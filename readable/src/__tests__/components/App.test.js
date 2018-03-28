import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import App from '../../components/App';

// Utils
const setup = (route) => {
  // Mock redux store
  const middlewares = [thunk];
  const mockStore = configureMockStore(middlewares);
  const store = mockStore(global.testUtils.getDefaultReduxState());

  const mountedApp = mount(
    <Provider store={store}>
      <MemoryRouter initialEntries={[route]} initialIndex={0}>
        <App />
      </MemoryRouter>
    </Provider>
  );

  const showPosts = mountedApp.find('ShowPosts');
  const showPostComments = mountedApp.find('ShowPostComments');
  const notFound = mountedApp.find('NotFound');

  return {
    showPosts,
    showPostComments,
    notFound,
  };
};


// Tests
describe('<App />', () => {
  it('renders a ShowPosts component at the home route', () => {
    const { showPosts } = setup('/');

    expect(showPosts.length).toBe(1);
    expect(showPosts.prop('activeCategoryPath')).not.toBeDefined();
  });


  it('renders a ShowPosts component at the category route', () => {
    const category = 'category';
    const { showPosts } = setup(`/${category}`);

    expect(showPosts.length).toBe(1);
    expect(showPosts.prop('activeCategoryPath')).toBe(category);
  });


  it('renders a ShowPostComments component at the post route', () => {
    const postId = 'postId';
    const { showPostComments } = setup(`/category/${postId}`);

    expect(showPostComments.length).toBe(1);
    expect(showPostComments.prop('postId')).toBe(postId);
  });


  it('renders a NotFound component at no matching routes', () => {
    const { notFound } = setup('/category/post/noMatch');

    expect(notFound.length).toBe(1);
  });
});
