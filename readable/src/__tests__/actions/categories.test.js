import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as PostsAPI from '../../util/PostsAPI';
import * as categoriesActions from '../../actions/categories';

// Mock PostsAPI.get.categories()
jest.mock('../../util/PostsAPI', () => {
  const categories = [
    { name: 'testCategorie1', path: 'testCategorie2' },
    { name: 'testCategorie2', path: 'testCategorie2' },
  ];

  return {
    get: { categories: jest.fn(() => Promise.resolve({ categories })) },
  };
});

// Mock redux store
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

// Utils
const getDefaultCategories = () => {
  const categoriesArray = [
    { name: 'testCategorie1', path: 'testCategorie2' },
    { name: 'testCategorie2', path: 'testCategorie2' },
  ];

  return {
    categoriesArray,
  };
};

afterEach(() => {
  jest.clearAllMocks();
});


// Tests
describe('actions', () => {
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


  it('should create an action to set the categories', () => {
    const testCategories = getDefaultCategories();
    const expectedAction = {
      type: categoriesActions.CATEGORIES_SET,
      categories: testCategories.categoriesArray,
    };

    expect(categoriesActions.setCategories(testCategories.categoriesArray))
      .toEqual(expectedAction);
  });


  it('should fetch data from the api and dispatch actions on success', () => {
    const testCategories = getDefaultCategories();

    const expectedActions = [
      { type: categoriesActions.CATEGORIES_SET_LOADING_STATE, loading: {
        isLoading: true,
        hasErrored: false,
      } },
      { type: categoriesActions.CATEGORIES_SET, categories: testCategories.categoriesArray },
      { type: categoriesActions.CATEGORIES_SET_LOADING_STATE, loading: {
        isLoading: false,
        hasErrored: false,
      } },
    ];

    const store = mockStore({});

    return store.dispatch(categoriesActions.fetchCategories()).then(() => {
      const dispatchedActions = store.getActions();
      expect(dispatchedActions).toEqual(expectedActions);
      expect(PostsAPI.get.categories).toHaveBeenCalled();
    });
  });


  it('should fetch data from the api and dispatch actions on failure', () => {
    PostsAPI.get.categories.mockImplementationOnce(() => Promise.reject());

    const expectedActions = [
      { type: categoriesActions.CATEGORIES_SET_LOADING_STATE, loading: {
        isLoading: true,
        hasErrored: false,
      } },
      { type: categoriesActions.CATEGORIES_SET, categories: [] },
      { type: categoriesActions.CATEGORIES_SET_LOADING_STATE, loading: {
        isLoading: false,
        hasErrored: true,
      } },
    ];

    const store = mockStore({});

    return store.dispatch(categoriesActions.fetchCategories()).then(() => {
      const dispatchedActions = store.getActions();
      expect(dispatchedActions).toEqual(expectedActions);
      expect(PostsAPI.get.categories).toHaveBeenCalled();
    });
  });
});
