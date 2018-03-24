import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
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

  state = {
    isModalAddPostOpen: false,
  }

  MESSAGE_LOAD_ERROR = 'There was an error while loading posts from the server'
  MESSAGE_NO_POSTS = 'No Posts Available'
  LOADING_ICON_COMPONENT = <Loading type="icon-squares" />

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

  openModalAddPost = () => {
    this.setState({ isModalAddPostOpen: true });
  }

  closeModalAddPost = () => {
    this.setState({ isModalAddPostOpen: false });
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
                    className="btn-fixed btn-blue"
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
                      />

                      {posts.map((postData) => (
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
