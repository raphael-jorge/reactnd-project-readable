import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as PostsAPI from '../../util/PostsAPI';
import * as actions from '../../actions/posts';

// Mock PostsAPI
jest.mock('../../util/PostsAPI', () => {
  const posts = [
    { id: 'testId1', title: 'testTitle1', body: 'testBody1' },
    { id: 'testId2', title: 'testTitle2', body: 'testBody2' },
  ];

  return {
    get: { posts: jest.fn(() => Promise.resolve(posts)) },
    create: {
      post: jest.fn((postData) => {
        const createdPost = { ...postData };
        createdPost.id = 'testCreatedPostId';
        return Promise.resolve(createdPost);
      }),
    },
    update: { post: jest.fn(() => Promise.resolve()) },
    del: { post: jest.fn(() => Promise.resolve()) },
  };
});

// Mock redux store
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const testPosts = [
  { id: 'testId1', title: 'testTitle1', body: 'testBody1' },
  { id: 'testId2', title: 'testTitle2', body: 'testBody2' },
];

afterEach(() => {
  jest.clearAllMocks();
});


describe('actions', () => {
  describe('action creators', () => {
    it('should create an action to set the loading state', () => {
      let loadingState = true;
      let expectedAction = {
        type: actions.POSTS_SET_LOADING_STATE,
        loading: loadingState,
      };

      expect(actions.setLoadingState(loadingState)).toEqual(expectedAction);

      loadingState = false;
      expectedAction = {
        type: actions.POSTS_SET_LOADING_STATE,
        loading: loadingState,
      };

      expect(actions.setLoadingState(loadingState)).toEqual(expectedAction);
    });

    it('should create an action to set the errorOnLoad state', () => {
      let errorOnLoad = true;
      let expectedAction = {
        type: actions.POSTS_SET_LOAD_ERROR,
        errorOnLoad: errorOnLoad,
      };

      expect(actions.setLoadError(errorOnLoad)).toEqual(expectedAction);

      errorOnLoad = false;
      expectedAction = {
        type: actions.POSTS_SET_LOAD_ERROR,
        errorOnLoad: errorOnLoad,
      };

      expect(actions.setLoadError(errorOnLoad)).toEqual(expectedAction);
    });

    it('should create an action to set posts', () => {
      const expectedAction = {
        type: actions.POSTS_SET,
        posts: testPosts,
      };

      expect(actions.setPosts(testPosts)).toEqual(expectedAction);
    });

    it('should create an action to add a new post', () => {
      const postToAdd = { id: 'testId' };
      const expectedAction = {
        type: actions.POSTS_ADD,
        post: postToAdd,
      };

      expect(actions.addPost(postToAdd)).toEqual(expectedAction);
    });

    it('should create an action to remove a post', () => {
      const postIdToRemove = 'testId';
      const expectedAction = {
        type: actions.POSTS_REMOVE,
        postId: postIdToRemove,
      };

      expect(actions.removePost(postIdToRemove)).toEqual(expectedAction);
    });

    it('should create an action to update a post', () => {
      const postIdToUpdate = 'testId';
      const updatedPostData = { title: 'testTitleUpdated', body: 'testBodyUpdated' };

      const expectedAction = {
        type: actions.POSTS_UPDATE,
        postId: postIdToUpdate,
        postData: updatedPostData,
      };

      expect(actions.updatePost(postIdToUpdate, updatedPostData)).toEqual(expectedAction);
    });
  });


  describe('async actions', () => {
    it('should fetch posts from the api and dispatch actions on success', () => {
      const expectedActions = [
        { type: actions.POSTS_SET_LOADING_STATE, loading: true },
        { type: actions.POSTS_SET, posts: testPosts },
        { type: actions.POSTS_SET_LOADING_STATE, loading: false },
        { type: actions.POSTS_SET_LOAD_ERROR, errorOnLoad: false },
      ];

      const store = mockStore({});

      return store.dispatch(actions.fetchPosts()).then(() => {
        const dispatchedActions = store.getActions();
        expect(dispatchedActions).toEqual(expectedActions);
        expect(PostsAPI.get.posts).toHaveBeenCalled();
      });
    });

    it('should fetch posts from the api and dispatch actions on failure', () => {
      PostsAPI.get.posts.mockImplementationOnce(() => Promise.reject());

      const expectedActions = [
        { type: actions.POSTS_SET_LOADING_STATE, loading: true },
        { type: actions.POSTS_SET_LOADING_STATE, loading: false },
        { type: actions.POSTS_SET_LOAD_ERROR, errorOnLoad: true },
      ];

      const store = mockStore({});

      return store.dispatch(actions.fetchPosts()).then(() => {
        const dispatchedActions = store.getActions();
        expect(dispatchedActions).toEqual(expectedActions);
        expect(PostsAPI.get.posts).toHaveBeenCalled();
      });
    });

    it('should add a new post on the api and dispatch actions on success', () => {
      const postToAdd = { title: 'testTitle', body: 'testBody' };

      const expectedAddedPost = { ...postToAdd, id: 'testCreatedPostId' };

      const expectedActions = [
        { type: actions.POSTS_ADD, post: expectedAddedPost },
      ];

      const store = mockStore({});

      return store.dispatch(actions.fetchAddPost(postToAdd)).then(() => {
        const dispatchedActions = store.getActions();
        expect(dispatchedActions).toEqual(expectedActions);
        expect(PostsAPI.create.post).toHaveBeenCalledWith(postToAdd);
      });
    });

    it('should remove a post from the api and dispatch actions on success', () => {
      const postIdToRemove = 'testId';

      const expectedActions = [
        { type: actions.POSTS_REMOVE, postId: postIdToRemove },
      ];

      const store = mockStore({});

      return store.dispatch(actions.fetchRemovePost(postIdToRemove)).then(() => {
        const dispatchedActions = store.getActions();
        expect(dispatchedActions).toEqual(expectedActions);
        expect(PostsAPI.del.post).toHaveBeenCalledWith(postIdToRemove);
      });
    });

    it('should update a post on the api and dispatch actions on success', () => {
      const postIdToUpdate = 'testId';
      const updatedPostData = { title: 'updatedTestTitle', body: 'updatedTestBody' };

      const expectedActions = [
        { type: actions.POSTS_UPDATE, postId: postIdToUpdate, postData: updatedPostData },
      ];

      const store = mockStore({});

      return store.dispatch(actions.fetchUpdatePost(postIdToUpdate, updatedPostData))
        .then(() => {
          const dispatchedActions = store.getActions();
          expect(dispatchedActions).toEqual(expectedActions);
          expect(PostsAPI.update.post).toHaveBeenCalledWith(postIdToUpdate, updatedPostData);
        });
    });
  });
});
