import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import sortBy from 'sort-by';
import AddIcon from 'react-icons/lib/fa/plus';
import {
  setSortOption,
  fetchVoteOnPost,
  fetchRemovePost,
  fetchUpdatePost,
  fetchAddPost,
} from '../actions/posts';
import Loading from './Loading';
import Menu from './Menu';
import Message from './Message';
import ModalAddPost from './ModalAddPost';
import Placeholder from './Placeholder';
import Post from './Post';

export class ShowPosts extends Component {
  static propTypes = {
    categories: PropTypes.array.isRequired,
    activeCategoryPath: PropTypes.string,
    posts: PropTypes.array.isRequired,
    postsSortOption: PropTypes.object,
    onSortOptionChange: PropTypes.func.isRequired,
    onPostVote: PropTypes.func.isRequired,
    onPostRemove: PropTypes.func.isRequired,
    onPostUpdate: PropTypes.func.isRequired,
    isLoading: PropTypes.bool,
    hasErrored: PropTypes.bool,
  }

  MESSAGE_LOAD_ERROR = 'There was an error while loading posts from the server'
  MESSAGE_NO_POSTS = 'No Posts Available'

  state = {
    isModalAddPostOpen: false,
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
      postsSortOption,
      onPostVote,
      onPostRemove,
      onPostUpdate,
      onPostAdd,
      isLoading,
      hasErrored,
      categories,
      activeCategoryPath,
    } = this.props;

    return (
      <div className="show-posts">

        <button
          className="btn-fixed btn-blue"
          title="Add Post"
          onClick={this.openModalAddPost}
        >
          Add Post
          <AddIcon size={20} />
        </button>

        {/* Verifica se os posts estão sendo carregados */}
        <Placeholder
          isReady={!isLoading}
          fallback={<Loading type="icon-squares" />}
          delay={250}
        >
          {hasErrored &&
            <Message msg={this.MESSAGE_LOAD_ERROR} />
          }

          {!hasErrored && posts.length > 0 &&
            <div>
              <Menu
                sortMenu={{
                  selectedSortOption: postsSortOption,
                  onSortOptionChange: this.handleSortOptionChange,
                }}
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
          }

          {!hasErrored && !posts.length &&
            <Message msg={this.MESSAGE_NO_POSTS} />
          }
        </Placeholder>

        <ModalAddPost
          isOpen={this.state.isModalAddPostOpen}
          onModalClose={this.closeModalAddPost}
          onPostAdd={onPostAdd}
          categories={categories}
          activeCategoryPath={activeCategoryPath}
        />

      </div>
    );
  }
}

export const mapStateToProps = ({ posts, categories }, props) => {
  const postsObj = posts.posts;
  const postsIds = Object.keys(postsObj);
  const postsArr = postsIds.map((postId) => (postsObj[postId]));

  const categoriesObj = categories.categories;
  const categoriesPaths = Object.keys(categoriesObj);
  const categoriesArr = categoriesPaths.map((path) => categoriesObj[path]);

  const activeCategoryPath = categories.activePath;
  let postsToProps;
  if (activeCategoryPath === null) {
    postsToProps = postsArr;
  } else {
    postsToProps = postsArr.filter((post) => post.category === activeCategoryPath);
  }

  if (posts.sortOption) {
    postsToProps = postsToProps.sort(sortBy(posts.sortOption.value));
  }

  return {
    isLoading: posts.loading.isLoading,
    hasErrored: posts.loading.hasErrored,
    posts: postsToProps,
    postsSortOption: posts.sortOption,
    categories: categoriesArr,
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
