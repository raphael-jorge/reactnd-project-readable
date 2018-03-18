import React from 'react';
import { shallow } from 'enzyme';
import sortBy from 'sort-by';
import {
  setSortOption,
  fetchVoteOnPost,
  fetchRemovePost,
  fetchUpdatePost,
  fetchAddPost,
} from '../../actions/posts';
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

const getDefaultCategories = () => {
  const categoriesArray = [
    { name: 'category1', path: 'categoryPath1' },
    { name: 'category2', path: 'categoryPath2' },
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

const getDefaultState = () => ({
  posts: {
    loading: {
      isLoading: false,
      hasErrored: false,
    },
    posts: {},
    sortOption: null,
  },
  categories: {
    activePath: null,
    categories: {},
  },
});

const getDefaultExpectedProps = () => ({
  isLoading: false,
  hasErrored: false,
  posts: [],
  postsSortOption: null,
  categories: [],
  activeCategoryPath: null,
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
      expect(matchingRenderedPost.prop('onRemove')).toBe(props.onPostRemove);
      expect(matchingRenderedPost.prop('onUpdate')).toBe(props.onPostUpdate);
    });
  });

  it('renders a Menu component when posts are available', () => {
    const testPosts = getDefaultPosts();
    const { showPosts } = setup({ posts: testPosts.postsArray });

    const menu = showPosts.find('Menu');

    expect(menu.length).toBe(1);
  });

  it('provides a method to handle sort option change', () => {
    const testPosts = getDefaultPosts();
    const onSortOptionChange = jest.fn();
    const { showPosts, props } = setup({ posts: testPosts.postsArray, onSortOptionChange });

    showPosts.instance().handleSortOptionChange();

    expect(props.onSortOptionChange).toHaveBeenCalled();
  });

  it('sets the Menu component sort configuration', () => {
    const testPosts = getDefaultPosts();
    const { showPosts, props } = setup({ posts: testPosts.postsArray });

    const menu = showPosts.find('Menu');
    const sortMenu = menu.prop('sortMenu');

    expect(sortMenu.selectedSortOption).toBe(props.postsSortOption);
    expect(sortMenu.onSortOptionChange).toBe(showPosts.instance().handleSortOptionChange);
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
  it('returns the expected isLoading and hasErrored props', () => {
    const testState = getDefaultState();
    const expectedProps = getDefaultExpectedProps();

    expectedProps.isLoading = testState.posts.loading.isLoading;
    expectedProps.hasErrored = testState.posts.loading.hasErrored;

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
    const expectedProps = getDefaultExpectedProps();
    testState.posts.posts = testPosts.postsNormalized;

    expectedProps.isLoading = testState.posts.loading.isLoading;
    expectedProps.hasErrored = testState.posts.loading.hasErrored;
    expectedProps.posts = testPosts.postsArray;

    expect(mapStateToProps(testState)).toEqual(expectedProps);
  });


  it('returns only the matching posts when categories.activePath is set', () => {
    const testPosts = getDefaultPosts();
    const testState = getDefaultState();
    const expectedProps = getDefaultExpectedProps();

    const activeCategoryPath = 'testCategory1';
    testState.categories.activePath = activeCategoryPath;
    testState.posts.posts = testPosts.postsNormalized;

    expectedProps.activeCategoryPath = activeCategoryPath;
    expectedProps.isLoading = testState.posts.loading.isLoading;
    expectedProps.hasErrored = testState.posts.loading.hasErrored;
    expectedProps.posts = testPosts.postsArray.filter((post) => (
      post.category === activeCategoryPath
    ));

    expect(mapStateToProps(testState)).toEqual(expectedProps);
  });

  it('returns the sorted posts when posts.sortOption is set', () => {
    const testPosts = getDefaultPosts();
    const testState = getDefaultState();
    const expectedProps = getDefaultExpectedProps();

    const sortOption = { value: 'id', label: 'test sort label' };
    testState.posts.sortOption = sortOption;
    testState.posts.posts = testPosts.postsNormalized;

    expectedProps.posts = testPosts.postsArray.sort(sortBy(sortOption.value));
    expectedProps.postsSortOption = sortOption;

    const arraySortMethod = jest.spyOn(Array.prototype, 'sort');

    expect(mapStateToProps(testState)).toEqual(expectedProps);
    expect(arraySortMethod).toHaveBeenCalled();
  });

  it('returns the expected categories props', () => {
    const testCategories = getDefaultCategories();
    const testState = getDefaultState();
    const expectedProps = getDefaultExpectedProps();

    testState.categories.categories = testCategories.categoriesNormalized;
    expectedProps.categories = testCategories.categoriesArray;

    expect(mapStateToProps(testState)).toEqual(expectedProps);
  });

  it('returns the expected activeCategoryPath prop', () => {
    const testState = getDefaultState();
    const expectedProps = getDefaultExpectedProps();
    const activeCategoryPath = 'test category';

    testState.categories.activePath = activeCategoryPath;
    expectedProps.activeCategoryPath = activeCategoryPath;

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

  it('sets the onPostRemove prop correctly', () => {
    const mappedProps = mapDispatchToProps(dispatchMock);
    const postData = getDefaultPosts().postsArray[0];

    expect(mappedProps.onPostRemove).toBeDefined();

    mappedProps.onPostRemove(postData);
    expect(fetchRemovePost).toHaveBeenCalledWith(postData);
  });

  it('sets the onPostUpdate prop correctly', () => {
    const mappedProps = mapDispatchToProps(dispatchMock);
    const postData = getDefaultPosts().postsArray[0];
    const updatedPostData = {
      title: 'test updated title',
      body: 'test updated body',
    };

    expect(mappedProps.onPostUpdate).toBeDefined();

    mappedProps.onPostUpdate(postData, updatedPostData);
    expect(fetchUpdatePost).toHaveBeenCalledWith(postData, updatedPostData);
  });

  it('sets the onPostAdd prop correctly', () => {
    const mappedProps = mapDispatchToProps(dispatchMock);
    const postDataToAdd = {
      title: 'test title',
      body: 'test body',
      author: 'test author',
      category: 'test category',
    };

    expect(mappedProps.onPostAdd).toBeDefined();

    mappedProps.onPostAdd(postDataToAdd);
    expect(fetchAddPost).toHaveBeenCalledWith(postDataToAdd);
  });

  it('sets the onSortOptionChange prop correctly', () => {
    const mappedProps = mapDispatchToProps(dispatchMock);
    const sortOption = { value: 'testSortValue', label: 'test sort label' };

    expect(mappedProps.onSortOptionChange).toBeDefined();

    mappedProps.onSortOptionChange(sortOption);
    expect(setSortOption).toHaveBeenCalledWith(sortOption);
  });
});
