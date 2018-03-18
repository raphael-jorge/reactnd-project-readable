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
      voteOnPost: jest.fn(() => Promise.resolve()),
    },
    update: { post: jest.fn(() => Promise.resolve()) },
    del: { post: jest.fn(() => Promise.resolve()) },
  };
});

// Mock createId
jest.mock('../../util/utils', () => {
  return { createId: () => 'testOperationId' };
});

// Mock redux store
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

// Utils
const getDefaultPostsArray = () => {
  const postsArray = [
    { id: 'testId1', title: 'testTitle1', body: 'testBody1' },
    { id: 'testId2', title: 'testTitle2', body: 'testBody2' },
  ];

  return postsArray;
};

afterEach(() => {
  jest.clearAllMocks();
});


// Tests
describe('actions', () => {
  describe('action creators', () => {
    it('should create an action to set the loading state', () => {
      const operationId = 'testOperationId';

      let loadingState = {
        id: operationId,
        isLoading: true,
      };
      let expectedAction = {
        type: actions.POSTS_SET_LOADING_STATE,
        loading: { ...loadingState, hasErrored: false },
      };

      expect(actions.setLoadingState(loadingState)).toEqual(expectedAction);

      loadingState = {
        id: operationId,
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
      const testPostsArray = getDefaultPostsArray();
      const operationId = 'testOperationId';
      const expectedAction = {
        type: actions.POSTS_SET,
        posts: testPostsArray,
        operationId,
      };

      expect(actions.setPosts({ posts: testPostsArray, operationId }))
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

    it('should create an action to vote on a post', () => {
      const postToVote = { id: 'testId' };
      let vote = 4;
      let expectedVote = 1;

      const expectedAction = {
        type: actions.POSTS_VOTE,
        post: postToVote,
        vote: expectedVote,
      };

      expect(actions.voteOnPost(postToVote, vote)).toEqual(expectedAction);

      vote = -4;
      expectedVote = -1;
      expectedAction.vote = expectedVote;

      expect(actions.voteOnPost(postToVote, vote)).toEqual(expectedAction);
    });

    it('should create an action to set the sort option', () => {
      const sortOption = { value: 'testSortOption', label: 'test sort option' };

      const expectedAction = {
        type: actions.POSTS_SET_SORT_OPTION,
        sortOption,
      };

      expect(actions.setSortOption(sortOption)).toEqual(expectedAction);
    });
  });


  describe('async actions', () => {
    it('should fetch posts from the api and dispatch actions on success', async () => {
      const testPostsArray = getDefaultPostsArray();
      const operationId = 'testOperationId';

      const expectedActions = [
        actions.setLoadingState({ id: operationId, isLoading: true, hasErrored: false }),
        actions.setPosts({ posts: testPostsArray, operationId }),
        actions.setLoadingState({ id: operationId, isLoading: false, hasErrored: false }),
      ];

      const store = mockStore({});
      await store.dispatch(actions.fetchPosts());
      const dispatchedActions = store.getActions();

      expect(dispatchedActions).toEqual(expectedActions);
      expect(PostsAPI.get.posts).toHaveBeenCalled();
    });

    it('should fetch posts from the api and dispatch actions on failure', async () => {
      PostsAPI.get.posts.mockImplementationOnce(() => Promise.reject());
      const operationId = 'testOperationId';

      const expectedActions = [
        actions.setLoadingState({ id: operationId, isLoading: true, hasErrored: false }),
        actions.setPosts({ posts: [], operationId }),
        actions.setLoadingState({ id: operationId, isLoading: false, hasErrored: true }),
      ];

      const store = mockStore({});
      await store.dispatch(actions.fetchPosts());
      const dispatchedActions = store.getActions();

      expect(dispatchedActions).toEqual(expectedActions);
      expect(PostsAPI.get.posts).toHaveBeenCalled();
    });

    it('should add a new post on the api and dispatch actions on success', async () => {
      const postToAdd = { title: 'testTitle', body: 'testBody' };
      const expectedAddedPost = { ...postToAdd, id: 'testCreatedPostId' };

      const expectedActions = [
        actions.addPost(expectedAddedPost),
      ];

      const store = mockStore({});
      await store.dispatch(actions.fetchAddPost(postToAdd));
      const dispatchedActions = store.getActions();

      expect(dispatchedActions).toEqual(expectedActions);
      expect(PostsAPI.create.post).toHaveBeenCalledWith(postToAdd);
    });

    it('should remove a post from the api and dispatch actions on success', async () => {
      const postToRemove = { id: 'testId' };

      const expectedActions = [
        actions.setProcessingState(postToRemove, true),
        actions.removePost(postToRemove),
      ];

      const store = mockStore({});
      await store.dispatch(actions.fetchRemovePost(postToRemove));
      const dispatchedActions = store.getActions();

      expect(dispatchedActions).toEqual(expectedActions);
      expect(PostsAPI.del.post).toHaveBeenCalledWith(postToRemove.id);
    });

    it('should remove a post from the api and dispatch actions on failure', async () => {
      PostsAPI.del.post.mockImplementationOnce(() => Promise.reject());
      const postToRemove = { id: 'testId' };

      const expectedActions = [
        actions.setProcessingState(postToRemove, true),
        actions.setProcessingState(postToRemove, false),
      ];

      const store = mockStore({});
      await store.dispatch(actions.fetchRemovePost(postToRemove));
      const dispatchedActions = store.getActions();

      expect(dispatchedActions).toEqual(expectedActions);
      expect(PostsAPI.del.post).toHaveBeenCalledWith(postToRemove.id);
    });

    it('should update a post on the api and dispatch actions on success', async () => {
      const postToUpdate = { id: 'testId', title: 'testTitle', body: 'testBody' };
      const updatedPostData = { title: 'updatedTestTitle', body: 'updatedTestBody' };

      const expectedActions = [
        actions.setProcessingState(postToUpdate, true),
        actions.updatePost(postToUpdate, updatedPostData),
        actions.setProcessingState(postToUpdate, false),
      ];

      const store = mockStore({});
      await store.dispatch(actions.fetchUpdatePost(postToUpdate, updatedPostData));
      const dispatchedActions = store.getActions();

      expect(dispatchedActions).toEqual(expectedActions);
      expect(PostsAPI.update.post).toHaveBeenCalledWith(postToUpdate.id, updatedPostData);
    });

    it('should update a post on the api and dispatch actions on failure', async () => {
      PostsAPI.update.post.mockImplementationOnce(() => Promise.reject());
      const postToUpdate = { id: 'testId', title: 'testTitle', body: 'testBody' };
      const updatedPostData = { title: 'updatedTestTitle', body: 'updatedTestBody' };

      const expectedActions = [
        actions.setProcessingState(postToUpdate, true),
        actions.setProcessingState(postToUpdate, false),
      ];

      const store = mockStore({});
      await store.dispatch(actions.fetchUpdatePost(postToUpdate, updatedPostData));
      const dispatchedActions = store.getActions();

      expect(dispatchedActions).toEqual(expectedActions);
      expect(PostsAPI.update.post).toHaveBeenCalledWith(postToUpdate.id, updatedPostData);
    });

    it('should vote on a post on the api and dispatch actions on success', async () => {
      const postToVote = { id: 'testId' };
      const vote = 1;

      const expectedActions = [
        actions.setProcessingState(postToVote, true),
        actions.voteOnPost(postToVote, vote),
        actions.setProcessingState(postToVote, false),
      ];

      const store = mockStore({});
      await store.dispatch(actions.fetchVoteOnPost(postToVote, vote));
      const dispatchedActions = store.getActions();

      expect(dispatchedActions).toEqual(expectedActions);
      expect(PostsAPI.create.voteOnPost).toHaveBeenCalledWith(postToVote.id, vote);
    });

    it('should vote on a post on the api and dispatch actions on failure', async () => {
      PostsAPI.create.voteOnPost.mockImplementationOnce(() => Promise.reject());
      const postToVote = { id: 'testId' };
      const vote = 1;

      const expectedActions = [
        actions.setProcessingState(postToVote, true),
        actions.setProcessingState(postToVote, false),
      ];

      const store = mockStore({});
      await store.dispatch(actions.fetchVoteOnPost(postToVote, vote));
      const dispatchedActions = store.getActions();

      expect(dispatchedActions).toEqual(expectedActions);
      expect(PostsAPI.create.voteOnPost).toHaveBeenCalledWith(postToVote.id, vote);
    });
  });
});
