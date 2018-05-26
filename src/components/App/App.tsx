import * as React from 'react';
import { observer } from 'mobx-react';
import { DataModel, AppScreen } from '../../model/DataModel';
import './App.css';
import { Camera } from '../Camera/Camera';
import { Results } from '../Results/Results';
import { Loading } from '../Loading/Loading';

export const App = observer((props: { dataModel: DataModel }) => {
    return (
        <div className="App">
            {props.dataModel.phase === AppScreen.CAMERA && (
                <Camera dataModel={props.dataModel} />
            )}
            {props.dataModel.phase === AppScreen.UPLOADING && <Loading />}
            {props.dataModel.phase === AppScreen.RESULTS && (
                <Results dataModel={props.dataModel} />
            )}
        </div>
    );
});
