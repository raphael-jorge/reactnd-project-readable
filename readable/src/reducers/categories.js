import {
  CATEGORIES_SET,
  CATEGORIES_SET_LOADING_STATE,
  CATEGORIES_SET_LOAD_ERROR,
} from '../actions/categories';

const initialState = {
  loading: false,
  errorOnLoad: false,
  categories: {},
};

export default function categories(state = initialState, action) {
  switch (action.type) {
    case CATEGORIES_SET_LOADING_STATE:
      return {
        ...state,
        loading: action.loading,
      };

    case CATEGORIES_SET_LOAD_ERROR:
      return {
        ...state,
        errorOnLoad: action.errorOnLoad,
      };

    case CATEGORIES_SET:
      return {
        ...state,
        categories: action.categories.reduce((categories, categorie) => {
          categories[categorie.name] = {
            name: categorie.name,
            path: categorie.path,
          };
          return categories;
        }, {}),
      };

    default:
      return state;
  }
}
