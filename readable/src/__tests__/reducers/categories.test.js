import * as actions from '../../actions/categories';
import reducer from '../../reducers/categories';


// Tests
describe('reducer', () => {
  it('should return the initial state', () => {
    const expectedState = global.testUtils.getDefaultReduxState().categories;

    expect(reducer(undefined, {})).toEqual(expectedState);
  });


  it('should handle CATEGORIES_SET', () => {
    const categories = global.testUtils.getDefaultCategoriesArray();
    const testAction = actions.setCategories(categories);

    const expectedState = {
      categories: global.testUtils.convertArrayToNormalizedObject(categories, 'path'),
    };

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
