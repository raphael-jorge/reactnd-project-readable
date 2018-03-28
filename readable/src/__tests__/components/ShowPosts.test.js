import React from 'react';
import { shallow } from 'enzyme';
import * as postsActions from '../../actions/posts';
import {
  ShowPosts,
  mapStateToProps,
  mapDispatchToProps,
} from '../../components/ShowPosts';

// Mock posts actions
jest.mock('../../actions/posts', () => ({
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
    posts: [],
    categories: [],
    onPostVote: () => {},
    onPostRemove: () => {},
    onPostUpdate: () => {},
    onPostAdd: () => {},
    isLoading: undefined,
    hasErrored: undefined,
    activeCategoryPath: undefined,
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

const getDefaultOption = () => ({
  value: 'optionValue',
  label: 'Option Label',
});


// Tests
describe('<ShowPosts />', () => {
  it('renders a Navbar component', () => {
    const { showPosts } = setup();

    expect(showPosts.find('Navbar').length).toBe(1);
  });


  it('renders a loading icon placeholder', () => {
    const { showPosts } = setup();

    const placeholder = showPosts.find('Placeholder');

    expect(placeholder.length).toBe(1);
    expect(placeholder.prop('fallback')).toBe(showPosts.instance().LOADING_ICON_COMPONENT);
  });


  it('renders a Menu component when posts are available', () => {
    const posts = global.testUtils.getDefaultPostsArray();
    const { showPosts } = setup({ posts });

    expect(showPosts.find('Menu').length).toBe(1);
  });


  it('renders a button to reset the posts filter options once they are set', () => {
    const posts = global.testUtils.getDefaultPostsArray();
    const { showPosts } = setup({ posts });

    showPosts.setState({
      selectedSearchOption: getDefaultOption(),
      searchQuery: 'search query value',
    });

    const button = showPosts.find('.status-group .btn');

    expect(button.length).toBe(1);
    expect(button.prop('onClick')).toBe(showPosts.instance().clearSearchQuery);
  });


  it('renders a ModalAddPost component', () => {
    const { showPosts } = setup();

    expect(showPosts.find('ModalAddPost').length).toBe(1);
  });


  it('renders a button to open the add post modal', () => {
    const { showPosts } = setup();

    const button = showPosts.find('.btn-fixed');

    expect(button.length).toBe(1);
    expect(button.prop('onClick')).toBe(showPosts.instance().openModalAddPost);
  });


  describe('posts', () => {
    it('is rendered one Post component on link mode for each post', () => {
      const posts = global.testUtils.getDefaultPostsArray();
      const { showPosts } = setup({ posts });

      const renderedPosts = showPosts.find('Post');

      posts.forEach((post) => {
        const matchingRenderedPost = renderedPosts.filterWhere((renderedPost) => (
          renderedPost.prop('postData').id === post.id
        ));

        expect(matchingRenderedPost.prop('postData')).toEqual(post);
        expect(matchingRenderedPost.prop('linkMode')).toBe(true);
      });
    });

    it('filters displayed posts by searchQuery and selectedSearchOption states', () => {
      const posts = global.testUtils.getDefaultPostsArray();
      const selectedSearchOption = getDefaultOption();

      // Configura a key nos posts
      posts.forEach((post, i) => {
        post[selectedSearchOption.value] = `${i}`;
      });

      const { showPosts } = setup({ posts });

      expect(showPosts.find('Post').length).toBe(posts.length);

      // Configura as configurações de filtro para filtrar os posts
      const searchQuery = '1';
      showPosts.setState({ selectedSearchOption, searchQuery });

      const renderedPost = showPosts.find('Post');

      expect(renderedPost.length).toBe(1);
      expect(renderedPost.prop('postData')[selectedSearchOption.value]).toBe(searchQuery);
    });

    it('sorts displayed posts by selectedSortOption state', () => {
      const nPosts = 3;
      const posts = global.testUtils.getDefaultPostsArray(nPosts);
      const selectedSortOption = getDefaultOption();

      // Configura a key nos posts
      posts.forEach((post, i) => {
        post[selectedSortOption.value] = nPosts - i;
      });

      const { showPosts } = setup({ posts });
      showPosts.setState({ selectedSortOption });

      const renderedPosts = showPosts.find('Post');

      renderedPosts.forEach((renderedPost, i) => {
        expect(renderedPost.prop('postData')[selectedSortOption.value]).toBe(i + 1);
      });
    });
  });


  describe('messages', () => {
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

    it('renders a Message component when posts is empty', () => {
      const { showPosts } = setup();

      const renderedMessage = showPosts.find('Message');
      const renderedPost = showPosts.find('Post');

      const expectedMessageContent = showPosts.instance().MESSAGE_NO_POSTS;

      expect(renderedPost.length).toBe(0);
      expect(renderedMessage.length).toBe(1);
      expect(renderedMessage.prop('msg')).toBe(expectedMessageContent);
    });
  });


  describe('page not found', () => {
    it('is rendered when activeCategoryPath is not found in categories', () => {
      const categories = global.testUtils.getDefaultCategoriesArray();
      const activeCategoryPath = 'noMatchCategoryPath';
      const { showPosts } = setup({ categories, activeCategoryPath });

      expect(showPosts.find('NotFound').length).toBe(1);
    });

    it('is not rendered when activeCategoryPath is found in categories', () => {
      const categories = global.testUtils.getDefaultCategoriesArray();
      const activeCategoryPath = categories[0].path;
      const { showPosts } = setup({ categories, activeCategoryPath });

      expect(showPosts.find('NotFound').length).toBe(0);
    });

    it('is not rendered when activeCategoryPath is not set', () => {
      const categories = global.testUtils.getDefaultCategoriesArray();
      const { showPosts } = setup({ categories });

      expect(showPosts.find('NotFound').length).toBe(0);
    });
  });


  describe('methods', () => {
    it('provides a method to handle the sort option change', () => {
      const { showPosts } = setup();

      const selectedSortOption = getDefaultOption();
      showPosts.instance().handleSortOptionChange(selectedSortOption);

      expect(showPosts.state('selectedSortOption')).toEqual(selectedSortOption);
    });

    it('provides a method to handle the search option change', () => {
      const { showPosts } = setup();

      const selectedSearchOption = getDefaultOption();
      showPosts.instance().handleSearchOptionChange(selectedSearchOption);

      expect(showPosts.state('selectedSearchOption')).toEqual(selectedSearchOption);
    });

    it('provides a method to handle the search query change', () => {
      const { showPosts } = setup();

      const searchQueryValue = 'new search query';
      const changeQueryEvent = global.testUtils.getDefaultEvent({
        targetValue: searchQueryValue,
      });
      showPosts.instance().handleSearchQueryChange(changeQueryEvent);

      expect(showPosts.state('searchQuery')).toBe(searchQueryValue);
    });

    it('provides a method to reset the search qeuery value', () => {
      const { showPosts } = setup();

      showPosts.setState({ searchQuery: 'search query value' });
      showPosts.instance().clearSearchQuery();

      expect(showPosts.state('searchQuery')).toBe('');
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
  });


  describe('lifecycle events', () => {
    it('resets the searchQuery state once the activeCategoryPath value changes', () => {
      const { showPosts } = setup();
      showPosts.setState({ searchQuery: 'search query value' });

      const activeCategoryPath = 'newCategoryPath';
      showPosts.setProps({ activeCategoryPath });

      expect(showPosts.state('searchQuery')).toBe('');
    });


    it('keeps the searchQuery state value if the activecategoryPath value is the same', () => {
      const { showPosts } = setup();
      const searchQuery = 'some query value';
      showPosts.setState({ searchQuery });

      showPosts.setProps({ onPostVote: () => {} });

      expect(showPosts.state('searchQuery')).toBe(searchQuery);
    });
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


  it('returns the expected categories props', () => {
    const categories = global.testUtils.getDefaultCategoriesArray();
    const state = global.testUtils.getDefaultReduxState();
    const ownProps = getDefaultOwnProps();

    state.categories.categories = global.testUtils
      .convertArrayToNormalizedObject(categories, 'path');
    const mappedProps = mapStateToProps(state, ownProps);

    expect(mappedProps.categories).toEqual(categories);
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
});
