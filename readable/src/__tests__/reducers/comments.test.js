import * as commentsActions from '../../actions/comments';
import * as postsActions from '../../actions/posts';
import reducer from '../../reducers/comments';

// Utils
const getDefaultCommentsArray = () => {
  const commentsArray = [
    { id: 'testId1', body: 'testBody1', author: 'testAuthor1' },
    { id: 'testId2', body: 'testBody2', author: 'testAuthor2' },
  ];

  return commentsArray;
};

const getExpectedCommentsOnState = (commentsArray = getDefaultCommentsArray()) => {
  const commentsNormalized = commentsArray.reduce((commentsObj, comment) => {
    commentsObj[comment.id] = { ...comment };
    commentsObj[comment.id].processing = false;
    return commentsObj;
  }, {});

  return commentsNormalized;
};


// Tests
describe('reducer', () => {
  describe('comments actions', () => {
    it('should return the initial state', () => {
      const expectedState = {
        loading: {
          id: null,
          isLoading: false,
          hasErrored: false,
        },
        comments: {},
        parentPostId: null,
      };

      expect(reducer(undefined, {})).toEqual(expectedState);
    });

    describe('should handle COMMENTS_SET', () => {
      it('updates comments if the operation id matches', () => {
        const testCommentsArray = getDefaultCommentsArray();
        const parentPostId = 'testParentPostId';
        const operationId = 'testOperationId';

        const initialState = {
          loading: { id: operationId },
          comments: {},
          parentPostId: null,
        };

        const testAction = commentsActions.setComments({
          comments: testCommentsArray,
          operationId,
          parentPostId,
        });

        const expectedCommentsOnState = getExpectedCommentsOnState();
        const expectedState = {
          loading: { id: operationId },
          comments: expectedCommentsOnState,
          parentPostId,
        };

        expect(reducer(initialState, testAction)).toEqual(expectedState);
      });

      it('does not update comments if operation id does not match', () => {
        const testCommentsArray = getDefaultCommentsArray();
        const parentPostId = 'testParentPostId';
        const operationIdState = 'testOldOperationId';
        const operationIdAction = 'testNewOperationId';

        const initialState = {
          loading: { id: operationIdState },
          comments: {},
          parentPostId: null,
        };

        const testAction = commentsActions.setComments({
          comments: testCommentsArray,
          operationId: operationIdAction,
          parentPostId,
        });

        const expectedState = initialState;

        expect(reducer(initialState, testAction)).toEqual(expectedState);
      });
    });

    it('should handle COMMENTS_ADD', () => {
      const commentToAdd = { id: 'testId', body: 'testBody', author: 'testAuthor' };

      const testAction = commentsActions.addComment(commentToAdd);

      const expectedState = { comments: {
        [commentToAdd.id]: { ...commentToAdd, processing: false },
      } };

      expect(reducer({}, testAction)).toEqual(expectedState);
    });

    it('should handle COMMENTS_REMOVE', () => {
      const commentToRemove = { id: 'testId1' };
      const commentToKeep = { id: 'testIdw' };

      const initialState = { comments: {
        [commentToRemove.id]: commentToRemove,
        [commentToKeep.id]: commentToKeep,
      } };

      const testAction = commentsActions.removeComment(commentToRemove);

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

      const testAction = commentsActions.updateComment(commentToUpdate, updatedCommentData);

      const expectedState = {
        comments: { [commentToUpdate.id]: { ...updatedCommentData, id: commentToUpdate.id } },
      };

      expect(reducer(initialState, testAction)).toEqual(expectedState);
    });

    it('should handle COMMENTS_VOTE', () => {
      const currentVoteScore = 3;
      const commentToVote = { id: 'testId', voteScore: currentVoteScore };
      const vote = 1;

      const initialState = {
        comments: {
          [commentToVote.id]: commentToVote,
        },
      };

      const testAction = commentsActions.voteOnComment(commentToVote, vote);

      const expectedState = {
        comments: {
          [commentToVote.id]: { ...commentToVote, voteScore: currentVoteScore + 1 },
        },
      };

      expect(reducer(initialState, testAction)).toEqual(expectedState);
    });

    it('should handle COMMENTS_SET_PROCESSING_STATE', () => {
      const processingState = true;
      const commentToSet = { id: 'testId', processing: false };

      const initialState = {
        comments: {
          [commentToSet.id]: commentToSet,
        },
      };

      const testAction = commentsActions.setProcessingState(commentToSet, processingState);

      const expectedState = {
        comments: {
          [commentToSet.id]: { ...commentToSet, processing: processingState },
        },
      };

      expect(reducer(initialState, testAction)).toEqual(expectedState);
    });

    describe('should handle COMMENTS_SET_LOADING_STATE', () => {
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

          const testAction = commentsActions.setLoadingState(newLoadingState);

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

          const testAction = commentsActions.setLoadingState(newLoadingState);

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

          const testAction = commentsActions.setLoadingState(newLoadingState);

          const expectedState = initialState;

          expect(reducer(initialState, testAction)).toEqual(expectedState);
        });
      });
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

      const testAction = postsActions.removePost(postToRemove);

      const expectedState = { comments: {
        [testCommentToKeep.id]: testCommentToKeep,
      } };

      expect(reducer(initialState, testAction)).toEqual(expectedState);
    });
  });
});
