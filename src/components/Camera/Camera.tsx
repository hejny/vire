import * as React from 'react';
import * as Webcam from 'react-webcam';
import './Camera.css';

export class Camera extends React.Component {

  private webcam:any;

  capture(){
    const imageSrc = this.webcam.getScreenshot();
    console.log(imageSrc);
  };

  render() {
    return (
      <div className={'Camera'}  onClick={()=>this.capture()}>
        <Webcam
          audio={false}
          width={window.innerWidth}
          height={window.innerHeight}
          ref={(webcam)=>this.webcam=webcam}
          screenshotFormat="image/jpeg"
          
        />
        <button></button>
      </div>
    );
  }
}