import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import registerServiceWorker from './registerServiceWorker';
import App from './components/App';
import configureStore from './store';
import { fetchCategories } from './actions/categories';
import setRouteState from './actions/routes';
import './index.css';

const store = configureStore();
store.dispatch(fetchCategories());

const history = createBrowserHistory();
history.listen((location) => store.dispatch(setRouteState(history.location)));
store.dispatch(setRouteState(history.location));

ReactDOM.render(
  <Router history={history}>
    <App />
  </Router>,
  document.getElementById('root'));
registerServiceWorker();
