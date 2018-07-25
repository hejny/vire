import * as React from 'react';
import { observer } from 'mobx-react';
import { DataModel } from '../../model/DataModel';
import './Result.css';

export const Result = observer((props: { dataModel: DataModel }) => {
    return (
        <div className="Result">
            <button onClick={() => props.dataModel.restart()}>Again</button>
            <img src={props.dataModel.output.toDataURL()} />
        </div>
    );
});
