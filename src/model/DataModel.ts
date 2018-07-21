import { observable, computed } from 'mobx';
import * as Detection from '../detection';
import { nextFrame } from '../tools/nextFrame';

export enum AppScreen {
    CAMERA,
    PROCESSING,
    RESULT,
}

export class DataModel {
    @observable phase: AppScreen = AppScreen.CAMERA;
    @observable percent: number;

    @observable imageInput: Detection.Image;
    @observable imageProcessed: Detection.Image;

    async processImage(image: Detection.Image) {
        
        this.percent = 0;
        this.imageInput = image;
        this.phase = AppScreen.PROCESSING;

        await nextFrame();

        const imageResizedPurged = image.resizePurge(
            image.size.scale(300 / image.size.x),
        );
        const imageResizedPurgedNoGaps = imageResizedPurged
            .removeGaps()
            .removeGaps()
            .removeGaps()
            .removeGaps()
            .removeGaps()
            .removeGaps()
            .removeGaps()
            .removeGaps()
            .removeGaps()
            .removeGaps()
            .removeGaps()
            .removeGaps()
            .removeGaps()
            .removeGaps()
            .removeGaps()
            .removeGaps()
            .removeGaps()
            .removeGaps()
            .removeGaps()
            .removeGaps()
            .removeGaps()
            .removeGaps()
            .removeGaps()
            .removeGaps()
            .removeGaps()
            .removeGaps()
            .removeGaps()
            .removeGaps()
            .removeGaps()
            .removeGaps()
            .removeGaps()
            .removeGaps()
            .removeGaps()
            .removeGaps()
            .removeGaps()
            .removeGaps()
            .removeGaps()
            .removeGaps()
            .removeGaps()
            .removeGaps()
            .removeGaps()
            .removeGaps()
            .removeGaps()
            .removeGaps()
            .removeGaps()
            .removeGaps()
            .removeGaps()
            .removeGaps()
            .removeGaps()
            .removeGaps()
            .removeGaps()
            .removeGaps();

       
        this.percent = 1;
        this.imageProcessed = imageResizedPurgedNoGaps;
        this.phase = AppScreen.RESULT;
    }
}
