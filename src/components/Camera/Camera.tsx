import * as React from 'react';
import * as Webcam from 'react-webcam';
import './Camera.css';
import { observer } from 'mobx-react';
import { DataModel } from '../../model/DataModel';

class Color {
    constructor(
        public r: number = 0,
        public g: number = 0,
        public b: number = 0,
    ) {}

    distance(color2: Color) {
        return Math.sqrt(
            Math.pow(this.r - color2.r, 2) +
                Math.pow(this.g - color2.g, 2) +
                Math.pow(this.b - color2.b, 2),
        );
    }

    nearestColor(...colors: Color[]) {
        return colors.sort(
            (a, b) => (this.distance(a) > this.distance(b) ? 1 : -1),
        )[0];
    }

    toCss() {
        return `rgb(${this.r},${this.g},${this.b})`;
    }
}

const targetColors = [
    new Color(169, 19, 2),
    new Color(29, 112, 8),
    new Color(255, 255, 255),
    new Color(0, 0, 0),
];

const MIRROR = true;

export const Camera = observer(
    class extends React.Component<{ dataModel: DataModel }, {}> {
        private webcam: any;
        private drawCanvas: HTMLCanvasElement;
        private overlayElementImg: HTMLElement;

        validate() {
            //const imageSrc = this.webcam.getScreenshot();
            //this.props.dataModel.loadAnswersFromImage(imageSrc);

            const video = this.webcam.video;

            var bufferCanvas = document.createElement('canvas');
            var bufferCtx = bufferCanvas.getContext('2d')!;
            var drawCtx = this.drawCanvas.getContext('2d')!;
            drawCtx.clearRect(
                0,
                0,
                this.drawCanvas.width,
                this.drawCanvas.height,
            );

            bufferCanvas.width = video.width;
            bufferCanvas.height = video.height;

            function getPointColor(x: number, y: number): Color {
                bufferCtx.drawImage(
                    video,
                    0,
                    0,
                    bufferCanvas.width,
                    bufferCanvas.height,
                );
                MIRROR; //todo
                var frame = bufferCtx.getImageData(x - 5, y - 5, 10, 10);

                let color1 = new Color();

                var length = frame.data.length / 4;
                for (var i = 0; i < length; i++) {
                    color1.r += frame.data[i * 4 + 0];
                    color1.g += frame.data[i * 4 + 1];
                    color1.b += frame.data[i * 4 + 2];
                }

                (color1.r /= length),
                    (color1.g /= length),
                    (color1.b /= length);

                return color1;
            }

            function detectColor(
                targetColors: Color[],
                x: number,
                y: number,
            ): number {
                const size = 17;
                const color = getPointColor(x, y);
                const targetColor = color.nearestColor(...targetColors);

                //if(color.distance(targetColor)<130){
                //drawCtx.beginPath();
                drawCtx.fillStyle = targetColor.toCss();
                drawCtx.fillRect(x - size / 2, y - size / 2, size, size);
                //console.log( targetColor.toCss());
                //drawCtx.fill();

                //}

                return targetColors.indexOf(targetColor);
            }

            targetColors;
            detectColor;

            const rect = this.overlayElementImg.getBoundingClientRect();

            const answers: (boolean | null)[] = [];

            const size = { x: 2, y: 10 };
            for (let y = 0; y < size.y; y++) {
                let colorIndex1, colorIndex2;

                for (let x = 0; x < size.x; x++) {
                    const colorIndex = detectColor(
                        targetColors,
                        (rect.right + rect.left) / 2 +
                            (rect.right - rect.left) *
                                (x / size.x - 0.25) *
                                0.7,
                        (rect.bottom + rect.top) / 2 +
                            (rect.bottom - rect.top) *
                                (y / size.y - 0.45) *
                                0.95,
                    );

                    if (x === 0) {
                        colorIndex1 = colorIndex;
                    } else if (x === 1) {
                        colorIndex2 = colorIndex;
                    }
                }

                let rowAnswer = null;

                if (colorIndex1 === 1 && colorIndex2 === 2) {
                    rowAnswer = true;
                } else if (colorIndex1 === 2 && colorIndex2 === 0) {
                    rowAnswer = false;
                }

                answers.push(rowAnswer);
            }

            console.log(answers);

            if (
                answers.filter((answer) => answer !== true && answer !== false)
                    .length > 3
            ) {
                setTimeout(
                    () => requestAnimationFrame(() => this.validate()),
                    30,
                );
            } else {
                this.props.dataModel.loadAnswersFromSmartDots(answers);
            }
        }

        render() {
            setTimeout(() => this.validate(), 100);

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
                        className="DrawCanvas"
                        ref={(drawCanvas) => (this.drawCanvas = drawCanvas!)}
                        width={window.innerWidth}
                        height={window.innerHeight}
                    />
                    <div className="Overlay">
                        <img
                            src="./overlay.png"
                            ref={(overlayElementImg) =>
                                (this.overlayElementImg = overlayElementImg!)
                            }
                        />
                    </div>
                    {/*<div className="snap" />*/}
                </div>
            );
        }
    },
);
