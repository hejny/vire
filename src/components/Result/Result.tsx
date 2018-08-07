import * as React from 'react';
import { observer } from 'mobx-react';
import { DataModel } from '../../model/DataModel';
import * as download from 'downloadjs';
import './Result.css';
import { textToDataURL } from '../../tools/dataTools';
import { SNAPPING_OPTIONS } from '../../config';
import { FlatDesignTemplate } from '../../detection/templates/FlatDesignTemplate';

export const Result = observer((props: { dataModel: DataModel }) => {

    let snappedOutput = props.dataModel.output;

    if(props.dataModel.snapping==='MATERIAL'){
        snappedOutput = snappedOutput.snap(new FlatDesignTemplate(snappedOutput.size));
    }

    return (
        <div className="Result">
            {/*<div
                dangerouslySetInnerHTML={{
                    __html: props.dataModel.output.toSvg(),
                }}
            />*/}
            {/*<div
                dangerouslySetInnerHTML={{
                    __html: props.dataModel.output.snap().toSvg(true),
                }}
            />*/}

            {/*<div
                className="fullscreen-image"
                style={{
                    background: `url(${textToDataURL(
                        snappedOutput.toSvg(true),
                        'image/svg+xml',
                    )})`,
                }}
            />*/}

            <div className="mobile">
            <img
             className="screen"
                src={textToDataURL(
                    snappedOutput.toSvg(true),
                    'image/svg+xml',
                )}
            />
             </div>



            <div className="toolbar-bottom">
                <button
                    className="red"
                    onClick={() => props.dataModel.restart()}
                >
                    Again
                </button>
                <button
                    className="blue"
                    onClick={() =>
                        download(
                            snappedOutput.toSvg(),
                            'wireframe.svg',
                            'image/svg+xml',
                        )
                    }
                >
                    Get SVG
                </button>
            </div>

            <div className="toolbar-top">
                <div className="options">
                    <select
                        value={props.dataModel.snapping}
                        onChange={(event) =>
                            (props.dataModel.snapping = event.target.value)
                        }
                    >
                        {SNAPPING_OPTIONS.map((value, i) => (
                            <option key={i} value={value.value}>
                                {value.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
});
