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

const getDefaultEvent = () => ({
  preventDefault: jest.fn(),
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
    const controlOnRemoveSubmit = control.prop('onRemove').onSubmit;

    controlOnRemoveSubmit();
    expect(props.onRemove).toHaveBeenCalledWith(props.commentData);
  });


  it('sets the Controls onEdit prop correctly', () => {
    const { comment } = setup();

    const control = comment.find('Controls');
    const controlOnEdit = control.prop('onEdit');

    comment.setState({ editMode: false });
    controlOnEdit.onRequest();
    expect(comment.state('editMode')).toBe(true);

    comment.setState({ editMode: true });
    controlOnEdit.onAbort();
    expect(comment.state('editMode')).toBe(false);

    comment.setState({ editMode: true });
    controlOnEdit.onSubmit();
    expect(comment.state('editMode')).toBe(false);
  });


  it('renders an input to edit the comment body on edit mode', () => {
    const commentData = getDefaultCommentData();
    commentData.body = 'test comment body';
    const { comment } = setup({ commentData });

    comment.setState({ editMode: true });

    const bodyInput = comment.find('.comment-body.input-edit');

    const event = getDefaultEvent();
    bodyInput.simulate('click', event);

    expect(bodyInput.length).toBe(1);
    expect(bodyInput.prop('defaultValue')).toBe(commentData.body);
    expect(event.preventDefault).toHaveBeenCalled();
  });
});
