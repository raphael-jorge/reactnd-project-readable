import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ArrowUpIcon from 'react-icons/lib/fa/caret-up';
import ArrowDownIcon from 'react-icons/lib/fa/caret-down';
import EditIcon from 'react-icons/lib/ti/edit';
import RemoveIcon from 'react-icons/lib/fa/trash';
import OperationConfirm from './OperationConfirm';

/**
 * Interface de controle para manipulação de votos, operações de edição
 * e remoção de posts ou comentários.
 */
export default class Operations extends PureComponent {
  static propTypes = {
    voteHandler: PropTypes.shape({
      voteUp: PropTypes.func.isRequired,
      voteDown: PropTypes.func.isRequired,
    }).isRequired,
    editHandler: PropTypes.shape({
      onRequest: PropTypes.func,
      onAbort: PropTypes.func,
      onSubmit: PropTypes.func.isRequired,
    }).isRequired,
    removeHandler: PropTypes.shape({
      onRequest: PropTypes.func,
      onAbort: PropTypes.func,
      onSubmit: PropTypes.func.isRequired,
    }).isRequired,
  };

  state = {
    operationHandler: null,
  }

  /**
   * Realiza a operação de voto positivo.
   */
  handleVoteUp = (event) => {
    event.preventDefault();
    this.props.voteHandler.voteUp();
  }

  /**
   * Realiza a operação de voto negativo.
   */
  handleVoteDown = (event) => {
    event.preventDefault();
    this.props.voteHandler.voteDown();
  }

  /**
   * Inicializa a operação de edição. Para isso, chama o método
   * onRequest da prop editHandler quando disponível e configura
   * o estado operationHandler para a prop editHandler.
   */
  handleEditRequest = (event) => {
    event.preventDefault();
    const { editHandler } = this.props;

    if (editHandler.onRequest) {
      editHandler.onRequest();
    }

    this.setState({ operationHandler: editHandler });
  }

  /**
   * Inicializa a operação de remoção. Para isso, chama o método
   * onRequest da prop removeHandler quando disponível e configura
   * o estado operationHandler para a prop removeHandler.
   */
  handleRemoveRequest = (event) => {
    event.preventDefault();
    const { removeHandler } = this.props;

    if (removeHandler.onRequest) {
      removeHandler.onRequest();
    }

    this.setState({ operationHandler: removeHandler });
  }

  /**
   * Executa o método onSubmit presente no estado operationHandler.
   * Se essa operação retornar true, indicando que a operação foi bem
   * sucedida, o estado operationHandler é configurado para null. Caso
   * contrário, o estado permanece inalterado. (O estado operationHandler
   * deve ser previamente configurado).
   */
  handleSubmit = async () => {
    if (await this.state.operationHandler.onSubmit()) {
      this.setState({ operationHandler: null });
    }
  }

  /**
   * Executa o método onAbort presente no estado operationHandler,
   * quando disponível. Após realizar essa chamada, o estado operationHandler
   * é configurado para null. (O estado operationHandler deve ser previamente
   * configurado).
   */
  handleAbort = () => {
    if (this.state.operationHandler.onAbort) {
      this.state.operationHandler.onAbort();
    }
    this.setState({ operationHandler: null });
  }

  render() {
    return (
      <div>

        {/* Interface de controle votos */}
        <div className="vote-operations">
          <button
            title="Vote Up"
            className="vote-up"
            onClick={this.handleVoteUp}
          >
            <ArrowUpIcon size={20} />
          </button>

          <button
            title="Vote Down"
            className="vote-down"
            onClick={this.handleVoteDown}
          >
            <ArrowDownIcon size={20} />
          </button>
        </div>

        {/* Interface de controle das operações de edição e remoção */}
        {this.state.operationHandler === null ? (
          // Renderiza um button para cada operação
          <div className="operations">
            <button
              title="Edit"
              className="operation-item"
              onClick={this.handleEditRequest}
            >
              <EditIcon size={20} />
            </button>

            <button
              title="Delete"
              className="operation-item"
              onClick={this.handleRemoveRequest}
            >
              <RemoveIcon size={20} />
            </button>
          </div>
        ) : (
          // Qunado uma operação é inicializada, renderiza componente para confirmação
          <OperationConfirm
            onConfirm={this.handleSubmit}
            onCancel={this.handleAbort}
          />
        )}

      </div>
    );
  }
}
