import * as PostsAPI from '../util/PostsAPI';
import { createId } from '../util/utils';

export const POSTS_SET = 'POSTS_SET';
export const POSTS_ADD = 'POSTS_ADD';
export const POSTS_REMOVE = 'POSTS_REMOVE';
export const POSTS_UPDATE = 'POSTS_UPDATE';
export const POSTS_SET_LOADING_STATE = 'POSTS_SET_LOADING_STATE';

// Action creators

export const setPosts = ({ posts, operationId }) => ({
  type: POSTS_SET,
  posts,
  operationId,
});

export const addPost = (post) => ({
  type: POSTS_ADD,
  post,
});

export const removePost = (post) => ({
  type: POSTS_REMOVE,
  post,
});

export const updatePost = (post, updatedData) => ({
  type: POSTS_UPDATE,
  post,
  newData: updatedData,
});

export const setLoadingState = (loading) => ({
  type: POSTS_SET_LOADING_STATE,
  loading: {
    ...loading,
    hasErrored: loading.hasErrored || false,
  },
});

// Async action creators

export const fetchPosts = (category) => ((dispatch) => {
  const operationId = createId();
  dispatch(setLoadingState({
    id: operationId,
    isLoading: true,
  }));

  return PostsAPI.get.posts(category)
    .then((posts) => {
      dispatch(setPosts({ posts, operationId }));
      dispatch(setLoadingState({
        id: operationId,
        isLoading: false,
        hasErrored: false,
      }));
    })
    .catch(() => {
      dispatch(setPosts({ posts: [], operationId }));
      dispatch(setLoadingState({
        id: operationId,
        isLoading: false,
        hasErrored: true,
      }));
    });
});

export const fetchAddPost = (postData) => ((dispatch) => {
  return PostsAPI.create.post(postData)
    .then((createdPost) => {
      dispatch(addPost(createdPost));
    });
});

export const fetchRemovePost = (post) => ((dispatch) => {
  return PostsAPI.del.post(post.id)
    .then(() => {
      dispatch(removePost(post));
    });
});

export const fetchUpdatePost = (post, updatedData) => ((dispatch) => {
  return PostsAPI.update.post(post.id, updatedData)
    .then(() => {
      dispatch(updatePost(post, updatedData));
    });
});
