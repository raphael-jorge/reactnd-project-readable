import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Loading from './Loading';
import Message from './Message';
import Placeholder from './Placeholder';
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

        {/* Verifica se os posts estão sendo carregados */}
        <Placeholder
          isReady={!isLoading}
          fallback={<Loading type={'squares'} />}
        >
          {hasErrored &&
            <Message msg={'There was an error while loading posts from the server'} />
          }

          {!hasErrored && posts.length > 0 && posts.map((postData) => (
            <Link
              key={postData.id}
              className="post-link"
              to={ `/${postData.category}/${postData.id}` }
            >
              <Post
                postData={postData}
                maxBodyLength={80}
              />
            </Link>
          ))}

          {!hasErrored && !posts.length &&
            <Message msg={'No Posts Available'} />
          }
        </Placeholder>

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
