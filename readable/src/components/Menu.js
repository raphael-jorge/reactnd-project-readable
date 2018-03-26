import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

export default class Menu extends PureComponent {
  static propTypes = {
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
  }

  sortOptions = [
    { value: '-voteScore', label: 'Votes: High to Low' },
    { value: 'voteScore', label: 'Votes: Low to High' },
    { value: '-timestamp', label: 'Newest' },
    { value: 'timestamp', label: 'Oldest' },
  ]

  render() {
    const {
      selectedSortOption,
      onSortOptionChange,
      searchOptions,
      selectedSearchOption,
      onSearchOptionChange,
      searchQueryValue,
      onSearchQueryChange,
    } = this.props;

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
            options={this.sortOptions}
          />
        </div>

      </div>
    );
  }
}
