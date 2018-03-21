import configurePathMatch from 'path-match';
import routes from '../routes';
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


const setRouteState = (location) => ((dispatch, getState) => {
  const pathname = location.pathname;
  const postMatch = pathMatch(routes.post)(pathname);

  if (postMatch && shouldFetchComments(getState(), postMatch.postId)) {
    dispatch(commentsActions.fetchComments(postMatch.postId));
  }

});

export default setRouteState;
