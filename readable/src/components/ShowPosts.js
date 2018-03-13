import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  fetchVoteOnPost,
  fetchRemovePost,
  fetchUpdatePost,
} from '../actions/posts';
import Loading from './Loading';
import Message from './Message';
import Placeholder from './Placeholder';
import Post from './Post';

export class ShowPosts extends Component {
  static propTypes = {
    posts: PropTypes.array.isRequired,
    onPostVote: PropTypes.func.isRequired,
    onPostRemove: PropTypes.func.isRequired,
    onPostUpdate: PropTypes.func.isRequired,
    isLoading: PropTypes.bool,
    hasErrored: PropTypes.bool,
  }

  MESSAGE_LOAD_ERROR = 'There was an error while loading posts from the server'
  MESSAGE_NO_POSTS = 'No Posts Available'

  render() {
    const {
      posts,
      onPostVote,
      onPostRemove,
      onPostUpdate,
      isLoading,
      hasErrored,
    } = this.props;

    return (
      <div className="show-posts">

        {/* Verifica se os posts estão sendo carregados */}
        <Placeholder
          isReady={!isLoading}
          fallback={<Loading type="icon-squares" />}
          delay={250}
        >
          {hasErrored &&
            <Message msg={this.MESSAGE_LOAD_ERROR} />
          }

          {!hasErrored && posts.length > 0 && posts.map((postData) => (
            <Post
              key={postData.id}
              postData={postData}
              onVote={onPostVote}
              onRemove={onPostRemove}
              onUpdate={onPostUpdate}
              linkMode={true}
            />
          ))}

          {!hasErrored && !posts.length &&
            <Message msg={this.MESSAGE_NO_POSTS} />
          }
        </Placeholder>

      </div>
    );
  }
}

export const mapStateToProps = ({ posts, categories }, props) => {
  const postsObj = posts.posts;
  const postsIds = Object.keys(postsObj);
  const postsArr = postsIds.map((postId) => (postsObj[postId]));

  const activeCategoryPath = categories.activePath;
  let postsToProps;
  if (activeCategoryPath === null) {
    postsToProps = postsArr;
  } else {
    postsToProps = postsArr.filter((post) => post.category === activeCategoryPath);
  }

  return {
    isLoading: posts.loading.isLoading,
    hasErrored: posts.loading.hasErrored,
    posts: postsToProps,
  };
};

export const mapDispatchToProps = (dispatch, props) => {
  return {
    onPostVote: (post, vote) => dispatch(fetchVoteOnPost(post, vote)),
    onPostRemove: (post) => dispatch(fetchRemovePost(post)),
    onPostUpdate: (post, updatedData) => dispatch(fetchUpdatePost(post, updatedData)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ShowPosts);
