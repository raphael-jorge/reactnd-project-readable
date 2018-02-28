import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import routes from '../routes';

class App extends Component {
  render() {
    return (
      <div>

        <Route exact path={routes.root} render={() => (
          <p>Root</p>
        )}/>

        <Route exact path={routes.category} render={({ match }) => {
          const category = match.params.category;
          return (
            <p>{category}</p>
          );
        }}/>

        <Route exact path={routes.post} render={({ match }) => {
          const category = match.params.category;
          const postId = match.params.postId;
          return (
            <p>{category} ({postId})</p>
          );
        }}/>

      </div>
    );
  }
}

export default App;
