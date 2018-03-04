import * as postsActions from '../../actions/posts';
import * as commentsActions from '../../actions/comments';
import reducer from '../../reducers/posts';

describe('reducer', () => {
  describe('posts actions', () => {
    it('should return the initial state', () => {
      const expectedState = {
        loading: {
          id: null,
          isLoading: false,
          hasErrored: false,
        },
        posts: {},
      };

      expect(reducer(undefined, {})).toEqual(expectedState);
    });

    describe('should handle POSTS_SET', () => {
      it('updates posts if the operation id matches', () => {
        const operationId = 'testId';
        const initialState = {
          loading: { id: operationId },
          posts: {},
        };

        const postsToSet = [
          { id: 'testId1', title: 'testTitle1', body: 'testBody1' },
          { id: 'testId2', title: 'testTitle2', body: 'testBody2' },
        ];

        const testAction = {
          type: postsActions.POSTS_SET,
          posts: postsToSet,
          operationId,
        };

        const expectedState = {
          loading: { id: operationId },
          posts: postsToSet.reduce((posts, post) => {
            posts[post.id] = post;
            return posts;
          }, {}),
        };

        expect(reducer(initialState, testAction)).toEqual(expectedState);
      });

      it('does not update posts if operation id does not match', () => {
        const operationIdState = 'testIdState';
        const operationIdAction = 'testIdAction';
        const initialState = {
          loading: { id: operationIdState },
          posts: {},
        };

        const postsToSet = [
          { id: 'testId1', title: 'testTitle1', body: 'testBody1' },
          { id: 'testId2', title: 'testTitle2', body: 'testBody2' },
        ];

        const testAction = {
          type: postsActions.POSTS_SET,
          posts: postsToSet,
          operationId: operationIdAction,
        };

        const expectedState = initialState;

        expect(reducer(initialState, testAction)).toEqual(expectedState);
      });
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

    describe('should handle POSTS_SET_LOADING_STATE', () => {
      describe('an operation with the same id of the current state', () => {
        it('is free to update any loading status', () => {
          const initialState = { loading: {
            id: 'testId',
            isLoading: true,
            hasErrored: false,
          } };

          const newLoadingState = {
            id: initialState.loading.id,
            isLoading: !initialState.loading.isLoading,
            hasErrored: !initialState.loading.hasErrored,
          };
          const testAction = {
            type: postsActions.POSTS_SET_LOADING_STATE,
            loading: newLoadingState,
          };

          const expectedState = { loading: newLoadingState };

          expect(reducer(initialState, testAction)).toEqual(expectedState);
        });
      });

      describe('an operation with a different id of the current state', () => {
        it('is free to update the loading status if it is a new loading operation', () => {
          const initialState = { loading: {
            id: 'testId',
            isLoading: true,
            hasErrored: false,
          } };

          const newLoadingState = {
            id: 'newTestId',
            isLoading: true,    // new loading
            hasErrored: false,
          };
          const testAction = {
            type: postsActions.POSTS_SET_LOADING_STATE,
            loading: newLoadingState,
          };

          const expectedState = { loading: newLoadingState };

          expect(reducer(initialState, testAction)).toEqual(expectedState);
        });

        it('is not allowed to updated the loading status if it is a concluding operation', () => {
          const initialState = { loading: {
            id: 'testId',
            isLoading: true,
            hasErrored: false,
          } };

          const newLoadingState = {
            id: 'newTestId',
            isLoading: false,    // end loading
            hasErrored: false,
          };
          const testAction = {
            type: postsActions.POSTS_SET_LOADING_STATE,
            loading: newLoadingState,
          };

          const expectedState = initialState;

          expect(reducer(initialState, testAction)).toEqual(expectedState);
        });
      });
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
