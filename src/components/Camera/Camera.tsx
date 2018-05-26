import * as React from 'react';
import * as Webcam from 'react-webcam';
import './Camera.css';
import { observer } from 'mobx-react';
import { DataModel } from '../../model/DataModel';

class Color{

    constructor(
        public r:number=0,
        public g:number=0,
        public b:number=0,
    ){}

    distance(color2:Color){
        return Math.sqrt(Math.pow(this.r-color2.r,2)+Math.pow(this.g-color2.g,2)+Math.pow(this.b-color2.b,2));
    }

    nearestColor(...colors: Color[]){
        return colors.sort((a,b)=>this.distance(a)>this.distance(b)?1:-1)[0]
    }

    toCss(){
        return `rgb(${this.r},${this.g},${this.b})`
    }

}

const targetColors = [new Color(0,0,0),new Color(255,255,255),new Color(169,19,2),new Color(29, 112, 8)]


export const Camera = observer(
    class extends React.Component<{ dataModel: DataModel }, {}> {
        private webcam: any;
        private drawCanvas: HTMLCanvasElement;


        validate() {
            //const imageSrc = this.webcam.getScreenshot();
            //this.props.dataModel.loadAnswersFromImage(imageSrc);

            const video = this.webcam.video;

            var bufferCanvas = document.createElement('canvas');
            var bufferCtx = bufferCanvas.getContext("2d")!;
            var drawCtx = this.drawCanvas.getContext("2d")!;
            drawCtx.clearRect(0,0,this.drawCanvas.width,this.drawCanvas.height);


            bufferCanvas.width  = video.width;
            bufferCanvas.height = video.height;


            function getPointColor(x:number,y:number):Color{

                bufferCtx.drawImage(video, 0,0, bufferCanvas.width, bufferCanvas.height);
                var frame = bufferCtx.getImageData(x-5, y-5, 10, 10);
    
                let color1 = new Color();
    
                var length = frame.data.length / 4;
                for (var i = 0; i < length; i++) {
                    
                    color1.r += frame.data[i * 4 + 0];
                    color1.g += frame.data[i * 4 + 1];
                    color1.b += frame.data[i * 4 + 2];      
                }   
    
                color1.r/=length,color1.g/=length,color1.b/=length;

                return color1;
            }
            

            function detectColor(targetColors:Color[], x:number,y:number){

                const color = getPointColor(x,y);
                const targetColor = color.nearestColor(...targetColors);


                //if(color.distance(targetColor)<130){
                    drawCtx.beginPath();
                    drawCtx.fillRect(x-5, y-5, 10, 10);
                    drawCtx.fillStyle = targetColor.toCss();
                    //console.log( targetColor.toCss());
                    drawCtx.fill();
                    
                //}
                
            }



            targetColors;detectColor;
            /*for(let y=0;y<20;y++){
            for(let x=0;x<20;x++){
                detectColor(targetColors,(x/20)*bufferCanvas.width,(y/20)*bufferCanvas.height);
            }
            }*/

            
       
            

       

        
            

            requestAnimationFrame(()=>this.validate());

        }

        render() {

            requestAnimationFrame(()=>this.validate());

            return (
                <div className={'Camera'}>
                    <Webcam
                        audio={false}
                        //width={640}
                        //height={480}
                        width={window.innerWidth}
                        height={window.innerHeight}
                        ref={(webcam) => (this.webcam = webcam)}
                        screenshotFormat="image/jpeg"
                    />
                    <canvas
                    className = 'DrawCanvas'
                    ref={(drawCanvas) => (this.drawCanvas = drawCanvas!)}
                    width={window.innerWidth}
                    height={window.innerHeight}
                    />
                    <div className = 'Overlay'>
                        <img src="/overlay.png" />
                    </div>
                    {/*<div className="snap" />*/}
                </div>
            );
        }
    },
);
