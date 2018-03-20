import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import routes from '../routes';
import Header from './Header';
import NotFound from './NotFound';
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
