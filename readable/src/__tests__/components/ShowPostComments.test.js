import React from 'react';
import { shallow } from 'enzyme';
import {
  ShowPostComments,
  mapStateToProps,
} from '../../components/ShowPostComments';

const setup = (propOverrides) => {
  const props = Object.assign({
    postData: {},
    comments: [],
    isLoading: undefined,
    hasErrored: undefined,
  }, propOverrides);

  const showPostComments= shallow(<ShowPostComments {...props} />);

  return {
    props,
    showPostComments,
  };
};

const testPostData = {
  id: 'testId',
  title: '',
  body: '',
  author: '',
  timestamp: 0,
};

const testComments = [
  { id: 'testId1', body: '', author: '', timestamp: 0 },
  { id: 'testId2', body: '', author: '', timestamp: 0 },
];


describe('<ShowPostComments />', () => {
  it('renders a Message component when an error occurs on load', () => {
    let hasErrored = true;
    const { showPostComments } = setup({ hasErrored });

    expect(showPostComments.find('Message').length).toBe(1);

    hasErrored = false;
    showPostComments.setProps({ hasErrored, comments: testComments });

    expect(showPostComments.find('Message').length).toBe(0);
  });

  it('renders a Post component with the postData', () => {
    const { showPostComments } = setup({ postData: testPostData });

    const post = showPostComments.find('Post');
    expect(post.length).toBe(1);
    expect(post.prop('postData')).toEqual(testPostData);
  });

  it('renders a Comment component for each comment in comments', () => {
    const { showPostComments } = setup({ comments: testComments });

    const renderedComments = showPostComments.find('Comment');

    testComments.forEach((testComment) => {
      const matchingRenderedComment = renderedComments.filterWhere((comment) => (
        comment.prop('commentData').id === testComment.id
      ));
      expect(matchingRenderedComment.prop('commentData')).toEqual(testComment);
    });
  });

  it('renders a Message component when comments is empty', () => {
    const { showPostComments } = setup();

    expect(showPostComments.find('Message').length).toBe(1);
  });
});


describe('mapStateToProps', () => {
  const getTestState = () => ({
    posts: {
      loading: {
        isLoading: false,
        hasErrored: false,
      },
      posts: {},
    },
    comments: {
      loading: false,
      errorOnLoad: false,
      comments: {},
    },
  });

  const getExpectedState = () => ({
    isLoading: false,
    hasErrored: false,
    postData: {},
    comments: [],
  });

  const getTestProps = () => ({ postId: 'testId' });

  it('sets the default expected state', () => {
    const testState = getTestState();
    const expectedState = getExpectedState();

    expect(mapStateToProps(testState, getTestProps())).toEqual(expectedState);
  });

  it('sets the isLoading prop', () => {
    const testState = getTestState();
    const expectedState = getExpectedState();

    testState.posts.loading.isLoading = true;
    expectedState.isLoading = true;
    expect(mapStateToProps(testState, getTestProps())).toEqual(expectedState);

    testState.posts.loading.isLoading = false;
    testState.comments.loading = true;
    expectedState.isLoading = true;
    expect(mapStateToProps(testState, getTestProps())).toEqual(expectedState);

    testState.posts.loading.isLoading = true;
    testState.comments.loading = true;
    expectedState.isLoading = true;
    expect(mapStateToProps(testState, getTestProps())).toEqual(expectedState);
  });

  it('sets the hasErrored prop', () => {
    const testState = getTestState();
    const expectedState = getExpectedState();

    testState.posts.loading.hasErrored = true;
    expectedState.hasErrored = true;
    expect(mapStateToProps(testState, getTestProps())).toEqual(expectedState);

    testState.posts.loading.hasErrored = false;
    testState.comments.errorOnLoad = true;
    expectedState.hasErrored = true;
    expect(mapStateToProps(testState, getTestProps())).toEqual(expectedState);

    testState.posts.loading.hasErrored = true;
    testState.comments.errorOnLoad = true;
    expectedState.hasErrored = true;
    expect(mapStateToProps(testState, getTestProps())).toEqual(expectedState);
  });

  it('sets the postData prop', () => {
    const testState = getTestState();
    const expectedState = getExpectedState();
    const { postId } = getTestProps();

    const testPost = {
      id: postId,
      title: '',
      body: '',
      author: '',
      timestamp: 0,
    };

    testState.posts.posts = { [postId]: testPost };
    expectedState.postData = testPost;

    expect(mapStateToProps(testState, getTestProps())).toEqual(expectedState);
  });

  it('sets the comments prop', () => {
    const testState = getTestState();
    const expectedState = getExpectedState();

    // Normalize comments
    const commentsObj = testComments.reduce((commentsObj, comment) => {
      commentsObj[comment.id] = comment;
      return commentsObj;
    }, {});

    testState.comments.comments = commentsObj;
    expectedState.comments = testComments;

    expect(mapStateToProps(testState, getTestProps())).toEqual(expectedState);
  });
});
