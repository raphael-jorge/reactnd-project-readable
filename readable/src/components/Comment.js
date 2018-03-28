import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import formatDate from '../util/formatDate';
import { areAllEntriesProvided, areKeysDifferent } from '../util/objectsVerifier';
import Operations from './Operations';
import Loading from './Loading';
import Placeholder from './Placeholder';

/* Representa um comentário */
export default class Comment extends PureComponent {
  static propTypes = {
    // Os dados do comentário
    commentData: PropTypes.object.isRequired,
    // Função chamado quando uma operação de voto é acionada
    onVote: PropTypes.func.isRequired,
    // Função chamado quando a operação de remoção do comentário é acionada
    onRemove: PropTypes.func.isRequired,
    // Função chamado quando a operação de edição do comentário é confirmada
    onUpdate: PropTypes.func.isRequired,
  }

  /* Componente exibido enquanto alguma operação é realizada */
  LOADING_COVER_COMPONENT = <Loading type="cover-squares" />

  /**
   * Os estados do componente.
   * @property {Boolean} editMode Indica se o componente está em modo de edição.
   * @property {String} bodyInput A mensagem do comentário no modo de edição.
   * @property {String} bodyInputErrorClass Classe CSS a ser adicionada ao formulário de
   * inserção da mensagem em caso de invalidação do conteúdo do formulário.
   */
  state = {
    editMode: false,
    bodyInput: '',
    bodyInputErrorClass: '',
  }

  /**
   * Atualiza os estados bodyInput e bodyInputErrorClass com base em um evento
   * de mudança, especificamente aquele disparado no formulário de edição da
   * mensagem do comentário. bodyInput armazenará o novo valor do formulário.
   * Se este valor for vazio, bodyInputErrorClass será configurado para
   * 'input-error'.
   * @param {Object} event O evento de mudança.
   */
  handleBodyInputChange = (event) => {
    const newBody = event.target.value;
    const errorClass = newBody ? '' : 'input-error';

    this.setState({
      bodyInput: newBody,
      bodyInputErrorClass: errorClass,
    });
  }

  /* Realiza a operação de voto positivo no cometário */
  handleVoteUp = () => this.props.onVote(this.props.commentData, 1)

  /* Realiza a operação de voto negativo no cometário */
  handleVoteDown = () => this.props.onVote(this.props.commentData, -1)

  /* Realiza a operação de remoção do comentário */
  handleRemoveSubmit = () => this.props.onRemove(this.props.commentData)

  /**
   * Inicializa o modo de edição do comentário. Para isso configura o estado
   * editMode para true e o estado bodyInput para o valor atual da mensagem
   * do comentário.
   */
  handleEditModeEnter = () => this.setState({
    editMode: true,
    bodyInput: this.props.commentData.body,
  });

  /**
   * Finaliza o modo de edição do comentário. Para isso configura o estado
   * editMode para false e os estados bodyInput e bodyInputErrorClass para ''.
   */
  handleEditModeLeave = () => this.setState({
    editMode: false,
    bodyInput: '',
    bodyInputErrorClass: '',
  });

  /**
   * Realiza a operação de edição do comentário chamando a função onUpdate
   * fornecida via props. Se a nova mensagem fornecida for idêntica à mensagem
   * original essa função não será chamada, porém o método handleEditModeLeave
   * será chamado, indicando o fim da operação de edição. Por outro lado, se a
   * nova mensagem for vazia nada será feito, indicando que a operação de edição
   * não foi finalizada.
   * @return {Promise} Uma promise que resolve para true se a operação de edição
   * for finalizada e false caso contrário.
   */
  handleEditSubmit = async () => {
    let done = true;

    const requiredEntries = ['bodyInput'];

    if (areAllEntriesProvided(requiredEntries, this.state)) {
      const oldData = { body: this.props.commentData.body };
      const updatedData = { body: this.state.bodyInput };

      if (areKeysDifferent(oldData, updatedData)) {
        await this.props.onUpdate(this.props.commentData, updatedData);
      }

      this.handleEditModeLeave();

    } else {
      done = false;
    }

    return done;
  }

  voteHandler = ((self=this) => ({
    voteUp: self.handleVoteUp,
    voteDown: self.handleVoteDown,
  }))()

  editHandler = ((self=this) => ({
    onRequest: self.handleEditModeEnter,
    onAbort: self.handleEditModeLeave,
    onSubmit: self.handleEditSubmit,
  }))()

  removeHandler = ((self=this) => ({
    onSubmit: self.handleRemoveSubmit,
  }))()

  render() {
    const {
      commentData,
    } = this.props;

    return (
      <article className="comment comment-operations">

        <Placeholder
          isReady={!commentData.processing}
          fallback={this.LOADING_COVER_COMPONENT}
          delay={250}
        />

        <div className="comment-info">
          <span>{ commentData.author }</span>
          { ' - ' }
          <span>{ formatDate(commentData.timestamp) }</span>
        </div>

        <div className="comment-vote-score">
          {commentData.voteScore}
        </div>

        {this.state.editMode ? (
          <textarea
            className={`comment-body input-edit ${this.state.bodyInputErrorClass}`}
            placeholder="Comment Body"
            value={this.state.bodyInput}
            onChange={this.handleBodyInputChange}
          />
        ) : (
          <p className="comment-body">
            { commentData.body }
          </p>
        )}

        <Operations
          voteHandler={this.voteHandler}
          editHandler={this.editHandler}
          removeHandler={this.removeHandler}
        />

      </article>
    );
  }
}
