import * as React from 'react';
import * as Webcam from 'react-webcam';
import './Camera.css';

export function Camera({}:{}){
  return (
    <div className="Camera">
      <Webcam/>
    </div>
  );
}