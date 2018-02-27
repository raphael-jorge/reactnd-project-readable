import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import postsActions from '../../actions/posts';
import commentsActions from '../../actions/comments';
import routes from '../../routes';
import setRouteState from '../../actions/routes';

// Mock posts actions
jest.mock('../../actions/posts', () => ({
  fetchPosts: jest.fn(
    () => (() => {})
  ),
  setPosts: jest.fn(
    () => (() => {})
  ),
}));

// Mock comments actions
jest.mock('../../actions/comments', () => ({
  fetchComments: jest.fn(
    () => (() => {})
  ),
  setComments: jest.fn(
    () => (() => {})
  ),
}));

// Mock redux store
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);


describe('actions', () => {
  describe('setRouteState()', () => {
    it(`should handle the root path [ ${routes.root} ]`, () => {
      const testLocation = { pathname: '/' };

      const store = mockStore({});
      store.dispatch(setRouteState(testLocation));

      expect(postsActions.fetchPosts).toHaveBeenCalledWith();
      expect(commentsActions.setComments).toHaveBeenCalledWith([]);
    });

    it(`should handle the categories path [ ${routes.category} ]`, () => {
      const testCategory = 'testCategory';
      const testLocation = { pathname: `/${testCategory}` };

      const store = mockStore({});
      store.dispatch(setRouteState(testLocation));

      expect(postsActions.fetchPosts).toHaveBeenCalledWith(testCategory);
      expect(commentsActions.setComments).toHaveBeenCalledWith([]);
    });

    it(`should handle the post path [ ${routes.post} ]`, () => {
      const testCategory = 'testCategory';
      const testPostId = 'testPostId';
      const testLocation = { pathname: `/${testCategory}/${testPostId}` };

      const store = mockStore({});
      store.dispatch(setRouteState(testLocation));

      expect(postsActions.fetchPosts).toHaveBeenCalledWith(testCategory);
      expect(commentsActions.fetchComments).toHaveBeenCalledWith(testPostId);
    });

    it('should handle other routes', () => {
      const testLocation = { pathname: '/test1/test2/test3' };

      const store = mockStore({});
      store.dispatch(setRouteState(testLocation));

      expect(postsActions.setPosts).toHaveBeenCalledWith([]);
      expect(commentsActions.setComments).toHaveBeenCalledWith([]);
    });
  });
});
