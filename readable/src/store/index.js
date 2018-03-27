import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import categories from '../reducers/categories';
import comments from '../reducers/comments';
import posts from '../reducers/posts';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const combinedReducer = combineReducers({ categories, comments, posts });

export default function configureStore() {
  return createStore(
    combinedReducer,
    composeEnhancers(applyMiddleware(thunk))
  );
}
