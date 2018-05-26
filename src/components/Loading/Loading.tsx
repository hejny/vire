import * as React from 'react';
import {observer} from 'mobx-react';
import './Loading.css';


export const Loading = ()=>{
    return (
        <div className="Loading">
            Načítání...
        </div>
    );
}
