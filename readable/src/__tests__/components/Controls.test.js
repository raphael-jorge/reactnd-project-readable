import React from 'react';
import { shallow } from 'enzyme';
import Controls from '../../components/Controls';

// Utils
const setup = (propOverrides) => {
  const props = Object.assign({
    voteData: getDefaultVoteData(),
    onEdit: { onSubmit: jest.fn() },
    onRemove: { onSubmit: jest.fn() },
  }, propOverrides);

  const controls = shallow(<Controls {...props} />);

  return {
    props,
    controls,
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
describe('<Controls />', () => {
  describe('vote score control', () => {
    it('renders the voteScore', () => {
      const voteData = getDefaultVoteData();
      const { controls } = setup();

      const renderedVoteCount = controls.find('.vote-count');

      expect(renderedVoteCount.length).toBe(1);
      expect(renderedVoteCount.text()).toBe(voteData.voteCount.toString());
    });

    it('renders a button to increase the vote score', () => {
      const { controls, props } = setup();

      const renderedButtons = controls.find('button');

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
      const { controls, props } = setup();

      const renderedButtons = controls.find('button');

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
      const { controls, props } = setup();
      const handleRequestSpy = jest.spyOn(controls.instance(), 'handleRequest');

      const renderedButtons = controls.find('button');

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
      const { controls, props } = setup();
      const handleRequestSpy = jest.spyOn(controls.instance(), 'handleRequest');

      const renderedButtons = controls.find('button');

      const removeRenderedButton = renderedButtons.filterWhere((button) => (
        button.prop('title') === 'Delete'
      ));

      const event = getDefaultEvent();
      removeRenderedButton.simulate('click', event);

      expect(removeRenderedButton.length).toBe(1);
      expect(event.preventDefault).toHaveBeenCalled();
      expect(handleRequestSpy).toHaveBeenCalledWith(event, props.onRemove);
    });

    it('sets the operationHandler state once an operation is triggered', () => {
      const { controls } = setup();
      const operationHandler = {
        onSubmit: () => {},
      };

      const event = getDefaultEvent();
      controls.instance().handleRequest(event, operationHandler);

      expect(controls.state('operationHandler')).toEqual(operationHandler);
    });

    it('calls operation handler`s onRequest method if one is set', () => {
      const { controls } = setup();
      const operationHandler = {
        onRequest: jest.fn(),
        onSubmit: () => {},
      };

      const event = getDefaultEvent();
      controls.instance().handleRequest(event, operationHandler);

      expect(operationHandler.onRequest).toHaveBeenCalled();
    });

    it('renders a Submit button when the operation is triggered', () => {
      const { controls } = setup();
      const handleSubmitSpy = jest.spyOn(controls.instance(), 'handleSubmit');
      const operationHandler = {
        onSubmit: jest.fn(),
      };

      controls.setState({ operationHandler });

      const renderedButtons = controls.find('button');
      const submitRenderedButton = renderedButtons.filterWhere((button) => (
        button.prop('title') === 'Submit'
      ));

      const event = getDefaultEvent();
      submitRenderedButton.simulate('click', event);

      expect(submitRenderedButton.length).toBe(1);
      expect(event.preventDefault).toHaveBeenCalled();
      expect(handleSubmitSpy).toHaveBeenCalled();
      expect(operationHandler.onSubmit).toHaveBeenCalled();
    });

    it('renders an Abort button when the operation is triggered', () => {
      const { controls } = setup();
      const handleAbortSpy = jest.spyOn(controls.instance(), 'handleAbort');
      const operationHandler = {
        onSubmit: () => {},
      };

      controls.setState({ operationHandler });

      const renderedButtons = controls.find('button');
      const abortRenderedButton = renderedButtons.filterWhere((button) => (
        button.prop('title') === 'Abort'
      ));

      const event = getDefaultEvent();
      abortRenderedButton.simulate('click', event);

      expect(abortRenderedButton.length).toBe(1);
      expect(event.preventDefault).toHaveBeenCalled();
      expect(handleAbortSpy).toHaveBeenCalled();
    });

    it('calls operation handler`s onAbort method if one is set when aborted', () => {
      const { controls } = setup();
      const operationHandler = {
        onAbort: jest.fn(),
        onSubmit: () => {},
      };

      controls.setState({ operationHandler });

      const renderedButtons = controls.find('button');
      const abortRenderedButton = renderedButtons.filterWhere((button) => (
        button.prop('title') === 'Abort'
      ));

      const event = getDefaultEvent();
      abortRenderedButton.simulate('click', event);

      expect(operationHandler.onAbort).toHaveBeenCalled();
    });

    it('sets the operationHandler state to null when submitted an operation', () => {
      const { controls } = setup();
      const operationHandler = {
        onSubmit: jest.fn(),
      };

      controls.setState({ operationHandler });

      const renderedButtons = controls.find('button');
      const submitRenderedButton = renderedButtons.filterWhere((button) => (
        button.prop('title') === 'Submit'
      ));

      const event = getDefaultEvent();
      submitRenderedButton.simulate('click', event);

      expect(controls.state('operationHandler')).toBe(null);
    });

    it('sets the operationHandler state to null when aborted an operation', () => {
      const { controls } = setup();
      const operationHandler = {
        onSubmit: jest.fn(),
      };

      controls.setState({ operationHandler });

      const renderedButtons = controls.find('button');
      const abortRenderedButton = renderedButtons.filterWhere((button) => (
        button.prop('title') === 'Abort'
      ));

      const event = getDefaultEvent();
      abortRenderedButton.simulate('click', event);

      expect(controls.state('operationHandler')).toBe(null);
    });
  });
});
