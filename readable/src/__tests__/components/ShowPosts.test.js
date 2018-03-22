import React from 'react';
import { shallow } from 'enzyme';
import sortBy from 'sort-by';
import * as postsActions from '../../actions/posts';
import {
  ShowPosts,
  mapStateToProps,
  mapDispatchToProps,
} from '../../components/ShowPosts';

// Mock posts actions
jest.mock('../../actions/posts', () => ({
  setSortOption: jest.fn(),
  fetchVoteOnPost: jest.fn(),
  fetchRemovePost: jest.fn(),
  fetchUpdatePost: jest.fn(),
  fetchAddPost: jest.fn(),
}));

// Mock dispatch
const dispatchMock = () => {};

// Utils
const setup = (propOverrides) => {
  const props = Object.assign({
    categories: [],
    activeCategoryPath: undefined,
    posts: [],
    postsSortOption: undefined,
    onSortOptionChange: () => {},
    onPostVote: () => {},
    onPostRemove: () => {},
    onPostUpdate: () => {},
    onPostAdd: () => {},
    isLoading: undefined,
    hasErrored: undefined,
  }, propOverrides);

  const showPosts= shallow(<ShowPosts {...props} />);

  return {
    props,
    showPosts,
  };
};

const getDefaultOwnProps = () => ({
  activeCategoryPath: undefined,
});


// Tests
describe('<ShowPosts />', () => {
  it('renders a Header component', () => {
    const { showPosts } = setup();

    expect(showPosts.find('Header').length).toBe(1);
  });


  it('renders a NotFound component if activeCategoryPath is not found in categories', () => {
    const categories = global.testUtils.getDefaultCategoriesArray();
    const activeCategoryPath = 'noMatchCategoryPath';
    const { showPosts } = setup({ categories, activeCategoryPath });

    expect(showPosts.find('NotFound').length).toBe(1);
  });


  it('does not render a NotFound component if activeCategoryPath is found in categories', () => {
    const categories = global.testUtils.getDefaultCategoriesArray();
    const activeCategoryPath = categories[0].path;
    const { showPosts } = setup({ categories, activeCategoryPath });

    expect(showPosts.find('NotFound').length).toBe(0);
  });


  it('does not render a NotFound component if activeCategoryPath is not set', () => {
    const categories = global.testUtils.getDefaultCategoriesArray();
    const { showPosts } = setup({ categories });

    expect(showPosts.find('NotFound').length).toBe(0);
  });


  it('renders a Message component when an error occurs on load', () => {
    const hasErrored = true;
    const { showPosts } = setup({ hasErrored });

    const renderedMessage = showPosts.find('Message');
    const renderedPost = showPosts.find('Post');

    const expectedMessageContent = showPosts.instance().MESSAGE_LOAD_ERROR;

    expect(renderedPost.length).toBe(0);
    expect(renderedMessage.length).toBe(1);
    expect(renderedMessage.prop('msg')).toBe(expectedMessageContent);
  });


  it('renders one Post component for each post in posts', () => {
    const posts = global.testUtils.getDefaultPostsArray();
    const { showPosts } = setup({ posts });

    const renderedPosts = showPosts.find('Post');

    posts.forEach((testPost) => {
      const matchingRenderedPost = renderedPosts.filterWhere((post) => (
        post.prop('postData').id === testPost.id
      ));

      expect(matchingRenderedPost.prop('postData')).toEqual(testPost);
    });
  });

  it('renders a Menu component when posts are available', () => {
    const posts = global.testUtils.getDefaultPostsArray();
    const { showPosts } = setup({ posts });

    expect(showPosts.find('Menu').length).toBe(1);
  });

  it('provides a method to handle sort option change', () => {
    const posts = global.testUtils.getDefaultPostsArray();
    const onSortOptionChange = jest.fn();
    const { showPosts, props } = setup({ posts, onSortOptionChange });

    showPosts.instance().handleSortOptionChange();

    expect(props.onSortOptionChange).toHaveBeenCalled();
  });

  it('sets the Menu component sort configuration', () => {
    const posts = global.testUtils.getDefaultPostsArray();
    const { showPosts, props } = setup({ posts });

    const menu = showPosts.find('Menu');
    const sortMenu = menu.prop('sortMenu');

    expect(sortMenu.selectedSortOption).toBe(props.postsSortOption);
    expect(sortMenu.onSortOptionChange).toBe(showPosts.instance().handleSortOptionChange);
  });

  it('renders a Message component when posts is empty', () => {
    const { showPosts } = setup();

    const renderedMessage = showPosts.find('Message');
    const renderedPost = showPosts.find('Post');

    const expectedMessageContent = showPosts.instance().MESSAGE_NO_POSTS;

    expect(renderedPost.length).toBe(0);
    expect(renderedMessage.length).toBe(1);
    expect(renderedMessage.prop('msg')).toBe(expectedMessageContent);
  });


  it('renders a ModalAddPost component', () => {
    const { showPosts } = setup();

    expect(showPosts.find('ModalAddPost').length).toBe(1);
  });


  it('provides a method to open the add post modal', () => {
    const { showPosts } = setup();

    showPosts.setState({ isModalAddPostOpen: false });
    showPosts.instance().openModalAddPost();

    expect(showPosts.state('isModalAddPostOpen')).toBe(true);
  });


  it('provides a method to close the add post modal', () => {
    const { showPosts } = setup();

    showPosts.setState({ isModalAddPostOpen: true });
    showPosts.instance().closeModalAddPost();

    expect(showPosts.state('isModalAddPostOpen')).toBe(false);
  });


  it('renders a button to open the add post modal', () => {
    const { showPosts } = setup();

    const button = showPosts.find('.btn-fixed');

    expect(button.length).toBe(1);
    expect(button.prop('onClick')).toBe(showPosts.instance().openModalAddPost);
  });
});


describe('mapStateToProps', () => {
  it('sets isLoading prop to false when categories and posts are not being loaded', () => {
    const state = global.testUtils.getDefaultReduxState();
    const ownProps = getDefaultOwnProps();

    const mappedProps = mapStateToProps(state, ownProps);

    expect(mappedProps.isLoading).toBe(false);
  });


  it('sets isLoading prop to true when posts are loading', () => {
    const state = global.testUtils.getDefaultReduxState();
    const ownProps = getDefaultOwnProps();

    const isLoadingPosts = true;
    state.posts.loading.isLoading = isLoadingPosts;
    const mappedProps = mapStateToProps(state, ownProps);

    expect(mappedProps.isLoading).toBe(isLoadingPosts);
  });


  it('sets isLoading prop to true when categories are loading', () => {
    const state = global.testUtils.getDefaultReduxState();
    const ownProps = getDefaultOwnProps();

    const isLoadingCategories = true;
    state.categories.loading.isLoading = isLoadingCategories;
    const mappedProps = mapStateToProps(state, ownProps);

    expect(mappedProps.isLoading).toBe(isLoadingCategories);
  });


  it('sets hasErrored prop to false when categories and posts load has not errored', () => {
    const state = global.testUtils.getDefaultReduxState();
    const ownProps = getDefaultOwnProps();

    const mappedProps = mapStateToProps(state, ownProps);

    expect(mappedProps.hasErrored).toBe(false);
  });


  it('sets hasErrored prop to true when posts load has errored', () => {
    const state = global.testUtils.getDefaultReduxState();
    const ownProps = getDefaultOwnProps();

    const hasErroredPosts = true;
    state.posts.loading.hasErrored = hasErroredPosts;
    const mappedProps = mapStateToProps(state, ownProps);

    expect(mappedProps.hasErrored).toBe(hasErroredPosts);
  });


  it('sets hasErrored prop to true when categories load has errored', () => {
    const state = global.testUtils.getDefaultReduxState();
    const ownProps = getDefaultOwnProps();

    const hasErroredCategories = true;
    state.categories.loading.hasErrored = hasErroredCategories;
    const mappedProps = mapStateToProps(state, ownProps);

    expect(mappedProps.hasErrored).toBe(hasErroredCategories);
  });


  it('sets posts prop to all posts when ownProps.activeCategoryPath is not set', () => {
    const posts = global.testUtils.getDefaultPostsArray();
    const state = global.testUtils.getDefaultReduxState();
    const ownProps = getDefaultOwnProps();

    state.posts.posts = global.testUtils.convertArrayToNormalizedObject(posts, 'id');
    const mappedProps = mapStateToProps(state, ownProps);

    expect(mappedProps.posts).toEqual(posts);
  });


  it('sets posts prop to matching posts when ownProps.activeCategoryPath is set', () => {
    const posts = global.testUtils.getDefaultPostsArray();
    const state = global.testUtils.getDefaultReduxState();
    const ownProps = getDefaultOwnProps();
    const activeCategoryPath = posts[0].category;

    ownProps.activeCategoryPath = activeCategoryPath;
    state.posts.posts = global.testUtils.convertArrayToNormalizedObject(posts, 'id');
    const mappedProps = mapStateToProps(state, ownProps);

    const expectedPosts = posts.filter((post) => post.category === activeCategoryPath);

    expect(mappedProps.posts).toEqual(expectedPosts);
  });


  it('sets posts prop to the sorted posts when posts.sortOption is set', () => {
    const posts = global.testUtils.getDefaultPostsArray();
    const state = global.testUtils.getDefaultReduxState();
    const ownProps = getDefaultOwnProps();
    const sortOption = { value: 'id', label: 'test sort label' };

    state.posts.sortOption = sortOption;
    state.posts.posts = global.testUtils.convertArrayToNormalizedObject(posts, 'id');
    const mappedProps = mapStateToProps(state, ownProps);

    const expectedPosts = posts.sort(sortBy(sortOption.value));

    expect(mappedProps.posts).toEqual(expectedPosts);
  });


  it('returns the expected categories props', () => {
    const categories = global.testUtils.getDefaultCategoriesArray();
    const state = global.testUtils.getDefaultReduxState();
    const ownProps = getDefaultOwnProps();

    state.categories.categories = global.testUtils
      .convertArrayToNormalizedObject(categories, 'path');
    const mappedProps = mapStateToProps(state, ownProps);

    expect(mappedProps.categories).toEqual(categories);
  });


  it('returns the expected activeCategoryPath prop', () => {
    const state = global.testUtils.getDefaultReduxState();
    const ownProps = getDefaultOwnProps();
    const activeCategoryPath = 'testCategoryPath';

    ownProps.activeCategoryPath = activeCategoryPath;
    const mappedProps = mapStateToProps(state, ownProps);

    expect(mappedProps.activeCategoryPath).toBe(activeCategoryPath);
  });
});


describe('mapDispatchToProps', () => {
  it('sets the onPostVote prop to dispatch the fetchVoteOnPost action', () => {
    const mappedProps = mapDispatchToProps(dispatchMock);
    const postData = global.testUtils.getDefaultPostData();
    const vote = 1;

    expect(mappedProps.onPostVote).toBeDefined();

    mappedProps.onPostVote(postData, vote);
    expect(postsActions.fetchVoteOnPost).toHaveBeenCalledWith(postData, vote);
  });

  it('sets the onPostRemove prop to dispatch the fetchRemovePost action', () => {
    const mappedProps = mapDispatchToProps(dispatchMock);
    const postData = global.testUtils.getDefaultPostData();

    expect(mappedProps.onPostRemove).toBeDefined();

    mappedProps.onPostRemove(postData);
    expect(postsActions.fetchRemovePost).toHaveBeenCalledWith(postData);
  });

  it('sets the onPostUpdate prop to dispatch the fetchUpdatePost action', () => {
    const mappedProps = mapDispatchToProps(dispatchMock);
    const postData = global.testUtils.getDefaultPostData();
    const updatedPostData = {
      title: 'test updated title',
      body: 'test updated body',
    };

    expect(mappedProps.onPostUpdate).toBeDefined();

    mappedProps.onPostUpdate(postData, updatedPostData);
    expect(postsActions.fetchUpdatePost).toHaveBeenCalledWith(postData, updatedPostData);
  });

  it('sets the onPostAdd prop to dispatch the fetchAddPost action', () => {
    const mappedProps = mapDispatchToProps(dispatchMock);
    const postDataToAdd = {
      title: 'test title',
      body: 'test body',
      author: 'test author',
      category: 'test category',
    };

    expect(mappedProps.onPostAdd).toBeDefined();

    mappedProps.onPostAdd(postDataToAdd);
    expect(postsActions.fetchAddPost).toHaveBeenCalledWith(postDataToAdd);
  });

  it('sets the onSortOptionChange prop to dispatch the setSortOption action', () => {
    const mappedProps = mapDispatchToProps(dispatchMock);
    const sortOption = { value: 'testSortValue', label: 'test sort label' };

    expect(mappedProps.onSortOptionChange).toBeDefined();

    mappedProps.onSortOptionChange(sortOption);
    expect(postsActions.setSortOption).toHaveBeenCalledWith(sortOption);
  });
});
