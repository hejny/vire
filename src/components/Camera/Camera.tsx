import * as React from 'react';
import * as Webcam from 'react-webcam';
import './Camera.css';
import { observer } from 'mobx-react';
import { DataModel, AppScreen } from '../../model/DataModel';
import * as Detection from '../../detection';
import { cloneCanvas } from '../../tools/cloneCanvas';

const SCREEN_RECT = new Detection.Vector2(1125, 2436).scale(0.3);

export const Camera = observer(
    class extends React.Component<{ dataModel: DataModel }, {}> {
        private webcam: Webcam;
        private drawCanvas: HTMLCanvasElement;
        private overlayElementImg: HTMLElement;

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
                            ref={(canvas) => {
                                if (canvas) {
                                    canvas.width = canvas.getBoundingClientRect().width;
                                    canvas.height = canvas.getBoundingClientRect().height;

                                    const ctx = canvas.getContext('2d');

                                    if (ctx) {
                                        


                                        if(this.props.dataModel.screen === AppScreen.CAMERA_CONFIRM){

                                            console.log('xxx',this.props.dataModel.imageInput);
                                            ctx.drawImage(
                                                this.props.dataModel.imageInput
                                                ,0,0
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
