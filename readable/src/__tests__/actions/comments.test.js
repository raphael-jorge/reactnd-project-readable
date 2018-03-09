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
const getDefaultComments = () => {
  const commentsArray = [
    { id: 'testId1', body: 'testBody1', author: 'testAuthor1' },
    { id: 'testId2', body: 'testBody2', author: 'testAuthor2' },
  ];

  return {
    commentsArray,
  };
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
      const testComments = getDefaultComments();
      const operationId = 'testOperationId';
      const parentPostId = 'testParentPostId';

      const testActionInput = {
        comments: testComments.commentsArray,
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
  });


  describe('async actions', () => {
    it('should fetch comments from the api and dispatch actions on success', () => {
      const testComments = getDefaultComments();
      const operationId = 'testOperationId';
      const parentPostId = 'testParentPostId';

      const expectedActions = [
        { type: actions.COMMENTS_SET_LOADING_STATE, loading: {
          id: operationId,
          isLoading: true,
          hasErrored: false,
        } },
        {
          type: actions.COMMENTS_SET,
          comments: testComments.commentsArray,
          operationId,
          parentPostId,
        },
        { type: actions.COMMENTS_SET_LOADING_STATE, loading: {
          id: operationId,
          isLoading: false,
          hasErrored: false,
        } },
      ];

      const store = mockStore({});

      return store.dispatch(actions.fetchComments(parentPostId)).then(() => {
        const dispatchedActions = store.getActions();
        expect(dispatchedActions).toEqual(expectedActions);
        expect(PostsAPI.get.postComments).toHaveBeenCalledWith(parentPostId);
      });
    });

    it('should fetch comments from the api and dispatch actions on failure', () => {
      PostsAPI.get.postComments.mockImplementationOnce(() => Promise.reject());
      const operationId = 'testOperationId';
      const parentPostId = 'testParentPostId';

      const expectedActions = [
        { type: actions.COMMENTS_SET_LOADING_STATE, loading: {
          id: operationId,
          isLoading: true,
          hasErrored: false,
        } },
        { type: actions.COMMENTS_SET, comments: [], parentPostId: null, operationId },
        { type: actions.COMMENTS_SET_LOADING_STATE, loading: {
          id: operationId,
          isLoading: false,
          hasErrored: true,
        } },
      ];

      const store = mockStore({});

      return store.dispatch(actions.fetchComments(parentPostId)).then(() => {
        const dispatchedActions = store.getActions();
        expect(dispatchedActions).toEqual(expectedActions);
        expect(PostsAPI.get.postComments).toHaveBeenCalledWith(parentPostId);
      });
    });

    it('should add a new comment on the api and dispatch actions on success', () => {
      const parentPostId = 'testParentPostId';
      const commentToAdd = { body: 'testBody', author: 'testAuthor' };

      const expectedAddedComment = { ...commentToAdd, id: 'testCreatedCommentId' };

      const expectedActions = [
        { type: actions.COMMENTS_ADD, comment: expectedAddedComment },
      ];

      const store = mockStore({});

      return store.dispatch(actions.fetchAddComment(parentPostId, commentToAdd))
        .then(() => {
          const dispatchedActions = store.getActions();
          expect(dispatchedActions).toEqual(expectedActions);
          expect(PostsAPI.create.comment)
            .toHaveBeenCalledWith(parentPostId, commentToAdd);
        });
    });

    it('should remove a comment from the api and dispatch actions on success', () => {
      const commentToRemove = { id: 'testId' };

      const expectedActions = [
        { type: actions.COMMENTS_REMOVE, comment: commentToRemove },
      ];

      const store = mockStore({});

      return store.dispatch(actions.fetchRemoveComment(commentToRemove))
        .then(() => {
          const dispatchedActions = store.getActions();
          expect(dispatchedActions).toEqual(expectedActions);
          expect(PostsAPI.del.comment).toHaveBeenCalledWith(commentToRemove.id);
        });
    });

    it('should update a comment on the api and dispatch actions on success', () => {
      const commentToUpdate = { id: 'testId', body: 'testBody' };
      const updatedCommentData = { body: 'updatedTestBody' };

      const expectedActions = [
        {
          type: actions.COMMENTS_UPDATE,
          comment: commentToUpdate,
          newData: updatedCommentData,
        },
      ];

      const store = mockStore({});

      return store.dispatch(actions.fetchUpdateComment(commentToUpdate, updatedCommentData))
        .then(() => {
          const dispatchedActions = store.getActions();
          expect(dispatchedActions).toEqual(expectedActions);
          expect(PostsAPI.update.comment)
            .toHaveBeenCalledWith(commentToUpdate.id, updatedCommentData);
        });
    });

    it('should vote on a comment on the api and dispatch actions on success', () => {
      const commentToVote = { id: 'testId' };
      const vote = 4;
      const expectedVote = 1;

      const expectedActions = [
        { type: actions.COMMENTS_VOTE, comment: commentToVote, vote: expectedVote },
      ];

      const store = mockStore({});

      return store.dispatch(actions.fetchVoteOnComment(commentToVote, vote))
        .then(() => {
          const dispatchedActions = store.getActions();
          expect(dispatchedActions).toEqual(expectedActions);
          expect(PostsAPI.create.voteOnComment).toHaveBeenCalledWith(commentToVote.id, vote);
        });
    });
  });
});
