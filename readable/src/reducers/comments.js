import {
  COMMENTS_SET,
  COMMENTS_ADD,
  COMMENTS_REMOVE,
  COMMENTS_UPDATE,
  COMMENTS_SET_LOADING_STATE,
  COMMENTS_SET_LOAD_ERROR,
} from '../actions/comments';

import {
  POSTS_REMOVE,
} from '../actions/posts';

const initialState = {
  loading: false,
  errorOnLoad: false,
  comments: {},
};

export default function comments(state = initialState, action) {
  switch (action.type) {
    case COMMENTS_SET:
      return {
        ...state,
        comments: action.comments.reduce((comments, comment) => {
          comments[comment.id] = comment;
          return comments;
        }, {}),
      };

    case COMMENTS_ADD:
      return {
        ...state,
        comments: {
          ...state.comments,
          [action.comment.id]: action.comment,
        },
      };

    case COMMENTS_REMOVE: {
      const commentsIds = Object.keys(state.comments);
      const idsToKeep = commentsIds.filter((id) => id !== action.comment.id);
      return {
        ...state,
        comments: idsToKeep.reduce((comments, id) => {
          comments[id] = state.comments[id];
          return comments;
        }, {}),
      };
    }

    case COMMENTS_UPDATE:
      return {
        ...state,
        comments: {
          ...state.comments,
          [action.comment.id]: {
            ...state.comments[action.comment.id],
            body: action.newData.body,
          },
        },
      };

    case COMMENTS_SET_LOADING_STATE:
      return {
        ...state,
        loading: action.loading,
      };

    case COMMENTS_SET_LOAD_ERROR:
      return {
        ...state,
        errorOnLoad: action.errorOnLoad,
      };

    case POSTS_REMOVE: {
      const commentsIds = Object.keys(state.comments);
      const idsToKeep = commentsIds.filter(
        (id) => state.comments[id].parentId !== action.post.id
      );
      return {
        ...state,
        comments: idsToKeep.reduce((comments, id) => {
          comments[id] = state.comments[id];
          return comments;
        }, {}),
      };
    }

    default:
      return state;
  }
}
