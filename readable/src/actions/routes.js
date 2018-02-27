import configurePathMatch from 'path-match';
import routes from '../routes';
import * as postsActions from './posts';
import * as commentsActions from './comments';

const pathMatch = configurePathMatch();

const setRouteState = (location) => ((dispatch) => {
  const pathname = location.pathname;

  const rootMatch = pathMatch(routes.root)(pathname);
  const categoryMatch = pathMatch(routes.category)(pathname);
  const postMatch = pathMatch(routes.post)(pathname);

  if (rootMatch) {
    dispatch(postsActions.fetchPosts());
    dispatch(commentsActions.setComments([]));

  } else if (categoryMatch) {
    dispatch(postsActions.fetchPosts(categoryMatch.category));
    dispatch(commentsActions.setComments([]));

  } else if (postMatch) {
    dispatch(postsActions.fetchPosts(postMatch.category));
    dispatch(commentsActions.fetchComments(postMatch.postId));

  } else {
    dispatch(postsActions.setPosts([]));
    dispatch(commentsActions.setComments([]));
  }
});

export default setRouteState;
