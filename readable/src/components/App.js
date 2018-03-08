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

export const mapStateToProps = ({ categories }, props) => {
  const categoriesObj = categories.categories;

  let categoriesArr;
  if (categories.loading.isLoading || categories.loading.hasErrored) {
    categoriesArr = [];
  } else {
    const categoriesPath = Object.keys(categoriesObj);
    categoriesArr = categoriesPath.map((path) => categoriesObj[path]);
  }

  return {
    categories: categoriesArr,
    activePath: categories.activePath,
  };
};

export default withRouter(connect(mapStateToProps)(App));
