import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import routes from '../../routes';
import commentsActions from '../../actions/comments';
import setRouteState from '../../actions/routes';

// Mock comments actions
jest.mock('../../actions/comments', () => ({
  fetchComments: jest.fn(
    () => (() => {})
  ),
}));

// Mock redux store
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

// Utils
const getDefaultState = () => ({
  comments: {
    comments: {},
    loading: { isLoading: false },
    parentPostId: null,
  },
});

const getDefaultLocation = (location) => {
  switch (location) {
    case 'root':
      return {
        locationStr: { pathname: '/' },
      };

    case 'category': {
      const category = 'testCategory';
      const locationStr = { pathname: `/${category}` };
      return {
        category,
        locationStr,
      };
    }

    case 'post': {
      const category = 'testCategory';
      const postId = 'testPostId';
      const locationStr = { pathname: `/${category}/${postId}` };

      return {
        category,
        postId,
        locationStr,
      };
    }

    default:
      return {
        locationStr: { pathname: '/test1/test2/test3' },
      };
  }
};

afterEach(() => {
  jest.clearAllMocks();
});


// Tests
describe('actions', () => {
  describe('setRouteState()', () => {
    describe(`post comments path [ ${routes.post} ]`, () => {
      it('fetches comments if there are no comments', () => {
        const testLocation = getDefaultLocation('post');
        const testState = getDefaultState();
        // Ajusta parâmetros para que não ativem a chamada ao fetch
        testState.comments.loading.isLoading = false;
        testState.comments.parentPostId = testLocation.postId;
        // Parâmetro que deve ativar a chamada
        testState.comments.comments = {};

        const store = mockStore(testState);
        store.dispatch(setRouteState(testLocation.locationStr));

        expect(commentsActions.fetchComments).toHaveBeenCalledWith(testLocation.postId);
      });

      it('fetches comments if it is a new parentPostId', () => {
        const testLocation = getDefaultLocation('post');
        const testState = getDefaultState();
        // Ajusta parâmetros para que não ativem a chamada ao fetch
        const testCommentId = 'testCommentId';
        testState.comments.comments = { [testCommentId]: { id: testCommentId } };
        testState.comments.loading.isLoading = false;
        // Parâmetro que deve ativar a chamada
        testState.comments.parentPostId = 'oldTestPostId';

        const store = mockStore(testState);
        store.dispatch(setRouteState(testLocation.locationStr));

        expect(commentsActions.fetchComments).toHaveBeenCalledWith(testLocation.postId);
      });

      it('fetches comments if there is comments being loaded already', () => {
        const testLocation = getDefaultLocation('post');
        const testState = getDefaultState();
        // Ajusta parâmetros para que não ativem a chamada ao fetch
        const testCommentId = 'testCommentId';
        testState.comments.comments = { [testCommentId]: { id: testCommentId } };
        testState.comments.parentPostId = testLocation.postId;
        // Parâmetro que deve ativar a chamada
        testState.comments.loading.isLoading = true;

        const store = mockStore(testState);
        store.dispatch(setRouteState(testLocation.locationStr));

        expect(commentsActions.fetchComments).toHaveBeenCalledWith(testLocation.postId);
      });

      it('does not fetch comments if it is not necessary', () => {
        const testLocation = getDefaultLocation('post');
        const testState = getDefaultState();
        // Ajusta parâmetros para que não ativem a chamada ao fetch
        const testCommentId = 'testCommentId';
        testState.comments.comments = { [testCommentId]: { id: testCommentId } };
        testState.comments.parentPostId = testLocation.postId;
        testState.comments.loading.isLoading = false;

        const store = mockStore(testState);
        store.dispatch(setRouteState(testLocation.locationStr));

        expect(commentsActions.fetchComments).not.toHaveBeenCalled();
      });
    });
  });
});
