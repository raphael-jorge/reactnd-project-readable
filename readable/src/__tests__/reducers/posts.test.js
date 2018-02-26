import * as postsActions from '../../actions/posts';
import * as commentsActions from '../../actions/comments';
import reducer from '../../reducers/posts';

describe('reducer', () => {
  describe('posts actions', () => {
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
        type: postsActions.POSTS_SET,
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
        type: postsActions.POSTS_ADD,
        post: postToAdd,
      };

      const expectedState = { posts: { [postToAdd.id]: postToAdd } };

      expect(reducer({}, testAction)).toEqual(expectedState);
    });

    it('should handle POSTS_REMOVE', () => {
      const postToRemove = { id: 'testId1' };
      const postToKeep = { id: 'testId2' };
      const initialState = { posts: {
        [postToRemove.id]: postToRemove,
        [postToKeep.id]: postToKeep,
      } };

      const testAction = {
        type: postsActions.POSTS_REMOVE,
        post: postToRemove,
      };

      const expectedState = {
        posts: { [postToKeep.id]: postToKeep },
      };

      expect(reducer(initialState, testAction)).toEqual(expectedState);
    });

    it('should handle POSTS_UPDATE', () => {
      const postToUpdate = { id: 'testId', title: 'testTitle', body: 'testBody' };
      const initialState = {
        posts: {
          [postToUpdate.id]: postToUpdate,
        },
      };
      const updatedPostData = { title: 'testUpdatedTitle', body: 'testUpdatedBody' };

      const testAction = {
        type: postsActions.POSTS_UPDATE,
        post: postToUpdate,
        newData: updatedPostData,
      };

      const expectedState = {
        posts: {
          [postToUpdate.id]: { ...updatedPostData, id: postToUpdate.id },
        },
      };

      expect(reducer(initialState, testAction)).toEqual(expectedState);
    });

    it('should handle POSTS_SET_LOADING_STATE', () => {
      const loadingState = true;
      const testAction = {
        type: postsActions.POSTS_SET_LOADING_STATE,
        loading: loadingState,
      };

      const expectedState = { loading: loadingState };

      expect(reducer({}, testAction)).toEqual(expectedState);
    });

    it('should handle POSTS_SET_LOAD_ERROR', () => {
      const errorOnLoad = true;
      const testAction = {
        type: postsActions.POSTS_SET_LOAD_ERROR,
        errorOnLoad,
      };

      const expectedState = { errorOnLoad };

      expect(reducer({}, testAction)).toEqual(expectedState);
    });
  });


  describe('comments postsActions', () => {
    it('should handle COMMENTS_ADD: update commentCount', () => {
      const postIdToAddComment = 'testId';

      const initialState = {
        posts: { [postIdToAddComment]: { id: postIdToAddComment, commentCount: 0 } },
      };

      const testAction = {
        type: commentsActions.COMMENTS_ADD,
        comment: { parentId: postIdToAddComment },
      };

      const expectedState = {
        posts: { [postIdToAddComment]: { id: postIdToAddComment, commentCount: 1 } },
      };

      expect(reducer(initialState, testAction)).toEqual(expectedState);
    });

    it('should handle COMMENTS_REMOVE: update commentCount', () => {
      const postIdToRemoveComment = 'testId';

      const initialState = {
        posts: { [postIdToRemoveComment]: { id: postIdToRemoveComment, commentCount: 1 } },
      };

      const testAction = {
        type: commentsActions.COMMENTS_REMOVE,
        comment: { parentId: postIdToRemoveComment },
      };

      const expectedState = {
        posts: { [postIdToRemoveComment]: { id: postIdToRemoveComment, commentCount: 0 } },
      };

      expect(reducer(initialState, testAction)).toEqual(expectedState);
    });
  });
});
