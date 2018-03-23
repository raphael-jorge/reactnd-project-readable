import React from 'react';
import { shallow } from 'enzyme';
import ModalAddComment from '../../components/ModalAddComment';

jest.mock('react-modal');

// Utils
const setup = (propOverrides) => {
  const props = Object.assign({
    isOpen: true,
    postData: {},
    onModalClose: () => {},
    onCommentAdd: () => {},
  }, propOverrides);

  const modal = shallow(<ModalAddComment {...props} />);

  return {
    props,
    modal,
  };
};


// Tests
describe('<ModalAddPost />', () => {
  it('renders an OperationConfirm conponent', () => {
    const { modal } = setup();

    const operationConfirm = modal.find('OperationConfirm');

    expect(operationConfirm.length).toBe(1);
    expect(operationConfirm.prop('onConfirm')).toBe(modal.instance().handleSubmit);
    expect(operationConfirm.prop('onCancel')).toBe(modal.instance().handleModalClose);
  });


  it('renders a Post component on read mode for the given postData', () => {
    const { modal, props } = setup();

    const post = modal.find('Post');

    expect(post.length).toBe(1);
    expect(post.prop('postData')).toBe(props.postData);
    expect(post.prop('readMode')).toBe(true);
  });


  describe('inputs', () => {
    it('renders an author input', () => {
      const { modal } = setup();

      const authorInput = modal.find('#input-author');

      expect(authorInput.length).toBe(1);
      expect(authorInput.prop('onChange')).toBe(modal.instance().handleAuthorChange);
    });

    it('renders a body input', () => {
      const { modal } = setup();

      const bodyInput = modal.find('#input-body');

      expect(bodyInput.length).toBe(1);
      expect(bodyInput.prop('onChange')).toBe(modal.instance().handleBodyChange);
    });

    it('updates the author state once the author input value changes', () => {
      const { modal } = setup();

      const newAuthor = 'new author value';
      const changeAuthorEvent = global.testUtils.getDefaultEvent({ targetValue: newAuthor });

      modal.instance().handleAuthorChange(changeAuthorEvent);

      expect(modal.state('author')).toBe(newAuthor);
    });

    it('updates the body state once the body input value changes', () => {
      const { modal } = setup();

      const newBody = 'new body value';
      const changeBodyEvent = global.testUtils.getDefaultEvent({ targetValue: newBody });

      modal.instance().handleBodyChange(changeBodyEvent);

      expect(modal.state('body')).toBe(newBody);
    });

    it('sets authorErrorClass state on an empty author value change', () => {
      const { modal } = setup();
      modal.setState({ author: 'post author' });

      const newAuthor = '';
      const changeAuthorEvent = global.testUtils.getDefaultEvent({ targetValue: newAuthor });

      modal.instance().handleAuthorChange(changeAuthorEvent);

      expect(modal.state('author')).toBe(newAuthor);
      expect(modal.state('authorErrorClass')).toBe('input-error');
    });

    it('sets bodyErrorClass state on an empty body value change', () => {
      const { modal } = setup();
      modal.setState({ body: 'post body' });

      const newBody = '';
      const changeBodyEvent = global.testUtils.getDefaultEvent({ targetValue: newBody });

      modal.instance().handleBodyChange(changeBodyEvent);

      expect(modal.state('body')).toBe(newBody);
      expect(modal.state('bodyErrorClass')).toBe('input-error');
    });
  });

  describe('methods', () => {
    it('handles modal close', () => {
      const onModalClose = jest.fn();
      const { modal, props } = setup({ onModalClose });

      modal.instance().handleModalClose();

      expect(props.onModalClose).toHaveBeenCalled();
    });

    it('handles a valid submit', async () => {
      const onCommentAdd = jest.fn(() => Promise.resolve());
      const postData = global.testUtils.getDefaultPostData();
      const { modal, props } = setup({ postData, onCommentAdd });

      jest.spyOn(modal.instance(), 'handleModalClose');

      const commentDataToSubmit = {
        body: 'test body',
        author: 'test author',
      };
      modal.setState(commentDataToSubmit);
      await modal.instance().handleSubmit();

      expect(props.onCommentAdd).toHaveBeenCalledWith(postData.id, commentDataToSubmit);
      expect(modal.instance().handleModalClose).toHaveBeenCalled();
    });

    it('handles a failed submit operation', async () => {
      const onCommentAdd = jest.fn(() => Promise.reject());
      const postData = global.testUtils.getDefaultPostData();
      const { modal, props } = setup({ postData, onCommentAdd });

      const commentDataToSubmit = {
        body: 'test body',
        author: 'test author',
      };
      modal.setState(commentDataToSubmit);
      await modal.instance().handleSubmit();

      expect(props.onCommentAdd).toHaveBeenCalledWith(postData.id, commentDataToSubmit);
      expect(modal.state('isProcessing')).toBe(false);
    });

    it('handles an unvalid submit (missing body)', async () => {
      const onCommentAdd = jest.fn();
      const { modal, props } = setup({ onCommentAdd });

      jest.spyOn(modal.instance(), 'handleModalClose');

      const commentDataToSubmit = {
        body: '',
        author: 'test author',
      };
      modal.setState(commentDataToSubmit);
      await modal.instance().handleSubmit();

      expect(props.onCommentAdd).not.toHaveBeenCalled();
      expect(modal.instance().handleModalClose).not.toHaveBeenCalled();
    });

    it('handles an unvalid submit (missing author)', async () => {
      const onCommentAdd = jest.fn();
      const { modal, props } = setup({ onCommentAdd });

      jest.spyOn(modal.instance(), 'handleModalClose');

      const commentDataToSubmit = {
        body: 'test body',
        author: '',
      };
      modal.setState(commentDataToSubmit);
      await modal.instance().handleSubmit();

      expect(props.onCommentAdd).not.toHaveBeenCalled();
      expect(modal.instance().handleModalClose).not.toHaveBeenCalled();
    });
  });
});
