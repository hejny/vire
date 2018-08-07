import * as React from 'react';
import './Processing.css';
import { DataModel } from '../../model/DataModel';
import { observer } from 'mobx-react';

export const Processing = observer((props: { dataModel: DataModel }) => {
    return (
        <div className="Processing">
            <div className="toolbar-top">
                <div className="percent">
                    {Math.round(props.dataModel.progress.percent * 100 * 10) /
                        10}%
                </div>
            </div>

            {props.dataModel.progress.image && (
                <div
                    className="fullscreen-image"
                    style={{
                        background: `url(${
                            props.dataModel.progress.image.negative.dataURL
                        })`,
                    }}
                />
            )}

            <div className="toolbar-bottom">
                <button
                    className="red"
                    onClick={() => {
                        if (confirm(`Do you really want to stop processing?`)) {
                            props.dataModel.stopProcessing();
                        }
                    }}
                >
                    Stop
                </button>
            </div>
        </div>
    );
});
