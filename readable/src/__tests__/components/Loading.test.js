import React from 'react';
import { shallow } from 'enzyme';
import Loading from '../../components/Loading';

// Utils
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

const getDefaultEvent = () => ({
  preventDefault: jest.fn(),
})


// Tests
describe('<Loading />', () => {
  it('renders a Message component when no type is set', () => {
    const { loading } = setup();

    const msg = loading.find('Message');
    expect(msg.length).toBe(1);
    expect(msg.prop('msg')).toBe('Loading...');
  });


  it('renders a loading squares icon when type is set to icon-squares', () => {
    const type = 'icon-squares';
    const { loading } = setup({ type });

    expect(loading.find('.loading-icon.loading-squares').length).toBe(1);
  });

  describe('cover-squares type', () => {
    it('renders a loading squares cover', () => {
      const type = 'cover-squares';
      const { loading } = setup({ type });

      expect(loading.find('.loading-cover.loading-squares').length).toBe(1);
      expect(loading.find('.loading-cover-overlay').length).toBe(1);
    });

    it('prevents click actions to be triggered', () => {
      const type = 'cover-squares';
      const { loading } = setup({ type });

      const cover = loading.find('.loading-cover');

      const event = getDefaultEvent();
      cover.simulate('click', event);
      expect(event.preventDefault).toHaveBeenCalled();
    });
  });
});
