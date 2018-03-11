import React from 'react';
import { shallow } from 'enzyme';
import Comment from '../../components/Comment';

// Utils
const setup = (propOverrides) => {
  const props = Object.assign({
    commentData: getDefaultCommentData(),
    onVote: jest.fn(),
    onRemove: jest.fn(),
    onUpdate: jest.fn(),
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

    expect(controlOnEdit.onRequest).toBe(comment.instance().handleUpdateRequest);
    expect(controlOnEdit.onAbort).toBe(comment.instance().handleUpdateAbort);
    expect(controlOnEdit.onSubmit).toBe(comment.instance().handleUpdateSubmit);
  });


  describe('edit mode', () => {
    describe('input', () => {
      it('is rendered to edit the comment body', () => {
        const { comment } = setup();
        comment.setState({ editMode: true });

        const bodyInput = comment.find('.comment-body.input-edit');

        expect(bodyInput.length).toBe(1);
      });

      it('blocks click events', () => {
        const { comment } = setup();
        comment.setState({ editMode: true });

        const bodyInput = comment.find('.comment-body.input-edit');

        const event = getDefaultEvent();
        bodyInput.simulate('click', event);

        expect(event.preventDefault).toHaveBeenCalled();
      });

      it('update state on value change', () => {
        const { comment } = setup();
        comment.setState({ editMode: true });

        const bodyInput = comment.find('.comment-body.input-edit');

        const newBodyValue = 'new comment body';
        const bodyChangeEvent = {
          target: { value: newBodyValue },
        };
        bodyInput.simulate('change', bodyChangeEvent);

        expect(comment.state('bodyInputValue')).toBe(newBodyValue);
      });
    });

    describe('methods', () => {
      it('initializes the edit mode', () => {
        const commentData = getDefaultCommentData();
        commentData.body = 'test comment body';
        const { comment } = setup({ commentData });

        comment.instance().handleUpdateRequest();

        expect(comment.state('editMode')).toBe(true);
        expect(comment.state('bodyInputValue')).toBe(commentData.body);
      });

      it('aborts the edit operation', () => {
        const commentData = getDefaultCommentData();
        commentData.body = 'test comment body';
        const { comment } = setup({ commentData });

        comment.setState({
          editMode: true,
          bodyInputValue: commentData.body,
        });

        comment.instance().handleUpdateAbort();

        expect(comment.state('editMode')).toBe(false);
        expect(comment.state('bodyInputValue')).toBe('');
      });

      it('submits the edit operation', async () => {
        const { comment, props } = setup();
        const updatedCommentData = {
          body: 'updated comment body',
        };

        comment.setState({
          editMode: true,
          bodyInputValue: updatedCommentData.body,
        });

        await comment.instance().handleUpdateSubmit();

        expect(comment.state('editMode')).toBe(false);
        expect(comment.state('bodyInputValue')).toBe('');
        expect(props.onUpdate).toHaveBeenCalledWith(props.commentData, updatedCommentData);
      });
    });
  });
});
