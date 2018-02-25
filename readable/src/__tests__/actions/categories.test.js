import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as PostsAPI from '../../util/PostsAPI';
import * as actions from '../../actions/categories';

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

const testCategories = [
  { name: 'testCategorie1', path: 'testCategorie2' },
  { name: 'testCategorie2', path: 'testCategorie2' },
];

afterEach(() => {
  jest.clearAllMocks();
});


describe('actions', () => {
  it('should create an action to set the loading state', () => {
    let loadingState = true;
    let expectedAction = {
      type: actions.CATEGORIES_SET_LOADING_STATE,
      loading: loadingState,
    };

    expect(actions.setLoadingState(loadingState)).toEqual(expectedAction);

    loadingState = false;
    expectedAction = {
      type: actions.CATEGORIES_SET_LOADING_STATE,
      loading: loadingState,
    };
    expect(actions.setLoadingState(loadingState)).toEqual(expectedAction);
  });


  it('should create an action to set the errorOnLoad state', () => {
    let errorState = true;
    let expectedAction = {
      type: actions.CATEGORIES_SET_LOAD_ERROR,
      errorOnLoad: errorState,
    };

    expect(actions.setLoadError(errorState)).toEqual(expectedAction);

    errorState = false;
    expectedAction = {
      type: actions.CATEGORIES_SET_LOAD_ERROR,
      errorOnLoad: errorState,
    };
    expect(actions.setLoadError(errorState)).toEqual(expectedAction);
  });


  it('should create an action to set the categories', () => {
    const expectedAction = {
      type: actions.CATEGORIES_SET,
      categories: testCategories,
    };

    expect(actions.setCategories(testCategories)).toEqual(expectedAction);
  });


  it('should fetch data from the api and dispatch actions on success', () => {
    const expectedActions = [
      { type: actions.CATEGORIES_SET_LOADING_STATE, loading: true },
      { type: actions.CATEGORIES_SET, categories: testCategories },
      { type: actions.CATEGORIES_SET_LOADING_STATE, loading: false },
      { type: actions.CATEGORIES_SET_LOAD_ERROR, errorOnLoad: false },
    ];

    const store = mockStore({});

    return store.dispatch(actions.fetchCategories()).then(() => {
      const dispatchedActions = store.getActions();
      expect(dispatchedActions).toEqual(expectedActions);
      expect(PostsAPI.get.categories).toHaveBeenCalled();
    });
  });


  it('should fetch data from the api and dispatch actions on failure', () => {
    PostsAPI.get.categories.mockImplementationOnce(() => Promise.reject());

    const expectedActions = [
      { type: actions.CATEGORIES_SET_LOADING_STATE, loading: true },
      { type: actions.CATEGORIES_SET_LOADING_STATE, loading: false },
      { type: actions.CATEGORIES_SET_LOAD_ERROR, errorOnLoad: true },
    ];

    const store = mockStore({});

    return store.dispatch(actions.fetchCategories()).then(() => {
      const dispatchedActions = store.getActions();
      expect(dispatchedActions).toEqual(expectedActions);
      expect(PostsAPI.get.categories).toHaveBeenCalled();
    });
  });
});
