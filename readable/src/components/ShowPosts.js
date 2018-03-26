import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import escapeRegExp from 'escape-string-regexp';
import AddIcon from 'react-icons/lib/fa/plus';
import {
  setSortOption,
  fetchVoteOnPost,
  fetchRemovePost,
  fetchUpdatePost,
  fetchAddPost,
} from '../actions/posts';
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
    onSortOptionChange: PropTypes.func.isRequired,
    onPostVote: PropTypes.func.isRequired,
    onPostRemove: PropTypes.func.isRequired,
    onPostUpdate: PropTypes.func.isRequired,
    isLoading: PropTypes.bool,
    hasErrored: PropTypes.bool,
    postsSortOption: PropTypes.object,
    activeCategoryPath: PropTypes.string,
  }

  postsSearchOptions = [
    { value: 'title', label: 'Title' },
    { value: 'author', label: 'Author' },
  ]

  state = {
    isModalAddPostOpen: false,
    postsSearchQuery: '',
    postsSearchOption: this.postsSearchOptions[0],
  }

  MESSAGE_LOAD_ERROR = 'There was an error while loading posts from the server'
  MESSAGE_NO_POSTS = 'No Posts Available'
  LOADING_ICON_COMPONENT = <Loading type="icon-squares" />

  componentWillReceiveProps(nextProps) {
    const { activeCategoryPath: currentActiveCategoryPath } = this.props;
    const { activeCategoryPath: nextActiveCategoryPath } = nextProps;

    if (nextActiveCategoryPath !== currentActiveCategoryPath) {
      this.clearSearchQuery();
    }
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

  handleSortOptionChange = (selectedOption) => {
    this.props.onSortOptionChange(selectedOption);
  }

  handleSearchOptionChange = (selectedOption) => {
    this.setState({ postsSearchOption: selectedOption });
  }

  handleSearchQueryChange = (event) => {
    this.setState({ postsSearchQuery: event.target.value });
  }

  clearSearchQuery = () => {
    this.setState({ postsSearchQuery: '' });
  }

  openModalAddPost = () => {
    this.setState({ isModalAddPostOpen: true });
  }

  closeModalAddPost = () => {
    this.setState({ isModalAddPostOpen: false });
  }

  filterPostsByQuery = () => {
    const { posts } = this.props;
    const { postsSearchQuery, postsSearchOption } = this.state;
    let postsToShow;
    if (postsSearchQuery) {
      const match = new RegExp(escapeRegExp(postsSearchQuery.trim()), 'i');
      postsToShow = posts.filter((post) => match.test(post[postsSearchOption.value]));
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
      postsSortOption,
      activeCategoryPath,
    } = this.props;

    const pageFound = this.wasCategoryFound();

    const postsToShow = this.filterPostsByQuery();

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
                        selectedSortOption={postsSortOption}
                        onSortOptionChange={this.handleSortOptionChange}
                        searchOptions={this.postsSearchOptions}
                        selectedSearchOption={this.state.postsSearchOption}
                        onSearchOptionChange={this.handleSearchOptionChange}
                        searchQueryValue={this.state.postsSearchQuery}
                        onSearchQueryChange={this.handleSearchQueryChange}
                      />

                      {this.state.postsSearchQuery.trim() &&
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
  const { activeCategoryPath } = ownProps;

  return {
    posts: getPosts(state, ownProps),
    categories: getCategories(state),
    isLoading: posts.loading.isLoading || categories.loading.isLoading,
    hasErrored: posts.loading.hasErrored || categories.loading.hasErrored,
    postsSortOption: posts.sortOption,
    activeCategoryPath,
  };
};

export const mapDispatchToProps = (dispatch, props) => {
  return {
    onPostVote: (post, vote) => dispatch(fetchVoteOnPost(post, vote)),
    onPostRemove: (post) => dispatch(fetchRemovePost(post)),
    onPostUpdate: (post, updatedData) => dispatch(fetchUpdatePost(post, updatedData)),
    onPostAdd: (postData) => dispatch(fetchAddPost(postData)),
    onSortOptionChange: (sortOption) => dispatch(setSortOption(sortOption)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ShowPosts);
