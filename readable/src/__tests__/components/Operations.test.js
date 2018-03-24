import React from 'react';
import { shallow } from 'enzyme';
import Operations from '../../components/Operations';

// Utils
const setup = (propOverrides) => {
  const props = Object.assign({
    voteHandler: getDefaultVoteHandler(),
    editHandler: { onSubmit: () => {} },
    removeHandler: { onSubmit: () => {} },
  }, propOverrides);

  const operations = shallow(<Operations {...props} />);

  const selectButton = (title) => {
    const renderedButtons = operations.find('button');

    const selectedButton = renderedButtons.filterWhere((button) => (
      button.prop('title') === title
    ));

    return selectedButton;
  };

  return {
    props,
    operations,
    selectButton,
  };
};

const getDefaultVoteHandler = () => ({
  voteUp: () => {},
  voteDown: () => {},
});


// Tests
describe('<Operations />', () => {
  describe('vote handler', () => {
    it('renders a button to increase the vote score', () => {
      const { operations, selectButton } = setup();

      const voteUpRenderedButton = selectButton('Vote Up');

      expect(voteUpRenderedButton.length).toBe(1);
      expect(voteUpRenderedButton.prop('onClick'))
        .toBe(operations.instance().handleVoteUp);
    });

    it('handles the vote up operation', () => {
      const voteHandler = getDefaultVoteHandler();
      voteHandler.voteUp = jest.fn();
      const { operations, props } = setup({ voteHandler });

      const event = global.testUtils.getDefaultEvent();
      event.preventDefault = jest.fn();
      operations.instance().handleVoteUp(event);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(props.voteHandler.voteUp).toHaveBeenCalled();
    });

    it('renders a button to decrease the vote score', () => {
      const { operations, selectButton } = setup();

      const voteDownRenderedButton = selectButton('Vote Down');

      expect(voteDownRenderedButton.length).toBe(1);
      expect(voteDownRenderedButton.prop('onClick'))
        .toBe(operations.instance().handleVoteDown);
    });

    it('handles the vote down operation', () => {
      const voteHandler = getDefaultVoteHandler();
      voteHandler.voteDown = jest.fn();
      const { operations, props } = setup({ voteHandler });

      const event = global.testUtils.getDefaultEvent();
      event.preventDefault = jest.fn();
      operations.instance().handleVoteDown(event);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(props.voteHandler.voteDown).toHaveBeenCalled();
    });
  });


  describe('edit/remove handlers', () => {
    it('renders a button to edit', () => {
      const { operations, selectButton } = setup();

      const editRenderedButton = selectButton('Edit');

      expect(editRenderedButton.length).toBe(1);
      expect(editRenderedButton.prop('onClick'))
        .toBe(operations.instance().handleEditRequest);
    });

    it('handles the edit operation request', () => {
      const editHandler = { onSubmit: () => {} };
      const { operations } = setup({ editHandler });

      const event = global.testUtils.getDefaultEvent();
      event.preventDefault = jest.fn();
      operations.instance().handleEditRequest(event);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(operations.state('operationHandler')).toBe(editHandler);
    });

    it('calls editHandler.onRequest method, when set, on a edit operation request', () => {
      const editHandler = {
        onSubmit: () => {},
        onRequest: jest.fn(),
      };
      const { operations } = setup({ editHandler });

      const event = global.testUtils.getDefaultEvent();
      event.preventDefault = jest.fn();
      operations.instance().handleEditRequest(event);

      expect(editHandler.onRequest).toHaveBeenCalled();
    });

    it('renders a button to remove', () => {
      const { operations, selectButton } = setup();

      const removeRenderedButton = selectButton('Delete');

      expect(removeRenderedButton.length).toBe(1);
      expect(removeRenderedButton.prop('onClick'))
        .toBe(operations.instance().handleRemoveRequest);
    });

    it('handles the remove operation request', () => {
      const removeHandler = { onSubmit: () => {} };
      const { operations } = setup({ removeHandler });

      const event = global.testUtils.getDefaultEvent();
      event.preventDefault = jest.fn();
      operations.instance().handleRemoveRequest(event);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(operations.state('operationHandler')).toBe(removeHandler);
    });

    it('calls removeHandler.onRequest method, when set, on a remove operation request', () => {
      const removeHandler = {
        onSubmit: () => {},
        onRequest: jest.fn(),
      };
      const { operations } = setup({ removeHandler });

      const event = global.testUtils.getDefaultEvent();
      event.preventDefault = jest.fn();
      operations.instance().handleRemoveRequest(event);

      expect(removeHandler.onRequest).toHaveBeenCalled();
    });

    it('renders an OperationConfirm component when an operation is requested', () => {
      const { operations } = setup();
      const operationHandler = { onSubmit: () => {} };

      operations.setState({ operationHandler });

      const operationConfirm = operations.find('OperationConfirm');

      expect(operationConfirm.length).toBe(1);
    });

    it('calls operation handler`s onAbort method if one is set when aborted', () => {
      const { operations } = setup();
      const operationHandler = {
        onAbort: jest.fn(),
        onSubmit: () => {},
      };

      operations.setState({ operationHandler });

      operations.instance().handleAbort();

      expect(operationHandler.onAbort).toHaveBeenCalled();
    });

    it('sets the operationHandler state to null on a successful submit', async () => {
      const { operations } = setup();
      const operationHandler = { onSubmit: jest.fn(() => Promise.resolve(true)) };

      operations.setState({ operationHandler });

      await operations.instance().handleSubmit();

      expect(operations.state('operationHandler')).toBe(null);
    });

    it('does not change the operationHandler state on a false submit', async () => {
      const { operations } = setup();
      const operationHandler = { onSubmit: jest.fn(() => Promise.resolve(false)) };

      operations.setState({ operationHandler });

      await operations.instance().handleSubmit();

      expect(operations.state('operationHandler')).toEqual(operationHandler);
    });

    it('sets the operationHandler state to null when aborted an operation', () => {
      const { operations } = setup();
      const operationHandler = { onSubmit: () => {} };

      operations.setState({ operationHandler });

      operations.instance().handleAbort();

      expect(operations.state('operationHandler')).toBe(null);
    });
  });
});
