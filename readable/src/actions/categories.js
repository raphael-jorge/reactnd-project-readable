import * as PostsAPI from '../util/PostsAPI';

export const CATEGORIES_SET = 'CATEGORIES_SET';
export const CATEGORIES_SET_LOADING_STATE = 'CATEGORIES_SET_LOADING_STATE';
export const CATEGORIES_SET_LOAD_ERROR = 'CATEGORIES_SET_LOAD_ERROR';

export const setCategories = (categories) => ({
  type: CATEGORIES_SET,
  categories,
});

export const setLoadingState = (loading) => ({
  type: CATEGORIES_SET_LOADING_STATE,
  loading,
});

export const setLoadError = (errorOnLoad) => ({
  type: CATEGORIES_SET_LOAD_ERROR,
  errorOnLoad,
});

export const fetchCategories = () => ((dispatch) => {
  dispatch(setLoadingState(true));

  return PostsAPI.get.categories()
    .then((categories) => {
      dispatch(setCategories(categories.categories));
      dispatch(setLoadingState(false));
      dispatch(setLoadError(false));
    })
    .catch(() => {
      dispatch(setLoadingState(false));
      dispatch(setLoadError(true));
    });
});
