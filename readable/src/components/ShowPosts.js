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
import Header from './Header';
import Menu from './Menu';
import Message from './Message';
import ModalAddPost from './ModalAddPost';
import NotFound from './NotFound';
import Placeholder from './Placeholder';
import Post from './Post';

export class ShowPosts extends PureComponent {
  static propTypes = {
    posts: PropTypes.array.isRequired,
    categories: PropTypes.array.isRequired,
    onPostVote: PropTypes.func.isRequired,
    onPostRemove: PropTypes.func.isRequired,
    onPostUpdate: PropTypes.func.isRequired,
    onPostAdd: PropTypes.func.isRequired,
    isLoading: PropTypes.bool,
    hasErrored: PropTypes.bool,
    activeCategoryPath: PropTypes.string,
  }

  MESSAGE_LOAD_ERROR = 'There was an error while loading posts from the server'
  MESSAGE_NO_POSTS = 'No Posts Available'
  LOADING_ICON_COMPONENT = <Loading type="icon-squares" />
  POSTS_SEARCH_OPTIONS = [
    { value: 'title', label: 'Title' },
    { value: 'author', label: 'Author' },
  ]
  POSTS_SORT_OPTIONS = [
    { value: '-voteScore', label: 'Votes: High to Low' },
    { value: 'voteScore', label: 'Votes: Low to High' },
    { value: '-timestamp', label: 'Newest' },
    { value: 'timestamp', label: 'Oldest' },
  ]

  state = {
    isModalAddPostOpen: false,
    searchQuery: '',
    selectedSearchOption: this.POSTS_SEARCH_OPTIONS[0],
    selectedSortOption: null,
  }

  componentWillReceiveProps(nextProps) {
    const { activeCategoryPath: currentActiveCategoryPath } = this.props;
    const { activeCategoryPath: nextActiveCategoryPath } = nextProps;

    if (nextActiveCategoryPath !== currentActiveCategoryPath) {
      this.clearSearchQuery();
    }
  }

  handleSortOptionChange = (selectedOption) => {
    this.setState({ selectedSortOption: selectedOption });
  }

  handleSearchOptionChange = (selectedOption) => {
    this.setState({ selectedSearchOption: selectedOption });
  }

  handleSearchQueryChange = (event) => {
    this.setState({ searchQuery: event.target.value });
  }

  clearSearchQuery = () => {
    this.setState({ searchQuery: '' });
  }

  openModalAddPost = () => {
    this.setState({ isModalAddPostOpen: true });
  }

  closeModalAddPost = () => {
    this.setState({ isModalAddPostOpen: false });
  }

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

        <Header categories={categories} activeCategoryPath={activeCategoryPath}/>

        <main className="container-md">
          {/* Verifica se os posts estão sendo carregados */}
          <Placeholder
            isReady={!isLoading}
            fallback={this.LOADING_ICON_COMPONENT}
            delay={250}
          >
            {hasErrored ? (
              <Message msg={this.MESSAGE_LOAD_ERROR} />
            ) : (
              !pageFound ? (
                <NotFound />
              ) : (
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
                    <Message msg={this.MESSAGE_NO_POSTS} />
                  ) : (
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
                    activeCategoryPath={activeCategoryPath}
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
