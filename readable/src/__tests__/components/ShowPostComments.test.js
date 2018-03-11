import React from 'react';
import { shallow } from 'enzyme';
import {
  fetchVoteOnPost,
  fetchRemovePost,
  fetchUpdatePost,
} from '../../actions/posts';
import {
  fetchVoteOnComment,
  fetchRemoveComment,
  fetchUpdateComment,
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
}));

// Mock dispatch
const dispatchMock = () => {};

// Utils
const setup = (propOverrides) => {
  const props = Object.assign({
    postData: {},
    comments: [],
    onPostVote: () => {},
    onCommentVote: () => {},
    onPostRemove: () => {},
    onCommentRemove: () => {},
    onPostUpdate: () => {},
    onCommentUpdate: () => {},
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
  isLoadingPost: false,
  isLoadingComments: false,
  hasErroredPost: false,
  hasErroredComments: false,
});

const getDefaultProps = () => ({ postId: getDefaultPostData().id });


// Tests
describe('<ShowPostComments />', () => {
  describe('Post', () => {
    it('renders a Post component when postData is available', () => {
      const postData = getDefaultPostData();
      const { showPostComments, props } = setup({ postData });

      const renderedPost = showPostComments.find('Post');
      expect(renderedPost.length).toBe(1);
      expect(renderedPost.prop('postData')).toEqual(postData);
      expect(renderedPost.prop('onVote')).toEqual(props.onPostVote);
      expect(renderedPost.prop('onRemove')).toEqual(props.onPostRemove);
      expect(renderedPost.prop('onUpdate')).toEqual(props.onPostUpdate);
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

    it('renders a no data Message component when postData is empty', () => {
      const { showPostComments } = setup();

      const renderedPost = showPostComments.find('Post');
      const renderedMessage = showPostComments.find('Message');

      const expectedMessage = showPostComments.instance().MESSAGE_NO_POST;

      expect(renderedPost.length).toBe(0);
      expect(renderedMessage.length).toBe(1);
      expect(renderedMessage.prop('msg')).toBe(expectedMessage);
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
});
