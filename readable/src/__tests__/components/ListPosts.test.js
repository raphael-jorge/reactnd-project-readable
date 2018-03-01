import React from 'react';
import { shallow } from 'enzyme';
import ListPosts from '../../components/ListPosts';

const setup = (propOverrides) => {
  const props = Object.assign({
    posts: [],
    isLoading: undefined,
    hasErrored: undefined,
    loadErrorMsg: undefined,
    noPostsMsg: undefined,
  }, propOverrides);

  const listPosts = shallow(<ListPosts {...props} />);

  return {
    props,
    listPosts,
  };
};


describe('<ListPosts />', () => {
  it('renders without crashing', () => {
    const { listPosts } = setup();
    expect(listPosts.find('.posts-list').length).toBe(1);
  });

  it('renders a Post component for each post', () => {
    const testPosts = [
      { id: 'testId1' },
      { id: 'testId2' },
      { id: 'testId3' },
    ];
    const { listPosts } = setup({ posts: testPosts });
    expect(listPosts.find('Post').length).toBe(testPosts.length);
  });

  it('renders a loading icon when isLoading is true', () => {
    let isLoading = false;
    const { listPosts } = setup({ isLoading });
    expect(listPosts.find('.loading-squares').length).toBe(0);

    isLoading = true;
    listPosts.setProps({ isLoading });
    expect(listPosts.find('.loading-squares').length).toBe(1);
  });

  describe('load error message', () => {
    const hasErrored = true;
    const loadErrorMsg = 'test load error message';

    it('is rendered when loadErrorMsg is set and hasErrored is true', () => {
      const { listPosts } = setup({ hasErrored, loadErrorMsg });
      expect(listPosts.find('.status-msg').length).toBe(1);
      expect(listPosts.find('.status-msg').text()).toBe(loadErrorMsg);
    });

    it('is not rendered when isLoading is true', () => {
      const isLoading = true;
      const { listPosts } = setup({ hasErrored, loadErrorMsg, isLoading });
      expect(listPosts.find('.status-msg').length).toBe(0);
    });
  });

  describe('no posts message', () => {
    const noPostsMsg = 'test no posts message';

    it('is rendered when noPostsMsg is set and posts is empty', () => {
      const { listPosts } = setup({ noPostsMsg });
      expect(listPosts.find('.status-msg').length).toBe(1);
      expect(listPosts.find('.status-msg').text()).toBe(noPostsMsg);
    });

    it('is not rendered when posts is not empty', () => {
      const testPosts = [{ id: 'testPost' }];
      const { listPosts } = setup({ noPostsMsg, posts: testPosts });
      expect(listPosts.find('.status-msg').length).toBe(0);
    });

    it('is not rendered when isLoading is true', () => {
      const isLoading = true;
      const { listPosts } = setup({ noPostsMsg, isLoading });
      expect(listPosts.find('.status-msg').length).toBe(0);
    });

    it('is not rendered when hasErrored is true', () => {
      const hasErrored = true;
      const { listPosts } = setup({ noPostsMsg, hasErrored });
      expect(listPosts.find('.status-msg').length).toBe(0);
    });
  });
});
