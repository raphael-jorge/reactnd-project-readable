import * as commentsActions from '../../actions/comments';
import * as postsActions from '../../actions/posts';
import reducer from '../../reducers/comments';

describe('reducer', () => {
  describe('comments actions', () => {
    it('should return the initial state', () => {
      const expectedState = {
        loading: false,
        errorOnLoad: false,
        comments: {},
      };

      expect(reducer(undefined, {})).toEqual(expectedState);
    });

    it('should handle COMMENTS_SET', () => {
      const commentsToSet = [
        { id: 'testId1', body: 'testBody1', author: 'testAuthor1' },
        { id: 'testId2', body: 'testBody2', author: 'testAuthor2' },
      ];

      const testAction = {
        type: commentsActions.COMMENTS_SET,
        comments: commentsToSet,
      };

      const expectedState = {
        comments: commentsToSet.reduce((comments, comment) => {
          comments[comment.id] = comment;
          return comments;
        }, {}),
      };

      expect(reducer({}, testAction)).toEqual(expectedState);
    });

    it('should handle COMMENTS_ADD', () => {
      const commentToAdd = { id: 'testId', body: 'testBody', author: 'testAuthor' };

      const testAction = {
        type: commentsActions.COMMENTS_ADD,
        comment: commentToAdd,
      };

      const expectedState = { comments: { [commentToAdd.id]: commentToAdd } };

      expect(reducer({}, testAction)).toEqual(expectedState);
    });

    it('should handle COMMENTS_REMOVE', () => {
      const commentToRemove = { id: 'testId1' };
      const commentToKeep = { id: 'testIdw' };

      const initialState = { comments: {
        [commentToRemove.id]: commentToRemove,
        [commentToKeep.id]: commentToKeep,
      } };

      const testAction = {
        type: commentsActions.COMMENTS_REMOVE,
        comment: commentToRemove,
      };

      const expectedState = {
        comments: { [commentToKeep.id]: commentToKeep },
      };

      expect(reducer(initialState, testAction)).toEqual(expectedState);
    });

    it('should handle COMMENTS_UPDATE', () => {
      const commentToUpdate = { id: 'testId', body: 'testBody' };
      const initialState = {
        comments: { [commentToUpdate.id]: commentToUpdate },
      };

      const updatedCommentData = { body: 'updatedTestBody' };

      const testAction = {
        type: commentsActions.COMMENTS_UPDATE,
        comment: commentToUpdate,
        newData: updatedCommentData,
      };

      const expectedState = {
        comments: { [commentToUpdate.id]: { ...updatedCommentData, id: commentToUpdate.id } },
      };

      expect(reducer(initialState, testAction)).toEqual(expectedState);
    });

    it('should handle COMMENTS_SET_LOADING_STATE', () => {
      const loadingState = true;
      const testAction = {
        type: commentsActions.COMMENTS_SET_LOADING_STATE,
        loading: loadingState,
      };

      const expectedState = { loading: loadingState };

      expect(reducer({}, testAction)).toEqual(expectedState);
    });

    it('should handle COMMENTS_SET_LOAD_ERROR', () => {
      const errorOnLoad = true;
      const testAction = {
        type: commentsActions.COMMENTS_SET_LOAD_ERROR,
        errorOnLoad,
      };

      const expectedState = { errorOnLoad };

      expect(reducer({}, testAction)).toEqual(expectedState);
    });
  });


  describe('posts actions', () => {
    it('should handle POSTS_REMOVE: remove the post child comments', () => {
      const postToRemove = { id: 'testPostId' };
      const testCommentToRemove = { id: 'testCommentId1', parentId: postToRemove.id };
      const testCommentToKeep = { id: 'testCommentId2', parentId: 'testPostIdToKeep' };

      const initialState = { comments: {
        [testCommentToRemove.id]: testCommentToRemove,
        [testCommentToKeep.id]: testCommentToKeep,
      } };

      const testAction = {
        type: postsActions.POSTS_REMOVE,
        post: postToRemove,
      };

      const expectedState = { comments: {
        [testCommentToKeep.id]: testCommentToKeep,
      } };

      expect(reducer(initialState, testAction)).toEqual(expectedState);
    });
  });
});
