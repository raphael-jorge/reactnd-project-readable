import configurePathMatch from 'path-match';
import routes from '../routes';
import * as categoriesActions from './categories';
import * as commentsActions from './comments';

const pathMatch = configurePathMatch();

/**
 * Verifica se os comentários do dado estado devem ser atualizados.
 * Se não houver comentários ou se o id do post pai for diferente
 * do id fornecido, ou se comentários estiverem sendo carregados,
 * os comentários deverão ser atualizados.
 * @param  {object} state  O estado com os comentários a serem verificados.
 * @param  {string} postId O id esperado do post pai dos comentários.
 * @return {bool}          true se a atualização for necessária e false
 *                         caso contrário.
 */
export const shouldFetchComments = (state, postId) => {
  const currentCommentsObj = state.comments.comments;
  const currentCommentsKeys = Object.keys(currentCommentsObj);
  const currentParentId = state.comments.parentPostId;

  return (
    currentCommentsKeys.length === 0 ||
    currentParentId !== postId ||
    state.comments.loading.isLoading
  );
};


/**
 * Verifica se a categoria ativa deve ser atualizada. Para isso,
 * o valor da categoria ativa no estado é comparado com o valor
 * esperado.
 * @param  {object} state         O estado com a categoria ativa.
 * @param  {string} expectedValue O valor esperado para a categoria ativa.
 * @return {bool}                 true se a atualização for necessária e
 *                                false caso contrário.
 */
export const shouldSetActiveCategory = (state, expectedValue) => {
  const currentActiveCategory = state.categories.activePath;
  return currentActiveCategory !== expectedValue;
};


const setRouteState = (location) => ((dispatch, getState) => {
  const pathname = location.pathname;

  const rootMatch = pathMatch(routes.root)(pathname);
  const categoryMatch = pathMatch(routes.category)(pathname);
  const postMatch = pathMatch(routes.post)(pathname);

  let activeCategory;
  if (rootMatch) {
    activeCategory = null;

  } else if (categoryMatch) {
    activeCategory = categoryMatch.category;

  } else if (postMatch) {
    activeCategory = null;
    if (shouldFetchComments(getState(), postMatch.postId)) {
      dispatch(commentsActions.fetchComments(postMatch.postId));
    }

  } else {
    activeCategory = null;

  }

  if (shouldSetActiveCategory(getState(), activeCategory)) {
    dispatch(categoriesActions.setActiveCategory(activeCategory));
  }
});

export default setRouteState;
