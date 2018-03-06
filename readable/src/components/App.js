import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import routes from '../routes';
import Header from './Header';
import ShowPosts from './ShowPosts';
import ShowPostComments from './ShowPostComments';

export class App extends Component {
  render() {
    const {
      categories,
      activePath,
    } = this.props;

    return (
      <div>
        <Header categories={categories} activePath={activePath}/>

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

export const mapStateToProps = (state, props) => {
  const categoriesState = state.categories;
  let categories;
  if (categoriesState.isLoading || categoriesState.hasErrored) {
    categories = [];
  } else {
    const categoriesIds = Object.keys(categoriesState.categories);
    categories = categoriesIds.map((id) => categoriesState.categories[id]);
  }
  return {
    categories,
    activePath: categoriesState.activePath,
  };
};

export default withRouter(connect(mapStateToProps)(App));
