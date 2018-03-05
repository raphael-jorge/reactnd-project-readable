import React from 'react';
import { shallow } from 'enzyme';
import Loading from '../../components/Loading';

const setup = (propOverrides) => {
  const props = Object.assign({
    type: undefined,
  }, propOverrides);

  const loading = shallow(<Loading {...props} />);

  return {
    props,
    loading,
  };
};


describe('<Loading />', () => {
  it('renders a Message component when no type is set', () => {
    const { loading } = setup();

    const msg = loading.find('Message');
    expect(msg.length).toBe(1);
    expect(msg.prop('msg')).toBe('Loading...');
  });

  it('renders a .loading-squares element when type is set to squares', () => {
    const type = 'squares';
    const { loading } = setup({ type });

    expect(loading.find('.loading-squares').length).toBe(1);
  });
});
