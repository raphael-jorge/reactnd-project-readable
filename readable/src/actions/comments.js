import * as PostsAPI from '../util/PostsAPI';
import { createId } from '../util/utils';

export const COMMENTS_SET = 'COMMENTS_SET';
export const COMMENTS_ADD = 'COMMENTS_ADD';
export const COMMENTS_REMOVE = 'COMMENTS_REMOVE';
export const COMMENTS_UPDATE = 'COMMENTS_UPDATE';
export const COMMENTS_VOTE = 'COMMENTS_VOTE';
export const COMMENTS_SET_LOADING_STATE = 'COMMENTS_SET_LOADING_STATE';

// Action creators

export const setComments = ({ comments, operationId, parentPostId }) => ({
  type: COMMENTS_SET,
  comments,
  operationId,
  parentPostId,
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

export const voteOnComment = (comment, vote) => ({
  type: COMMENTS_VOTE,
  vote: vote > 0 ? 1 : -1,
  comment,
});

export const setLoadingState = (loading) => ({
  type: COMMENTS_SET_LOADING_STATE,
  loading: {
    ...loading,
    hasErrored: loading.hasErrored || false,
  },
});

// Async Actions

export const fetchComments = (parentPostId) => ((dispatch) => {
  const operationId = createId();
  dispatch(setLoadingState({
    id: operationId,
    isLoading: true,
  }));

  return PostsAPI.get.postComments(parentPostId)
    .then((comments) => {
      dispatch(setComments({ comments, operationId, parentPostId }));
      dispatch(setLoadingState({
        id: operationId,
        isLoading: false,
      }));
    })
    .catch(() => {
      dispatch(setComments({ comments: [], operationId, parentPostId: null }));
      dispatch(setLoadingState({
        id: operationId,
        isLoading: false,
        hasErrored: true,
      }));
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

export const fetchVoteOnComment = (comment, vote) => ((dispatch) => {
  return PostsAPI.create.voteOnComment(comment.id, vote)
    .then(() => {
      dispatch(voteOnComment(comment, vote));
    });
});
