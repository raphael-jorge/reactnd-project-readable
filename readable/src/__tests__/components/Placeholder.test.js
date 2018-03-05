import React from 'react';
import { shallow } from 'enzyme';
import Placeholder from '../../components/Placeholder';

const setup = (propOverrides) => {
  const children = {
    type: 'p',
    text: 'test children text',
  };

  const props = Object.assign({
    isReady: false,
    fallback: undefined,
    children: React.createElement(children.type, null, children.text),
  }, propOverrides);

  const placeholder = shallow(<Placeholder {...props} />);

  return {
    props,
    placeholder,
    children,
  };
};


describe('<Placeholder />', () => {
  it('renders the children component when isReady is true', () => {
    const isReady = true;
    const { placeholder, children } = setup({ isReady });

    expect(placeholder.find(children.type).text()).toBe(children.text);
  });

  it('renders fallback when isReady is false', () => {
    const isReady = false;
    const fallbackData = {
      type: 'p',
      text: 'test fallback text',
    };
    const fallback = React.createElement(fallbackData.type, null, fallbackData.text);

    const { placeholder } = setup({ isReady, fallback });

    expect(placeholder.find(fallbackData.type).text()).toBe(fallbackData.text);
  });

  it('renders nothing when isReady is false and fallback is not set', () => {
    const isReady = false;
    const { placeholder } = setup({ isReady });

    expect(placeholder.children().length).toBe(0);
  });
});
