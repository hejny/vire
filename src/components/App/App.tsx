import * as React from 'react';
import {observer} from 'mobx-react';
import { DataModel } from '../../DataModel';
import './App.css';
import { Camera } from '../Camera/Camera';
import { Results } from '../Results/Results';


export const App = observer((props: {dataModel:DataModel})=>{
    return (
        <div className="App">
            {props.dataModel.phase===1&&<Camera dataModel={props.dataModel} />}
            {props.dataModel.phase===2&&<Results dataModel={props.dataModel} />}
        </div>
    );
})
