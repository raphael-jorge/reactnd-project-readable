import * as actions from '../../actions/categories';
import reducer from '../../reducers/categories';

// Utils
const getDefaultCategories = () => {
  const categoriesArray = [
    { name: 'testCategorie1', path: 'testCategorie2' },
    { name: 'testCategorie2', path: 'testCategorie2' },
  ];

  const categoriesNormalized = categoriesArray.reduce((categoriesObj, category) => {
    categoriesObj[category.path] = category;
    return categoriesObj;
  }, {});

  return {
    categoriesArray,
    categoriesNormalized,
  };
};


// Tests
describe('reducer', () => {
  it('should return the initial state', () => {
    const expectedState = {
      activePath: null,
      loading: {
        isLoading: false,
        hasErrored: false,
      },
      categories: {},
    };

    expect(reducer(undefined, {})).toEqual(expectedState);
  });


  it('should handle CATEGORIES_SET', () => {
    const testCategories = getDefaultCategories();
    const testAction = actions.setCategories(testCategories.categoriesArray);

    const expectedState = { categories: testCategories.categoriesNormalized };

    expect(reducer({}, testAction)).toEqual(expectedState);
  });


  it('should handle CATEGORIES_SET_ACTIVE', () => {
    const activePath = 'testActivePath';
    const testAction = actions.setActiveCategory(activePath);

    const expectedState = { activePath };

    expect(reducer({}, testAction)).toEqual(expectedState);
  });


  it('should handle CATEGORIES_SET_LOADING_STATE', () => {
    const loadingState = {
      isLoading: false,
      hasErrored: true,
    };
    const testAction = actions.setLoadingState(loadingState);

    const expectedState = { loading: loadingState };

    expect(reducer({}, testAction)).toEqual(expectedState);
  });
});
