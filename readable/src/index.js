import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import { Provider } from 'react-redux';
import ReactModal from 'react-modal';
import registerServiceWorker from './registerServiceWorker';
import App from './components/App';
import configureStore from './store';
import { fetchCategories } from './actions/categories';
import { fetchPosts } from './actions/posts';
import setRouteState from './actions/routes';
import './index.css';

const store = configureStore();
store.dispatch(fetchCategories());
store.dispatch(fetchPosts());

const history = createBrowserHistory();
history.listen((location) => store.dispatch(setRouteState(location)));
store.dispatch(setRouteState(history.location));

const rootId = 'root';
ReactModal.setAppElement(`#${rootId}`);
ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>,
  document.getElementById(rootId));
registerServiceWorker();
