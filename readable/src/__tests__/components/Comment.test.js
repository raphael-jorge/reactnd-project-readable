import React from 'react';
import { shallow } from 'enzyme';
import Comment from '../../components/Comment';

// Utils
const setup = (propOverrides) => {
  const props = Object.assign({
    commentData: {
      id: 'testId',
      timestamp: Date.now(),
      author: '',
      body: '',
    },
  }, propOverrides);

  const comment = shallow(<Comment {...props} />);

  return {
    props,
    comment,
  };
};


// Tests
describe('<Comment />', () => {
  it('renders without crashing', () => {
    const { comment } = setup();

    expect(comment.find('.comment').length).toBe(1);
    expect(comment.find('.comment-info').length).toBe(1);
    expect(comment.find('.comment-body').length).toBe(1);
  });
});
