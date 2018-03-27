import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import AddIcon from 'react-icons/lib/fa/plus';
import routes from '../routes';
import * as postsActions from '../actions/posts';
import * as commentsActions from '../actions/comments';
import { getCategories } from '../selectors/categories';
import { getComments } from '../selectors/comments';
import { getPostData } from '../selectors/posts';
import Comment from './Comment';
import Header from './Header';
import Loading from './Loading';
import Message from './Message';
import ModalAddComment from './ModalAddComment';
import NotFound from './NotFound';
import Placeholder from './Placeholder';
import Post from './Post';

export class ShowPostComments extends PureComponent {
  static propTypes = {
    postData: PropTypes.object.isRequired,
    comments: PropTypes.array.isRequired,
    categories: PropTypes.array.isRequired,
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

  MESSAGE_LOAD_ERROR = 'There was an error while loading data from the server'
  MESSAGE_NO_COMMENTS = 'No comments yet'
  LOADING_ICON_COMPONENT = <Loading type={'icon-squares'} />

  state = {
    isModalAddCommentOpen: false,
    redirectToRoot: false,
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

  wasPostFound = () => {
    return (Object.keys(this.props.postData).length > 0);
  }

  render() {
    const {
      postData,
      comments,
      categories,
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
        <div>

          <Header categories={categories} />

          <main className="container-md">
            {/* Verifica se os dados do post estão sendo carregados */}
            <Placeholder
              isReady={!isLoadingPost}
              fallback={this.LOADING_ICON_COMPONENT}
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
                      className="btn btn-fixed btn-magenta-shadow"
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
                fallback={this.LOADING_ICON_COMPONENT}
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

          </main>
        </div>
      )
    );
  }
}

export const mapStateToProps = (state, ownProps) => {
  const { posts, comments } = state;

  return {
    postData: getPostData(state, ownProps),
    comments: getComments(state),
    categories: getCategories(state),
    isLoadingPost: posts.loading.isLoading,
    isLoadingComments: comments.loading.isLoading,
    hasErroredPost: posts.loading.hasErrored,
    hasErroredComments: comments.loading.hasErrored,
  };
};

export const mapDispatchToProps = (dispatch, ownProps) => ({
  onPostVote: (post, vote) => dispatch(postsActions.fetchVoteOnPost(post, vote)),
  onPostRemove: (post) => dispatch(postsActions.fetchRemovePost(post)),
  onPostUpdate: (post, updatedData) =>
    dispatch(postsActions.fetchUpdatePost(post, updatedData)),
  onCommentVote: (comment, vote) =>
    dispatch(commentsActions.fetchVoteOnComment(comment, vote)),
  onCommentRemove: (comment) =>
    dispatch(commentsActions.fetchRemoveComment(comment)),
  onCommentUpdate: (comment, updatedData) =>
    dispatch(commentsActions.fetchUpdateComment(comment, updatedData)),
  onCommentAdd: (postId, commentData) =>
    dispatch(commentsActions.fetchAddComment(postId, commentData)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ShowPostComments);
