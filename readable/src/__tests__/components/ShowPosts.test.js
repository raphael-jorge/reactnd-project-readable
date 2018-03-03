import React from 'react';
import { shallow } from 'enzyme';
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

  const showPosts = shallow(<ShowPosts {...props} />);

  return {
    props,
    showPosts,
  };
};


describe('<ShowPosts />', () => {
  it('renders without crashing', () => {
    const { showPosts } = setup();
    expect(showPosts.find('.show-posts').length).toBe(1);
  });

  it('renders a ListPosts component', () => {
    const testProps = {
      posts: [{ id: 'testId' }],
      isLoading: false,
      hasErrored: false,
    };
    const { showPosts, props } = setup(testProps);
    const listPosts = showPosts.find('ListPosts');

    expect(listPosts.length).toBe(1);
    expect(listPosts.prop('posts')).toBe(props.posts);
    expect(listPosts.prop('isLoading')).toBe(props.isLoading);
    expect(listPosts.prop('hasErrored')).toBe(props.hasErrored);
  });
});


describe('mapStateToProps', () => {
  it('returns the expected props', () => {
    const testPostsState = {
      loading: true,
      errorOnLoad: true,
      posts: {
        testId1: { id: 'testId1' },
        testId2: { id: 'testId2' },
      },
    };
    const testProps = {};

    const expectedProps = {
      isLoading: testPostsState.loading,
      hasErrored: testPostsState.errorOnLoad,
      posts: [{ id: 'testId1' }, { id: 'testId2' }],
    };

    expect(mapStateToProps({ posts: testPostsState }, testProps)).toEqual(expectedProps);
  });
});
