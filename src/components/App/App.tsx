import { observer } from 'mobx-react';
import * as React from 'react';
import { AppScreen, DataModel } from '../../model/DataModel';
import { Camera } from '../Camera/Camera';
import { Processing } from '../Processing/Processing';
import { Result } from '../Result/Result';
import './App.css';

export const App = observer((props: { dataModel: DataModel }) => {
    return (
        <div className="App">
            {props.dataModel.screen === AppScreen.CAMERA && (
                <Camera dataModel={props.dataModel} />
            )}
            {props.dataModel.screen === AppScreen.PROCESSING && (
                <Processing dataModel={props.dataModel} />
            )}
            {props.dataModel.screen === AppScreen.RESULT && (
                <Result dataModel={props.dataModel} />
            )}
        </div>
    );
});
