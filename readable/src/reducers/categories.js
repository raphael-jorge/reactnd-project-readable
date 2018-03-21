import {
  CATEGORIES_SET,
  CATEGORIES_SET_LOADING_STATE,
} from '../actions/categories';

const initialState = {
  loading: {
    isLoading: false,
    hasErrored: false,
  },
  categories: {},
};

export default function categories(state = initialState, action) {
  switch (action.type) {
    case CATEGORIES_SET_LOADING_STATE:
      return {
        ...state,
        loading: {
          isLoading: action.loading.isLoading,
          hasErrored: action.loading.hasErrored,
        },
      };

    case CATEGORIES_SET:
      return {
        ...state,
        categories: action.categories.reduce((categories, category) => {
          categories[category.path] = {
            name: category.name,
            path: category.path,
          };
          return categories;
        }, {}),
      };

    default:
      return state;
  }
}
