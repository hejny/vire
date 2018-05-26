import * as React from 'react';
import * as Webcam from 'react-webcam';
import './Camera.css';
import { observer } from 'mobx-react';
import { DataModel } from '../../model/DataModel';

export const Camera = observer(
    class extends React.Component<{ dataModel: DataModel }, {}> {
        private webcam: any;

        async capture() {
            const imageSrc = this.webcam.getScreenshot();
            this.props.dataModel.loadAnswersFromImage(imageSrc);

            /*/
            const stream = await navigator.mediaDevices.getUserMedia({
                //audio: true,
                video: {
                  width: { min: 320, ideal: 1024, max: 1920 },
                  height: { min: 320, ideal: 1024, max: 1920 }
                }
              });
            console.log('Screenshot');
            const track = stream.getVideoTracks()[0];
            console.log(track.);

            //const imageCapture = new (window as any).ImageCapture(track);

            //console.log(imageCapture);

            const frame = await track.grabFrame();

            //console.log((window as any).encode(frame));
            alert(frame.width+','+frame.height);
            console.log(frame);
              /**/
        }

        render() {
            return (
                <div className={'Camera'} onClick={() => this.capture()}>
                    <Webcam
                        audio={false}
                        //width={640}
                        //height={480}
                        width={window.innerWidth}
                        height={window.innerHeight}
                        ref={(webcam) => (this.webcam = webcam)}
                        screenshotFormat="image/jpeg"
                    />
                    <div className="snap" />
                </div>
            );
        }
    },
);
