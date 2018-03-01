import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Post from './Post';

export default class ListPosts extends Component {
  static propTypes = {
    posts: PropTypes.array.isRequired,
    isLoading: PropTypes.bool,
    hasErrored: PropTypes.bool,
    loadErrorMsg: PropTypes.string,
    noPostsMsg: PropTypes.string,
  }

  render() {
    const {
      posts,
      isLoading,
      hasErrored,
      loadErrorMsg,
      noPostsMsg,
    } = this.props;

    return (
      <div className="posts-list">

        {isLoading &&
          <div className="loading-squares">Loading</div>
        }

        {!isLoading && hasErrored && loadErrorMsg &&
          <p className="status-msg">
            { loadErrorMsg }
          </p>
        }

        {!isLoading && !hasErrored && posts.length > 0 &&
          posts.map((post) => (
            <Post key={post.id} postData={post} maxBodyLength={80} />
          ))
        }

        {!isLoading && !hasErrored && !posts.length && noPostsMsg &&
          <p className="status-msg">
            { noPostsMsg }
          </p>
        }

      </div>
    );
  }
}
