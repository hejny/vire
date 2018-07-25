import { observable, computed } from 'mobx';
import * as Detection from '../detection';
import { nextFrame } from '../tools/nextFrame';
import { canvasFromSrc } from '../tools/canvasFromSrc';
import { fitToScreenInfo } from '../tools/fitToScreen';

export enum AppScreen {
    CAMERA,
    PROCESSING,
    RESULT,
}

export class DataModel {
    @observable screen: AppScreen = AppScreen.CAMERA;
    @observable percent: number;

    @observable screenSize:Detection.Vector2;
    @observable cropScreenSize:Detection.Vector2 =  new Detection.Vector2(1125, 2436).scale(0.3).floor;


    @observable input: HTMLCanvasElement|null;
    @observable output: Detection.Image;


    @computed get inputSize():Detection.Vector2{if(!this.input) return Detection.Vector2.ONE; else return new Detection.Vector2(this.input.width,this.input.height); }
    @computed get inputSizeFitBounding(){return fitToScreenInfo(this.screenSize,this.inputSize);}
    @computed get cropScreenFitBounding(){
        
        const inputSizeFitInfo = this.inputSizeFitBounding;
        const cropScreenFit = this.cropScreenSize.scale(inputSizeFitInfo.ratio);

        return({
            size: this.screenSize.subtract(cropScreenFit).scale(.5),
            topLeft: cropScreenFit
        });
        /*
        ctx.rect(
            (canvas.width - cropScreenFit.x) / 2,
            (canvas.height - cropScreenFit.y) / 2,
            cropScreenFit.x,
            cropScreenFit.y,
        );
        */
        
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


    constructor(){
        this.startWithMockedInputImage();

        this.screenSize = this.detectScreenSize();
        window.addEventListener('resize',()=>{
            //todo lodash debounce
            this.screenSize = this.detectScreenSize();
        });
    }

    private detectScreenSize(){
        const size = window.document.getElementById('size')!.getBoundingClientRect();
        //console.log(size);
        return(new Detection.Vector2(
            size.width,
            size.height
        ));
    }


    private async startWithMockedInputImage(){
        const image = await canvasFromSrc('/mock/IMG_2982.JPG');
        this.input = image;
        this.screen = AppScreen.CAMERA;
    }

    restart() {
        this.input = null;
        this.screen = AppScreen.CAMERA;
    }


    async processImage() {

        if(!this.input){
            throw new Error(`"imageInput" must be set before processing.`);
        }
        this.percent = 0;
        this.screen = AppScreen.PROCESSING;

        await nextFrame();

        //const image = Detection.Image.fromCanvas(this.imageInput);

 
        const image = Detection.Image.fromImageData(
            this.input.getContext('2d')!.getImageData(0, 0, this.cropScreenSize.x, this.cropScreenSize.y)
        )

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
        this.output = imageResizedPurgedNoGaps;
        this.screen = AppScreen.RESULT;
    }
}
