import React from 'react';
import { shallow } from 'enzyme';
import Menu from '../../components/Menu';

// Utils
const setup = (propOverrides) => {
  const props = Object.assign({
    sortMenu: undefined,
  }, propOverrides);

  const menu = shallow(<Menu {...props} />);

  return {
    props,
    menu,
  };
};

const getDefaultSortMenuConfig = () => ({
  selectedSortOption: undefined,
  onSortOptionChange: () => {},
});


// Tests
describe('<Menu />', () => {
  it('renders without crashing', () => {
    const { menu } = setup();

    expect(menu.find('.menu-row').length).toBe(1);
  });


  describe('sort menu', () => {
    it('renders a Select component', () => {
      const sortMenu = getDefaultSortMenuConfig();
      const { menu } = setup({ sortMenu });

      expect(menu.find('Select').length).toBe(1);
    });

    it('sets the initial selected value', () => {
      const sortMenu = getDefaultSortMenuConfig();
      const sortOption = { value: 'test sort value', label: 'test sort label' };
      sortMenu.selectedSortOption = sortOption;
      const { menu } = setup({ sortMenu });

      const select = menu.find('Select');

      expect(select.prop('value')).toBe(sortOption.value);
    });

    it('sets the selection change method', () => {
      const sortMenu = getDefaultSortMenuConfig();
      sortMenu.onSortOptionChange = jest.fn();
      const { menu } = setup({ sortMenu });

      const select = menu.find('Select');

      expect(select.prop('onChange')).toBe(sortMenu.onSortOptionChange);
    });
  });
});
