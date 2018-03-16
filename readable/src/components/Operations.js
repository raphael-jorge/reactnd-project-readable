import React, { Component } from 'react';
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
export default class Operations extends Component {
  static propTypes = {
    voteData: PropTypes.shape({
      voteCount: PropTypes.number.isRequired,
      onVoteUp: PropTypes.func.isRequired,
      onVoteDown: PropTypes.func.isRequired,
    }).isRequired,
    onEdit: PropTypes.shape({
      onRequest: PropTypes.func,
      onAbort: PropTypes.func,
      onSubmit: PropTypes.func.isRequired,
    }).isRequired,
    onRemove: PropTypes.shape({
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
    this.props.voteData.onVoteUp();
  }

  /**
   * Realiza a operação de voto negativo.
   */
  handleVoteDown = (event) => {
    event.preventDefault();
    this.props.voteData.onVoteDown();
  }

  /**
   * Inicializa uma determinada operação. Para isso chama o método
   * onRequest do parâmetro operationHandler, quando disponível,
   * e configura o estado operationHandler com esse parâmetro.
   * @param {object} operationHandler O objeto com os métodos da operação.
   */
  handleRequest = (event, operationHandler) => {
    event.preventDefault();
    if (operationHandler.onRequest) {
      operationHandler.onRequest();
    }
    this.setState({ operationHandler });
  }

  /**
   * Executa o método onSubmit presente no estado operationHandler.
   * Se essa operação retornar true, indicando que a operação foi bem
   * sucedida, o estado operationHandler é configurado para null. Caso
   * contrário, o estado permanece inalterado. (O estado operationHandler
   * deve ser previamente configurado com o método handleRequest).
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
   * configurado com o método handleRequest).
   */
  handleAbort = () => {
    if (this.state.operationHandler.onAbort) {
      this.state.operationHandler.onAbort();
    }
    this.setState({ operationHandler: null });
  }

  render() {
    const {
      voteData,
      onEdit,
      onRemove,
    } = this.props;

    return (
      <div>

        {/* Interface de votos */}
        <div className="vote-operations">
          <button
            title="Vote Up"
            className="vote-up"
            onClick={this.handleVoteUp}
          >
            <ArrowUpIcon size={20} />
          </button>

          <div className="vote-count">{voteData.voteCount}</div>

          <button
            title="Vote Down"
            className="vote-down"
            onClick={this.handleVoteDown}
          >
            <ArrowDownIcon size={20} />
          </button>
        </div>

        {/* Interface de operações => edição, remoção */}
        {this.state.operationHandler === null ? (
          // Renderiza um button para cada operação (edit, remove)
          <div className="operations">
            <button
              title="Edit"
              className="operation-item"
              onClick={(event) => this.handleRequest(event, onEdit)}
            >
              <EditIcon size={20} />
            </button>

            <button
              title="Delete"
              className="operation-item"
              onClick={(event) => this.handleRequest(event, onRemove)}
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