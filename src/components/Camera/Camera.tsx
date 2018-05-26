import * as React from 'react';
import * as Webcam from 'react-webcam';
import './Camera.css';
import { observer } from 'mobx-react';
import { DataModel } from '../../model/DataModel';

export const Camera = observer(class extends React.Component<{dataModel:DataModel},{}>{
    private webcam: any;

    capture() {
        const imageSrc = this.webcam.getScreenshot();
        console.log(imageSrc);

        this.props.dataModel.phase = 2;
    }

    render() {
        return (
            <div className={'Camera'} onClick={() => this.capture()}>
                <Webcam
                    audio={false}
                    width={window.innerWidth}
                    height={window.innerHeight}
                    ref={(webcam) => (this.webcam = webcam)}
                    screenshotFormat="image/jpeg"
                />
                <div className="snap" />
            </div>
        );
    }
})
