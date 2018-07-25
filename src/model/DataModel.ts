import { observable, computed } from 'mobx';
import * as Detection from '../detection';
import { nextFrame } from '../tools/nextFrame';
import { canvasFromSrc } from '../tools/canvasFromSrc';

export enum AppScreen {
    CAMERA,
    CAMERA_CONFIRM,
    PROCESSING,
    RESULT,
}

export class DataModel {
    @observable screen: AppScreen = AppScreen.CAMERA;
    @observable percent: number;

    @observable imageInput: HTMLCanvasElement;
    @observable imageProcessed: Detection.Image;


    constructor(){
        this.mockInputImage();
    }


    async mockInputImage(){
        const image = await canvasFromSrc('/mock/IMG_2982.JPG');
        this.imageInput = image;
        this.screen = AppScreen.CAMERA_CONFIRM;
    }

    restart() {
        this.screen = AppScreen.CAMERA;
    }


    snapImage(image: HTMLCanvasElement) {
        this.imageInput = image;
        this.screen = AppScreen.CAMERA_CONFIRM;
    }


    async processImage() {
        this.percent = 0;
        this.screen = AppScreen.PROCESSING;

        await nextFrame();

        const image = Detection.Image.fromCanvas(this.imageInput);

        const imageResizedPurged = image
            /**/
            .resizePurge(
                image.size,
                //image.size.scale(300 / image.size.x),
            );
        /**/

        const _ = Detection.Color.WHITE;
        const $ = Detection.Color.BLACK;
        const imageResizedPurgedNoGaps = imageResizedPurged;

        /*
        .replacePatterns([new Detection.Image([
            [_,_,_],
            [_,$,_],
            [_,_,_],
        ]),new Detection.Image([
            [_,_,_],
            [_,$,_],
            [_,$,_],
        ]),new Detection.Image([
            [_,_,_],
            [_,$,_],
            [_,_,$],
        ])],_)
        .replacePatterns([new Detection.Image([
            [$,_,_],
            [_,_,_],
            [_,_,$],
        ]),new Detection.Image([
            [_,$,_],
            [_,_,_],
            [_,$,_],
        ])],$);
        /**/

        this.percent = 1;
        this.imageProcessed = imageResizedPurgedNoGaps;
        this.screen = AppScreen.RESULT;
    }
}
