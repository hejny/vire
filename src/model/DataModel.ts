import { observable, computed } from 'mobx';
import * as Detection from '../detection';
import { nextFrame, sleep } from '../tools/wait';
import { canvasFromSrc } from '../tools/canvasFromSrc';
import { fitToScreenInfo } from '../tools/fitToScreen';
import { SSL_OP_DONT_INSERT_EMPTY_FRAGMENTS } from 'constants';
import { imageSeparateIslands } from '../detection/';

export enum AppScreen {
    CAMERA,
    PROCESSING,
    RESULT,
}

export class DataModel {
    @observable screen: AppScreen = AppScreen.CAMERA;
    //@observable percent: number;

    @observable screenSize: Detection.Vector2;
    @observable cropScreenRatio = 1125 / 2436;
    @observable cropScreenMargin = 35;
    @observable cameraSize: Detection.Vector2 = Detection.Vector2.ONE;

    @observable input: HTMLCanvasElement | null;
    @observable inputParsed: Detection.Image;
    @observable
    progress: {
        percent: number;
        images: Detection.Image[];
    };
    @observable output: Detection.Image;

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
            await this.startWithMockedInputImage();
            await this.processImage();
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

    async processImage() {
        if (!this.input) {
            throw new Error(`"imageInput" must be set before processing.`);
        }
        this.progress = {
            percent: 0,
            images: [],
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

        const imageResizedPurged = image
            /**/
            .resizePurge(
                //image.size,
                image.size.scale(250 / image.size.x),
            );
        /**/

        const _ = Detection.Color.WHITE;
        const $ = Detection.Color.BLACK;
        const imageResizedPurgedNoGaps = imageResizedPurged.replacePattern(
            new Detection.Image([[_, _, _], [_, $, _], [_, _, _]]),
            _,
        );
        /*
            .replacePatterns(
                [
                    new Detection.Image([[_, _, _], [_, $, _], [_, _, _]]),
                    new Detection.Image([[_, _, _], [_, $, _], [_, $, _]]),
                    new Detection.Image([[_, _, _], [_, $, _], [_, _, $]]),
                ],
                _,
            )
            .replacePatterns(
                [
                    new Detection.Image([[$, _, _], [_, _, _], [_, _, $]]),
                    new Detection.Image([[_, $, _], [_, _, _], [_, $, _]]),
                ],
                $,
            );
        /**/

        /*const separateIslands = await imageResizedPurgedNoGaps.separateIslands(
            async (percent, islands) => {
                islands;
                this.progress = {
                    percent,
                    images: [
                        imageResizedPurged,
                        imageResizedPurgedNoGaps,
                        imageResizedPurgedNoGaps.withIslands(islands),
                    ],
                };
                await nextFrame();
            },
        );*/

        /*const lines = detectLines(imageResizedPurgedNoGaps);
        console.log('lines', lines);
        for (const line of lines) {
            line.draw(imageResizedPurgedNoGaps, Detection.Color.RED);
        }*/

        const separateIslands = await imageSeparateIslands(
            imageResizedPurgedNoGaps,
            async (percent,islands)=>{
                console.log(Math.round(percent*100*10)/10+'%');
                this.progress = {
                    percent,
                    images: [imageResizedPurgedNoGaps,imageResizedPurgedNoGaps.withIslands(islands)],
                };
                await nextFrame();
                await sleep(1);
            }
        )
        

        this.progress = {
            percent: 1,
            images: [],
        };
        this.output = imageResizedPurgedNoGaps.withIslands(separateIslands);
        this.screen = AppScreen.RESULT;
    }
}
