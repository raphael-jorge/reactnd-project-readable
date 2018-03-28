import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

Menu.propTypes = {
  // As opções disponíveis para ordenação dos dados
  sortOptions: PropTypes.array.isRequired,
  // A opção selecionada para ordenar os dados
  selectedSortOption: PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  }),
  // Função a ser chamada quando a opção de ordenação dos dados é alterada
  onSortOptionChange: PropTypes.func.isRequired,
  // As opções disponíveis para filtrar os dados
  searchOptions: PropTypes.array.isRequired,
  // A opção selecionada para filtrar os dados
  selectedSearchOption: PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  }),
  // Função a ser chamada quando a opção de filtro dos dados é alterada
  onSearchOptionChange: PropTypes.func.isRequired,
  // O valor do formulário de pesquisa (componente controlado)
  searchQueryValue: PropTypes.string.isRequired,
  // Função a ser chamada quando o valor do formulário de pesquisa é alterado
  onSearchQueryChange: PropTypes.func.isRequired,
};

/* Um menu para controle de dados */
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

      {/* Controle dos parâmetros de filtragem dos dados */}
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

      {/* Controle dos parâmetros de ordenação dos dados */}
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
