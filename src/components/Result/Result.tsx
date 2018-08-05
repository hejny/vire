import * as React from 'react';
import { observer } from 'mobx-react';
import { DataModel } from '../../model/DataModel';
import * as download from 'downloadjs';
import './Result.css';

export const Result = observer((props: { dataModel: DataModel }) => {
    return (
        <div className="Result">
            <button onClick={() => props.dataModel.restart()}>Again</button>
            <button
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
            <div
                dangerouslySetInnerHTML={{
                    __html: props.dataModel.output.toSvg(),
                }}
            />
            <div
                dangerouslySetInnerHTML={{
                    __html: props.dataModel.output.snap().toSvg(true),
                }}
            />
        </div>
    );
});
