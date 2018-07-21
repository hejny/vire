import * as React from 'react';
import * as Webcam from 'react-webcam';
import './Camera.css';
import { observer } from 'mobx-react';
import { DataModel } from '../../model/DataModel';
import * as Detection from '../../detection';


console.log(Detection);
console.log(typeof Detection);
console.log("ahoj");



export const Camera = observer(
    class extends React.Component<{ dataModel: DataModel }, {}> {
        private webcam: Webcam;
        private drawCanvas: HTMLCanvasElement;
        private overlayElementImg: HTMLElement;

        snap() {
            //const screenshot = this.webcam.getScreenshot();

            //console.log(this.webcam)

            const ctx = this.webcam.getCanvas()!.getContext('2d')!;
            var frame = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
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

            this.props.dataModel.processImage(image);

            
        }

        render() {
            return (
                <div className="Camera" onClick={() => this.snap()}>
                    <Webcam
                        audio={false}
                        width={window.innerWidth}
                        height={window.innerHeight}
                        ref={(webcam: Webcam) => (this.webcam = webcam)}
                        screenshotFormat="image/jpeg"
                    />
                    {/*<div className="Overlay">
                        <img
                            src="./overlay.png"
                            ref={(overlayElementImg) =>
                                (this.overlayElementImg = overlayElementImg!)
                            }
                        />-->
                    </div>*/}

                    <div className="snap" />
                </div>
            );
        }
    },
);
