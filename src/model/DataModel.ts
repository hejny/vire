import { observable, computed } from 'mobx';
import { Image } from 'detection/src/detection/Image';

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
    
    processImage() {
    }

}
