import { observable, computed } from 'mobx';
import * as Detection from '../detection';
import { nextFrame } from '../tools/nextFrame';

export enum AppScreen {
    CAMERA,
    PROCESSING,
    RESULT,
}

export class DataModel {
    @observable screen: AppScreen = AppScreen.CAMERA;
    @observable percent: number;

    @observable imageInput: Detection.Image;
    @observable imageProcessed: Detection.Image;


    restart(){
        this.screen = AppScreen.CAMERA;
    }

    async processImage(image: Detection.Image) {
        
        this.percent = 0;
        this.imageInput = image;
        this.screen = AppScreen.PROCESSING;

        await nextFrame();

        const imageResizedPurged = image.resizePurge(
            image.size.scale(300 / image.size.x),
        );
 



        const _ = Detection.Color.WHITE;
        const $ = Detection.Color.BLACK;
        const imageResizedPurgedNoGaps = imageResizedPurged.replacePatterns([new Detection.Image([
            [$,_,_],
            [_,_,_],
            [_,_,$],
        ])],$);
  


        this.percent = 1;
        this.imageProcessed = imageResizedPurgedNoGaps;
        this.screen = AppScreen.RESULT;


    }
}
