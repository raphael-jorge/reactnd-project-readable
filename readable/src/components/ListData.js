import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * Lista uma array de dados usando um determinado componente.
 * Permite lidar com casos em que os dados sendo carregados e
 * a array de dados é vazia.
 */
export default class ListData extends Component {
  static propTypes = {
    ComponentToList: PropTypes.func.isRequired,
    componentProps: PropTypes.shape({
      dataPropName: PropTypes.string.isRequired,
      dataArr: PropTypes.array.isRequired,
      individual: PropTypes.object,
      common: PropTypes.object,
    }).isRequired,
    isLoading: PropTypes.bool,
    hasErrored: PropTypes.bool,
    loadErrorMsg: PropTypes.string,
    noDataMsg: PropTypes.string,
  }

  /**
   * Converte um objeto da forma key: array em um novo objeto da forma
   * key: array[idx].
   * @param  {object} arrayValuesObj O objeto com os pares key: array.
   * @param  {number} idx         O índice do elemento a ser extraído da array.
   * @return {object}             O objeto com pares key: array[idx].
   */
  getObjectValuesFromIdx(arrayValuesObj, idx) {
    const keys = Object.keys(arrayValuesObj);
    if (!keys.length) {
      return {};
    }
    return keys.reduce((valuesAtIdx, key) => {
      valuesAtIdx[key] = arrayValuesObj[key][idx];
      return valuesAtIdx;
    }, {});
  }

  render() {
    const {
      ComponentToList,
      componentProps,
      isLoading,
      hasErrored,
      loadErrorMsg,
      noDataMsg,
    } = this.props;

    return (
      <div className="data-list">

        {isLoading &&
          <div className="loading-squares">Loading</div>
        }

        {!isLoading && hasErrored && loadErrorMsg &&
          <p className="status-msg">
            { loadErrorMsg }
          </p>
        }

        {!isLoading && !hasErrored && componentProps.dataArr.length > 0 &&
          componentProps.dataArr.map((data, i) => {
            const commonProps = componentProps.common ? componentProps.common : {};
            const individualProps = componentProps.individual ?
              this.getObjectValuesFromIdx(componentProps.individual, i) : {};

            return (
              <ComponentToList
                key={data.id}
                // A proprieda principal, que determina os dados
                {...{ [componentProps.dataPropName]: data }}
                // Propriedades adicionais, específicas de cada elemento
                {...individualProps}
                // Propriedades comuns a todos os elementos
                {...commonProps}
              />
            );
          })
        }

        {!isLoading && !hasErrored && !componentProps.dataArr.length && noDataMsg &&
          <p className="status-msg">
            { noDataMsg }
          </p>
        }

      </div>
    );
  }
}
