import React from 'react';
import { shallow } from 'enzyme';
import OperationConfirm from '../../components/OperationConfirm';

// Utils
const setup = (propOverrides) => {
  const props = Object.assign({
    onConfirm: () => {},
    onCancel: () => {},
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
    const onConfirm = jest.fn();
    const { selectButton, props } = setup({ onConfirm });

    const confirmButton = selectButton('Confirm');

    const event = global.testUtils.getDefaultEvent();
    event.preventDefault = jest.fn();

    confirmButton.prop('onClick')(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(props.onConfirm).toHaveBeenCalled();
  });


  it('calls onCancel prop once cancel button is clicked', () => {
    const onCancel = jest.fn();
    const { selectButton, props } = setup({ onCancel });

    const cancelButton = selectButton('Cancel');

    const event = global.testUtils.getDefaultEvent();
    event.preventDefault = jest.fn();

    cancelButton.prop('onClick')(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(props.onCancel).toHaveBeenCalled();
  });
});
