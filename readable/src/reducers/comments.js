import {
  COMMENTS_SET,
  COMMENTS_ADD,
  COMMENTS_REMOVE,
  COMMENTS_UPDATE,
  COMMENTS_SET_LOADING_STATE,
} from '../actions/comments';

import {
  POSTS_REMOVE,
} from '../actions/posts';

const initialState = {
  loading: {
    id: null,
    isLoading: false,
    hasErrored: false,
  },
  comments: {},
  parentPostId: null,
};

export default function comments(state = initialState, action) {
  switch (action.type) {
    case COMMENTS_SET: {
      // id corresponde à operação de loading -> atualização comments liberada
      if (action.operationId === state.loading.id) {
        return {
          ...state,
          comments: action.comments.reduce((comments, comment) => {
            comments[comment.id] = comment;
            return comments;
          }, {}),
          parentPostId: action.parentPostId,
        };
      } else {
        // se não corresponder -> o estado fica inalterado
        return state;
      }
    }

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

    case COMMENTS_SET_LOADING_STATE: {
      // Mesmo id de operação -> atualização liberada
      if (action.loading.id === state.loading.id) {
        return {
          ...state,
          loading: {
            ...state.loading,
            isLoading: action.loading.isLoading,
            hasErrored: action.loading.hasErrored,
          },
        };
      } else {
        // Se for uma nova operação -> atualização liberada
        if (action.loading.isLoading) {
          return {
            ...state,
            loading: {
              id: action.loading.id,
              isLoading: action.loading.isLoading,
              hasErrored: action.loading.hasErrored,
            },
          };
        } else {
          // Se não for -> atualização bloqueada
          return state;
        }
      }
    }

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
