import React from 'react';
import { shallow } from 'enzyme';
import Message from '../../components/Message';

// Utils
const setup = (propOverrides) => {
  const props = Object.assign({
    msg: '',
  }, propOverrides);

  const message = shallow(<Message {...props} />);

  return {
    props,
    message,
  };
};


// Tests
describe('<Message />', () => {
  it('renders a paragraph element with the message', () => {
    const msg = 'test message';
    const { message } = setup({ msg });

    const statusMsg = message.find('.status-msg');
    expect(statusMsg.length).toBe(1);
    expect(statusMsg.text()).toBe(msg);
  });
});
