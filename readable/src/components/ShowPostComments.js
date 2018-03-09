import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchVoteOnPost, fetchRemovePost } from '../actions/posts';
import { fetchVoteOnComment, fetchRemoveComment } from '../actions/comments';
import Comment from './Comment';
import Loading from './Loading';
import Message from './Message';
import Placeholder from './Placeholder';
import Post from './Post';

export class ShowPostComments extends Component {
  static propTypes = {
    postData: PropTypes.object.isRequired,
    comments: PropTypes.array.isRequired,
    onPostVote: PropTypes.func.isRequired,
    onCommentVote: PropTypes.func.isRequired,
    onPostRemove: PropTypes.func.isRequired,
    onCommentRemove: PropTypes.func.isRequired,
    isLoadingPost: PropTypes.bool,
    isLoadingComments: PropTypes.bool,
    hasErroredPost: PropTypes.bool,
    hasErroredComments: PropTypes.bool,
  };

  MESSAGE_LOAD_ERROR = 'There was an error while loading data from the server'
  MESSAGE_NO_POST = 'It was not possible to find the requested post'
  MESSAGE_NO_COMMENTS = 'No comments yet'

  render() {
    const {
      postData,
      comments,
      onPostVote,
      onCommentVote,
      onPostRemove,
      onCommentRemove,
      isLoadingPost,
      isLoadingComments,
      hasErroredPost,
      hasErroredComments,
    } = this.props;

    return (
      <div className="show-post-comments">

        {/* Verifica se os dados do post estão sendo carregados */}
        <Placeholder
          isReady={!isLoadingPost}
          fallback={<Loading type={'squares'} />}
        >
          {hasErroredPost &&
            <Message msg={this.MESSAGE_LOAD_ERROR} />
          }

          {!hasErroredPost && Object.keys(postData).length > 0 &&
            <Post
              postData={postData}
              onVote={onPostVote}
              onRemove={onPostRemove}
            />
          }

          {!hasErroredPost && !Object.keys(postData).length &&
            <Message msg={this.MESSAGE_NO_POST} />
          }
        </Placeholder>

        {/* Se o post foi carregado com sucesso os comentários podem ser analisados */}
        {!isLoadingPost && !hasErroredPost && Object.keys(postData).length > 0 &&
          <Placeholder
            isReady={!isLoadingComments}
            fallback={<Loading type={'squares'} />}
          >
            {hasErroredComments &&
              <Message msg={this.MESSAGE_LOAD_ERROR} />
            }

            {!hasErroredComments && comments.length > 0 && comments.map((commentData) => (
              <Comment
                key={commentData.id}
                commentData={commentData}
                onVote={onCommentVote}
                onRemove={onCommentRemove}
              />
            ))}

            {!hasErroredComments && !comments.length &&
              <Message msg={this.MESSAGE_NO_COMMENTS} />
            }
          </Placeholder>
        }

      </div>
    );
  }
}

export const mapStateToProps = ({ posts, comments }, props) => {
  const commentsObj = comments.comments;
  const commentsIds = Object.keys(commentsObj);

  const postsObj = posts.posts;
  const postData = postsObj[props.postId] || {};

  return {
    postData,
    comments: commentsIds.map((commentId) => commentsObj[commentId]),
    isLoadingPost: posts.loading.isLoading,
    isLoadingComments: comments.loading.isLoading,
    hasErroredPost: posts.loading.hasErrored,
    hasErroredComments: comments.loading.hasErrored,
  };
};

export const mapDispatchToProps = (dispatch, props) => {
  return {
    onPostVote: (post, vote) => dispatch(fetchVoteOnPost(post, vote)),
    onPostRemove: (post) => dispatch(fetchRemovePost(post)),
    onCommentVote: (comment, vote) => dispatch(fetchVoteOnComment(comment, vote)),
    onCommentRemove: (comment) => dispatch(fetchRemoveComment(comment)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ShowPostComments);
