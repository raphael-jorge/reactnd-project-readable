import React from 'react';
import { shallow } from 'enzyme';
import routes from '../../routes';
import {
  fetchVoteOnPost,
  fetchRemovePost,
  fetchUpdatePost,
} from '../../actions/posts';
import {
  fetchVoteOnComment,
  fetchRemoveComment,
  fetchUpdateComment,
  fetchAddComment,
} from '../../actions/comments';
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

const getDefaultPostData = () => ({
  id: 'testId',
  title: '',
  body: '',
  author: '',
  timestamp: 0,
});

const getDefaultCategories = () => {
  const categoriesArray = [
    { name: 'testCategory1', path: 'testCategory1' },
    { name: 'testCategory2', path: 'testCategory2' },
  ];

  const categoriesNormalized = categoriesArray.reduce((categoriesObj, category) => {
    categoriesObj[category.path] = { ...category };
    return categoriesObj;
  }, {});

  return {
    categoriesArray,
    categoriesNormalized,
  };
};

const getDefaultComments = () => {
  const commentsArray = [
    { id: 'testId1', body: '', author: '', timestamp: 0 },
    { id: 'testId2', body: '', author: '', timestamp: 0 },
  ];

  const commentsNormalized = commentsArray.reduce((commentsObj, comment) => {
    commentsObj[comment.id] = comment;
    return commentsObj;
  }, {});

  return {
    commentsArray,
    commentsNormalized,
  };
};

const getDefaultState = () => ({
  categories: {
    categories: {},
  },
  posts: {
    loading: {
      isLoading: false,
      hasErrored: false,
    },
    posts: {},
  },
  comments: {
    loading: {
      isLoading: false,
      hasErrored: false,
    },
    comments: {},
  },
});

const getDefaultExpectedState = () => ({
  postData: {},
  comments: [],
  categories: [],
  isLoadingPost: false,
  isLoadingComments: false,
  hasErroredPost: false,
  hasErroredComments: false,
});

const getDefaultProps = () => ({ postId: getDefaultPostData().id });


// Tests
describe('<ShowPostComments />', () => {
  it('renders a Header component', () => {
    const { showPostComments } = setup();

    expect(showPostComments.find('Header').length).toBe(1);
  });


  it('renders a ModalAddComment component', () => {
    const postData = getDefaultPostData();
    const { showPostComments } = setup({ postData });

    expect(showPostComments.find('ModalAddComment').length).toBe(1);
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


  it('renders a button to open the add comment modal when a post is available', () => {
    const postData = getDefaultPostData();
    const { showPostComments } = setup({ postData });

    const button = showPostComments.find('.btn-fixed');

    expect(button.length).toBe(1);
    expect(button.prop('onClick')).toBe(showPostComments.instance().openModalAddComment);
  });

  describe('Post', () => {
    it('renders a Post component when postData is available', () => {
      const postData = getDefaultPostData();
      const { showPostComments } = setup({ postData });

      expect(showPostComments.find('Post').length).toBe(1);
    });

    it('sets the Post onRemove prop correctly', () => {
      const postData = getDefaultPostData();
      const { showPostComments } = setup({ postData });

      const renderedPost = showPostComments.find('Post');

      expect(renderedPost.prop('onRemove'))
        .toBe(showPostComments.instance().handlePostRemove);
    });

    it('redirects to the root page once a post is deleted', async () => {
      const postData = getDefaultPostData();
      const onPostRemove = jest.fn(() => Promise.resolve());
      const { showPostComments } = setup({ postData, onPostRemove });

      await showPostComments.instance().handlePostRemove();
      showPostComments.update();

      const redirect = showPostComments.find('Redirect');

      expect(onPostRemove).toHaveBeenCalled();
      expect(showPostComments.state('redirectToRoot')).toBe(true);
      expect(redirect.length).toBe(1);
      expect(redirect.prop('to')).toBe(routes.root);
    });

    it('renders an error Message component when post load has errored', () => {
      const hasErroredPost = true;
      const { showPostComments } = setup({ hasErroredPost });

      const renderedPost = showPostComments.find('Post');
      const renderedMessage = showPostComments.find('Message');

      const expectedMessage = showPostComments.instance().MESSAGE_LOAD_ERROR;

      expect(renderedPost.length).toBe(0);
      expect(renderedMessage.length).toBe(1);
      expect(renderedMessage.prop('msg')).toBe(expectedMessage);
    });

    it('renders a NotFound component when postData is empty', () => {
      const { showPostComments } = setup();

      expect(showPostComments.find('Post').length).toBe(0);
      expect(showPostComments.find('NotFound').length).toBe(1);
    });
  });


  describe('Comments', () => {
    it('renders comments only when post load completely succeeded', () => {
      const testComments = getDefaultComments();
      let isLoadingPost = true;
      let hasErroredPost = false;
      let postData = {};

      const { showPostComments } = setup({
        isLoadingPost,
        hasErroredPost,
        postData,
        comments: testComments.commentsArray,
      });

      expect(showPostComments.find('Comment').length).toBe(0);

      isLoadingPost = false;
      hasErroredPost = true;
      showPostComments.setProps({ isLoadingPost, hasErroredPost });

      expect(showPostComments.find('Comment').length).toBe(0);

      hasErroredPost = false;
      showPostComments.setProps({ hasErroredPost });

      expect(showPostComments.find('Comment').length).toBe(0);

      postData = getDefaultPostData();
      showPostComments.setProps({ postData });

      expect(showPostComments.find('Comment').length)
        .toBe(testComments.commentsArray.length);
    });

    it('renders a Comment component for each comment in comments', () => {
      const testComments = getDefaultComments();
      const postData = getDefaultPostData();
      const { showPostComments } = setup({
        comments: testComments.commentsArray,
        postData,
      });

      const renderedComments = showPostComments.find('Comment');

      testComments.commentsArray.forEach((testComment) => {
        const matchingRenderedComment = renderedComments.filterWhere((comment) => (
          comment.prop('commentData').id === testComment.id
        ));
        expect(matchingRenderedComment.prop('commentData')).toEqual(testComment);
      });
    });

    it('renders an error Message component when comments load has errored', () => {
      const postData = getDefaultPostData();
      const hasErroredComments = true;
      const { showPostComments } = setup({ hasErroredComments, postData });

      const renderedComments = showPostComments.find('Comment');
      const renderedMessage = showPostComments.find('Message');

      const expectedMessage = showPostComments.instance().MESSAGE_LOAD_ERROR;

      expect(renderedComments.length).toBe(0);
      expect(renderedMessage.length).toBe(1);
      expect(renderedMessage.prop('msg')).toBe(expectedMessage);
    });

    it('renders a empty comments Message component when comments is empty', () => {
      const postData = getDefaultPostData();
      const { showPostComments } = setup({ postData });

      const renderedComments = showPostComments.find('Comment');
      const renderedMessage = showPostComments.find('Message');

      const expectedMessage = showPostComments.instance().MESSAGE_NO_COMMENTS;

      expect(renderedComments.length).toBe(0);
      expect(renderedMessage.length).toBe(1);
      expect(renderedMessage.prop('msg')).toBe(expectedMessage);
    });
  });
});


describe('mapStateToProps', () => {
  it('sets the categories related props', () => {
    const testState = getDefaultState();
    const expectedState = getDefaultExpectedState();
    const categories = getDefaultCategories();

    testState.categories.categories = categories.categoriesNormalized;

    expectedState.categories = categories.categoriesArray;

    expect(mapStateToProps(testState, getDefaultProps())).toEqual(expectedState);
  });


  it('sets the post related props', () => {
    const testState = getDefaultState();
    const expectedState = getDefaultExpectedState();
    const postData = getDefaultPostData();

    testState.posts.loading.isLoading = true;

    expectedState.isLoadingPost = true;

    expect(mapStateToProps(testState, getDefaultProps())).toEqual(expectedState);

    testState.posts.loading.isLoading = false;
    testState.posts.loading.hasErrored = true;

    expectedState.isLoadingPost = false;
    expectedState.hasErroredPost = true;

    expect(mapStateToProps(testState, getDefaultProps())).toEqual(expectedState);

    testState.posts.loading.hasErrored = false;
    testState.posts.posts = { [postData.id]: postData };

    expectedState.hasErroredPost = false;
    expectedState.postData = postData;

    expect(mapStateToProps(testState, getDefaultProps())).toEqual(expectedState);
  });


  it('sets the comments related props', () => {
    const testState = getDefaultState();
    const expectedState = getDefaultExpectedState();
    const testComments = getDefaultComments();

    testState.comments.loading.isLoading = true;

    expectedState.isLoadingComments = true;

    expect(mapStateToProps(testState, getDefaultProps())).toEqual(expectedState);

    testState.comments.loading.isLoading = false;
    testState.comments.loading.hasErrored = true;

    expectedState.isLoadingComments = false;
    expectedState.hasErroredComments = true;

    expect(mapStateToProps(testState, getDefaultProps())).toEqual(expectedState);

    testState.comments.loading.hasErrored = false;
    testState.comments.comments = testComments.commentsNormalized;

    expectedState.hasErroredComments = false;
    expectedState.comments = testComments.commentsArray;

    expect(mapStateToProps(testState, getDefaultProps())).toEqual(expectedState);
  });
});


describe('mapDispatchToProps', () => {
  it('sets the onPostVote prop correctly', () => {
    const mappedProps = mapDispatchToProps(dispatchMock);
    const postData = getDefaultPostData();
    const vote = 1;

    expect(mappedProps.onPostVote).toBeDefined();

    mappedProps.onPostVote(postData, vote);
    expect(fetchVoteOnPost).toHaveBeenCalledWith(postData, vote);
  });

  it('sets the onCommentVote prop correctly', () => {
    const mappedProps = mapDispatchToProps(dispatchMock);
    const commentData = getDefaultComments().commentsArray[0];
    const vote = 1;

    expect(mappedProps.onCommentVote).toBeDefined();

    mappedProps.onCommentVote(commentData, vote);
    expect(fetchVoteOnComment).toHaveBeenCalledWith(commentData, vote);
  });

  it('sets the onPostRemove prop correctly', () => {
    const mappedProps = mapDispatchToProps(dispatchMock);
    const postData = getDefaultPostData();

    expect(mappedProps.onPostRemove).toBeDefined();

    mappedProps.onPostRemove(postData);
    expect(fetchRemovePost).toHaveBeenCalledWith(postData);
  });

  it('sets the onCommentRemove prop correctly', () => {
    const mappedProps = mapDispatchToProps(dispatchMock);
    const commentData = getDefaultComments().commentsArray[0];

    expect(mappedProps.onCommentRemove).toBeDefined();

    mappedProps.onCommentRemove(commentData);
    expect(fetchRemoveComment).toHaveBeenCalledWith(commentData);
  });

  it('sets the onPostUpdate prop correctly', () => {
    const mappedProps = mapDispatchToProps(dispatchMock);
    const postData = getDefaultPostData();
    const updatedPostData = {
      title: 'test updated title',
      body: 'test updated body',
    };

    expect(mappedProps.onPostUpdate).toBeDefined();

    mappedProps.onPostUpdate(postData, updatedPostData);
    expect(fetchUpdatePost).toHaveBeenCalledWith(postData, updatedPostData);
  });

  it('sets the onCommentUpdate prop correctly', () => {
    const mappedProps = mapDispatchToProps(dispatchMock);
    const commentData = getDefaultComments().commentsArray[0];
    const updatedCommentData = {
      body: 'test updated comment',
    };

    expect(mappedProps.onCommentUpdate).toBeDefined();

    mappedProps.onCommentUpdate(commentData, updatedCommentData);
    expect(fetchUpdateComment).toHaveBeenCalledWith(commentData, updatedCommentData);
  });

  it('sets the onCommentAdd prop correctly', () => {
    const mappedProps = mapDispatchToProps(dispatchMock);
    const postData = getDefaultPostData();
    const commentToAdd = {
      author: 'test author',
      body: 'test comment body',
    };

    expect(mappedProps.onCommentAdd).toBeDefined();

    mappedProps.onCommentAdd(postData.id, commentToAdd);
    expect(fetchAddComment).toHaveBeenCalledWith(postData.id, commentToAdd);
  });
});
