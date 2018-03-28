import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import routes from '../routes';
import NotFound from './NotFound';
import ShowPosts from './ShowPosts';
import ShowPostComments from './ShowPostComments';

/* A aplicação Readable */
export default class App extends Component {
  render() {

    return (
      <Switch>
        <Route exact path={routes.root} render={() => (
          <ShowPosts />
        )} />

        <Route exact path={routes.category} render={({ match }) => (
          <ShowPosts activeCategoryPath={match.params.category} />
        )} />

        <Route exact path={routes.post} render={({ match }) => (
          <ShowPostComments postId={match.params.postId} />
        )} />

        <Route path="*" component={NotFound} />
      </Switch>
    );
  }
}
