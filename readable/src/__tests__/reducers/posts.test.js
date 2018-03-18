import * as postsActions from '../../actions/posts';
import * as commentsActions from '../../actions/comments';
import reducer from '../../reducers/posts';

// Utils
const getDefaultPostsArray = () => {
  const postsArray = [
    { id: 'testId1', title: 'testTitle1', body: 'testBody1' },
    { id: 'testId2', title: 'testTitle2', body: 'testBody2' },
  ];
  return postsArray;


};

const getExpectedPostsOnState = (postsArray = getDefaultPostsArray()) => {
  const postsNormalized = postsArray.reduce((postsObj, post) => {
    postsObj[post.id] = { ...post };
    postsObj[post.id].processing = false;
    return postsObj;
  }, {});

  return postsNormalized;
};


// Tests
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
        sortOption: null,
      };

      expect(reducer(undefined, {})).toEqual(expectedState);
    });

    describe('should handle POSTS_SET', () => {
      it('updates posts if the operation id matches', () => {
        const testPostsArray = getDefaultPostsArray();
        const operationId = 'testoperationId';

        const initialState = {
          loading: { id: operationId },
          posts: {},
        };

        const testAction = postsActions.setPosts({
          posts: testPostsArray,
          operationId,
        });

        const expectedPostsOnState = getExpectedPostsOnState();
        const expectedState = {
          loading: { id: operationId },
          posts: expectedPostsOnState,
        };

        expect(reducer(initialState, testAction)).toEqual(expectedState);
      });

      it('does not update posts if operation id does not match', () => {
        const testPostsArray = getDefaultPostsArray();
        const operationIdState = 'testOldOperationId';
        const operationIdAction = 'testNewOperationId';

        const initialState = {
          loading: { id: operationIdState },
          posts: {},
        };

        const testAction = postsActions.setPosts({
          posts: testPostsArray,
          operationId: operationIdAction,
        });

        const expectedState = initialState;

        expect(reducer(initialState, testAction)).toEqual(expectedState);
      });
    });

    it('should handle POSTS_ADD', () => {
      const postToAdd = { id: 'testId', title: 'testTitle', body: 'testBody' };

      const testAction = postsActions.addPost(postToAdd);

      const expectedState = { posts: {
        [postToAdd.id]: { ...postToAdd, processing: false },
      } };

      expect(reducer({}, testAction)).toEqual(expectedState);
    });

    it('should handle POSTS_REMOVE', () => {
      const postToRemove = { id: 'testId1' };
      const postToKeep = { id: 'testId2' };

      const initialState = { posts: {
        [postToRemove.id]: postToRemove,
        [postToKeep.id]: postToKeep,
      } };

      const testAction = postsActions.removePost(postToRemove);

      const expectedState = {
        posts: { [postToKeep.id]: postToKeep },
      };

      expect(reducer(initialState, testAction)).toEqual(expectedState);
    });

    it('should handle POSTS_UPDATE', () => {
      const postToUpdate = { id: 'testId', title: 'testTitle', body: 'testBody' };
      const updatedPostData = { title: 'testUpdatedTitle', body: 'testUpdatedBody' };

      const initialState = {
        posts: {
          [postToUpdate.id]: postToUpdate,
        },
      };

      const testAction = postsActions.updatePost(postToUpdate, updatedPostData);

      const expectedState = {
        posts: {
          [postToUpdate.id]: { ...updatedPostData, id: postToUpdate.id },
        },
      };

      expect(reducer(initialState, testAction)).toEqual(expectedState);
    });

    it('should handle POSTS_VOTE', () => {
      const currentVoteScore = 3;
      const postToVote = { id: 'testId', voteScore: currentVoteScore };
      const vote = 1;

      const initialState = {
        posts: {
          [postToVote.id]: postToVote,
        },
      };

      const testAction = postsActions.voteOnPost(postToVote, vote);

      const expectedState = {
        posts: {
          [postToVote.id]: { ...postToVote, voteScore: currentVoteScore + 1 },
        },
      };

      expect(reducer(initialState, testAction)).toEqual(expectedState);
    });

    it('should handle POSTS_SET_PROCESSING_STATE', () => {
      const processingState = true;
      const postToSet = { id: 'testId', processing: false };

      const initialState = {
        posts: {
          [postToSet.id]: postToSet,
        },
      };

      const testAction = postsActions.setProcessingState(postToSet, processingState);

      const expectedState = {
        posts: {
          [postToSet.id]: { ...postToSet, processing: processingState },
        },
      };

      expect(reducer(initialState, testAction)).toEqual(expectedState);
    });

    it('should handle POSTS_SET_SORT_OPTION', () => {
      const sortOption = { value: 'testSortOption', label: 'test sort option' };

      const initialState = { sortOption: null };

      const testAction = postsActions.setSortOption(sortOption);

      const expectedState = { sortOption };

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
          const testAction = postsActions.setLoadingState(newLoadingState);

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
          const testAction = postsActions.setLoadingState(newLoadingState);

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
          const testAction = postsActions.setLoadingState(newLoadingState);

          const expectedState = initialState;

          expect(reducer(initialState, testAction)).toEqual(expectedState);
        });
      });
    });
  });


  describe('comments actions', () => {
    it('should handle COMMENTS_ADD: update commentCount', () => {
      const postIdToAddComment = 'testId';
      const commentToAdd = { parentId: postIdToAddComment };

      const initialState = {
        posts: { [postIdToAddComment]: { id: postIdToAddComment, commentCount: 0 } },
      };

      const testAction = commentsActions.addComment(commentToAdd);

      const expectedState = {
        posts: { [postIdToAddComment]: { id: postIdToAddComment, commentCount: 1 } },
      };

      expect(reducer(initialState, testAction)).toEqual(expectedState);
    });

    it('should handle COMMENTS_REMOVE: update commentCount', () => {
      const postIdToRemoveComment = 'testId';
      const commentToRemove = { parentId: postIdToRemoveComment };

      const initialState = {
        posts: { [postIdToRemoveComment]: { id: postIdToRemoveComment, commentCount: 1 } },
      };

      const testAction = commentsActions.removeComment(commentToRemove);

      const expectedState = {
        posts: { [postIdToRemoveComment]: { id: postIdToRemoveComment, commentCount: 0 } },
      };

      expect(reducer(initialState, testAction)).toEqual(expectedState);
    });
  });
});
