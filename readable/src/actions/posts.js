import * as PostsAPI from '../util/PostsAPI';
import createIdSimpleId from '../util/createSimpleId';

export const POSTS_SET = 'POSTS_SET';
export const POSTS_ADD = 'POSTS_ADD';
export const POSTS_REMOVE = 'POSTS_REMOVE';
export const POSTS_UPDATE = 'POSTS_UPDATE';
export const POSTS_VOTE = 'POSTS_VOTE';
export const POSTS_SET_LOADING_STATE = 'POSTS_SET_LOADING_STATE';
export const POSTS_SET_PROCESSING_STATE = 'POSTS_SET_PROCESSING_STATE';

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

export const voteOnPost = (post, vote) => ({
  type: POSTS_VOTE,
  vote: vote > 0 ? 1 : -1,
  post,
});

export const setLoadingState = (loading) => ({
  type: POSTS_SET_LOADING_STATE,
  loading: {
    ...loading,
    hasErrored: loading.hasErrored || false,
  },
});

export const setProcessingState = (post, processingState) => ({
  type: POSTS_SET_PROCESSING_STATE,
  post,
  processingState,
});

// Async action creators

export const fetchPosts = (category) => ((dispatch) => {
  const operationId = createIdSimpleId();
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
  return PostsAPI.add.post(postData)
    .then((createdPost) => {
      dispatch(addPost(createdPost));
    });
});

export const fetchRemovePost = (post) => ((dispatch) => {
  dispatch(setProcessingState(post, true));

  return PostsAPI.remove.post(post.id)
    .then(() => {
      dispatch(removePost(post));
    })
    .catch(() => {
      dispatch(setProcessingState(post, false));
    });
});

export const fetchUpdatePost = (post, updatedData) => ((dispatch) => {
  dispatch(setProcessingState(post, true));

  return PostsAPI.update.post(post.id, updatedData)
    .then(() => {
      dispatch(updatePost(post, updatedData));
      dispatch(setProcessingState(post, false));
    })
    .catch(() => {
      dispatch(setProcessingState(post, false));
    });
});

export const fetchVoteOnPost = (post, vote) => ((dispatch) => {
  dispatch(setProcessingState(post, true));

  return PostsAPI.add.voteOnPost(post.id, vote)
    .then(() => {
      dispatch(voteOnPost(post, vote));
      dispatch(setProcessingState(post, false));
    })
    .catch(() => {
      dispatch(setProcessingState(post, false));
    });
});
