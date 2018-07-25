import * as React from 'react';
import './Processing.css';
import { DataModel } from '../../model/DataModel';
import { observer } from 'mobx-react';

export const Processing = observer((props: { dataModel: DataModel }) => {
    return (
        <div className="Processing">
            {Math.round(props.dataModel.progress.percent * 100 * 10) / 10}%
            {props.dataModel.progress.images.map((image, imageIndex) => (
                <div key={imageIndex}>
                    <img src={image.dataURL} />
                </div>
            ))}
        </div>
    );
});
