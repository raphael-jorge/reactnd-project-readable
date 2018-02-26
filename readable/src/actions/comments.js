import * as PostsAPI from '../util/PostsAPI';

export const COMMENTS_SET = 'COMMENTS_SET';
export const COMMENTS_ADD = 'COMMENTS_ADD';
export const COMMENTS_REMOVE = 'COMMENTS_REMOVE';
export const COMMENTS_UPDATE = 'COMMENTS_UPDATE';
export const COMMENTS_SET_LOADING_STATE = 'COMMENTS_SET_LOADING_STATE';
export const COMMENTS_SET_LOAD_ERROR = 'COMMENTS_SET_LOAD_ERROR';

// Action creators

export const setComments = (comments) => ({
  type: COMMENTS_SET,
  comments,
});

export const addComment = (comment) => ({
  type: COMMENTS_ADD,
  comment,
});

export const removeComment = (comment) => ({
  type: COMMENTS_REMOVE,
  comment,
});

export const updateComment = (comment, updatedData) => ({
  type: COMMENTS_UPDATE,
  comment,
  newData: updatedData,
});

export const setLoadingState = (loading) => ({
  type: COMMENTS_SET_LOADING_STATE,
  loading,
});

export const setLoadError = (errorOnLoad) => ({
  type: COMMENTS_SET_LOAD_ERROR,
  errorOnLoad,
});

// Async Actions

export const fetchComments = (postId) => ((dispatch) => {
  dispatch(setLoadingState(true));

  return PostsAPI.get.postComments(postId)
    .then((comments) => {
      dispatch(setComments(comments));
      dispatch(setLoadingState(false));
      dispatch(setLoadError(false));
    })
    .catch(() => {
      dispatch(setLoadingState(false));
      dispatch(setLoadError(true));
    });
});

export const fetchAddComment = (postId, comment) => ((dispatch) => {
  return PostsAPI.create.comment(postId, comment)
    .then((createdComment) => {
      dispatch(addComment(createdComment));
    });
});

export const fetchRemoveComment = (comment) => ((dispatch) => {
  return PostsAPI.del.comment(comment.id)
    .then(() => {
      dispatch(removeComment(comment));
    });
});

export const fetchUpdateComment = (comment, updatedData) => ((dispatch) => {
  return PostsAPI.update.comment(comment.id, updatedData)
    .then(() => {
      dispatch(updateComment(comment, updatedData));
    });
});
