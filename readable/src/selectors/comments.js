import { createSelector } from 'reselect';

const commentsSelector = (state) => state.comments.comments;

export const getComments = createSelector(
  commentsSelector,
  (commentsObj) => {
    const commentsIds = Object.keys(commentsObj);
    return commentsIds.map((commentId) => ({ ...commentsObj[commentId] }));
  }
);
