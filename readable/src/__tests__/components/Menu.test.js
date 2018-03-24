import React from 'react';
import { shallow } from 'enzyme';
import Menu from '../../components/Menu';

// Utils
const setup = (propOverrides) => {
  const props = Object.assign({
    selectedSortOption: undefined,
    onSortOptionChange: undefined,
  }, propOverrides);

  const menu = shallow(<Menu {...props} />);
  const sortOptions = menu.instance().sortOptions;

  return {
    props,
    menu,
    sortOptions,
  };
};


// Tests
describe('<Menu />', () => {
  it('renders without crashing', () => {
    const { menu } = setup();

    expect(menu.find('.menu-row').length).toBe(1);
  });


  describe('sort menu', () => {
    it('renders a Select component', () => {
      const selectedSortOption = null;
      const onSortOptionChange = () => {};
      const { menu } = setup({ selectedSortOption, onSortOptionChange });

      expect(menu.find('Select').length).toBe(1);
    });

    it('sets the initial selected value', () => {
      let selectedSortOption = null;
      const onSortOptionChange = () => {};
      const { menu, sortOptions } = setup({ selectedSortOption, onSortOptionChange });

      sortOptions.forEach((sortOption) => {
        selectedSortOption = sortOption;
        menu.setProps({ selectedSortOption });

        const select = menu.find('Select');

        expect(select.prop('value')).toBe(selectedSortOption.value);
      });
    });

    it('sets the selection change method', () => {
      const selectedSortOption = null;
      const onSortOptionChange = jest.fn();
      const { menu } = setup({ selectedSortOption, onSortOptionChange });

      const select = menu.find('Select');
      select.prop('onChange')();

      expect(onSortOptionChange).toHaveBeenCalled();
    });
  });
});
