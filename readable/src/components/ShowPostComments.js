import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import AddIcon from 'react-icons/lib/fa/plus';
import routes from '../routes';
import * as postsActions from '../actions/posts';
import * as commentsActions from '../actions/comments';
import { getCategories } from '../selectors/categories';
import { getComments } from '../selectors/comments';
import { getPostData } from '../selectors/posts';
import Comment from './Comment';
import Navbar from './Navbar';
import Loading from './Loading';
import Message from './Message';
import ModalAddComment from './ModalAddComment';
import NotFound from './NotFound';
import Placeholder from './Placeholder';
import Post from './Post';

export class ShowPostComments extends PureComponent {
  static propTypes = {
    // Os dados do post aos quais os comentários fazem referência
    postData: PropTypes.object.isRequired,
    // Os comentários a serem renderizados
    comments: PropTypes.array.isRequired,
    // As categorias disponíveis
    categories: PropTypes.array.isRequired,
    // Função chamado quando uma operação de voto no post é acionada
    onPostVote: PropTypes.func.isRequired,
    // Função chamado quando uma operação de voto em um determinado comentário é acionada
    onCommentVote: PropTypes.func.isRequired,
    // Função chamado quando a operação de remoção do post é acionada
    onPostRemove: PropTypes.func.isRequired,
    // Função chamado quando a operação de remoção de um comentário é acionada
    onCommentRemove: PropTypes.func.isRequired,
    // Função chamado quando a operação de edição do post é confirmada
    onPostUpdate: PropTypes.func.isRequired,
    // Função chamado quando a operação de edição de um comentário é confirmada
    onCommentUpdate: PropTypes.func.isRequired,
    // Função chamado quando a operação de adição de um comentário é acionada
    onCommentAdd: PropTypes.func.isRequired,
    // Indica se os dados do post estão sendo carregados
    isLoadingPost: PropTypes.bool,
    // Indica se os comentários estão sendo carregados
    isLoadingComments: PropTypes.bool,
    // Indica se o carregamento do post resultou em erro
    hasErroredPost: PropTypes.bool,
    // Indica se o carregamento dos comentários resultou em erro
    hasErroredComments: PropTypes.bool,
  };

  /* Mensagem indicando erro no carregamento dos dados */
  MESSAGE_LOAD_ERROR = 'There was an error while loading data from the server'
  /* Mensagem indicando inexistência de comentários */
  MESSAGE_NO_COMMENTS = 'No comments yet'
  /* Componente exibido enquanto os dados estão sendo carregados */
  LOADING_ICON_COMPONENT = <Loading type={'icon-squares'} />

  /**
   * Os estados do componente.
   * @property {Boolean} isModalAddCommentOpen Indica se o modal para adição de novos
   * comentários está aberto.
   * @property {Boolean} redirectToRoot Indica se deve haver redirecionamento para a
   * home page.
   */
  state = {
    isModalAddCommentOpen: false,
    redirectToRoot: false,
  }

  /**
   * Realiza a operação de remoção do post. Para isso, a função onPostRemove,
   * fornecida via props, é chamada. Quando finalizada, o estado redirectToRoot
   * é configurado para true.
   * @param {Object} post Os dados do post a ser removido.
   */
  handlePostRemove = (post) => {
    return this.props.onPostRemove(post)
      .then(() => this.setState({ redirectToRoot: true }));
  }

  /**
   * Abre o modal para adição de um novo comentário configurando o estado
   * isModalAddCommentOpen para true.
   */
  openModalAddComment = () => {
    this.setState({ isModalAddCommentOpen: true });
  }

  /**
   * Fecha o modal para adição de um novo comentário configurando o estado
   * isModalAddCommentOpen para false.
   */
  closeModalAddComment = () => {
    this.setState({ isModalAddCommentOpen: false });
  }

  /**
   * Verifica se o post fornecido é válido. Para isso, verifica a existência
   * de dados.
   * @return {Boolean} true se o post for válido, false caso contrário.
   */
  wasPostFound = () => {
    return (Object.keys(this.props.postData).length > 0);
  }

  render() {
    const {
      postData,
      comments,
      categories,
      onPostVote,
      onCommentVote,
      onCommentRemove,
      onPostUpdate,
      onCommentUpdate,
      onCommentAdd,
      isLoadingPost,
      isLoadingComments,
      hasErroredPost,
      hasErroredComments,
    } = this.props;

    const pageFound = this.wasPostFound();

    return (
      this.state.redirectToRoot ? (
        <Redirect push to={routes.root} />
      ) : (
        <div>

          <Navbar categories={categories} />

          <main className="container-md">
            {/* Verifica se os dados do post estão sendo carregados */}
            <Placeholder
              isReady={!isLoadingPost}
              fallback={this.LOADING_ICON_COMPONENT}
              delay={250}
            >
              {hasErroredPost ? (
                // Verifica se o carregamento do post resultou em erro
                <Message msg={this.MESSAGE_LOAD_ERROR} />
              ) : (
                !pageFound ? (
                  // Verifica se a página do post foi encontrada
                  <NotFound />
                ) : (
                  // Renderiza a página e o post
                  <div>
                    <button
                      className="btn btn-fixed btn-magenta-shadow"
                      title="Add Comment"
                      onClick={this.openModalAddComment}
                    >
                      Add Post
                      <AddIcon size={20} />
                    </button>

                    <Post
                      postData={postData}
                      onVote={onPostVote}
                      onRemove={this.handlePostRemove}
                      onUpdate={onPostUpdate}
                    />

                    <ModalAddComment
                      isOpen={this.state.isModalAddCommentOpen}
                      onModalClose={this.closeModalAddComment}
                      onCommentAdd={onCommentAdd}
                      postData={postData}
                    />

                  </div>
                ))}

            </Placeholder>

            {/* Se o post foi carregado com sucesso os comentários podem ser analisados */}
            {!isLoadingPost && pageFound && !hasErroredPost &&
              <Placeholder
                isReady={!isLoadingComments}
                fallback={this.LOADING_ICON_COMPONENT}
                delay={250}
              >
                {hasErroredComments ? (
                  // Verifica se o carregamento dos comentários resultou em erro
                  <Message msg={this.MESSAGE_LOAD_ERROR} />
                ) : (
                  !comments.length ? (
                    // Verifica a existência de comentários
                    <Message msg={this.MESSAGE_NO_COMMENTS} />
                  ) : (
                    // Renderiza os comentários
                    comments.map((commentData) => (
                      <Comment
                        key={commentData.id}
                        commentData={commentData}
                        onVote={onCommentVote}
                        onRemove={onCommentRemove}
                        onUpdate={onCommentUpdate}
                      />
                    ))
                  )
                )}
              </Placeholder>
            }

          </main>
        </div>
      )
    );
  }
}

export const mapStateToProps = (state, ownProps) => {
  const { posts, comments } = state;

  return {
    postData: getPostData(state, ownProps),
    comments: getComments(state),
    categories: getCategories(state),
    isLoadingPost: posts.loading.isLoading,
    isLoadingComments: comments.loading.isLoading,
    hasErroredPost: posts.loading.hasErrored,
    hasErroredComments: comments.loading.hasErrored,
  };
};

export const mapDispatchToProps = (dispatch, ownProps) => ({
  onPostVote: (post, vote) => dispatch(postsActions.fetchVoteOnPost(post, vote)),
  onPostRemove: (post) => dispatch(postsActions.fetchRemovePost(post)),
  onPostUpdate: (post, updatedData) =>
    dispatch(postsActions.fetchUpdatePost(post, updatedData)),
  onCommentVote: (comment, vote) =>
    dispatch(commentsActions.fetchVoteOnComment(comment, vote)),
  onCommentRemove: (comment) =>
    dispatch(commentsActions.fetchRemoveComment(comment)),
  onCommentUpdate: (comment, updatedData) =>
    dispatch(commentsActions.fetchUpdateComment(comment, updatedData)),
  onCommentAdd: (postId, commentData) =>
    dispatch(commentsActions.fetchAddComment(postId, commentData)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ShowPostComments);
