import * as actions from '../../actions/posts';
import reducer from '../../reducers/posts';

describe('reducer', () => {
  it('should return the initial state', () => {
    const expectedState = {
      loading: false,
      errorOnLoad: false,
      posts: {},
    };

    expect(reducer(undefined, {})).toEqual(expectedState);
  });

  it('should handle POSTS_SET', () => {
    const postsToSet = [
      { id: 'testId1', title: 'testTitle1', body: 'testBody1' },
      { id: 'testId2', title: 'testTitle2', body: 'testBody2' },
    ];

    const testAction = {
      type: actions.POSTS_SET,
      posts: postsToSet,
    };

    const expectedState = {
      posts: postsToSet.reduce((posts, post) => {
        posts[post.id] = post;
        return posts;
      }, {}),
    };

    expect(reducer({}, testAction)).toEqual(expectedState);
  });

  it('should handle POSTS_ADD', () => {
    const postToAdd = { id: 'testId', title: 'testTitle', body: 'testBody' };
    const testAction = {
      type: actions.POSTS_ADD,
      post: postToAdd,
    };

    const expectedState = { posts: { [postToAdd.id]: postToAdd } };

    expect(reducer({}, testAction)).toEqual(expectedState);
  });

  it('should handle POSTS_REMOVE', () => {
    const postIdToRemove = 'testId1';
    const postIdToKeep = 'testId2';
    const initialState = { posts: {
      [postIdToRemove]: { id: postIdToRemove },
      [postIdToKeep]: { id: postIdToKeep },
    } };

    const testAction = {
      type: actions.POSTS_REMOVE,
      postId: postIdToRemove,
    };

    const expectedState = {
      posts: { [postIdToKeep]: { id: postIdToKeep } },
    };

    expect(reducer(initialState, testAction)).toEqual(expectedState);
  });

  it('should handle POSTS_UPDATE', () => {
    const postId = 'testId';
    const initialState = {
      posts: {
        [postId]: { id: postId, title: 'testTitle', body: 'testBody' },
      },
    };
    const updatedPost = { title: 'testUpdatedTitle', body: 'testUpdatedBody' };

    const testAction = {
      type: actions.POSTS_UPDATE,
      postId: postId,
      postData: updatedPost,
    };

    const expectedState = {
      posts: {
        [postId]: { ...updatedPost, id: postId },
      },
    };

    expect(reducer(initialState, testAction)).toEqual(expectedState);
  });

  it('should handle POSTS_SET_LOADING_STATE', () => {
    const loadingState = true;
    const testAction = {
      type: actions.POSTS_SET_LOADING_STATE,
      loading: loadingState,
    };

    const expectedState = { loading: loadingState };

    expect(reducer({}, testAction)).toEqual(expectedState);
  });

  it('should handle POSTS_SET_LOAD_ERROR', () => {
    const errorOnLoad = true;
    const testAction = {
      type: actions.POSTS_SET_LOAD_ERROR,
      errorOnLoad,
    };

    const expectedState = { errorOnLoad };

    expect(reducer({}, testAction)).toEqual(expectedState);
  });
});
