import {
  POSTS_SET,
  POSTS_ADD,
  POSTS_REMOVE,
  POSTS_UPDATE,
  POSTS_SET_LOADING_STATE,
} from '../actions/posts';

import {
  COMMENTS_ADD,
  COMMENTS_REMOVE,
} from '../actions/comments';

const initialState = {
  loading: {
    id: null,
    isLoading: false,
    hasErrored: false,
  },
  posts: {},
};

export default function posts(state = initialState, action) {
  switch (action.type) {
    case POSTS_SET: {
      // id corresponde à operação de loading -> atualização posts liberada
      if (action.operationId === state.loading.id) {
        return {
          ...state,
          posts: action.posts.reduce((posts, post) => {
            posts[post.id] = post;
            return posts;
          }, {}),
        };
      } else {
        // se não corresponder -> o estado fica inalterado
        return state;
      }
    }

    case POSTS_ADD:
      return {
        ...state,
        posts: {
          ...state.posts,
          [action.post.id]: action.post,
        },
      };

    case POSTS_REMOVE: {
      const postsIds = Object.keys(state.posts);
      const idsToKeep = postsIds.filter((id) => id !== action.post.id);
      return {
        ...state,
        posts: idsToKeep.reduce((posts, id) => {
          posts[id] = state.posts[id];
          return posts;
        }, {}),
      };
    }

    case POSTS_UPDATE:
      return {
        ...state,
        posts: {
          ...state.posts,
          [action.post.id]: {
            ...state.posts[action.post.id],
            title: action.newData.title,
            body: action.newData.body,
          },
        },
      };

    case POSTS_SET_LOADING_STATE: {
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

    case COMMENTS_ADD:
      return {
        ...state,
        posts: {
          ...state.posts,
          [action.comment.parentId]: {
            ...state.posts[action.comment.parentId],
            commentCount: state.posts[action.comment.parentId].commentCount + 1,
          },
        },
      };

    case COMMENTS_REMOVE:
      return {
        ...state,
        posts: {
          ...state.posts,
          [action.comment.parentId]: {
            ...state.posts[action.comment.parentId],
            commentCount: state.posts[action.comment.parentId].commentCount - 1,
          },
        },
      };

    default:
      return state;
  }
}
