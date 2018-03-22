import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as PostsAPI from '../../util/PostsAPI';
import * as postsActions from '../../actions/posts';

// Mock PostsAPI
jest.mock('../../util/PostsAPI', () => {
  const posts = global.testUtils.getDefaultPostsArray();

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

afterEach(() => {
  jest.clearAllMocks();
});


// Tests
describe('actions', () => {
  describe('action creators', () => {
    it('should create an action to set posts', () => {
      const posts = global.testUtils.getDefaultPostsArray();
      const operationId = 'testOperationId';

      const expectedAction = {
        type: postsActions.POSTS_SET,
        posts,
        operationId,
      };

      expect(postsActions.setPosts({ posts, operationId }))
        .toEqual(expectedAction);
    });

    it('should create an action to add a new post', () => {
      const postToAdd = { id: 'testId' };

      const expectedAction = {
        type: postsActions.POSTS_ADD,
        post: postToAdd,
      };

      expect(postsActions.addPost(postToAdd)).toEqual(expectedAction);
    });

    it('should create an action to remove a post', () => {
      const postToRemove = global.testUtils.getDefaultPostData();

      const expectedAction = {
        type: postsActions.POSTS_REMOVE,
        post: postToRemove,
      };

      expect(postsActions.removePost(postToRemove)).toEqual(expectedAction);
    });

    it('should create an action to update a post', () => {
      const postToUpdate = global.testUtils.getDefaultPostData();
      const updatedPostData = { title: 'testTitleUpdated', body: 'testBodyUpdated' };

      const expectedAction = {
        type: postsActions.POSTS_UPDATE,
        post: postToUpdate,
        newData: updatedPostData,
      };

      expect(postsActions.updatePost(postToUpdate, updatedPostData)).toEqual(expectedAction);
    });

    it('should create an action to vote on a post', () => {
      const postToVote = global.testUtils.getDefaultPostData();
      let vote = 4;
      let expectedVote = 1;

      const expectedAction = {
        type: postsActions.POSTS_VOTE,
        post: postToVote,
        vote: expectedVote,
      };

      expect(postsActions.voteOnPost(postToVote, vote)).toEqual(expectedAction);

      vote = -4;
      expectedVote = -1;
      expectedAction.vote = expectedVote;

      expect(postsActions.voteOnPost(postToVote, vote)).toEqual(expectedAction);
    });

    it('should create an action to set the loading state', () => {
      const operationId = 'testOperationId';

      let loadingState = {
        id: operationId,
        isLoading: true,
      };
      let expectedAction = {
        type: postsActions.POSTS_SET_LOADING_STATE,
        loading: { ...loadingState, hasErrored: false },
      };

      expect(postsActions.setLoadingState(loadingState)).toEqual(expectedAction);

      loadingState = {
        id: operationId,
        isLoading: false,
        hasErrored: true,
      };
      expectedAction = {
        type: postsActions.POSTS_SET_LOADING_STATE,
        loading: { ...loadingState },
      };

      expect(postsActions.setLoadingState(loadingState)).toEqual(expectedAction);
    });

    it('should create an action to set the processing state of a post', () => {
      const postToSet = global.testUtils.getDefaultPostData();

      let processingState = false;
      const expectedAction = {
        type: postsActions.POSTS_SET_PROCESSING_STATE,
        post: postToSet,
        processingState,
      };

      expect(postsActions.setProcessingState(postToSet, processingState))
        .toEqual(expectedAction);

      processingState = true;
      expectedAction.processingState = processingState;

      expect(postsActions.setProcessingState(postToSet, processingState))
        .toEqual(expectedAction);
    });

    it('should create an action to set the sort option', () => {
      const sortOption = { value: 'testSortOption', label: 'test sort option' };

      const expectedAction = {
        type: postsActions.POSTS_SET_SORT_OPTION,
        sortOption,
      };

      expect(postsActions.setSortOption(sortOption)).toEqual(expectedAction);
    });
  });


  describe('async actions', () => {
    it('should fetch posts from the api and dispatch actions on success', async () => {
      const posts = global.testUtils.getDefaultPostsArray();
      const operationId = 'testOperationId';

      const expectedActions = [
        postsActions.setLoadingState(
          { id: operationId, isLoading: true, hasErrored: false }
        ),
        postsActions.setPosts({ posts: posts, operationId }),
        postsActions.setLoadingState(
          { id: operationId, isLoading: false, hasErrored: false }
        ),
      ];

      const store = mockStore({});
      await store.dispatch(postsActions.fetchPosts());
      const dispatchedActions = store.getActions();

      expect(dispatchedActions).toEqual(expectedActions);
      expect(PostsAPI.get.posts).toHaveBeenCalled();
    });

    it('should fetch posts from the api and dispatch actions on failure', async () => {
      PostsAPI.get.posts.mockImplementationOnce(() => Promise.reject());
      const operationId = 'testOperationId';

      const expectedActions = [
        postsActions.setLoadingState(
          { id: operationId, isLoading: true, hasErrored: false }
        ),
        postsActions.setPosts({ posts: [], operationId }),
        postsActions.setLoadingState(
          { id: operationId, isLoading: false, hasErrored: true }
        ),
      ];

      const store = mockStore({});
      await store.dispatch(postsActions.fetchPosts());
      const dispatchedActions = store.getActions();

      expect(dispatchedActions).toEqual(expectedActions);
      expect(PostsAPI.get.posts).toHaveBeenCalled();
    });

    it('should add a new post on the api and dispatch actions on success', async () => {
      const postToAdd = { title: 'testTitle', body: 'testBody' };
      const expectedAddedPost = { ...postToAdd, id: 'testCreatedPostId' };

      const expectedActions = [
        postsActions.addPost(expectedAddedPost),
      ];

      const store = mockStore({});
      await store.dispatch(postsActions.fetchAddPost(postToAdd));
      const dispatchedActions = store.getActions();

      expect(dispatchedActions).toEqual(expectedActions);
      expect(PostsAPI.create.post).toHaveBeenCalledWith(postToAdd);
    });

    it('should remove a post from the api and dispatch actions on success', async () => {
      const postToRemove = global.testUtils.getDefaultPostData();

      const expectedActions = [
        postsActions.setProcessingState(postToRemove, true),
        postsActions.removePost(postToRemove),
      ];

      const store = mockStore({});
      await store.dispatch(postsActions.fetchRemovePost(postToRemove));
      const dispatchedActions = store.getActions();

      expect(dispatchedActions).toEqual(expectedActions);
      expect(PostsAPI.del.post).toHaveBeenCalledWith(postToRemove.id);
    });

    it('should remove a post from the api and dispatch actions on failure', async () => {
      PostsAPI.del.post.mockImplementationOnce(() => Promise.reject());
      const postToRemove = global.testUtils.getDefaultPostData();

      const expectedActions = [
        postsActions.setProcessingState(postToRemove, true),
        postsActions.setProcessingState(postToRemove, false),
      ];

      const store = mockStore({});
      await store.dispatch(postsActions.fetchRemovePost(postToRemove));
      const dispatchedActions = store.getActions();

      expect(dispatchedActions).toEqual(expectedActions);
      expect(PostsAPI.del.post).toHaveBeenCalledWith(postToRemove.id);
    });

    it('should update a post on the api and dispatch actions on success', async () => {
      const postToUpdate = global.testUtils.getDefaultPostData();
      const updatedPostData = { title: 'updatedTestTitle', body: 'updatedTestBody' };

      const expectedActions = [
        postsActions.setProcessingState(postToUpdate, true),
        postsActions.updatePost(postToUpdate, updatedPostData),
        postsActions.setProcessingState(postToUpdate, false),
      ];

      const store = mockStore({});
      await store.dispatch(postsActions.fetchUpdatePost(postToUpdate, updatedPostData));
      const dispatchedActions = store.getActions();

      expect(dispatchedActions).toEqual(expectedActions);
      expect(PostsAPI.update.post).toHaveBeenCalledWith(postToUpdate.id, updatedPostData);
    });

    it('should update a post on the api and dispatch actions on failure', async () => {
      PostsAPI.update.post.mockImplementationOnce(() => Promise.reject());
      const postToUpdate = global.testUtils.getDefaultPostData();
      const updatedPostData = { title: 'updatedTestTitle', body: 'updatedTestBody' };

      const expectedActions = [
        postsActions.setProcessingState(postToUpdate, true),
        postsActions.setProcessingState(postToUpdate, false),
      ];

      const store = mockStore({});
      await store.dispatch(postsActions.fetchUpdatePost(postToUpdate, updatedPostData));
      const dispatchedActions = store.getActions();

      expect(dispatchedActions).toEqual(expectedActions);
      expect(PostsAPI.update.post).toHaveBeenCalledWith(postToUpdate.id, updatedPostData);
    });

    it('should vote on a post on the api and dispatch actions on success', async () => {
      const postToVote = global.testUtils.getDefaultPostData();
      const vote = 1;

      const expectedActions = [
        postsActions.setProcessingState(postToVote, true),
        postsActions.voteOnPost(postToVote, vote),
        postsActions.setProcessingState(postToVote, false),
      ];

      const store = mockStore({});
      await store.dispatch(postsActions.fetchVoteOnPost(postToVote, vote));
      const dispatchedActions = store.getActions();

      expect(dispatchedActions).toEqual(expectedActions);
      expect(PostsAPI.create.voteOnPost).toHaveBeenCalledWith(postToVote.id, vote);
    });

    it('should vote on a post on the api and dispatch actions on failure', async () => {
      PostsAPI.create.voteOnPost.mockImplementationOnce(() => Promise.reject());
      const postToVote = global.testUtils.getDefaultPostData();
      const vote = 1;

      const expectedActions = [
        postsActions.setProcessingState(postToVote, true),
        postsActions.setProcessingState(postToVote, false),
      ];

      const store = mockStore({});
      await store.dispatch(postsActions.fetchVoteOnPost(postToVote, vote));
      const dispatchedActions = store.getActions();

      expect(dispatchedActions).toEqual(expectedActions);
      expect(PostsAPI.create.voteOnPost).toHaveBeenCalledWith(postToVote.id, vote);
    });
  });
});
