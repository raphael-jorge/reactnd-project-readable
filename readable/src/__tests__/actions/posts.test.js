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

// Mock createId
jest.mock('../../util/utils', () => {
  return { createId: () => 'testId' };
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
      let loadingState = {
        id: 'testId',
        isLoading: true,
      };

      let expectedAction = {
        type: actions.POSTS_SET_LOADING_STATE,
        loading: { ...loadingState, hasErrored: false },
      };

      expect(actions.setLoadingState(loadingState)).toEqual(expectedAction);

      loadingState = {
        id: 'testId',
        isLoading: false,
        hasErrored: true,
      };

      expectedAction = {
        type: actions.POSTS_SET_LOADING_STATE,
        loading: { ...loadingState },
      };
      expect(actions.setLoadingState(loadingState)).toEqual(expectedAction);
    });

    it('should create an action to set posts', () => {
      const operationId = 'testId';
      const expectedAction = {
        type: actions.POSTS_SET,
        posts: testPosts,
        operationId,
      };

      expect(actions.setPosts({ posts: testPosts, operationId: 'testId' }))
        .toEqual(expectedAction);
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
      const postToRemove = { id: 'testId' };
      const expectedAction = {
        type: actions.POSTS_REMOVE,
        post: postToRemove,
      };

      expect(actions.removePost(postToRemove)).toEqual(expectedAction);
    });

    it('should create an action to update a post', () => {
      const postToUpdate = { id: 'testId' };
      const updatedPostData = { title: 'testTitleUpdated', body: 'testBodyUpdated' };

      const expectedAction = {
        type: actions.POSTS_UPDATE,
        post: postToUpdate,
        newData: updatedPostData,
      };

      expect(actions.updatePost(postToUpdate, updatedPostData)).toEqual(expectedAction);
    });
  });


  describe('async actions', () => {
    it('should fetch posts from the api and dispatch actions on success', () => {
      const operationId = 'testId';
      const expectedActions = [
        { type: actions.POSTS_SET_LOADING_STATE, loading: {
          id: operationId,
          isLoading: true,
          hasErrored: false,
        } },
        { type: actions.POSTS_SET, posts: testPosts, operationId },
        { type: actions.POSTS_SET_LOADING_STATE, loading: {
          id: operationId,
          isLoading: false,
          hasErrored: false,
        } },
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

      const operationId = 'testId';
      const expectedActions = [
        { type: actions.POSTS_SET_LOADING_STATE, loading: {
          id: operationId,
          isLoading: true,
          hasErrored: false,
        } },
        { type: actions.POSTS_SET, posts: [], operationId },
        { type: actions.POSTS_SET_LOADING_STATE, loading: {
          id: operationId,
          isLoading: false,
          hasErrored: true,
        } },
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
      const postToRemove = { id: 'testId' };

      const expectedActions = [
        { type: actions.POSTS_REMOVE, post: postToRemove },
      ];

      const store = mockStore({});

      return store.dispatch(actions.fetchRemovePost(postToRemove)).then(() => {
        const dispatchedActions = store.getActions();
        expect(dispatchedActions).toEqual(expectedActions);
        expect(PostsAPI.del.post).toHaveBeenCalledWith(postToRemove.id);
      });
    });

    it('should update a post on the api and dispatch actions on success', () => {
      const postToUpdate = { id: 'testId', title: 'testTitle', body: 'testBody' };
      const updatedPostData = { title: 'updatedTestTitle', body: 'updatedTestBody' };

      const expectedActions = [
        { type: actions.POSTS_UPDATE, post: postToUpdate, newData: updatedPostData },
      ];

      const store = mockStore({});

      return store.dispatch(actions.fetchUpdatePost(postToUpdate, updatedPostData))
        .then(() => {
          const dispatchedActions = store.getActions();
          expect(dispatchedActions).toEqual(expectedActions);
          expect(PostsAPI.update.post).toHaveBeenCalledWith(postToUpdate.id, updatedPostData);
        });
    });
  });
});
