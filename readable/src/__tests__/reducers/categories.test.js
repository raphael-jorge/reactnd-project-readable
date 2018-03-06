import * as actions from '../../actions/categories';
import reducer from '../../reducers/categories';

const testCategories = [
  { name: 'testCategorie1', path: 'testCategorie2' },
  { name: 'testCategorie2', path: 'testCategorie2' },
];

const structuredTestCategories = testCategories.reduce((categories, categorie) => {
  categories[categorie.name] = {
    name: categorie.name,
    path: categorie.path,
  };
  return categories;
}, {});


describe('reducer', () => {
  it('should return the initial state', () => {
    const expectedState = {
      activePath: null,
      loading: false,
      errorOnLoad: false,
      categories: {},
    };

    expect(reducer(undefined, {})).toEqual(expectedState);
  });


  it('should handle SET_CATEGORIES', () => {
    const testAction = {
      type: actions.CATEGORIES_SET,
      categories: testCategories,
    };

    const expectedState = { categories: structuredTestCategories };

    expect(reducer({}, testAction)).toEqual(expectedState);
  });


  it('should handle SET_CATEGORIES_ACTIVE', () => {
    const activePath = 'testActivePath';
    const testAction = {
      type: actions.CATEGORIES_SET_ACTIVE,
      activePath,
    };

    const expectedState = { activePath };

    expect(reducer({}, testAction)).toEqual(expectedState);
  });


  it('should handle SET_CATEGORIES_LOADING_STATE', () => {
    const testAction = {
      type: actions.CATEGORIES_SET_LOADING_STATE,
      loading: true,
    };

    const expectedState = { loading: true };

    expect(reducer({}, testAction)).toEqual(expectedState);
  });


  it('should handle SET_CATEGORIES_LOAD_ERROR', () => {
    const testAction = {
      type: actions.CATEGORIES_SET_LOAD_ERROR,
      errorOnLoad: true,
    };

    const expectedState = { errorOnLoad: true };

    expect(reducer({}, testAction)).toEqual(expectedState);
  });
});
