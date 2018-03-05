import React from 'react';
import { shallow } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import {
  ShowPosts,
  mapStateToProps,
} from '../../components/ShowPosts';

const setup = (propOverrides) => {
  const props = Object.assign({
    posts: [],
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

const testPosts = [
  { id: 'testId1', title: '', body: '', author: '', timestamp: 0, category: 'testCategory' },
  { id: 'testId2', title: '', body: '', author: '', timestamp: 0, category: 'testCategory' },
];


describe('<ShowPosts />', () => {
  it('renders without crashing', () => {
    const { showPosts } = setup();
    expect(showPosts.find('.show-posts').length).toBe(1);
  });

  it('renders a Message component when an error occurs on load', () => {
    let hasErrored = true;
    const { showPosts } = setup({ hasErrored });

    expect(showPosts.find('Message').length).toBe(1);

    hasErrored = false;
    showPosts.setProps({ hasErrored, posts: testPosts });

    expect(showPosts.find('Message').length).toBe(0);
  });

  it('renders one Post component for each post in posts', () => {
    const { showPosts } = setup({ posts: testPosts });

    const renderedPosts = showPosts.find('Post');

    testPosts.forEach((testPost) => {
      const matchingRenderedPost = renderedPosts.filterWhere((post) => (
        post.prop('postData').id === testPost.id
      ));
      expect(matchingRenderedPost.prop('postData')).toEqual(testPost);
    });
  });

  it('renders a Link component wrapping each Post component', () => {
    const { showPosts } = setup({ posts: testPosts });

    const renderedPosts = showPosts.find('Post');

    testPosts.forEach((testPost) => {
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
    expect(showPosts.find('Message').length).toBe(1);
  });
});


describe('mapStateToProps', () => {
  it('returns the expected props', () => {
    const testPostsState = {
      loading: {
        id: 'testId',
        isLoading: true,
        hasErrored: true,
      },
      posts: {
        testId1: { id: 'testId1' },
        testId2: { id: 'testId2' },
      },
    };
    const testProps = {};

    const expectedProps = {
      isLoading: testPostsState.loading.isLoading,
      hasErrored: testPostsState.loading.hasErrored,
      posts: [{ id: 'testId1' }, { id: 'testId2' }],
    };

    expect(mapStateToProps({ posts: testPostsState }, testProps)).toEqual(expectedProps);
  });
});
