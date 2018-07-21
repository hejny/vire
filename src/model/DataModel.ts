import { observable, computed } from 'mobx';
import { Image } from 'detection/src/detection/Image';
import { nextFrame } from '../tools/nextFrame';

export enum AppScreen {
    CAMERA,
    PROCESSING,
    RESULT,
}

export class DataModel {
    @observable phase: AppScreen = AppScreen.CAMERA;
    @observable percent: number;

    @observable imageInput: Image;
    @observable imageProcessed: Image;

    async processImage(image: Image) {
        this.phase = AppScreen.PROCESSING;
        this.percent = 0;
        this.imageInput = image;

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

        this.phase = AppScreen.RESULT;
        this.percent = 1;
        this.imageProcessed = imageResizedPurgedNoGaps;
    }
}
