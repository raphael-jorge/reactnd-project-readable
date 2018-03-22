import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as PostsAPI from '../../util/PostsAPI';
import * as commentsActions from '../../actions/comments';

// Mock PostsAPI
jest.mock('../../util/PostsAPI', () => {
  const comments = global.testUtils.getDefaultCommentsArray();

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

afterEach(() => {
  jest.clearAllMocks();
});


// Tests
describe('actions', () => {
  describe('action creators', () => {
    it('should create an action to set comments', () => {
      const comments = global.testUtils.getDefaultCommentsArray();
      const operationId = 'testOperationId';
      const parentPostId = 'testParentPostId';

      const testActionInput = {
        comments,
        operationId,
        parentPostId,
      };

      const expectedAction = {
        type: commentsActions.COMMENTS_SET,
        ...testActionInput,
      };

      expect(commentsActions.setComments(testActionInput)).toEqual(expectedAction);
    });

    it('should create an action to add a new comment', () => {
      const commentToAdd = { id: 'testId' };

      const expectedAction = {
        type: commentsActions.COMMENTS_ADD,
        comment: commentToAdd,
      };

      expect(commentsActions.addComment(commentToAdd)).toEqual(expectedAction);
    });

    it('should create an action to remove a comment', () => {
      const commentToRemove = global.testUtils.getDefaultCommentData();

      const expectedAction = {
        type: commentsActions.COMMENTS_REMOVE,
        comment: commentToRemove,
      };

      expect(commentsActions.removeComment(commentToRemove)).toEqual(expectedAction);
    });

    it('should create an action to update a comment', () => {
      const commentToUpdate = global.testUtils.getDefaultCommentData();
      const updatedCommentData = { body: 'testBody' };

      const expectedAction = {
        type: commentsActions.COMMENTS_UPDATE,
        comment: commentToUpdate,
        newData: updatedCommentData,
      };

      expect(commentsActions.updateComment(commentToUpdate, updatedCommentData))
        .toEqual(expectedAction);
    });

    it('should create an action to vote on a comment', () => {
      const commentToVote = global.testUtils.getDefaultCommentData();

      let vote = 4;
      let expectedVote = 1;
      const expectedAction = {
        type: commentsActions.COMMENTS_VOTE,
        comment: commentToVote,
        vote: expectedVote,
      };

      expect(commentsActions.voteOnComment(commentToVote, vote)).toEqual(expectedAction);

      vote = -4;
      expectedVote = -1;
      expectedAction.vote = expectedVote;

      expect(commentsActions.voteOnComment(commentToVote, vote)).toEqual(expectedAction);
    });

    it('should create an action to set the loading state', () => {
      const operationId = 'testOperationId';
      let loadingState = {
        id: operationId,
        isLoading: true,
      };

      let expectedAction = {
        type: commentsActions.COMMENTS_SET_LOADING_STATE,
        loading: { ...loadingState, hasErrored: false },
      };

      expect(commentsActions.setLoadingState(loadingState)).toEqual(expectedAction);

      loadingState = {
        id: operationId,
        isLoading: false,
        hasErrored: true,
      };

      expectedAction = {
        type: commentsActions.COMMENTS_SET_LOADING_STATE,
        loading: loadingState,
      };

      expect(commentsActions.setLoadingState(loadingState)).toEqual(expectedAction);
    });

    it('should create an action to set the processing state of a comment', () => {
      const commentToSet = global.testUtils.getDefaultCommentData();

      let processingState = false;
      const expectedAction = {
        type: commentsActions.COMMENTS_SET_PROCESSING_STATE,
        comment: commentToSet,
        processingState,
      };

      expect(commentsActions.setProcessingState(commentToSet, processingState))
        .toEqual(expectedAction);

      processingState = true;
      expectedAction.processingState = processingState;

      expect(commentsActions.setProcessingState(commentToSet, processingState))
        .toEqual(expectedAction);
    });
  });


  describe('async actions', () => {
    it('should fetch comments from the api and dispatch actions on success', async () => {
      const testCommentsArray = global.testUtils.getDefaultCommentsArray();
      const operationId = 'testOperationId';
      const parentPostId = 'testParentPostId';

      const expectedActions = [
        commentsActions.setLoadingState(
          { id: operationId, isLoading: true, hasErrored: false }
        ),
        commentsActions.setComments(
          { comments: testCommentsArray, operationId, parentPostId }
        ),
        commentsActions.setLoadingState(
          { id: operationId, isLoading: false, hasErrored: false }
        ),
      ];

      const store = mockStore({});
      await store.dispatch(commentsActions.fetchComments(parentPostId));
      const dispatchedActions = store.getActions();

      expect(dispatchedActions).toEqual(expectedActions);
      expect(PostsAPI.get.postComments).toHaveBeenCalledWith(parentPostId);
    });

    it('should fetch comments from the api and dispatch actions on failure', async () => {
      PostsAPI.get.postComments.mockImplementationOnce(() => Promise.reject());
      const operationId = 'testOperationId';
      const parentPostId = 'testParentPostId';

      const expectedActions = [
        commentsActions.setLoadingState(
          { id: operationId, isLoading: true, hasErrored: false }
        ),
        commentsActions.setComments(
          { comments: [], operationId, parentPostId: null }
        ),
        commentsActions.setLoadingState(
          { id: operationId, isLoading: false, hasErrored: true }
        ),
      ];

      const store = mockStore({});
      await store.dispatch(commentsActions.fetchComments(parentPostId));
      const dispatchedActions = store.getActions();

      expect(dispatchedActions).toEqual(expectedActions);
      expect(PostsAPI.get.postComments).toHaveBeenCalledWith(parentPostId);
    });

    it('should add a new comment on the api and dispatch actions on success', async () => {
      const parentPostId = 'testParentPostId';
      const commentToAdd = { body: 'testBody', author: 'testAuthor' };

      const expectedAddedComment = { ...commentToAdd, id: 'testCreatedCommentId' };

      const expectedActions = [
        commentsActions.addComment(expectedAddedComment),
      ];

      const store = mockStore({});
      await store.dispatch(commentsActions.fetchAddComment(parentPostId, commentToAdd));
      const dispatchedActions = store.getActions();

      expect(dispatchedActions).toEqual(expectedActions);
      expect(PostsAPI.create.comment)
        .toHaveBeenCalledWith(parentPostId, commentToAdd);
    });

    it('should remove a comment from the api and dispatch actions on success', async () => {
      const commentToRemove = global.testUtils.getDefaultCommentData();

      const expectedActions = [
        commentsActions.setProcessingState(commentToRemove, true),
        commentsActions.removeComment(commentToRemove),
      ];

      const store = mockStore({});
      await store.dispatch(commentsActions.fetchRemoveComment(commentToRemove));
      const dispatchedActions = store.getActions();

      expect(dispatchedActions).toEqual(expectedActions);
      expect(PostsAPI.del.comment).toHaveBeenCalledWith(commentToRemove.id);
    });

    it('should remove a comment from the api and dispatch actions on failure', async () => {
      PostsAPI.del.comment.mockImplementationOnce(() => Promise.reject());
      const commentToRemove = global.testUtils.getDefaultCommentData();

      const expectedActions = [
        commentsActions.setProcessingState(commentToRemove, true),
        commentsActions.setProcessingState(commentToRemove, false),
      ];

      const store = mockStore({});
      await store.dispatch(commentsActions.fetchRemoveComment(commentToRemove));
      const dispatchedActions = store.getActions();

      expect(dispatchedActions).toEqual(expectedActions);
      expect(PostsAPI.del.comment).toHaveBeenCalledWith(commentToRemove.id);
    });

    it('should update a comment on the api and dispatch actions on success', async () => {
      const commentToUpdate = global.testUtils.getDefaultCommentData();
      const updatedCommentData = { body: 'updatedTestBody' };

      const expectedActions = [
        commentsActions.setProcessingState(commentToUpdate, true),
        commentsActions.updateComment(commentToUpdate, updatedCommentData),
        commentsActions.setProcessingState(commentToUpdate, false),
      ];

      const store = mockStore({});
      await store.dispatch(
        commentsActions.fetchUpdateComment(commentToUpdate, updatedCommentData)
      );
      const dispatchedActions = store.getActions();

      expect(dispatchedActions).toEqual(expectedActions);
      expect(PostsAPI.update.comment)
        .toHaveBeenCalledWith(commentToUpdate.id, updatedCommentData);
    });

    it('should update a comment on the api and dispatch actions on failure', async () => {
      PostsAPI.update.comment.mockImplementationOnce(() => Promise.reject());
      const commentToUpdate = global.testUtils.getDefaultCommentData();
      const updatedCommentData = { body: 'updatedTestBody' };

      const expectedActions = [
        commentsActions.setProcessingState(commentToUpdate, true),
        commentsActions.setProcessingState(commentToUpdate, false),
      ];

      const store = mockStore({});
      await store.dispatch(
        commentsActions.fetchUpdateComment(commentToUpdate, updatedCommentData)
      );
      const dispatchedActions = store.getActions();

      expect(dispatchedActions).toEqual(expectedActions);
      expect(PostsAPI.update.comment)
        .toHaveBeenCalledWith(commentToUpdate.id, updatedCommentData);
    });

    it('should vote on a comment on the api and dispatch actions on success', async () => {
      const commentToVote = global.testUtils.getDefaultCommentData();
      const vote = 1;

      const expectedActions = [
        commentsActions.setProcessingState(commentToVote, true),
        commentsActions.voteOnComment(commentToVote, vote),
        commentsActions.setProcessingState(commentToVote, false),
      ];

      const store = mockStore({});
      await store.dispatch(commentsActions.fetchVoteOnComment(commentToVote, vote));
      const dispatchedActions = store.getActions();

      expect(dispatchedActions).toEqual(expectedActions);
      expect(PostsAPI.create.voteOnComment).toHaveBeenCalledWith(commentToVote.id, vote);
    });

    it('should vote on a comment on the api and dispatch actions on failure', async () => {
      PostsAPI.create.voteOnComment.mockImplementationOnce(() => Promise.reject());
      const commentToVote = global.testUtils.getDefaultCommentData();
      const vote = 1;

      const expectedActions = [
        commentsActions.setProcessingState(commentToVote, true),
        commentsActions.setProcessingState(commentToVote, false),
      ];

      const store = mockStore({});
      await store.dispatch(commentsActions.fetchVoteOnComment(commentToVote, vote));
      const dispatchedActions = store.getActions();

      expect(dispatchedActions).toEqual(expectedActions);
      expect(PostsAPI.create.voteOnComment).toHaveBeenCalledWith(commentToVote.id, vote);
    });
  });
});
