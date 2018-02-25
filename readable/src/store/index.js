import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import categoriesReducer from '../reducers/categories';

const logger = (store) => (next) => (action) => {
  console.group(action.type);
  console.info('dispatching', action);
  const result = next(action);
  console.info('next state', store.getState());
  console.groupEnd(action.type);
  return result;
};

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default function configureStore() {
  return createStore(
    categoriesReducer,
    composeEnhancers(applyMiddleware(thunk, logger))
  );
}
