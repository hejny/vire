import * as React from 'react';
import {observer} from 'mobx-react';
import './Results.css';
import { print } from '../../tools/print';
import { DataModel } from '../../model/DataModel';
import { Loading } from '../Loading/Loading';



export const Results = observer((props: {dataModel:DataModel})=>{
    
    

    return (
        <div className="Results" id="results">
            <h1>Volební kalkulačka 2017</h1>

            <button onClick={print}>
                Vytisknout
            </button>

            <button onClick={()=>props.dataModel.phase=1}>
                Znovu
            </button>

            <div>
            {props.dataModel.preferencesHtml?
            <div dangerouslySetInnerHTML={{__html: props.dataModel.preferencesHtml}} />
                :<Loading/>}
            </div>
        </div>
    );
})
  
  