import React from 'react';
import { shallow } from 'enzyme';
import Controls from '../../components/Controls';

// Utils
const setup = (propOverrides) => {
  const props = Object.assign({
    voteData: getDefaultVoteData(),
    onEdit: jest.fn(),
    onRemove: jest.fn(),
    commentCount: undefined,
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


  describe('edit control', () => {
    it('renders a button to edit', () => {
      const { controls, props } = setup();

      const renderedButtons = controls.find('button');

      const editRenderedButton = renderedButtons.filterWhere((button) => (
        button.prop('title') === 'Edit'
      ));

      const event = getDefaultEvent();
      editRenderedButton.simulate('click', event);

      expect(editRenderedButton.length).toBe(1);
      expect(event.preventDefault).toHaveBeenCalled();
      expect(props.onEdit).toHaveBeenCalled();
    });

    it('renders a button to remove', () => {
      const { controls, props } = setup();

      const renderedButtons = controls.find('button');

      const removeRenderedButton = renderedButtons.filterWhere((button) => (
        button.prop('title') === 'Delete'
      ));

      const event = getDefaultEvent();
      removeRenderedButton.simulate('click', event);

      expect(removeRenderedButton.length).toBe(1);
      expect(event.preventDefault).toHaveBeenCalled();
      expect(props.onRemove).toHaveBeenCalled();
    });
  });
});
