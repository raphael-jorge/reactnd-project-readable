import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import App from './components/App';
import configureStore from './store';
import { fetchCategories } from './actions/categories';
import './index.css';

const store = configureStore();
store.dispatch(fetchCategories());

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
