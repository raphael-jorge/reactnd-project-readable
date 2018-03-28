import React from 'react';
import { shallow } from 'enzyme';
import routes from '../../routes';
import * as postsActions from '../../actions/posts';
import * as commentsActions from '../../actions/comments';
import {
  ShowPostComments,
  mapStateToProps,
  mapDispatchToProps,
} from '../../components/ShowPostComments';

// Mock posts actions
jest.mock('../../actions/posts', () => ({
  fetchVoteOnPost: jest.fn(),
  fetchRemovePost: jest.fn(),
  fetchUpdatePost: jest.fn(),
}));

// Mock comments actions
jest.mock('../../actions/comments', () => ({
  fetchVoteOnComment: jest.fn(),
  fetchRemoveComment: jest.fn(),
  fetchUpdateComment: jest.fn(),
  fetchAddComment: jest.fn(),
}));

// Mock dispatch
const dispatchMock = () => {};

// Utils
const setup = (propOverrides) => {
  const props = Object.assign({
    postData: {},
    comments: [],
    categories: [],
    onPostVote: () => {},
    onCommentVote: () => {},
    onPostRemove: () => {},
    onCommentRemove: () => {},
    onPostUpdate: () => {},
    onCommentUpdate: () => {},
    onCommentAdd: () => {},
    isLoadingPost: false,
    isLoadingComments: false,
    hasErroredPost: false,
    hasErroredComments: false,
  }, propOverrides);

  const showPostComments= shallow(<ShowPostComments {...props} />);

  return {
    props,
    showPostComments,
  };
};

const getDefaultOwnProps = () => ({
  postId: null,
});


// Tests
describe('<ShowPostComments />', () => {
  it('renders a Navbar component', () => {
    const { showPostComments } = setup();

    expect(showPostComments.find('Navbar').length).toBe(1);
  });


  it('renders a loading icon placeholder', () => {
    const { showPostComments } = setup();

    const placeholder = showPostComments.find('Placeholder');

    expect(placeholder.length).toBe(1);
    expect(placeholder.prop('fallback')).toBe(showPostComments.instance().LOADING_ICON_COMPONENT);
  });


  it('renders a ModalAddComment component', () => {
    const postData = global.testUtils.getDefaultPostData();
    const { showPostComments } = setup({ postData });

    expect(showPostComments.find('ModalAddComment').length).toBe(1);
  });


  it('renders a button to open the add comment modal when a post is available', () => {
    const postData = global.testUtils.getDefaultPostData();
    const { showPostComments } = setup({ postData });

    const button = showPostComments.find('.btn-fixed');

    expect(button.length).toBe(1);
    expect(button.prop('onClick')).toBe(showPostComments.instance().openModalAddComment);
  });


  describe('post', () => {
    it('renders a Post component when postData is available', () => {
      const postData = global.testUtils.getDefaultPostData();
      const { showPostComments } = setup({ postData });

      expect(showPostComments.find('Post').length).toBe(1);
    });

    it('sets the Post onRemove prop correctly', () => {
      const postData = global.testUtils.getDefaultPostData();
      const { showPostComments } = setup({ postData });

      const renderedPost = showPostComments.find('Post');

      expect(renderedPost.prop('onRemove'))
        .toBe(showPostComments.instance().handlePostRemove);
    });

    it('redirects to the root page once the post is deleted', async () => {
      const onPostRemove = jest.fn(() => Promise.resolve());
      const postData = global.testUtils.getDefaultPostData();
      const { showPostComments, props } = setup({ postData, onPostRemove });

      await showPostComments.instance().handlePostRemove();
      showPostComments.update();

      const redirect = showPostComments.find('Redirect');

      expect(props.onPostRemove).toHaveBeenCalled();
      expect(showPostComments.state('redirectToRoot')).toBe(true);
      expect(redirect.length).toBe(1);
      expect(redirect.prop('to')).toBe(routes.root);
    });

    it('renders an error Message component when post load has errored', () => {
      const hasErroredPost = true;
      const { showPostComments } = setup({ hasErroredPost });

      const renderedPost = showPostComments.find('Post');
      const renderedMessage = showPostComments.find('Message');

      const expectedMessageContent = showPostComments.instance().MESSAGE_LOAD_ERROR;

      expect(renderedPost.length).toBe(0);
      expect(renderedMessage.length).toBe(1);
      expect(renderedMessage.prop('msg')).toBe(expectedMessageContent);
    });

    it('renders a NotFound component when postData is empty', () => {
      const { showPostComments } = setup();

      expect(showPostComments.find('Post').length).toBe(0);
      expect(showPostComments.find('NotFound').length).toBe(1);
    });
  });


  describe('comments', () => {
    it('renders a Comment component for each comment in comments', () => {
      const comments = global.testUtils.getDefaultCommentsArray();
      const postData = global.testUtils.getDefaultPostData();
      const { showPostComments } = setup({ comments, postData });

      const renderedComments = showPostComments.find('Comment');

      comments.forEach((testComment) => {
        const matchingRenderedComment = renderedComments.filterWhere((comment) => (
          comment.prop('commentData').id === testComment.id
        ));

        expect(matchingRenderedComment.prop('commentData')).toEqual(testComment);
      });
    });

    it('does not render comments if post is being loaded', () => {
      const comments = global.testUtils.getDefaultCommentsArray();
      const isLoadingPost = true;

      const { showPostComments } = setup({ comments, isLoadingPost });

      expect(showPostComments.find('Comment').length).toBe(0);
    });

    it('does not render comments if post load has errored', () => {
      const comments = global.testUtils.getDefaultCommentsArray();
      const hasErroredPost = true;

      const { showPostComments } = setup({ comments, hasErroredPost });

      expect(showPostComments.find('Comment').length).toBe(0);
    });

    it('does not render comments if post data is empty', () => {
      const comments = global.testUtils.getDefaultCommentsArray();

      const { showPostComments } = setup({ comments });

      expect(showPostComments.find('Comment').length).toBe(0);
    });

    describe('messages', () => {
      it('renders an error Message component when comments load has errored', () => {
        const postData = global.testUtils.getDefaultPostData();
        const hasErroredComments = true;
        const { showPostComments } = setup({ hasErroredComments, postData });

        const renderedComments = showPostComments.find('Comment');
        const renderedMessage = showPostComments.find('Message');

        const expectedMessageContent = showPostComments.instance().MESSAGE_LOAD_ERROR;

        expect(renderedComments.length).toBe(0);
        expect(renderedMessage.length).toBe(1);
        expect(renderedMessage.prop('msg')).toBe(expectedMessageContent);
      });

      it('renders an empty comments Message component when comments is empty', () => {
        const postData = global.testUtils.getDefaultPostData();
        const { showPostComments } = setup({ postData });

        const renderedComments = showPostComments.find('Comment');
        const renderedMessage = showPostComments.find('Message');

        const expectedMessageContent = showPostComments.instance().MESSAGE_NO_COMMENTS;

        expect(renderedComments.length).toBe(0);
        expect(renderedMessage.length).toBe(1);
        expect(renderedMessage.prop('msg')).toBe(expectedMessageContent);
      });
    });
  });


  describe('methods', () => {
    it('provides a method to remove the post', async () => {
      const onPostRemove = jest.fn(() => Promise.resolve());
      const { showPostComments } = setup({ onPostRemove });

      await showPostComments.instance().handlePostRemove();

      expect(onPostRemove).toHaveBeenCalled();
      expect(showPostComments.state('redirectToRoot')).toBe(true);
    });

    it('provides a method to open the add comment modal', () => {
      const { showPostComments } = setup();

      showPostComments.setState({ isModalAddCommentOpen: false });
      showPostComments.instance().openModalAddComment();

      expect(showPostComments.state('isModalAddCommentOpen')).toBe(true);
    });


    it('provides a method to close the add comment modal', () => {
      const { showPostComments } = setup();

      showPostComments.setState({ isModalAddCommentOpen: true });
      showPostComments.instance().closeModalAddComment();

      expect(showPostComments.state('isModalAddCommentOpen')).toBe(false);
    });
  });
});


describe('mapStateToProps', () => {
  it('sets the postData prop to the matching post id', () => {
    const posts = global.testUtils.getDefaultPostsArray();
    const state = global.testUtils.getDefaultReduxState();
    const ownProps = getDefaultOwnProps();
    const postIndex = 0;

    state.posts.posts = global.testUtils.convertArrayToNormalizedObject(posts, 'id');
    ownProps.postId = posts[postIndex].id;

    const mappedProps = mapStateToProps(state, ownProps);

    expect(mappedProps.postData).toEqual(posts[postIndex]);
  });


  it('sets the postData prop to an empty object if the post id is not found', () => {
    const posts = global.testUtils.getDefaultPostsArray();
    const state = global.testUtils.getDefaultReduxState();
    const ownProps = getDefaultOwnProps();

    state.posts.posts = global.testUtils.convertArrayToNormalizedObject(posts, 'id');
    ownProps.postId = 'postIdNoMatch';

    const mappedProps = mapStateToProps(state, ownProps);

    expect(mappedProps.postData).toEqual({});
  });


  it('sets the comments prop to an array with the comments on the state', () => {
    const comments = global.testUtils.getDefaultCommentsArray();
    const state = global.testUtils.getDefaultReduxState();
    const ownProps = getDefaultOwnProps();

    state.comments.comments = global.testUtils.convertArrayToNormalizedObject(comments, 'id');

    const mappedProps = mapStateToProps(state, ownProps);

    expect(mappedProps.comments).toEqual(comments);
  });


  it('sets the categories prop to an array with the categories on the state', () => {
    const categories = global.testUtils.getDefaultCategoriesArray();
    const state = global.testUtils.getDefaultReduxState();
    const ownProps = getDefaultOwnProps();

    state.categories.categories = global.testUtils
      .convertArrayToNormalizedObject(categories, 'path');

    const mappedProps = mapStateToProps(state, ownProps);

    expect(mappedProps.categories).toEqual(categories);
  });


  it('sets the isLoadingPost prop according to the posts loading state', () => {
    const state = global.testUtils.getDefaultReduxState();
    const ownProps = getDefaultOwnProps();

    let isLoadingPost = false;
    state.posts.loading.isLoading = isLoadingPost;

    let mappedProps = mapStateToProps(state, ownProps);

    expect(mappedProps.isLoadingPost).toEqual(isLoadingPost);

    isLoadingPost = true;
    state.posts.loading.isLoading = isLoadingPost;

    mappedProps = mapStateToProps(state, ownProps);

    expect(mappedProps.isLoadingPost).toEqual(isLoadingPost);
  });


  it('sets the isLoadingComments prop according to the comments loading state', () => {
    const state = global.testUtils.getDefaultReduxState();
    const ownProps = getDefaultOwnProps();

    let isLoadingComments = false;
    state.comments.loading.isLoading = isLoadingComments;

    let mappedProps = mapStateToProps(state, ownProps);

    expect(mappedProps.isLoadingComments).toEqual(isLoadingComments);

    isLoadingComments = true;
    state.comments.loading.isLoading = isLoadingComments;

    mappedProps = mapStateToProps(state, ownProps);

    expect(mappedProps.isLoadingComments).toEqual(isLoadingComments);
  });


  it('sets the hasErroredPost prop according to the posts loading state', () => {
    const state = global.testUtils.getDefaultReduxState();
    const ownProps = getDefaultOwnProps();

    let hasErroredPost = false;
    state.posts.loading.hasErrored = hasErroredPost;

    let mappedProps = mapStateToProps(state, ownProps);

    expect(mappedProps.hasErroredPost).toEqual(hasErroredPost);

    hasErroredPost = true;
    state.posts.loading.hasErrored = hasErroredPost;

    mappedProps = mapStateToProps(state, ownProps);

    expect(mappedProps.hasErroredPost).toEqual(hasErroredPost);
  });


  it('sets the hasErroredComments prop according to the comments loading state', () => {
    const state = global.testUtils.getDefaultReduxState();
    const ownProps = getDefaultOwnProps();

    let hasErroredComments = false;
    state.comments.loading.hasErrored = hasErroredComments;

    let mappedProps = mapStateToProps(state, ownProps);

    expect(mappedProps.hasErroredComments).toEqual(hasErroredComments);

    hasErroredComments = true;
    state.comments.loading.hasErrored = hasErroredComments;

    mappedProps = mapStateToProps(state, ownProps);

    expect(mappedProps.hasErroredComments).toEqual(hasErroredComments);
  });
});


describe('mapDispatchToProps', () => {
  it('sets the onPostVote prop to dispatch the fetchVoteOnPost action', () => {
    const mappedProps = mapDispatchToProps(dispatchMock);
    const postData = global.testUtils.getDefaultPostData();
    const vote = 1;

    mappedProps.onPostVote(postData, vote);

    expect(postsActions.fetchVoteOnPost).toHaveBeenCalledWith(postData, vote);
  });


  it('sets the onCommentVote to dispatch the fetchVoteOnComment action', () => {
    const mappedProps = mapDispatchToProps(dispatchMock);
    const commentData = global.testUtils.getDefaultCommentData();
    const vote = 1;

    mappedProps.onCommentVote(commentData, vote);

    expect(commentsActions.fetchVoteOnComment).toHaveBeenCalledWith(commentData, vote);
  });


  it('sets the onPostRemove prop to dispatch the fetchRemovePost action', () => {
    const mappedProps = mapDispatchToProps(dispatchMock);
    const postData = global.testUtils.getDefaultPostData();

    mappedProps.onPostRemove(postData);

    expect(postsActions.fetchRemovePost).toHaveBeenCalledWith(postData);
  });


  it('sets the onCommentRemove prop to dispatch the fetchRemoveComment action', () => {
    const mappedProps = mapDispatchToProps(dispatchMock);
    const commentData = global.testUtils.getDefaultCommentData();

    mappedProps.onCommentRemove(commentData);

    expect(commentsActions.fetchRemoveComment).toHaveBeenCalledWith(commentData);
  });


  it('sets the onPostUpdate prop to dispatch the fetchUpdatePost action', () => {
    const mappedProps = mapDispatchToProps(dispatchMock);
    const postData = global.testUtils.getDefaultPostData();

    const updatedPostData = {
      title: 'test updated title',
      body: 'test updated body',
    };

    mappedProps.onPostUpdate(postData, updatedPostData);

    expect(postsActions.fetchUpdatePost).toHaveBeenCalledWith(postData, updatedPostData);
  });


  it('sets the onCommentUpdate prop to dispatch the fetchUpdateComment action', () => {
    const mappedProps = mapDispatchToProps(dispatchMock);
    const commentData = global.testUtils.getDefaultCommentData();

    const updatedCommentData = {
      body: 'test updated comment',
    };


    mappedProps.onCommentUpdate(commentData, updatedCommentData);

    expect(commentsActions.fetchUpdateComment)
      .toHaveBeenCalledWith(commentData, updatedCommentData);
  });


  it('sets the onCommentAdd prop to dispatch the fetchAddComment action', () => {
    const mappedProps = mapDispatchToProps(dispatchMock);
    const postData = global.testUtils.getDefaultPostData();

    const commentToAdd = {
      author: 'test author',
      body: 'test comment body',
    };

    mappedProps.onCommentAdd(postData.id, commentToAdd);

    expect(commentsActions.fetchAddComment)
      .toHaveBeenCalledWith(postData.id, commentToAdd);
  });
});
