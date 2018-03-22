import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as PostsAPI from '../../util/PostsAPI';
import * as categoriesActions from '../../actions/categories';

// Mock PostsAPI.get.categories()
jest.mock('../../util/PostsAPI', () => {
  const categories = global.testUtils.getDefaultCategoriesArray();

  return {
    get: { categories: jest.fn(() => Promise.resolve({ categories })) },
  };
});

// Mock redux store
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

afterEach(() => {
  jest.clearAllMocks();
});


// Tests
describe('actions', () => {
  it('should create an action to set the categories', () => {
    const categories = global.testUtils.getDefaultCategoriesArray();

    const expectedAction = {
      type: categoriesActions.CATEGORIES_SET,
      categories,
    };

    expect(categoriesActions.setCategories(categories)).toEqual(expectedAction);
  });


  it('should create an action to set the loading state', () => {
    let loadingState = {
      isLoading: true,
    };
    let expectedAction = {
      type: categoriesActions.CATEGORIES_SET_LOADING_STATE,
      loading: { ...loadingState, hasErrored: false },
    };

    expect(categoriesActions.setLoadingState(loadingState)).toEqual(expectedAction);

    loadingState = {
      isLoading: false,
      hasErrored: true,
    };
    expectedAction = {
      type: categoriesActions.CATEGORIES_SET_LOADING_STATE,
      loading: loadingState,
    };

    expect(categoriesActions.setLoadingState(loadingState)).toEqual(expectedAction);
  });


  it('should fetch categories from the api and dispatch actions on success', async () => {
    const categories = global.testUtils.getDefaultCategoriesArray();

    const expectedActions = [
      categoriesActions.setLoadingState({ isLoading: true }),
      categoriesActions.setCategories(categories),
      categoriesActions.setLoadingState({ isLoading: false }),
    ];

    const store = mockStore({});
    await store.dispatch(categoriesActions.fetchCategories());
    const dispatchedActions = store.getActions();

    expect(dispatchedActions).toEqual(expectedActions);
    expect(PostsAPI.get.categories).toHaveBeenCalled();
  });


  it('should fetch categories from the api and dispatch actions on failure', async () => {
    PostsAPI.get.categories.mockImplementationOnce(() => Promise.reject());

    const expectedActions = [
      categoriesActions.setLoadingState({ isLoading: true }),
      categoriesActions.setCategories([]),
      categoriesActions.setLoadingState({ isLoading: false, hasErrored: true }),
    ];

    const store = mockStore({});
    await store.dispatch(categoriesActions.fetchCategories());
    const dispatchedActions = store.getActions();

    expect(dispatchedActions).toEqual(expectedActions);
    expect(PostsAPI.get.categories).toHaveBeenCalled();
  });
});
