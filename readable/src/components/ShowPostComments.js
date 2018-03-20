import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import AddIcon from 'react-icons/lib/fa/plus';
import routes from '../routes';
import {
  fetchVoteOnPost,
  fetchRemovePost,
  fetchUpdatePost,
} from '../actions/posts';
import {
  fetchVoteOnComment,
  fetchRemoveComment,
  fetchUpdateComment,
  fetchAddComment,
} from '../actions/comments';
import Comment from './Comment';
import Loading from './Loading';
import Message from './Message';
import ModalAddComment from './ModalAddComment';
import NotFound from './NotFound';
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
    onPostUpdate: PropTypes.func.isRequired,
    onCommentUpdate: PropTypes.func.isRequired,
    onCommentAdd: PropTypes.func.isRequired,
    isLoadingPost: PropTypes.bool,
    isLoadingComments: PropTypes.bool,
    hasErroredPost: PropTypes.bool,
    hasErroredComments: PropTypes.bool,
  };

  state = {
    isModalAddCommentOpen: false,
    redirectToRoot: false,
  }

  wasPostFound = () => {
    return (Object.keys(this.props.postData).length > 0);
  }

  handlePostRemove = (post) => {
    return this.props.onPostRemove(post)
      .then(() => this.setState({ redirectToRoot: true }));
  }

  openModalAddComment = () => {
    this.setState({ isModalAddCommentOpen: true });
  }

  closeModalAddComment = () => {
    this.setState({ isModalAddCommentOpen: false });
  }

  MESSAGE_LOAD_ERROR = 'There was an error while loading data from the server'
  MESSAGE_NO_COMMENTS = 'No comments yet'

  render() {
    const {
      postData,
      comments,
      onPostVote,
      onCommentVote,
      onCommentRemove,
      onPostUpdate,
      onCommentUpdate,
      onCommentAdd,
      isLoadingPost,
      isLoadingComments,
      hasErroredPost,
      hasErroredComments,
    } = this.props;

    const pageFound = this.wasPostFound();

    return (
      this.state.redirectToRoot ? (
        <Redirect push to={routes.root} />
      ) : (
        <div className="show-post-comments">

          {/* Verifica se os dados do post estão sendo carregados */}
          <Placeholder
            isReady={!isLoadingPost}
            fallback={<Loading type={'icon-squares'} />}
            delay={250}
          >
            {hasErroredPost ? (
              <Message msg={this.MESSAGE_LOAD_ERROR} />
            ) : (
              !pageFound ? (
                <NotFound />
              ) : (
                <div>
                  <button
                    className="btn-fixed btn-magenta"
                    title="Add Comment"
                    onClick={this.openModalAddComment}
                  >
                    Add Post
                    <AddIcon size={20} />
                  </button>

                  <Post
                    postData={postData}
                    onVote={onPostVote}
                    onRemove={this.handlePostRemove}
                    onUpdate={onPostUpdate}
                  />

                  <ModalAddComment
                    isOpen={this.state.isModalAddCommentOpen}
                    onModalClose={this.closeModalAddComment}
                    onCommentAdd={onCommentAdd}
                    postData={postData}
                  />

                </div>
              ))}

          </Placeholder>

          {/* Se o post foi carregado com sucesso os comentários podem ser analisados */}
          {!isLoadingPost && pageFound && !hasErroredPost &&
            <Placeholder
              isReady={!isLoadingComments}
              fallback={<Loading type={'icon-squares'} />}
              delay={250}
            >
              {hasErroredComments ? (
                <Message msg={this.MESSAGE_LOAD_ERROR} />
              ) : (
                !comments.length ? (
                  <Message msg={this.MESSAGE_NO_COMMENTS} />
                ) : (
                  comments.map((commentData) => (
                    <Comment
                      key={commentData.id}
                      commentData={commentData}
                      onVote={onCommentVote}
                      onRemove={onCommentRemove}
                      onUpdate={onCommentUpdate}
                    />
                  ))
                )
              )}
            </Placeholder>
          }
        </div>
      )
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
    onPostUpdate: (post, updatedData) => dispatch(fetchUpdatePost(post, updatedData)),
    onCommentVote: (comment, vote) => dispatch(fetchVoteOnComment(comment, vote)),
    onCommentRemove: (comment) => dispatch(fetchRemoveComment(comment)),
    onCommentUpdate: (comment, updatedData) => dispatch(fetchUpdateComment(comment, updatedData)),
    onCommentAdd: (postId, commentData) => dispatch(fetchAddComment(postId, commentData)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ShowPostComments);
