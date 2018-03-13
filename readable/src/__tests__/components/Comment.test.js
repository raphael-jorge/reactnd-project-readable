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
    expect(comment.find('.comment-info').length).toBe(1);
    expect(comment.find('.comment-body').length).toBe(1);
  });


  it('renders a Operations component', () => {
    const { comment } = setup();
    expect(comment.find('Operations').length).toBe(1);
    expect(comment.find('.comment-operations').length).toBe(1);
  });


  describe('operations', () => {
    it('sets vote operations to vote up and down on the comment', () => {
      const { comment, props } = setup();

      const operations = comment.find('Operations');
      const operationVote = operations.prop('voteData');

      operationVote.onVoteUp();
      expect(props.onVote).toHaveBeenCalledWith(props.commentData, 1);

      props.onVote.mockClear();
      operationVote.onVoteDown();
      expect(props.onVote).toHaveBeenCalledWith(props.commentData, -1);
    });

    it('sets remove operation submit to remove the comment', () => {
      const { comment, props } = setup();

      const operations = comment.find('Operations');
      const operationRemove = operations.prop('onRemove');

      operationRemove.onSubmit();
      expect(props.onRemove).toHaveBeenCalledWith(props.commentData);
    });

    it('sets edit operation methods correctly', () => {
      const { comment } = setup();

      const operations = comment.find('Operations');
      const operationEdit = operations.prop('onEdit');

      expect(operationEdit.onRequest).toBe(comment.instance().handleUpdateRequest);
      expect(operationEdit.onAbort).toBe(comment.instance().handleUpdateAbort);
      expect(operationEdit.onSubmit).toBe(comment.instance().handleUpdateSubmit);
    });
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

      it('submits the edit operation when valid and different', async () => {
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

      it('leaves the edit mode when submitted data is equal to current data', async () => {
        const commentData = getDefaultCommentData();
        commentData.body = 'test comment body';
        const { comment, props } = setup({ commentData });

        comment.setState({
          editMode: true,
          bodyInputValue: commentData.body,
        });

        await comment.instance().handleUpdateSubmit();

        expect(comment.state('editMode')).toBe(false);
        expect(comment.state('bodyInputValue')).toBe('');
        expect(props.onUpdate).not.toHaveBeenCalled();
      });

      it('stops submit operation if no body is provided', async () => {
        const { comment, props } = setup();

        comment.setState({
          editMode: true,
          bodyInputValue: '',
        });

        await comment.instance().handleUpdateSubmit();

        expect(comment.state('editMode')).toBe(true);
        expect(comment.state('bodyInputErrorClass')).toBe('input-error');
        expect(props.onUpdate).not.toHaveBeenCalled();
      });
    });
  });
});
