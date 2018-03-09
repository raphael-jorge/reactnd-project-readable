import React from 'react';
import { shallow } from 'enzyme';
import Comment from '../../components/Comment';

// Utils
const setup = (propOverrides) => {
  const props = Object.assign({
    commentData: getDefaultCommentData(),
    onVote: jest.fn(),
    onRemove: jest.fn(),
  }, propOverrides);

  const comment = shallow(<Comment {...props} />);

  return {
    props,
    comment,
  };
};

const getDefaultCommentData = () => ({
  id: 'testId',
  timestamp: Date.now(),
  author: '',
  body: '',
  voteScore: 0,
});

afterEach(() => {
  jest.clearAllMocks();
});


// Tests
describe('<Comment />', () => {
  it('renders without crashing', () => {
    const { comment } = setup();

    expect(comment.find('.comment').length).toBe(1);
    expect(comment.find('.comment-control').length).toBe(1);
    expect(comment.find('.comment-info').length).toBe(1);
    expect(comment.find('.comment-body').length).toBe(1);
  });


  it('renders a Controls component', () => {
    const { comment } = setup();
    expect(comment.find('Controls').length).toBe(1);
  });


  it('sets the Controls voteData.onVote props correctly', () => {
    const { comment, props } = setup();

    const control = comment.find('Controls');
    const controlVoteData = control.prop('voteData');

    controlVoteData.onVoteUp();
    expect(props.onVote).toHaveBeenCalledWith(props.commentData, 1);

    props.onVote.mockClear();
    controlVoteData.onVoteDown();
    expect(props.onVote).toHaveBeenCalledWith(props.commentData, -1);
  });


  it('sets the Controls onRemove prop correctly', () => {
    const { comment, props } = setup();

    const control = comment.find('Controls');
    const controlOnRemove = control.prop('onRemove');

    controlOnRemove();
    expect(props.onRemove).toHaveBeenCalledWith(props.commentData);
  });
});
