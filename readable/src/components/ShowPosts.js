import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import escapeRegExp from 'escape-string-regexp';
import sortBy from 'sort-by';
import AddIcon from 'react-icons/lib/fa/plus';
import * as postsActions from '../actions/posts';
import { getPosts } from '../selectors/posts';
import { getCategories } from '../selectors/categories';
import Loading from './Loading';
import Navbar from './Navbar';
import Menu from './Menu';
import Message from './Message';
import ModalAddPost from './ModalAddPost';
import NotFound from './NotFound';
import Placeholder from './Placeholder';
import Post from './Post';

export class ShowPosts extends PureComponent {
  static propTypes = {
    // Os posts a serem renderizados
    posts: PropTypes.array.isRequired,
    // As categorias disponíveis
    categories: PropTypes.array.isRequired,
    // Função chamado quando uma operação de voto em um determinado post é acionada
    onPostVote: PropTypes.func.isRequired,
    // Função chamado quando a operação de remoção de um post é acionada
    onPostRemove: PropTypes.func.isRequired,
    // Função chamado quando a operação de edição de um post é confirmada
    onPostUpdate: PropTypes.func.isRequired,
    // Função chamado quando a operação de adição de um post é acionada
    onPostAdd: PropTypes.func.isRequired,
    // Indica se os dados estão sendo carregados
    isLoading: PropTypes.bool,
    // Indica se o carregamento dos dados resultou em erro
    hasErrored: PropTypes.bool,
    // O path da categoria ativa
    activeCategoryPath: PropTypes.string,
  }

  /* Mensagem indicando erro no carregamento dos dados */
  MESSAGE_LOAD_ERROR = 'There was an error while loading posts from the server'
  /* Mensagem indicando inexistência de posts */
  MESSAGE_NO_POSTS = 'No Posts Available'
  /* Componente exibido enquanto os dados estão sendo carregados */
  LOADING_ICON_COMPONENT = <Loading type="icon-squares" />
  /* Opçoes para filtragem dos posts */
  POSTS_SEARCH_OPTIONS = [
    { value: 'title', label: 'Title' },
    { value: 'author', label: 'Author' },
  ]
  /* Opçoes para ordenação dos posts */
  POSTS_SORT_OPTIONS = [
    { value: '-voteScore', label: 'Votes: High to Low' },
    { value: 'voteScore', label: 'Votes: Low to High' },
    { value: '-timestamp', label: 'Newest' },
    { value: 'timestamp', label: 'Oldest' },
  ]

  /**
   * Os estados do componente.
   * @property {Boolean} isModalAddPostOpen Indica se o modal para adição de novos
   * posts está aberto.
   * @property {String} searchQuery O valor utilizado para filtrar os posts.
   * @property {Object} selectedSearchOption A opção de filtragem selecionada.
   * @property {Object} selectedSortOption A opção de ordenação selecionada.
   */
  state = {
    isModalAddPostOpen: false,
    searchQuery: '',
    selectedSearchOption: this.POSTS_SEARCH_OPTIONS[0],
    selectedSortOption: null,
  }

  /**
   * Quando o componente for receber novas props, verifica se o novo valor
   * de activeCategoryPath é diferente do anterior. Caso seja, configura o
   * estado searchQuery para ''.
   * @param {Object} nextProps As novas props que serão recebidas.
   */
  componentWillReceiveProps(nextProps) {
    const { activeCategoryPath: currentActiveCategoryPath } = this.props;
    const { activeCategoryPath: nextActiveCategoryPath } = nextProps;

    if (nextActiveCategoryPath !== currentActiveCategoryPath) {
      this.clearSearchQuery();
    }
  }

  /**
   * Seleciona uma opção de ordenação dos posts. O estado selectedSortOption
   * será configurado para essa opção.
   * @param {Object} selectedOption A opção de ordenação selecionada.
   */
  handleSortOptionChange = (selectedOption) => {
    this.setState({ selectedSortOption: selectedOption });
  }

  /**
   * Seleciona uma opção de filtragem dos posts. O estado selectedSearchOption
   * será configurado para essa opção.
   * @param {Object} selectedOption A opção de filtragem selecionada.
   */
  handleSearchOptionChange = (selectedOption) => {
    this.setState({ selectedSearchOption: selectedOption });
  }

  /**
   * Atualiza o estado searchQuery a partir de um evento de mudança do valor
   * utilizado ára filtragem dos posts.
   * @param {Object} event O evento de mudança do valor do formulário.
   */
  handleSearchQueryChange = (event) => {
    this.setState({ searchQuery: event.target.value });
  }

  /* Configura o estado searchQuery para '' */
  clearSearchQuery = () => {
    this.setState({ searchQuery: '' });
  }

  /**
   * Abre o modal para adição de um novo post configurando o estado
   * isModalAddPostOpen para true.
   */
  openModalAddPost = () => {
    this.setState({ isModalAddPostOpen: true });
  }

  /**
   * Fecha o modal para adição de um novo post configurando o estado
   * isModalAddPostOpen para false.
   */
  closeModalAddPost = () => {
    this.setState({ isModalAddPostOpen: false });
  }

  /**
   * Verifica se a categoria fornecida via prop activeCategoryPath resulta
   * em uma página válida. Para isso a categoria fornecida deve estar presente
   * na prop categories.
   * @return {Boolean} true se a página for válida, false caso contrário.
   */
  wasCategoryFound = () => {
    const {
      categories,
      activeCategoryPath,
    } = this.props;

    let categoryFound = true;
    if (activeCategoryPath) {
      const matchingCategory = categories.filter((category) => (
        category.path === activeCategoryPath
      ));

      if (!matchingCategory.length) {
        categoryFound = false;
      }
    }

    return categoryFound;
  }

  /**
   * Filtra os posts, fornecidos via props, com base nos estados searchQuery
   * e selectedSearchOption. Se ambos estiverem configurados, apenas serão
   * retornados os posts cuja propriedade indicada por selectedSearchOption.value
   * corresponder ao valor indicado em searchQuery.
   * @return {Array} Os posts filtrados.
   */
  filterPostsByQuery = () => {
    const { posts } = this.props;
    const { searchQuery, selectedSearchOption } = this.state;
    let postsToShow;
    if (searchQuery) {
      const match = new RegExp(escapeRegExp(searchQuery.trim()), 'i');
      postsToShow = posts.filter((post) => match.test(post[selectedSearchOption.value]));
    } else {
      postsToShow = posts;
    }

    return postsToShow;
  }

  render() {
    const {
      posts,
      categories,
      onPostVote,
      onPostRemove,
      onPostUpdate,
      onPostAdd,
      isLoading,
      hasErrored,
      activeCategoryPath,
    } = this.props;

    const pageFound = this.wasCategoryFound();

    const postsToShow = this.filterPostsByQuery();
    if (this.state.selectedSortOption) {
      postsToShow.sort(sortBy(this.state.selectedSortOption.value));
    }

    return (
      <div>

        <Navbar categories={categories} activeCategoryPath={activeCategoryPath}/>

        <main className="container-md">
          {/* Verifica se os posts estão sendo carregados */}
          <Placeholder
            isReady={!isLoading}
            fallback={this.LOADING_ICON_COMPONENT}
            delay={250}
          >
            {hasErrored ? (
              // Verifica se o carregamento dos dados resultou em erro
              <Message msg={this.MESSAGE_LOAD_ERROR} />
            ) : (
              // Verifica se a página foi encontrada
              !pageFound ? (
                <NotFound />
              ) : (
                // Renderiza a página
                <div>
                  <button
                    className={`btn btn-fixed btn-blue-shadow ${activeCategoryPath}`}
                    title="Add Post"
                    onClick={this.openModalAddPost}
                  >
                    Add Post
                    <AddIcon size={20} />
                  </button>

                  {!posts.length ? (
                    // Verifica a existência de posts
                    <Message msg={this.MESSAGE_NO_POSTS} />
                  ) : (
                    // Renderiza o menu e os posts
                    <div>
                      <Menu
                        sortOptions={this.POSTS_SORT_OPTIONS}
                        selectedSortOption={this.state.selectedSortOption}
                        onSortOptionChange={this.handleSortOptionChange}
                        searchOptions={this.POSTS_SEARCH_OPTIONS}
                        selectedSearchOption={this.state.selectedSearchOption}
                        onSearchOptionChange={this.handleSearchOptionChange}
                        searchQueryValue={this.state.searchQuery}
                        onSearchQueryChange={this.handleSearchQueryChange}
                      />

                      {this.state.searchQuery.trim() &&
                        <div className="status-group">
                          <Message
                            msg={`Found ${postsToShow.length} matching posts of ${posts.length}.`}
                          />
                          <button
                            className="btn btn-blue-border"
                            onClick={this.clearSearchQuery}
                          >
                            Show All Posts
                          </button>
                        </div>
                      }

                      {postsToShow.map((postData) => (
                        <Post
                          key={postData.id}
                          postData={postData}
                          onVote={onPostVote}
                          onRemove={onPostRemove}
                          onUpdate={onPostUpdate}
                          linkMode={true}
                        />
                      ))}
                    </div>
                  )}

                  <ModalAddPost
                    isOpen={this.state.isModalAddPostOpen}
                    onModalClose={this.closeModalAddPost}
                    onPostAdd={onPostAdd}
                    categories={categories}
                    initialCategory={activeCategoryPath}
                  />

                </div>
              ))}
          </Placeholder>
        </main>

      </div>
    );
  }
}

export const mapStateToProps = (state, ownProps) => {
  const { posts, categories } = state;

  return {
    posts: getPosts(state, ownProps),
    categories: getCategories(state),
    isLoading: posts.loading.isLoading || categories.loading.isLoading,
    hasErrored: posts.loading.hasErrored || categories.loading.hasErrored,
  };
};

export const mapDispatchToProps = (dispatch, ownProps) => ({
  onPostVote: (post, vote) => dispatch(postsActions.fetchVoteOnPost(post, vote)),
  onPostRemove: (post) => dispatch(postsActions.fetchRemovePost(post)),
  onPostUpdate: (post, updatedData) => dispatch(postsActions.fetchUpdatePost(post, updatedData)),
  onPostAdd: (postData) => dispatch(postsActions.fetchAddPost(postData)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ShowPosts);
