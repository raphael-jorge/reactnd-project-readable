import { createSelector } from 'reselect';

const categoriesSelector = (state) => state.categories.categories;

export const getCategories = createSelector(
  categoriesSelector,
  (categoriesObj) => {
    const categoriesPaths = Object.keys(categoriesObj);
    return categoriesPaths.map((path) => ({ ...categoriesObj[path] }));
  }
);
