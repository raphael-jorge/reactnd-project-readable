import { createSelector } from 'reselect';
import sortBy from 'sort-by';

const postsSelector = (state) => state.posts.posts;

const postIdSelector = (state, props) => props.postId;

const sortOptionSelector = (state) => state.posts.sortOption;

const activeCategoryPathSelector = (state, ownProps) => ownProps.activeCategoryPath;

export const getPosts = createSelector(
  postsSelector,
  sortOptionSelector,
  activeCategoryPathSelector,
  (postsObj, sortOption, activeCategoryPath) => {
    const postsIds = Object.keys(postsObj);
    const postsArray = postsIds.map((postId) => ({ ...postsObj[postId] }));

    // Filtra posts para uma determinada categoria
    const postsArrayToProps = activeCategoryPath
      ? postsArray.filter((post) => post.category === activeCategoryPath)
      : postsArray;

    // Ordena os posts quando uma opção de ordenação está selecionada
    if (sortOption) {
      postsArrayToProps.sort(sortBy(sortOption.value));
    }

    return postsArrayToProps;
  }
);

export const getPostData = createSelector(
  postsSelector,
  postIdSelector,
  (postObj, postId) => postObj[postId] || {}
);
