import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ListPosts from './ListPosts';

export class ShowPosts extends Component {
  static propTypes = {
    posts: PropTypes.array.isRequired,
    isLoading: PropTypes.bool,
    hasErrored: PropTypes.bool,
  }

  render() {
    const {
      posts,
      isLoading,
      hasErrored,
    } = this.props;

    return (
      <div className="show-posts">
        <ListPosts
          posts={posts}
          isLoading={isLoading}
          hasErrored={hasErrored}
          loadErrorMsg={'There was an error while loading posts from the server'}
          noPostsMsg={'No posts to show'}
        />
      </div>

    );
  }
}

export const mapStateToProps = ({ posts: postsState }, props) => {
  const posts = postsState.posts;
  const postsIds = Object.keys(posts);
  return {
    isLoading: postsState.loading,
    hasErrored: postsState.errorOnLoad,
    posts: postsIds.map((postId) => (posts[postId])),
  };
};

export default connect(mapStateToProps)(ShowPosts);
