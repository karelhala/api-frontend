import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { init } from './store';
import App from './App';
import { getBaseName } from '@redhat-cloud-services/frontend-components-utilities/files/helpers';

ReactDOM.render(
    <Provider store={ init().getStore() }>
        <Router basename={ getBaseName(window.location.pathname) }>
            <App />
        </Router>
    </Provider>,

    document.getElementById('root')
);
