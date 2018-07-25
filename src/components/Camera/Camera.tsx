import * as React from 'react';
import * as Webcam from 'react-webcam';
import './Camera.css';
import { observer } from 'mobx-react';
import { DataModel, AppScreen } from '../../model/DataModel';
import * as Detection from '../../detection';
import { cloneCanvas } from '../../tools/cloneCanvas';
import { fitToScreen } from '../../tools/fitToScreen';

const SCREEN_RECT = new Detection.Vector2(1125, 2436).scale(0.3);

interface ICameraProps{
    dataModel: DataModel;
}

interface ICameraState{
    width: number;
    height: number;
}

export const Camera = observer(
    class extends React.Component<ICameraProps,ICameraState> {
        private webcam: Webcam;
        private drawCanvas: HTMLCanvasElement;
        private overlayElementImg: HTMLElement;

        constructor(props: ICameraProps){
            super(props);
            this.state = this.size;
        }

        //todo react lifecycle and component unmount
        componentDidMount(){
            //console.log('resize listener');
            window.addEventListener('resize',()=>{
                //todo lodash debounce
                this.resize();
            });
        }

        get size(){
            const size = window.document.getElementById('size')!.getBoundingClientRect();
            //console.log(size);
            return({
                width: size.width,
                height: size.height
            });
        }

        resize(){
            this.setState(this.size)
        }

        snap() {
            //const screenshot = this.webcam.getScreenshot();
            //console.log(this.webcam)

            /*const ctx = this.webcam.getCanvas()!.getContext('2d')!;
            var frame = ctx.getImageData(
                0,
                0,
                ctx.canvas.width,
                ctx.canvas.height,
            );
            const table: Detection.Color[][] = [];
            for (let y = 0; y < ctx.canvas.height; y++) {
                const row: Detection.Color[] = [];
                table.push(row);
                for (let x = 0; x < ctx.canvas.width; x++) {
                    const i = y * ctx.canvas.width + x;
                    row.push(
                        new Detection.Color(
                            frame.data[i * 4 + 0],
                            frame.data[i * 4 + 1],
                            frame.data[i * 4 + 2],
                        ),
                    );
                }
            }
            const image = new Detection.Image(table);

            //console.log(image);
            */

            this.props.dataModel.snapImage(cloneCanvas(this.webcam.getCanvas()!));
        }

        render() {
            return (
                <div className="Camera" onClick={() => this.snap()}>


                    <div className="screen real">
                        <Webcam
                            audio={false}
                            width={window.innerWidth}
                            height={window.innerHeight}
                            ref={(webcam: Webcam) => (this.webcam = webcam)}
                            screenshotFormat="image/jpeg"
                        />
                    </div>

                    {/*<div className="screen mock">
                        <img src="/mock/IMG_2982.JPG" />
                    </div>*/}

                    {}

                    <div className="screen overlay">
                        <canvas
                            data-foo={[this.props.dataModel.screen,this.props.dataModel.imageInput]}
                            width={this.state.width}
                            height={this.state.height}
                            ref={(canvas) => {
                                if (canvas) {


                                    const ctx = canvas.getContext('2d');

                                    if (ctx) {
                                        


                                        if(this.props.dataModel.screen === AppScreen.CAMERA_CONFIRM){

                                            const screenSize = new Detection.Vector2(ctx.canvas.width,ctx.canvas.height);
                                            const contentSize = new Detection.Vector2(this.props.dataModel.imageInput.width,this.props.dataModel.imageInput.height);
                                            const contentSizeFit = fitToScreen(screenSize,contentSize);
                                            ctx.drawImage(
                                                this.props.dataModel.imageInput
                                                ,(screenSize.x-contentSizeFit.x)/2
                                                ,(screenSize.y-contentSizeFit.y)/2
                                                ,contentSizeFit.x
                                                ,contentSizeFit.y
                                            )
                                        }

                                        ctx.beginPath();
                                        ctx.rect(
                                            (canvas.width - SCREEN_RECT.x) / 2,
                                            (canvas.height - SCREEN_RECT.y) / 2,
                                            SCREEN_RECT.x,
                                            SCREEN_RECT.y,
                                        );
                                        ctx.lineCap = 'round';
                                        ctx.lineWidth = 4;
                                        ctx.strokeStyle = 'red';
                                        ctx.stroke();
                                    }
                                }
                            }}
                        />
                    </div>

                    {/*<div className="overlay">
                        <div className="cover left"/> 
                        <div className="cover right"/> 
                        <div className="cover top"/> 
                        <div className="cover bottom"/> 
                        <div className="window"/>   
                    </div>*/}

                    <div className="snap" />
                </div>
            );
        }
    },
);
