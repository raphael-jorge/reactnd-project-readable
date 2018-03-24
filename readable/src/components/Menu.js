import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

export default class Menu extends PureComponent {
  static propTypes = {
    selectedSortOption: PropTypes.object,
    onSortOptionChange: PropTypes.func,
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
    } = this.props;

    return (
      <div className="menu-row">

        {selectedSortOption !== undefined && onSortOptionChange &&
          <Select
            className="select-menu"
            name="sortOption"
            placeholder="Sort By"
            searchable={false}
            clearValueText="Clear Sort Option"
            value={selectedSortOption && selectedSortOption.value}
            onChange={onSortOptionChange}
            options={this.sortOptions}
          />
        }

      </div>
    );
  }
}
