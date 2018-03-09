import React from 'react';
import { shallow } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import { fetchVoteOnPost } from '../../actions/posts';
import {
  ShowPosts,
  mapStateToProps,
  mapDispatchToProps,
} from '../../components/ShowPosts';

// Mock posts actions
jest.mock('../../actions/posts', () => ({
  fetchVoteOnPost: jest.fn(),
}));

// Mock dispatch
const dispatchMock = () => {};

// Utils
const setup = (propOverrides) => {
  const props = Object.assign({
    posts: [],
    onPostVote: () => {},
    isLoading: undefined,
    hasErrored: undefined,
  }, propOverrides);

  const showPosts= shallow(
    <MemoryRouter>
      <ShowPosts {...props} />
    </MemoryRouter>
  ).find(ShowPosts).dive();

  return {
    props,
    showPosts,
  };
};

const getDefaultPosts = () => {
  const postsArray = [
    { id: 'testId1', title: '', body: '', author: '', timestamp: 0, category: 'testCategory1' },
    { id: 'testId2', title: '', body: '', author: '', timestamp: 0, category: 'testCategory2' },
  ];

  const postsNormalized = postsArray.reduce((postsObj, post) => {
    postsObj[post.id] = post;
    return postsObj;
  }, {});

  return {
    postsArray,
    postsNormalized,
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
  categories: {
    activePath: null,
  },
});


// Tests
describe('<ShowPosts />', () => {
  it('renders without crashing', () => {
    const { showPosts } = setup();
    expect(showPosts.find('.show-posts').length).toBe(1);
  });


  it('renders a Message component when an error occurs on load', () => {
    const hasErrored = true;
    const { showPosts } = setup({ hasErrored });

    const renderedMessage = showPosts.find('Message');
    const renderedPost = showPosts.find('Post');

    const expectedMessage = showPosts.instance().MESSAGE_LOAD_ERROR;

    expect(renderedPost.length).toBe(0);
    expect(renderedMessage.length).toBe(1);
    expect(renderedMessage.prop('msg')).toBe(expectedMessage);
  });


  it('renders one Post component for each post in posts', () => {
    const testPosts = getDefaultPosts();
    const { showPosts, props } = setup({ posts: testPosts.postsArray });

    const renderedPosts = showPosts.find('Post');

    testPosts.postsArray.forEach((testPost) => {
      const matchingRenderedPost = renderedPosts.filterWhere((post) => (
        post.prop('postData').id === testPost.id
      ));
      expect(matchingRenderedPost.prop('postData')).toEqual(testPost);
      expect(matchingRenderedPost.prop('onVote')).toBe(props.onPostVote);
    });
  });


  it('renders a Link component wrapping each Post component', () => {
    const testPosts = getDefaultPosts();
    const { showPosts } = setup({ posts: testPosts.postsArray });

    const renderedPosts = showPosts.find('Post');

    testPosts.postsArray.forEach((testPost) => {
      const matchingRenderedPost = renderedPosts.filterWhere((post) => (
        post.prop('postData').id === testPost.id
      ));

      const wrappingLink = matchingRenderedPost.parent().find('Link');
      expect(wrappingLink.length).toBe(1);
      expect(wrappingLink.prop('to')).toBe(`/${testPost.category}/${testPost.id}`);
    });
  });


  it('renders a Message component when posts is empty', () => {
    const { showPosts } = setup();

    const renderedMessage = showPosts.find('Message');
    const renderedPost = showPosts.find('Post');

    const expectedMessage = showPosts.instance().MESSAGE_NO_POSTS;

    expect(renderedPost.length).toBe(0);
    expect(renderedMessage.length).toBe(1);
    expect(renderedMessage.prop('msg')).toBe(expectedMessage);
  });
});


describe('mapStateToProps', () => {
  it('returns the expected isLoading and hasErrored props', () => {
    const testState = getDefaultState();

    const expectedProps = {
      isLoading: testState.posts.loading.isLoading,
      hasErrored: testState.posts.loading.hasErrored,
      posts: [],
    };

    expect(mapStateToProps(testState)).toEqual(expectedProps);

    testState.posts.loading.isLoading = true;
    testState.posts.loading.hasErrored = true;

    expectedProps.isLoading = testState.posts.loading.isLoading;
    expectedProps.hasErrored = testState.posts.loading.hasErrored;

    expect(mapStateToProps(testState)).toEqual(expectedProps);
  });


  it('returns all posts when categories.activePath is not set', () => {
    const testPosts = getDefaultPosts();
    const testState = getDefaultState();
    testState.posts.posts = testPosts.postsNormalized;

    const expectedProps = {
      isLoading: testState.posts.loading.isLoading,
      hasErrored: testState.posts.loading.hasErrored,
      posts: testPosts.postsArray,
    };

    expect(mapStateToProps(testState)).toEqual(expectedProps);
  });


  it('returns only the matching posts when categories.activePath is set', () => {
    const testPosts = getDefaultPosts();
    const testState = getDefaultState();

    const activeCategoryPath = 'testCategory1';
    testState.categories.activePath = activeCategoryPath;
    testState.posts.posts = testPosts.postsNormalized;

    const expectedProps = {
      isLoading: testState.posts.loading.isLoading,
      hasErrored: testState.posts.loading.hasErrored,
      posts: testPosts.postsArray.filter((post) => (
        post.category === activeCategoryPath
      )),
    };

    expect(mapStateToProps(testState)).toEqual(expectedProps);
  });
});


describe('mapDispatchToProps', () => {
  it('sets the onPostVote prop correctly', () => {
    const mappedProps = mapDispatchToProps(dispatchMock);
    const postData = getDefaultPosts().postsArray[0];
    const vote = 1;

    expect(mappedProps.onPostVote).toBeDefined();

    mappedProps.onPostVote(postData, vote);
    expect(fetchVoteOnPost).toHaveBeenCalledWith(postData, vote);
  });
});
