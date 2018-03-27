import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

Menu.propTypes = {
  sortOptions: PropTypes.array.isRequired,
  selectedSortOption: PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  }),
  onSortOptionChange: PropTypes.func.isRequired,
  searchOptions: PropTypes.array.isRequired,
  selectedSearchOption: PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  }),
  onSearchOptionChange: PropTypes.func.isRequired,
  searchQueryValue: PropTypes.string.isRequired,
  onSearchQueryChange: PropTypes.func.isRequired,
};

export default function Menu(props) {
  const {
    sortOptions,
    selectedSortOption,
    onSortOptionChange,
    searchOptions,
    selectedSearchOption,
    onSearchOptionChange,
    searchQueryValue,
    onSearchQueryChange,
  } = props;

  return (
    <div className="menu-row">

      <div className="menu-search">
        <Select
          className="menu-select-item"
          name="sortOption"
          searchable={false}
          clearable={false}
          value={selectedSearchOption && selectedSearchOption.value}
          onChange={onSearchOptionChange}
          options={searchOptions}
        />

        <input
          type="text"
          placeholder="Search"
          value={searchQueryValue}
          onChange={onSearchQueryChange}
        />
      </div>

      <div className="menu-sort">
        <Select
          className="menu-select-item"
          name="sortOption"
          placeholder="Sort By"
          searchable={false}
          clearValueText="Clear Sort Option"
          value={selectedSortOption && selectedSortOption.value}
          onChange={onSortOptionChange}
          options={sortOptions}
        />
      </div>

    </div>
  );
}
