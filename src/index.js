import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Routes from './routes';
import store from './stores'
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter as Router } from "react-router-dom";
import 'react-select/dist/react-select.css'
import 'react-virtualized/styles.css';
import 'react-virtualized-select/styles.css'
import { Provider } from "mobx-react";

ReactDOM.render(
	<Router>
		<Provider appState = {store.AppState}>
			<Routes />
		</Provider>
	</Router>, 
	document.getElementById('root')
);

registerServiceWorker();
