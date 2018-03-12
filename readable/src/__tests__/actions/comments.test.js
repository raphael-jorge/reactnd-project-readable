import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as PostsAPI from '../../util/PostsAPI';
import * as actions from '../../actions/comments';

// Mock PostsAPI
jest.mock('../../util/PostsAPI', () => {
  const comments = [
    { id: 'testId1', body: 'testBody1', author: 'testAuthor1' },
    { id: 'testId2', body: 'testBody2', author: 'testAuthor2' },
  ];

  return {
    get: { postComments: jest.fn(() => Promise.resolve(comments)) },
    create: {
      comment: jest.fn(
        (postId, commentData) => Promise.resolve({
          ...commentData,
          id: 'testCreatedCommentId',
        })
      ),
      voteOnComment: jest.fn(() => Promise.resolve()),
    },
    update: { comment: jest.fn(() => Promise.resolve()) },
    del: { comment: jest.fn(() => Promise.resolve()) },
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
const getDefaultCommentsArray = () => {
  const commentsArray = [
    { id: 'testId1', body: 'testBody1', author: 'testAuthor1' },
    { id: 'testId2', body: 'testBody2', author: 'testAuthor2' },
  ];

  return commentsArray;
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
        type: actions.COMMENTS_SET_LOADING_STATE,
        loading: { ...loadingState, hasErrored: false },
      };

      expect(actions.setLoadingState(loadingState)).toEqual(expectedAction);

      loadingState = {
        id: operationId,
        isLoading: false,
        hasErrored: true,
      };
      expectedAction = {
        type: actions.COMMENTS_SET_LOADING_STATE,
        loading: loadingState,
      };

      expect(actions.setLoadingState(loadingState)).toEqual(expectedAction);
    });

    it('should create an action to set comments', () => {
      const testCommentsArray = getDefaultCommentsArray();
      const operationId = 'testOperationId';
      const parentPostId = 'testParentPostId';

      const testActionInput = {
        comments: testCommentsArray,
        operationId,
        parentPostId,
      };

      const expectedAction = {
        type: actions.COMMENTS_SET,
        ...testActionInput,
      };

      expect(actions.setComments(testActionInput)).toEqual(expectedAction);
    });

    it('should create an action to add a new comment', () => {
      const commentToAdd = { id: 'testId' };

      const expectedAction = {
        type: actions.COMMENTS_ADD,
        comment: commentToAdd,
      };

      expect(actions.addComment(commentToAdd)).toEqual(expectedAction);
    });

    it('should create an action to remove a comment', () => {
      const commentToRemove = { id: 'testId' };

      const expectedAction = {
        type: actions.COMMENTS_REMOVE,
        comment: commentToRemove,
      };

      expect(actions.removeComment(commentToRemove)).toEqual(expectedAction);
    });

    it('should create an action to update a comment', () => {
      const commentToUpdate = { id: 'testId' };
      const updatedCommentData = { body: 'testBody' };

      const expectedAction = {
        type: actions.COMMENTS_UPDATE,
        comment: commentToUpdate,
        newData: updatedCommentData,
      };

      expect(actions.updateComment(commentToUpdate, updatedCommentData))
        .toEqual(expectedAction);
    });

    it('should create an action to vote on a comment', () => {
      const commentToVote = { id: 'testId' };
      let vote = 4;
      let expectedVote = 1;

      const expectedAction = {
        type: actions.COMMENTS_VOTE,
        comment: commentToVote,
        vote: expectedVote,
      };

      expect(actions.voteOnComment(commentToVote, vote)).toEqual(expectedAction);

      vote = -4;
      expectedVote = -1;
      expectedAction.vote = expectedVote;

      expect(actions.voteOnComment(commentToVote, vote)).toEqual(expectedAction);
    });

    it('should create an action to set the processing state of a comment', () => {
      const commentToSet = { id: 'testId' };

      let processingState = false;
      const expectedAction = {
        type: actions.COMMENTS_SET_PROCESSING_STATE,
        comment: commentToSet,
        processingState,
      };

      expect(actions.setProcessingState(commentToSet, processingState))
        .toEqual(expectedAction);

      processingState = true;
      expectedAction.processingState = processingState;

      expect(actions.setProcessingState(commentToSet, processingState))
        .toEqual(expectedAction);
    });
  });


  describe('async actions', () => {
    it('should fetch comments from the api and dispatch actions on success', async () => {
      const testCommentsArray = getDefaultCommentsArray();
      const operationId = 'testOperationId';
      const parentPostId = 'testParentPostId';

      const expectedActions = [
        actions.setLoadingState({ id: operationId, isLoading: true, hasErrored: false }),
        actions.setComments({ comments: testCommentsArray, operationId, parentPostId }),
        actions.setLoadingState({ id: operationId, isLoading: false, hasErrored: false }),
      ];

      const store = mockStore({});
      await store.dispatch(actions.fetchComments(parentPostId));
      const dispatchedActions = store.getActions();

      expect(dispatchedActions).toEqual(expectedActions);
      expect(PostsAPI.get.postComments).toHaveBeenCalledWith(parentPostId);
    });

    it('should fetch comments from the api and dispatch actions on failure', async () => {
      PostsAPI.get.postComments.mockImplementationOnce(() => Promise.reject());
      const operationId = 'testOperationId';
      const parentPostId = 'testParentPostId';

      const expectedActions = [
        actions.setLoadingState({ id: operationId, isLoading: true, hasErrored: false }),
        actions.setComments({ comments: [], operationId, parentPostId: null }),
        actions.setLoadingState({ id: operationId, isLoading: false, hasErrored: true }),
      ];

      const store = mockStore({});
      await store.dispatch(actions.fetchComments(parentPostId));
      const dispatchedActions = store.getActions();

      expect(dispatchedActions).toEqual(expectedActions);
      expect(PostsAPI.get.postComments).toHaveBeenCalledWith(parentPostId);
    });

    it('should add a new comment on the api and dispatch actions on success', async () => {
      const parentPostId = 'testParentPostId';
      const commentToAdd = { body: 'testBody', author: 'testAuthor' };

      const expectedAddedComment = { ...commentToAdd, id: 'testCreatedCommentId' };

      const expectedActions = [
        actions.addComment(expectedAddedComment),
      ];

      const store = mockStore({});
      await store.dispatch(actions.fetchAddComment(parentPostId, commentToAdd));
      const dispatchedActions = store.getActions();

      expect(dispatchedActions).toEqual(expectedActions);
      expect(PostsAPI.create.comment)
        .toHaveBeenCalledWith(parentPostId, commentToAdd);
    });

    it('should remove a comment from the api and dispatch actions on success', async () => {
      const commentToRemove = { id: 'testId' };

      const expectedActions = [
        actions.setProcessingState(commentToRemove, true),
        actions.removeComment(commentToRemove),
      ];

      const store = mockStore({});
      await store.dispatch(actions.fetchRemoveComment(commentToRemove));
      const dispatchedActions = store.getActions();

      expect(dispatchedActions).toEqual(expectedActions);
      expect(PostsAPI.del.comment).toHaveBeenCalledWith(commentToRemove.id);
    });

    it('should remove a comment from the api and dispatch actions on failure', async () => {
      PostsAPI.del.comment.mockImplementationOnce(() => Promise.reject());
      const commentToRemove = { id: 'testId' };

      const expectedActions = [
        actions.setProcessingState(commentToRemove, true),
        actions.setProcessingState(commentToRemove, false),
      ];

      const store = mockStore({});
      await store.dispatch(actions.fetchRemoveComment(commentToRemove));
      const dispatchedActions = store.getActions();

      expect(dispatchedActions).toEqual(expectedActions);
      expect(PostsAPI.del.comment).toHaveBeenCalledWith(commentToRemove.id);
    });

    it('should update a comment on the api and dispatch actions on success', async () => {
      const commentToUpdate = { id: 'testId', body: 'testBody' };
      const updatedCommentData = { body: 'updatedTestBody' };

      const expectedActions = [
        actions.setProcessingState(commentToUpdate, true),
        actions.updateComment(commentToUpdate, updatedCommentData),
        actions.setProcessingState(commentToUpdate, false),
      ];

      const store = mockStore({});
      await store.dispatch(actions.fetchUpdateComment(commentToUpdate, updatedCommentData));
      const dispatchedActions = store.getActions();

      expect(dispatchedActions).toEqual(expectedActions);
      expect(PostsAPI.update.comment)
        .toHaveBeenCalledWith(commentToUpdate.id, updatedCommentData);
    });

    it('should update a comment on the api and dispatch actions on failure', async () => {
      PostsAPI.update.comment.mockImplementationOnce(() => Promise.reject());
      const commentToUpdate = { id: 'testId', body: 'testBody' };
      const updatedCommentData = { body: 'updatedTestBody' };

      const expectedActions = [
        actions.setProcessingState(commentToUpdate, true),
        actions.setProcessingState(commentToUpdate, false),
      ];

      const store = mockStore({});
      await store.dispatch(actions.fetchUpdateComment(commentToUpdate, updatedCommentData));
      const dispatchedActions = store.getActions();

      expect(dispatchedActions).toEqual(expectedActions);
      expect(PostsAPI.update.comment)
        .toHaveBeenCalledWith(commentToUpdate.id, updatedCommentData);
    });

    it('should vote on a comment on the api and dispatch actions on success', async () => {
      const commentToVote = { id: 'testId' };
      const vote = 1;

      const expectedActions = [
        actions.setProcessingState(commentToVote, true),
        actions.voteOnComment(commentToVote, vote),
        actions.setProcessingState(commentToVote, false),
      ];

      const store = mockStore({});
      await store.dispatch(actions.fetchVoteOnComment(commentToVote, vote));
      const dispatchedActions = store.getActions();

      expect(dispatchedActions).toEqual(expectedActions);
      expect(PostsAPI.create.voteOnComment).toHaveBeenCalledWith(commentToVote.id, vote);
    });

    it('should vote on a comment on the api and dispatch actions on failure', async () => {
      PostsAPI.create.voteOnComment.mockImplementationOnce(() => Promise.reject());
      const commentToVote = { id: 'testId' };
      const vote = 1;

      const expectedActions = [
        actions.setProcessingState(commentToVote, true),
        actions.setProcessingState(commentToVote, false),
      ];

      const store = mockStore({});
      await store.dispatch(actions.fetchVoteOnComment(commentToVote, vote));
      const dispatchedActions = store.getActions();

      expect(dispatchedActions).toEqual(expectedActions);
      expect(PostsAPI.create.voteOnComment).toHaveBeenCalledWith(commentToVote.id, vote);
    });
  });
});
