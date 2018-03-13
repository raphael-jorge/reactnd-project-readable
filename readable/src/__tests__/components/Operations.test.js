import React from 'react';
import { shallow } from 'enzyme';
import Operations from '../../components/Operations';

// Utils
const setup = (propOverrides) => {
  const props = Object.assign({
    voteData: getDefaultVoteData(),
    onEdit: { onSubmit: jest.fn() },
    onRemove: { onSubmit: jest.fn() },
  }, propOverrides);

  const operations = shallow(<Operations {...props} />);

  return {
    props,
    operations,
  };
};

const getDefaultVoteData = () => ({
  voteCount: 0,
  onVoteUp: jest.fn(),
  onVoteDown: jest.fn(),
});

const getDefaultEvent = () => ({
  preventDefault: jest.fn(),
});

afterEach(() => {
  jest.clearAllMocks();
});


// Tests
describe('<Operations />', () => {
  describe('vote score control', () => {
    it('renders the voteScore', () => {
      const voteData = getDefaultVoteData();
      const { operations } = setup();

      const renderedVoteCount = operations.find('.vote-count');

      expect(renderedVoteCount.length).toBe(1);
      expect(renderedVoteCount.text()).toBe(voteData.voteCount.toString());
    });

    it('renders a button to increase the vote score', () => {
      const { operations, props } = setup();

      const renderedButtons = operations.find('button');

      const voteUpRenderedButton = renderedButtons.filterWhere((button) => (
        button.prop('title') === 'Vote Up'
      ));

      const event = getDefaultEvent();
      voteUpRenderedButton.simulate('click', event);

      expect(voteUpRenderedButton.length).toBe(1);
      expect(event.preventDefault).toHaveBeenCalled();
      expect(props.voteData.onVoteUp).toHaveBeenCalled();
    });

    it('renders a button to decrease the vote score', () => {
      const { operations, props } = setup();

      const renderedButtons = operations.find('button');

      const voteDownRenderedButton = renderedButtons.filterWhere((button) => (
        button.prop('title') === 'Vote Down'
      ));

      const event = getDefaultEvent();
      voteDownRenderedButton.simulate('click', event);

      expect(voteDownRenderedButton.length).toBe(1);
      expect(event.preventDefault).toHaveBeenCalled();
      expect(props.voteData.onVoteDown).toHaveBeenCalled();
    });
  });


  describe('operations control', () => {
    it('renders a button to edit', () => {
      const { operations, props } = setup();
      const handleRequestSpy = jest.spyOn(operations.instance(), 'handleRequest');

      const renderedButtons = operations.find('button');

      const editRenderedButton = renderedButtons.filterWhere((button) => (
        button.prop('title') === 'Edit'
      ));

      const event = getDefaultEvent();
      editRenderedButton.simulate('click', event);

      expect(editRenderedButton.length).toBe(1);
      expect(event.preventDefault).toHaveBeenCalled();
      expect(handleRequestSpy).toHaveBeenCalledWith(event, props.onEdit);
    });

    it('renders a button to remove', () => {
      const { operations, props } = setup();
      const handleRequestSpy = jest.spyOn(operations.instance(), 'handleRequest');

      const renderedButtons = operations.find('button');

      const removeRenderedButton = renderedButtons.filterWhere((button) => (
        button.prop('title') === 'Delete'
      ));

      const event = getDefaultEvent();
      removeRenderedButton.simulate('click', event);

      expect(removeRenderedButton.length).toBe(1);
      expect(event.preventDefault).toHaveBeenCalled();
      expect(handleRequestSpy).toHaveBeenCalledWith(event, props.onRemove);
    });

    it('renders a OperationConfirm component when an operation is requested', () => {
      const { operations } = setup();
      const operationHandler = {
        onSubmit: jest.fn(),
      };

      operations.setState({ operationHandler });

      const operationConfirm = operations.find('OperationConfirm');

      expect(operationConfirm.length).toBe(1);
    });

    it('sets the operationHandler state once an operation is triggered', () => {
      const { operations } = setup();
      const operationHandler = {
        onSubmit: () => {},
      };

      const event = getDefaultEvent();
      operations.instance().handleRequest(event, operationHandler);

      expect(operations.state('operationHandler')).toEqual(operationHandler);
    });

    it('calls operation handler`s onRequest method if one is set', () => {
      const { operations } = setup();
      const operationHandler = {
        onRequest: jest.fn(),
        onSubmit: () => {},
      };

      const event = getDefaultEvent();
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
      const operationHandler = {
        onSubmit: jest.fn(() => Promise.resolve(true)),
      };

      operations.setState({ operationHandler });

      await operations.instance().handleSubmit();
      expect(operations.state('operationHandler')).toBe(null);
    });

    it('does not change the operationHandler state on a false submit', async () => {
      const { operations } = setup();
      const operationHandler = {
        onSubmit: jest.fn(() => Promise.resolve(false)),
      };

      operations.setState({ operationHandler });

      await operations.instance().handleSubmit();
      expect(operations.state('operationHandler')).toEqual(operationHandler);
    });

    it('sets the operationHandler state to null when aborted an operation', () => {
      const { operations } = setup();
      const operationHandler = {
        onSubmit: jest.fn(),
      };

      operations.setState({ operationHandler });

      operations.instance().handleAbort();
      expect(operations.state('operationHandler')).toBe(null);
    });
  });
});
