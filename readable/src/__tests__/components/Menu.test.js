import React from 'react';
import { shallow } from 'enzyme';
import Menu from '../../components/Menu';

// Utils
const setup = (propOverrides) => {
  const props = Object.assign({
    selectedSortOption: undefined,
    onSortOptionChange: () => {},
    searchOptions: [],
    selectedSearchOption: undefined,
    onSearchOptionChange: () => {},
    searchQueryValue: '',
    onSearchQueryChange: () => {},
  }, propOverrides);

  const menu = shallow(<Menu {...props} />);

  const sortOptions = menu.instance().sortOptions;
  const sortOptionSelector = () => menu.find('.menu-sort Select');
  const searchOptionSelector = () => menu.find('.menu-search Select');
  const searchInputSelector = () => menu.find('.menu-search input');

  return {
    props,
    menu,
    sortOptions,
    sortOptionSelector,
    searchOptionSelector,
    searchInputSelector,
  };
};

const getDefaultOptions = () => ([
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
]);


// Tests
describe('<Menu />', () => {
  describe('sort option selector', () => {
    it('renders a Select component to select the sort option', () => {
      const { sortOptionSelector } = setup();

      expect(sortOptionSelector().length).toBe(1);
    });

    it('sets the selected sort option', () => {
      let selectedSortOption = null;
      const { menu, sortOptions, sortOptionSelector } = setup({ selectedSortOption });

      sortOptions.forEach((sortOption) => {
        selectedSortOption = sortOption;
        menu.setProps({ selectedSortOption });

        expect(sortOptionSelector().prop('value')).toBe(selectedSortOption.value);
      });
    });

    it('sets the sort option change method', () => {
      const onSortOptionChange = jest.fn();
      const { sortOptionSelector } = setup({ onSortOptionChange });

      sortOptionSelector().prop('onChange')();

      expect(onSortOptionChange).toHaveBeenCalled();
    });
  });


  describe('search option selector', () => {
    it('renders a Select component to select the search option', () => {
      const { searchOptionSelector } = setup();

      expect(searchOptionSelector().length).toBe(1);
    });

    it('sets the search options', () => {
      const searchOptions = getDefaultOptions();
      const { searchOptionSelector } = setup({ searchOptions });

      expect(searchOptionSelector().prop('options')).toEqual(searchOptions);
    });

    it('sets the selected search option', () => {
      let selectedSearchOption = null;
      const searchOptions = getDefaultOptions();
      const { menu, searchOptionSelector } = setup({ searchOptions, selectedSearchOption });

      searchOptions.forEach((searchOption) => {
        selectedSearchOption = searchOption;
        menu.setProps({ selectedSearchOption });

        expect(searchOptionSelector().prop('value')).toBe(selectedSearchOption.value);
      });
    });

    it('sets the search option change method', () => {
      const onSearchOptionChange = jest.fn();
      const { searchOptionSelector } = setup({ onSearchOptionChange });

      searchOptionSelector().prop('onChange')();

      expect(onSearchOptionChange).toHaveBeenCalled();
    });
  });


  describe('search input', () => {
    it('renders an input to get the search value', () => {
      const { searchInputSelector } = setup();

      expect(searchInputSelector().length).toBe(1);
    });

    it('sets the search input value', () => {
      const searchQueryValue = 'test input value';
      const { searchInputSelector } = setup({ searchQueryValue });

      expect(searchInputSelector().prop('value')).toBe(searchQueryValue);
    });

    it('sets the search value change method', () => {
      const onSearchQueryChange = jest.fn();
      const { searchInputSelector } = setup({ onSearchQueryChange });

      searchInputSelector().prop('onChange')();

      expect(onSearchQueryChange).toHaveBeenCalled();

    });
  });
});
