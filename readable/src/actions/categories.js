import * as PostsAPI from '../util/PostsAPI';

export const CATEGORIES_SET = 'CATEGORIES_SET';
export const CATEGORIES_SET_LOADING_STATE = 'CATEGORIES_SET_LOADING_STATE';

export const setCategories = (categories) => ({
  type: CATEGORIES_SET,
  categories,
});

export const setLoadingState = (loading) => ({
  type: CATEGORIES_SET_LOADING_STATE,
  loading: {
    ...loading,
    hasErrored: loading.hasErrored || false,
  },
});

export const fetchCategories = () => ((dispatch) => {
  dispatch(setLoadingState({ isLoading: true }));

  return PostsAPI.get.categories()
    .then((categories) => {
      dispatch(setCategories(categories.categories));
      dispatch(setLoadingState({ isLoading: false }));
    })
    .catch(() => {
      dispatch(setCategories([]));
      dispatch(setLoadingState({
        isLoading: false,
        hasErrored: true,
      }));
    });
});
