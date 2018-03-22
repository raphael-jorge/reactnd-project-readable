import React from 'react';
import { shallow } from 'enzyme';
import Placeholder from '../../components/Placeholder';

// Utils
const setup = (propOverrides) => {
  const children = {
    type: 'p',
    text: 'test children text',
  };

  const props = Object.assign({
    isReady: false,
    fallback: undefined,
    delay: undefined,
    children: React.createElement(children.type, null, children.text),
  }, propOverrides);

  const placeholder = shallow(<Placeholder {...props} />);

  return {
    props,
    placeholder,
    children,
  };
};

const getDefaultFallback = () => {
  const data = {
    type: 'p',
    text: 'test fallback text',
  };

  const element = React.createElement(data.type, null, data.text);

  return {
    data,
    element,
  };
};


// Tests
describe('<Placeholder />', () => {
  it('renders the children component when isReady is true', () => {
    const isReady = true;
    const { placeholder, children } = setup({ isReady });

    expect(placeholder.find(children.type).text()).toBe(children.text);
  });


  it('renders nothing when isReady is false', () => {
    const isReady = false;
    const { placeholder } = setup({ isReady });

    expect(placeholder.children().length).toBe(0);
  });


  it('renders the set fallback when isReady is false', () => {
    const isReady = false;
    const fallback = getDefaultFallback();

    const { placeholder } = setup({ isReady, fallback: fallback.element });

    expect(placeholder.find(fallback.data.type).text()).toBe(fallback.data.text);
  });


  it('renders the set fallback after delay time if isReady is false', async () => {
    const isReady = false;
    const fallback = getDefaultFallback();
    const delay = 10;

    const { placeholder } = setup({ isReady, delay, fallback: fallback.element });

    expect(placeholder.state('hideFallback')).toBe(true);

    await new Promise((resolve) => {
      setTimeout(() => {
        expect(placeholder.state('hideFallback')).toBe(false);
        resolve();
      }, delay);
    });
  });


  it('renders fallback after delay time once isReady changes from true to false', async () => {
    let isReady = true;
    const fallback = getDefaultFallback();
    const delay = 10;

    const { placeholder } = setup({ isReady, delay, fallback: fallback.element });

    isReady = false;
    placeholder.setProps({ isReady });

    expect(placeholder.state('hideFallback')).toBe(true);

    await new Promise((resolve) => {
      setTimeout(() => {
        expect(placeholder.state('hideFallback')).toBe(false);
        resolve();
      }, delay);
    });
  });


  it('renders children once isReady changes from false to true', () => {
    let isReady = false;
    const fallback = getDefaultFallback();
    const delay = 10;

    const { placeholder, children } = setup({ isReady, delay, fallback: fallback.element });

    isReady = true;
    placeholder.setProps({ isReady });

    expect(placeholder.find(children.type).text()).toBe(children.text);
  });


  it('clears any active timeout before unmounting', () => {
    const isReady = false;
    const fallback = getDefaultFallback();
    const delay = 10;

    jest.spyOn(global, 'clearTimeout');

    const { placeholder } = setup({ isReady, delay, fallback: fallback.element });

    const timeoutId = placeholder.instance().timeoutId;

    placeholder.unmount();

    expect(global.clearTimeout).toHaveBeenCalledWith(timeoutId);
  });
});
