import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

export default function Menu(props) {
  const {
    sortMenu,
  } = props;

  return (
    <div className="menu-row">

      {sortMenu &&
        <Select
          className="select-menu"
          name="sortOption"
          placeholder="Sort By"
          searchable={false}
          clearValueText="Clear Sort Option"
          value={sortMenu.selectedSortOption && sortMenu.selectedSortOption.value}
          onChange={sortMenu.onSortOptionChange}
          options={[
            { value: '-voteScore', label: 'Votes: High to Low' },
            { value: 'voteScore', label: 'Votes: Low to High' },
            { value: '-timestamp', label: 'Newest' },
            { value: 'timestamp', label: 'Oldest' },
          ]}
        />
      }

    </div>
  );
}

Menu.propTypes = {
  sortMenu: PropTypes.shape({
    selectedSortOption: PropTypes.object,
    onSortOptionChange: PropTypes.func.isRequired,
  }),
};
