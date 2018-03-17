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


  it('renders an Operations component', () => {
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

      expect(operationEdit.onRequest).toBe(comment.instance().handleEditModeEnter);
      expect(operationEdit.onAbort).toBe(comment.instance().handleEditModeLeave);
      expect(operationEdit.onSubmit).toBe(comment.instance().handleEditSubmit);
    });
  });


  describe('edit mode', () => {
    describe('input', () => {
      it('is rendered to edit the comment body', () => {
        const { comment } = setup();
        comment.setState({ editMode: true });

        const bodyInput = comment.find('.comment-body.input-edit');

        expect(bodyInput.length).toBe(1);
        expect(bodyInput.prop('onChange')).toBe(comment.instance().handleBodyInputChange);
      });

      it('updates bodyInput state on value change', () => {
        const { comment } = setup();
        comment.setState({ editMode: true });

        const newBodyValue = 'new comment body';
        const bodyChangeEvent = {
          target: { value: newBodyValue },
        };
        comment.instance().handleBodyInputChange(bodyChangeEvent);

        expect(comment.state('bodyInput')).toBe(newBodyValue);
      });

      it('sets bodyInputErrorClass state on an empty value change', () => {
        const { comment } = setup();
        comment.setState({
          editMode: true,
          bodyInput: 'comment body',
        });

        const newBodyValue = '';
        const bodyChangeEvent = {
          target: { value: newBodyValue },
        };
        comment.instance().handleBodyInputChange(bodyChangeEvent);

        expect(comment.state('bodyInput')).toBe(newBodyValue);
        expect(comment.state('bodyInputErrorClass')).toBe('input-error');
      });
    });

    describe('methods', () => {
      it('enters the edit mode', () => {
        const commentData = getDefaultCommentData();
        commentData.body = 'test comment body';
        const { comment } = setup({ commentData });

        comment.instance().handleEditModeEnter();

        expect(comment.state('editMode')).toBe(true);
        expect(comment.state('bodyInput')).toBe(commentData.body);
      });

      it('leaves the edit mode', () => {
        const commentData = getDefaultCommentData();
        commentData.body = 'test comment body';
        const { comment } = setup({ commentData });

        comment.setState({
          editMode: true,
          bodyInput: commentData.body,
          bodyInputErrorClass: 'input-error',
        });

        comment.instance().handleEditModeLeave();

        expect(comment.state('editMode')).toBe(false);
        expect(comment.state('bodyInput')).toBe('');
        expect(comment.state('bodyInputErrorClass')).toBe('');
      });

      it('submits the edit operation when data is valid and different', async () => {
        const { comment, props } = setup();
        const updatedCommentData = {
          body: 'updated comment body',
        };

        comment.setState({
          editMode: true,
          bodyInput: updatedCommentData.body,
        });

        await comment.instance().handleEditSubmit();

        expect(comment.state('editMode')).toBe(false);
        expect(comment.state('bodyInput')).toBe('');
        expect(props.onUpdate).toHaveBeenCalledWith(props.commentData, updatedCommentData);
      });

      it('leaves the edit mode when submitted data is equal to current data', async () => {
        const commentData = getDefaultCommentData();
        commentData.body = 'test comment body';
        const { comment, props } = setup({ commentData });

        comment.setState({
          editMode: true,
          bodyInput: commentData.body,
        });

        await comment.instance().handleEditSubmit();

        expect(comment.state('editMode')).toBe(false);
        expect(comment.state('bodyInput')).toBe('');
        expect(props.onUpdate).not.toHaveBeenCalled();
      });

      it('stops submit operation if no body is provided', async () => {
        const { comment, props } = setup();

        comment.setState({
          editMode: true,
          bodyInput: '',
        });

        await comment.instance().handleEditSubmit();

        expect(comment.state('editMode')).toBe(true);
        expect(props.onUpdate).not.toHaveBeenCalled();
      });
    });
  });
});
