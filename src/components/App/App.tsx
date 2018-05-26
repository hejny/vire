import * as React from 'react';
import './App.css';
//import { Camera } from '../Camera/Camera';<Camera />
import { Results } from '../Results/Results';

export function App({  }: {}) {
    return (
        <div className="App">
            
            <Results />
        </div>
    );
}
