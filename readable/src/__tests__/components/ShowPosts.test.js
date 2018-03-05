import React from 'react';
import { shallow } from 'enzyme';
import Post from '../../components/Post';
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

  it('renders a ListData component with Post components', () => {
    const testProps = {
      posts: [{ id: 'testId' }],
      isLoading: false,
      hasErrored: false,
    };
    const { showPosts, props } = setup(testProps);
    const listData = showPosts.find('ListData');

    expect(listData.length).toBe(1);
    expect(listData.prop('ComponentToList')).toBe(Post);
    expect(listData.prop('componentProps').dataArr).toBe(testProps.posts);
    expect(listData.prop('componentProps').dataPropName).toBe('postData');
    expect(listData.prop('isLoading')).toBe(props.isLoading);
    expect(listData.prop('hasErrored')).toBe(props.hasErrored);
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
