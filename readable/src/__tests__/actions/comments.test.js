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
    },
    update: { comment: jest.fn(() => Promise.resolve()) },
    del: { comment: jest.fn(() => Promise.resolve()) },
  };
});

// Mock redux store
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const testComments = [
  { id: 'testId1', body: 'testBody1', author: 'testAuthor1' },
  { id: 'testId2', body: 'testBody2', author: 'testAuthor2' },
];

afterEach(() => {
  jest.clearAllMocks();
});


describe('actions', () => {
  describe('action creators', () => {
    it('should create an action to set the loading state', () => {
      let loadingState = true;
      let expectedAction = {
        type: actions.COMMENTS_SET_LOADING_STATE,
        loading: loadingState,
      };

      expect(actions.setLoadingState(loadingState)).toEqual(expectedAction);

      loadingState = false;
      expectedAction = {
        type: actions.COMMENTS_SET_LOADING_STATE,
        loading: loadingState,
      };

      expect(actions.setLoadingState(loadingState)).toEqual(expectedAction);
    });

    it('should create an action to set the errorOnLoad state', () => {
      let errorOnLoad = true;
      let expectedAction = {
        type: actions.COMMENTS_SET_LOAD_ERROR,
        errorOnLoad: errorOnLoad,
      };

      expect(actions.setLoadError(errorOnLoad)).toEqual(expectedAction);

      errorOnLoad = false;
      expectedAction = {
        type: actions.COMMENTS_SET_LOAD_ERROR,
        errorOnLoad: errorOnLoad,
      };

      expect(actions.setLoadError(errorOnLoad)).toEqual(expectedAction);
    });

    it('should create an action to set comments', () => {
      const expectedAction = {
        type: actions.COMMENTS_SET,
        comments: testComments,
      };

      expect(actions.setComments(testComments)).toEqual(expectedAction);
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
  });


  describe('async actions', () => {
    it('should fetch comments from the api and dispatch actions on success', () => {
      const parentPostId = 'testId';
      const expectedActions = [
        { type: actions.COMMENTS_SET_LOADING_STATE, loading: true },
        { type: actions.COMMENTS_SET, comments: testComments },
        { type: actions.COMMENTS_SET_LOADING_STATE, loading: false },
        { type: actions.COMMENTS_SET_LOAD_ERROR, errorOnLoad: false },
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

      const postId = 'testId';
      const expectedActions = [
        { type: actions.COMMENTS_SET_LOADING_STATE, loading: true },
        { type: actions.COMMENTS_SET_LOADING_STATE, loading: false },
        { type: actions.COMMENTS_SET_LOAD_ERROR, errorOnLoad: true },
      ];


      const store = mockStore({});

      return store.dispatch(actions.fetchComments(postId)).then(() => {
        const dispatchedActions = store.getActions();
        expect(dispatchedActions).toEqual(expectedActions);
        expect(PostsAPI.get.postComments).toHaveBeenCalledWith(postId);
      });
    });

    it('should add a new comment on the api and dispatch actions on success', () => {
      const parentPostId = 'testId';
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
  });
});
