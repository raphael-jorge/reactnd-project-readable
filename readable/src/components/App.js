import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import routes from '../routes';
import ShowPosts from './ShowPosts';
import ShowPostComments from './ShowPostComments';

class App extends Component {
  render() {
    return (
      <div>

        <Route exact path={routes.root} render={() => (
          <ShowPosts />
        )} />

        <Route exact path={routes.category} render={({ match }) => (
          <ShowPosts />
        )} />

        <Route exact path={routes.post} render={({ match }) => (
          <ShowPostComments postId={match.params.postId}/>
        )} />

      </div>
    );
  }
}

export default App;
