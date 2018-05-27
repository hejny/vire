import { observable, computed } from 'mobx';
import * as superagent from 'superagent';
import { QUESTION_ID_ORDER } from '../config';

export enum AppScreen {
    CAMERA,
    UPLOADING,
    RESULTS,
}

//const viewport = document.querySelector('meta[name=viewport]')!;

export class DataModel {
    @observable phase: AppScreen;
    @observable answers: (boolean | null)[] | null;
    @observable preferencesHtml: string | null;

    //todo errors

    constructor() {
        this.restart();
    }

    restart() {
        /*viewport.setAttribute(
            'content',
            'width=device-width, initial-scale=0.6',
        );*/

        /**/
        this.phase = AppScreen.CAMERA;
        this.answers = null;
        this.preferencesHtml = null;
        /**/
        /*/
        this.phase = AppScreen.RESULTS;
        this.answers = [
            null,
            false,
            false,
            false,
            true,
            null,
            true,
            false,
            null,
            true,
        ];
        this.preferencesHtml = null;
        this.loadPreferencesHtml();
        /**/
    }

    async loadAnswersFromImage(imageData: string) {
        /*viewport.setAttribute(
            'content',
            'width=device-width, initial-scale=1.0',
        );*/

        this.phase = AppScreen.UPLOADING;

        const result = await superagent
            .post(`http://139.59.151.87/v1.0.0/recognize`)
            .set('Content-Type', 'application/octet-stream')
            .send(imageData.split('base64,')[1]);
        //.send(SAMPLE_IMAGE);

        //.set('Content-Type', 'neco/prasarna-cuncovina')
        //.attach("file", file.file, file.file.name)
        //.set('Content-Type', 'multipart/form-data')
        //.field("image",imageData)
        //.attach('image', dataURLtoFile(imageData,'image.jpeg' ))
        //.send();
        //.send({'image': imageData})
        //console.log(result);
        const answers = JSON.parse(result.text);

        //todo check answers;

        this.answers = answers;
        this.phase = AppScreen.RESULTS;
        this.loadPreferencesHtml();
    }

    loadAnswersFromSmartDots(answers: (boolean | null)[]) {
        this.answers = answers;
        this.phase = AppScreen.RESULTS;
        this.loadPreferencesHtml();
    }

    @computed
    get answersQuery(): string {
        if (!this.answers) {
            throw new Error(
                `loadPreferencesHtml should be called after loadAnswersFromImage.`,
            );
        }

        if (QUESTION_ID_ORDER.length !== this.answers.length) {
            console.warn(
                `On sheet there was ${
                    this.answers.length
                } answers but in config are ${
                    QUESTION_ID_ORDER.length
                } answers.`,
            );
            return '{}';
        }

        const query = {};

        this.answers.forEach((answer, i) => {
            if (answer === true || answer === false) {
                query[QUESTION_ID_ORDER[i].toString()] = answer ? 1 : -1;
            }
        });

        //'{"1":-1,"11":1}'
        return JSON.stringify(query);
    }

    async loadPreferencesHtml() {
        const result = await superagent
            .get(`https://volebnikalkulacka.cz/hackathon-2018/`)
            .query({ q: this.answersQuery, x: 'x', key: 'hackathon' }); //todo dynamic event
        this.preferencesHtml = result.text;
    }
}
