import React from 'react';
import { shallow } from 'enzyme';
import Post from '../../components/Post';

// Utils
const setup = (propOverrides) => {
  const props = Object.assign({
    postData: getDefaultPostData(),
    maxBodyLength: undefined,
  }, propOverrides);

  const post = shallow(<Post {...props} />);

  return {
    props,
    post,
  };
};

const getDefaultPostData = () => ({
  id: 'testId',
  category: 'testCategory',
  timestamp: Date.now(),
  title: '',
  author: '',
  body: '',
  voteScore: 0,
  commentCount: 0,
});


// Tests
describe('<Post />', () => {
  it('renders without crashing', () => {
    const { post } = setup();
    expect(post.find('.post').length).toBe(1);
    expect(post.find('.post-control').length).toBe(1);
    expect(post.find('.post-info').length).toBe(1);
    expect(post.find('.post-title').length).toBe(1);
    expect(post.find('.post-body').length).toBe(1);
    expect(post.find('.post-comments-info').length).toBe(1);
  });


  it('renders a Controls component', () => {
    const { post } = setup();
    expect(post.find('Controls').length).toBe(1);
  });


  it('crops the body length if the maxBodyLength prop is set', () => {
    const stringFiller = '-';
    const continueMark = '...';
    const testBodyLength = 100;
    const testBody = Array(testBodyLength + 1).join(stringFiller);
    const postData = getDefaultPostData();

    // Limite maior que o body length
    let maxBodyLength = 150;
    postData.body = testBody;
    const { post } = setup({ postData, maxBodyLength });
    let expectedRenderedBody = testBody;

    expect(post.find('.post-body').text()).toBe(expectedRenderedBody);

    // Limite menor que o body length
    maxBodyLength = 50;
    post.setProps({ maxBodyLength });
    expectedRenderedBody = Array(maxBodyLength - continueMark.length + 1)
      .join(stringFiller) + continueMark;

    expect(post.find('.post-body').text()).toBe(expectedRenderedBody);
  });
});
