import {
  POSTS_SET,
  POSTS_ADD,
  POSTS_REMOVE,
  POSTS_UPDATE,
  POSTS_SET_LOADING_STATE,
  POSTS_SET_LOAD_ERROR,
} from '../actions/posts';

import {
  COMMENTS_ADD,
  COMMENTS_REMOVE,
} from '../actions/comments';

const initialState = {
  loading: false,
  errorOnLoad: false,
  posts: {},
};

export default function posts(state = initialState, action) {
  switch (action.type) {
    case POSTS_SET:
      return {
        ...state,
        posts: action.posts.reduce((posts, post) => {
          posts[post.id] = post;
          return posts;
        }, {}),
      };

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

    case POSTS_SET_LOADING_STATE:
      return {
        ...state,
        loading: action.loading,
      };

    case POSTS_SET_LOAD_ERROR:
      return {
        ...state,
        errorOnLoad: action.errorOnLoad,
      };

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
