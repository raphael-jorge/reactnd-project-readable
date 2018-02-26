import {
  POSTS_SET,
  POSTS_ADD,
  POSTS_REMOVE,
  POSTS_UPDATE,
  POSTS_SET_LOADING_STATE,
  POSTS_SET_LOAD_ERROR,
} from '../actions/posts';

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
      const idsToKeep = postsIds.filter((id) => id !== action.postId);
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
          [action.postId]: {
            ...state.posts[action.postId],
            title: action.postData.title,
            body: action.postData.body,
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

    default:
      return state;
  }
}
