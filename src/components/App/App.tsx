import * as React from 'react';
import { observer } from 'mobx-react';
import { DataModel, AppScreen } from '../../model/DataModel';
import './App.css';
import { Camera } from '../Camera/Camera';
import { Processing } from '../Processing/Processing';
import { Result } from '../Result/Result';

export const App = observer((props: { dataModel: DataModel }) => {
    return (
        <div className="App">
            {props.dataModel.phase === AppScreen.CAMERA && (
                <Camera dataModel={props.dataModel} />
            )}
            {props.dataModel.phase === AppScreen.PROCESSING && (
                <Processing dataModel={props.dataModel} />
            )}
            {props.dataModel.phase === AppScreen.RESULT && (
                <Result dataModel={props.dataModel} />
            )}
        </div>
    );
});
