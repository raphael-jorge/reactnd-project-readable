import { createSelector } from 'reselect';

const postsSelector = (state) => state.posts.posts;

const postIdSelector = (state, props) => props.postId;

const activeCategoryPathSelector = (state, ownProps) => ownProps.activeCategoryPath;

export const getPosts = createSelector(
  postsSelector,
  activeCategoryPathSelector,
  (postsObj, activeCategoryPath) => {
    const postsIds = Object.keys(postsObj);
    const postsArray = postsIds.map((postId) => ({ ...postsObj[postId] }));

    // Filtra posts para uma determinada categoria
    const postsArrayToProps = activeCategoryPath
      ? postsArray.filter((post) => post.category === activeCategoryPath)
      : postsArray;

    return postsArrayToProps;
  }
);

export const getPostData = createSelector(
  postsSelector,
  postIdSelector,
  (postObj, postId) => postObj[postId] || {}
);
