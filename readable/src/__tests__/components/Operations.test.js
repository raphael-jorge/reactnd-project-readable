import React from 'react';
import { shallow } from 'enzyme';
import Operations from '../../components/Operations';

// Utils
const setup = (propOverrides) => {
  const props = Object.assign({
    voteData: getDefaultVoteData(),
    onEdit: { onSubmit: () => {} },
    onRemove: { onSubmit: () => {} },
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

const getDefaultVoteData = () => ({
  voteCount: 0,
  onVoteUp: () => {},
  onVoteDown: () => {},
});


// Tests
describe('<Operations />', () => {
  describe('vote score control', () => {
    it('renders the voteScore', () => {
      const { operations, props } = setup();

      const renderedVoteCount = operations.find('.vote-count');

      expect(renderedVoteCount.length).toBe(1);
      expect(renderedVoteCount.text()).toBe(props.voteData.voteCount.toString());
    });

    it('renders a button to increase the vote score', () => {
      const voteData = getDefaultVoteData();
      voteData.onVoteUp = jest.fn();
      const { props, selectButton } = setup({ voteData });

      const voteUpRenderedButton = selectButton('Vote Up');

      const event = global.testUtils.getDefaultEvent();
      event.preventDefault = jest.fn();

      voteUpRenderedButton.prop('onClick')(event);

      expect(voteUpRenderedButton.length).toBe(1);
      expect(event.preventDefault).toHaveBeenCalled();
      expect(props.voteData.onVoteUp).toHaveBeenCalled();
    });

    it('renders a button to decrease the vote score', () => {
      const voteData = getDefaultVoteData();
      voteData.onVoteDown = jest.fn();
      const { props, selectButton } = setup({ voteData });

      const voteDownRenderedButton = selectButton('Vote Down');

      const event = global.testUtils.getDefaultEvent();
      event.preventDefault = jest.fn();

      voteDownRenderedButton.prop('onClick')(event);

      expect(voteDownRenderedButton.length).toBe(1);
      expect(event.preventDefault).toHaveBeenCalled();
      expect(props.voteData.onVoteDown).toHaveBeenCalled();
    });
  });


  describe('edit/remove control', () => {
    it('renders a button to edit', () => {
      const { operations, props, selectButton } = setup();
      jest.spyOn(operations.instance(), 'handleRequest');

      const editRenderedButton = selectButton('Edit');

      const event = global.testUtils.getDefaultEvent();
      event.preventDefault = jest.fn();

      editRenderedButton.prop('onClick')(event);

      expect(editRenderedButton.length).toBe(1);
      expect(event.preventDefault).toHaveBeenCalled();
      expect(operations.instance().handleRequest).toHaveBeenCalledWith(event, props.onEdit);
    });

    it('renders a button to remove', () => {
      const { operations, props, selectButton } = setup();
      jest.spyOn(operations.instance(), 'handleRequest');

      const removeRenderedButton = selectButton('Delete');

      const event = global.testUtils.getDefaultEvent();
      event.preventDefault = jest.fn();

      removeRenderedButton.prop('onClick')(event);

      expect(removeRenderedButton.length).toBe(1);
      expect(event.preventDefault).toHaveBeenCalled();
      expect(operations.instance().handleRequest).toHaveBeenCalledWith(event, props.onRemove);
    });

    it('renders an OperationConfirm component when an operation is requested', () => {
      const { operations } = setup();
      const operationHandler = { onSubmit: () => {} };

      operations.setState({ operationHandler });

      const operationConfirm = operations.find('OperationConfirm');

      expect(operationConfirm.length).toBe(1);
    });

    it('sets the operationHandler state once an operation is triggered', () => {
      const { operations } = setup();
      const operationHandler = { onSubmit: () => {} };

      const event = global.testUtils.getDefaultEvent();
      operations.instance().handleRequest(event, operationHandler);

      expect(operations.state('operationHandler')).toEqual(operationHandler);
    });

    it('calls operation handler`s onRequest method if one is set', () => {
      const { operations } = setup();
      const operationHandler = {
        onRequest: jest.fn(),
        onSubmit: () => {},
      };

      const event = global.testUtils.getDefaultEvent();
      operations.instance().handleRequest(event, operationHandler);

      expect(operationHandler.onRequest).toHaveBeenCalled();
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
