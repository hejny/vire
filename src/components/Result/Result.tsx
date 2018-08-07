import * as React from 'react';
import { observer } from 'mobx-react';
import { DataModel } from '../../model/DataModel';
import * as download from 'downloadjs';
import './Result.css';
import { textToDataURL } from '../../tools/dataTools';

export const Result = observer((props: { dataModel: DataModel }) => {
    return (
        <div className="Result">
            <div
                dangerouslySetInnerHTML={{
                    __html: props.dataModel.output.toSvg(),
                }}
            />
            {/*<div
                dangerouslySetInnerHTML={{
                    __html: props.dataModel.output.snap().toSvg(true),
                }}
            />*/}

            <div
                className="fullscreen-image"
                style={{
                    background: `url(${
                        textToDataURL(props.dataModel.output.toSvg(),'image/svg+xml')
                    })`,
                }}
            />

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
                            props.dataModel.output.toSvg(),
                            'wireframe.svg',
                            'image/svg+xml',
                        )
                    }
                >
                    Get SVG
                </button>
            </div>
        </div>
    );
});
