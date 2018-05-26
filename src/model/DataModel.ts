import {observable} from "mobx";

export enum AppScreen{
    CAMERA,
    UPLOADING,
    RESULTS
}

export class DataModel {

    @observable phase: AppScreen;
    @observable answers: any;
    @observable preferencesHtml: string;

    constructor(){
        this.restart();
    }

    restart(){
        this.phase = AppScreen.CAMERA;
    }

    async loadAnswersFromImage(imageData:string){

        this.phase = AppScreen.UPLOADING;

        //multipart image    


        //this.answers=...;

        this.phase = AppScreen.RESULTS;

        this.loadPreferencesHtml();
    }


    async loadPreferencesHtml(){
        
    }



}
