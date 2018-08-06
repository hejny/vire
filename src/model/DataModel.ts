import { observable, computed } from 'mobx';
import * as Detection from '../detection';
import { nextFrame, sleep } from '../tools/wait';
import { canvasFromSrc } from '../tools/canvasTools';
import { fitToScreenInfo } from '../tools/fitToScreen';
import { SSL_OP_DONT_INSERT_EMPTY_FRAGMENTS } from 'constants';
import { imageSeparateIslands } from '../detection';
import { createWireframe } from '../detection/processing/createWireframe';
import {
    CROP_SCREEN_RATIO_OPTIONS,
    PROCESSING_QUALITY_OPTIONS,
    CROP_SCREEN_RATIO_OPTIONS_DEFAULT,
    PROCESSING_QUALITY_OPTIONS_DEFAULT,
} from '../config';

export enum AppScreen {
    CAMERA,
    PROCESSING,
    RESULT,
}

export interface IProgressFrame {
    percent: number;
    image: Detection.Image | null;
}

export class DataModel {
    @observable screen: AppScreen = AppScreen.CAMERA;
    //@observable percent: number;

    @observable screenSize: Detection.Vector2;
    @observable cropScreenRatio = CROP_SCREEN_RATIO_OPTIONS_DEFAULT.value;
    @observable cropScreenMargin = 85;
    @observable processingQuality = PROCESSING_QUALITY_OPTIONS_DEFAULT.value;
    @observable cameraSize: Detection.Vector2 = Detection.Vector2.ONE;

    @observable input: HTMLCanvasElement | null;
    @observable inputParsed: Detection.Image;
    @observable progress: IProgressFrame;
    @observable output: Detection.Wireframe;

    @computed
    get cropScreenSize() {
        const inputSizeMargins = this.inputSize.map(
            (value) =>
                value -
                2 * this.cropScreenMargin / this.inputSizeFitBounding.ratio,
        );
        if (inputSizeMargins.x > inputSizeMargins.y) {
            return new Detection.Vector2(
                inputSizeMargins.y * this.cropScreenRatio,
                inputSizeMargins.y,
            ).floor;
        } else {
            return new Detection.Vector2(
                inputSizeMargins.x,
                inputSizeMargins.x / this.cropScreenRatio,
            ).floor;
        }
    }
    @computed
    get inputSize(): Detection.Vector2 {
        if (!this.input) return this.cameraSize;
        else return new Detection.Vector2(this.input.width, this.input.height);
    }
    @computed
    get inputSizeFitBounding() {
        return fitToScreenInfo(this.screenSize, this.inputSize);
    }
    @computed
    get cropScreenFitBounding() {
        const inputSizeFitInfo = this.inputSizeFitBounding;
        const cropScreenFit = this.cropScreenSize.scale(inputSizeFitInfo.ratio);
        return {
            size: this.screenSize.subtract(cropScreenFit).scale(0.5),
            topLeft: cropScreenFit,
        };
    }
    @computed
    get cropScreenBounding() {
        return {
            size: this.cropScreenSize,
            topLeft: new Detection.Vector2(
                (this.inputSize.x - this.cropScreenSize.x) / 2,
                (this.inputSize.y - this.cropScreenSize.y) / 2,
            ).floor,
        };
    }

    /*@computed get cropScreenFitInfo(){

        const inputSizeFitInfo = this.inputSizeFitInfo;
        const cropScreenFit = this.cropScreen.scale(contentSizeFitInfo.ratio);
        return({
            
        })
        
        
        return({
            size:
            topLeft:
        });
        
    }*/

    constructor() {
        (async () => {
            //await this.startWithMockedInputImage();
            //await this.processImage();
            /*this.screen = AppScreen.PROCESSING;
            this.progress = {
                percent: .5,
                image: null
            }*/
        })();

        this.screenSize = this.detectScreenSize();
        window.addEventListener('resize', () => {
            //todo lodash debounce
            this.screenSize = this.detectScreenSize();
        });
    }

    private detectScreenSize() {
        const size = window.document
            .getElementById('size')!
            .getBoundingClientRect();
        //console.log(size);
        return new Detection.Vector2(size.width, size.height);
    }

    private async startWithMockedInputImage() {
        const image = await canvasFromSrc('/mock/IMG_2982.JPG');
        this.input = image;
        this.screen = AppScreen.CAMERA;
    }

    restart() {
        this.input = null;
        this.screen = AppScreen.CAMERA;
    }

    private shouldStopProcessing = false;

    async stopProcessing() {
        this.shouldStopProcessing = true;
    }

    async processImage() {
        if (!this.input) {
            throw new Error(`"imageInput" must be set before processing.`);
        }

        try {
            this.progress = {
                percent: 0,
                image: null,
            };
            this.screen = AppScreen.PROCESSING;

            await nextFrame();

            //const image = Detection.Image.fromCanvas(this.imageInput);

            const cropScreenBounding = this.cropScreenBounding;
            const image = Detection.Image.fromImageData(
                this.input
                    .getContext('2d')!
                    .getImageData(
                        cropScreenBounding.topLeft.x,
                        cropScreenBounding.topLeft.y,
                        cropScreenBounding.size.x,
                        cropScreenBounding.size.y,
                    ),
            );

            this.output = await createWireframe(
                image,
                this.processingQuality,
                async (progressFrame) => {
                    if (this.shouldStopProcessing) {
                        throw new Error('STOPPED'); //todo better extend error
                    }
                    this.progress = progressFrame;
                    await nextFrame();
                    await sleep(1);
                },
            );

            this.screen = AppScreen.RESULT;
        } catch (error) {
            if (error.message === 'STOPPED') {
                this.shouldStopProcessing = false;
                this.screen = AppScreen.CAMERA;
            } else {
                throw error;
            }
        }
    }
}
