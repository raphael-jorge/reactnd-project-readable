import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ListData from './ListData';
import Post from './Post';

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
        <ListData
          ComponentToList={Post}
          componentProps={{
            dataPropName: 'postData',
            dataArr: posts,
            common: { maxBodyLength: 80 },
          }}
          isLoading={isLoading}
          hasErrored={hasErrored}
          loadErrorMsg={'There was an error while loading posts from the server'}
          noDataMsg={'No posts to show'}
        />
      </div>

    );
  }
}

export const mapStateToProps = ({ posts: postsState }, props) => {
  const posts = postsState.posts;
  const postsIds = Object.keys(posts);
  return {
    isLoading: postsState.loading.isLoading,
    hasErrored: postsState.loading.hasErrored,
    posts: postsIds.map((postId) => (posts[postId])),
  };
};

export default connect(mapStateToProps)(ShowPosts);
