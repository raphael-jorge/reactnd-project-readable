import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Post from './Post';
import Message from './Message';
import Loading from './Loading';
import Placeholder from './Placeholder';
import Comment from './Comment';

export class ShowPostComments extends Component {
  static propTypes = {
    postData: PropTypes.object.isRequired,
    comments: PropTypes.array.isRequired,
    isLoading: PropTypes.bool,
    hasErrored: PropTypes.bool,
  };

  render() {
    const {
      postData,
      comments,
      isLoading,
      hasErrored,
    } = this.props;

    return (
      <div className="show-post-comments">

        {/* Verifica se os dados estão sendo carregados */}
        <Placeholder
          isReady={!isLoading}
          fallback={<Loading type={'squares'} />}
        >
          {hasErrored &&
            <Message msg={'There was an error while loading data from the server'} />
          }

          {!hasErrored && Object.keys(postData).length &&
            <Post postData={postData} />
          }

          {!hasErrored && comments.length > 0 && comments.map((comment) => (
            <Comment
              key={comment.id}
              commentData={comment}
            />
          ))}

          {!hasErrored && !comments.length &&
            <Message msg={'No comments yet'} />
          }
        </Placeholder>

      </div>
    );
  }
}

export const mapStateToProps = (state, props) => {
  const commentsState = state.comments;
  const comments = commentsState.comments;
  const commentsIds = Object.keys(comments);

  const postsState = state.posts;
  const posts = postsState.posts;
  const postData = posts[props.postId] || {};

  return {
    postData,
    comments: commentsIds.map((commentId) => comments[commentId]),
    isLoading: commentsState.loading || postsState.loading.isLoading,
    hasErrored: commentsState.errorOnLoad || postsState.loading.hasErrored,
  };
};

export default connect(mapStateToProps)(ShowPostComments);
