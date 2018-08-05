import * as React from 'react';
import './Processing.css';
import { DataModel } from '../../model/DataModel';
import { observer } from 'mobx-react';

export const Processing = observer((props: { dataModel: DataModel }) => {
    return (
        <div className="Processing">
            <button
                onClick={() => {
                    if (confirm(`Do you really want to stop processing?`)) {
                        props.dataModel.stopProcessing();
                    }
                }}
            >
                Stop
            </button>
            {Math.round(props.dataModel.progress.percent * 100 * 10) / 10}%
            {props.dataModel.progress.image && (
                <img src={props.dataModel.progress.image.dataURL} />
            )}
        </div>
    );
});
