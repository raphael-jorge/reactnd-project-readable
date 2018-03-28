import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import CheckIcon from 'react-icons/lib/fa/check';
import CrossIcon from 'react-icons/lib/fa/close';

/* Um componente para confirmar ou cancelar alguma operação */
export default class OperationConfirm extends PureComponent {
  static propTypes = {
    // Função a ser chamada com a confirmação da operação
    onConfirm: PropTypes.func.isRequired,
    // Função a ser chamada com o cancelamento da operação
    onCancel: PropTypes.func.isRequired,
  }

  /**
   * Confirma a operação chamando a função onConfirm fornecida via props.
   * @param {[type]} event O evento de clique no botão de confirmação.
   */
  handleConfirmation = (event) => {
    event.preventDefault();
    this.props.onConfirm();
  }

  /**
   * Cancela a operação chamando a função onCancel fornecida via props.
   * @param {[type]} event O evento de clique no botão de cancelamento.
   */
  handleCancelation = (event) => {
    event.preventDefault();
    this.props.onCancel();
  }

  render() {

    return (
      <div className="operations">

        <button
          title="Confirm"
          className="operation-confirm"
          onClick={this.handleConfirmation}
        >
          <CheckIcon size={20} />
        </button>

        <button
          title="Cancel"
          className="operation-cancel"
          onClick={this.handleCancelation}
        >
          <CrossIcon size={20} />
        </button>

      </div>
    );
  }
}
