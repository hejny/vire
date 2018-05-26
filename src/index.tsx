import * as React from 'react';
import * as ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import { App } from './components/App/App';
import { DataModel } from './DataModel';

const dataModel = new DataModel();

ReactDOM.render(<App dataModel={dataModel} />, document.getElementById('root') as HTMLElement);
registerServiceWorker();
