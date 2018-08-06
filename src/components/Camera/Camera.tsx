import * as React from 'react';
import * as Webcam from 'react-webcam';
import './Camera.css';
import { observer } from 'mobx-react';
import { DataModel, AppScreen } from '../../model/DataModel';
import * as Detection from '../../detection';
import { cloneCanvas } from '../../tools/cloneCanvas';
import { fitToScreen, fitToScreenInfo } from '../../tools/fitToScreen';
import { repeatRequest } from '../../tools/repeatRequest';
import {
    PROCESSING_QUALITY_OPTIONS,
    CROP_SCREEN_RATIO_OPTIONS,
} from '../../config';

interface ICameraProps {
    dataModel: DataModel;
}

export const Camera = observer(
    class extends React.Component<ICameraProps> {
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

            this.props.dataModel.input = cloneCanvas(this.webcam.getCanvas()!);
        }

        render() {
            return (
                <div
                    className="Camera"
                >
                    <div className="screen real">
                        <Webcam
                            audio={false}
                            width={window.innerWidth}
                            height={window.innerHeight}
                            ref={(webcam: Webcam) => {
                                this.webcam = webcam;
                            }}
                            onUserMedia={async () => {
                                this.props.dataModel.cameraSize = await repeatRequest(
                                    () => {
                                        const canvas = this.webcam.getCanvas();
                                        if (canvas) {
                                            return new Detection.Vector2(
                                                canvas.width,
                                                canvas.height,
                                            );
                                        } else {
                                            throw new Error(
                                                `Can not get camera size.`,
                                            );
                                        }
                                    },
                                );
                                console.log(
                                    `Camera size set to ${
                                        this.props.dataModel.cameraSize
                                    }.`,
                                );
                            }}
                            screenshotFormat="image/jpeg"
                        />
                    </div>

                    {/*<div className="screen mock">
                        <img src="/mock/IMG_2982.JPG" />
                    </div>*/}

                    {}

                    <div className="screen overlay">
                        <canvas
                            data-foo={this.props.dataModel.input ? 1 : 0}
                            width={this.props.dataModel.screenSize.x}
                            height={this.props.dataModel.screenSize.y}
                            ref={(canvas) => {
                                console.log('overlay rerender');
                                if (canvas) {
                                    const ctx = canvas.getContext('2d');

                                    if (ctx) {
                                        ctx.clearRect(
                                            0,
                                            0,
                                            ctx.canvas.width,
                                            ctx.canvas.height,
                                        );

                                        if (this.props.dataModel.input) {
                                            const inputSizeFitBounding = this
                                                .props.dataModel
                                                .inputSizeFitBounding;

                                            ctx.drawImage(
                                                this.props.dataModel.input,
                                                inputSizeFitBounding.topLeft.x,
                                                inputSizeFitBounding.topLeft.y,
                                                inputSizeFitBounding.size.x,
                                                inputSizeFitBounding.size.y,
                                            );
                                        }

                                        ctx.beginPath();

                                        const cropScreenFitBounding = this.props
                                            .dataModel.cropScreenFitBounding;
                                        ctx.rect(
                                            cropScreenFitBounding.size.x,
                                            cropScreenFitBounding.size.y,
                                            cropScreenFitBounding.topLeft.x,
                                            cropScreenFitBounding.topLeft.y,
                                        );
                                        /*
                                        ctx.rect(
                                            (canvas.width - this.props.dataModel.cropScreen.x) / 2,
                                            (canvas.height - this.props.dataModel.cropScreen.y) / 2,
                                            this.props.dataModel.cropScreen.x,
                                            this.props.dataModel.cropScreen.y,
                                        );*/

                                        ctx.lineCap = 'round';
                                        ctx.lineWidth = 4;
                                        ctx.strokeStyle = '#0098ff';
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

                    {!this.props.dataModel.input && (
                        <>
                            <div className="snap"/>
                            <div className="snap-click-overlay" onClick={() => this.snap()}/>
                            <div className="header">
                                <select
                                    value={this.props.dataModel.cropScreenRatio}
                                    onChange={(event) =>
                                        (this.props.dataModel.cropScreenRatio = parseFloat(
                                            event.target.value,
                                        ))
                                    }
                                >
                                    {CROP_SCREEN_RATIO_OPTIONS.map(
                                        (value, i) => (
                                            <option key={i} value={value.value}>
                                                {value.label}
                                            </option>
                                        ),
                                    )}
                                </select>
                            </div>
                        </>
                    )}
                    {this.props.dataModel.input && (
                        <>
                        <div className="snap-effect" ref={(element) => {

                        }}/>
                        <div className="tools">
                            <div className="options">
                                <select
                                    value={
                                        this.props.dataModel.processingQuality
                                    }
                                    onChange={(event) =>
                                        (this.props.dataModel.processingQuality = parseFloat(
                                            event.target.value,
                                        ))
                                    }
                                >
                                    {PROCESSING_QUALITY_OPTIONS.map(
                                        (value, i) => (
                                            <option key={i} value={value.value}>
                                                 {value.label}
                                            </option>
                                        ),
                                    )}
                                </select>
                            </div>
                            <div className="buttons">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (confirm(`Do you really want to discard image?`)) {
                                            this.props.dataModel.input = null;
                                        }
                                    }}
                                >
                                    Again
                                </button>
                                <button
                                    onClick={() =>
                                        this.props.dataModel.processImage()
                                    }
                                >
                                    Convert
                                </button>
                            </div>
                        </div>
                        </>
                    )}
                </div>
            );
        }
    },
);
