import React from 'react';
import { shallow } from 'enzyme';
import OperationConfirm from '../../components/OperationConfirm';

// Utils
const setup = (propOverrides) => {
  const props = Object.assign({
    onConfirm: jest.fn(),
    onCancel: jest.fn(),
  }, propOverrides);

  const operationConfirm = shallow(<OperationConfirm {...props} />);

  const selectButton = (title) => {
    const renderedButtons = operationConfirm.find('button');

    const selectedButton = renderedButtons.filterWhere((button) => (
      button.prop('title') === title
    ));

    return selectedButton;
  };

  return {
    props,
    operationConfirm,
    selectButton,
  };
};

const getDefaultEvent = () => ({
  preventDefault: jest.fn(),
});


describe('<OperationConfirm />', () => {
  it('renders a confirm button', () => {
    const { selectButton } = setup();

    const confirmButton = selectButton('Confirm');

    expect(confirmButton.length).toBe(1);
  });


  it('renders a cancel button', () => {
    const { selectButton } = setup();

    const cancelButton = selectButton('Cancel');

    expect(cancelButton.length).toBe(1);
  });


  it('calls onConfirm prop once confirm button is clicked', () => {
    const { selectButton, props } = setup();

    const confirmButton = selectButton('Confirm');

    const event = getDefaultEvent();
    confirmButton.simulate('click', event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(props.onConfirm).toHaveBeenCalled();
  });


  it('calls onCancel prop once cancel button is clicked', () => {
    const { selectButton, props } = setup();

    const cancelButton = selectButton('Cancel');

    const event = getDefaultEvent();
    cancelButton.simulate('click', event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(props.onCancel).toHaveBeenCalled();
  });
});
