import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import { areAllEntriesProvided } from '../util/objectsVerifier';
import Loading from './Loading';
import OperationConfirm from './OperationConfirm';
import Placeholder from './Placeholder';
import Post from './Post';

/* Um componente modal para adição de novos comentários */
export default class ModalAddComment extends PureComponent {
  static propTypes = {
    // Indica se o modal está aberto ou não
    isOpen: PropTypes.bool.isRequired,
    // Os dados do post ao qual o comentário será adicionado
    postData: PropTypes.object.isRequired,
    // Função a ser chamada quando o modal for fechado
    onModalClose: PropTypes.func.isRequired,
    // Função a ser chamada quando o a operação de adição for confirmada
    onCommentAdd: PropTypes.func.isRequired,
  }

  /* Componente exibido enquanto a operação de adição do comentário é processada */
  LOADING_COVER_COMPONENT = <Loading type="cover-squares" />

  /**
   * Os estados do componente.
   * @property {Boolean} isProcessing Indica se a operação de adição está sendo processada.
   * @property {String} author O autor do novo comentário.
   * @property {String} body A mensagem do novo comentário.
   * @property {String} authorErrorClass Classe CSS a ser adicionada ao formulário de
   * inserção do autor em caso de invalidação do conteúdo do formulário.
   * @property {String} bodyErrorClass Classe CSS a ser adicionada ao formulário de
   * inserção da mensagem em caso de invalidação do conteúdo do formulário.
   */
  state = {
    isProcessing: false,
    author: '',
    body: '',
    authorErrorClass: '',
    bodyErrorClass: '',
  }

  /**
   * Atualiza os estados author e authorErrorClass com base em um evento
   * de mudança, especificamente aquele disparado no formulário de inserção do
   * autor do comentário. O estado author armazenará o novo valor do formulário.
   * Se este valor for vazio, authorErrorClass será configurado para 'input-error'.
   * @param {Object} event O evento de mudança.
   */
  handleAuthorChange = (event) => {
    const newAuthor = event.target.value;
    const errorClass = newAuthor ? '' : 'input-error';

    this.setState({
      author: newAuthor,
      authorErrorClass: errorClass,
    });
  }

  /**
   * Atualiza os estados body e bodyErrorClass com base em um evento
   * de mudança, especificamente aquele disparado no formulário de inserção da
   * mensagem do comentário. O estado body armazenará o novo valor do formulário.
   * Se este valor for vazio, bodyErrorClass será configurado para 'input-error'.
   * @param {Object} event O evento de mudança.
   */
  handleBodyChange = (event) => {
    const newBody = event.target.value;
    const errorClass = newBody ? '' : 'input-error';

    this.setState({
      body: newBody,
      bodyErrorClass: errorClass,
    });
  }

  /**
   * Realiza os procedimentos necessários para fechar o modal. Para isso,
   * reinicia o estado do modal para os valores iniciais e chama a função
   * onModalClose, fornecida via props.
   */
  handleModalClose = () => {
    this.setState({
      isProcessing: false,
      author: '',
      body: '',
      authorErrorClass: '',
      bodyErrorClass: '',
    });

    this.props.onModalClose();
  }

  /**
   * Realiza os procedimentos necessários para efetivar a criação do comentário.
   * Para isso, verifica se as entradas necessárias foram fornecidas. Caso
   * tenham sido, configura o estado processing no state e chama a função
   * onCommentAdd, fornecida via props, com os dados fornecidos para a criação
   * do comentário. Por fim, concluído o processo de criação, chama o método
   * handleModalClose para fechar o modal.
   */
  handleSubmit = async () => {
    const requiredEntries = ['body', 'author'];

    if (areAllEntriesProvided(requiredEntries, this.state)) {
      this.setState({ isProcessing: true });

      const commentData = {
        body: this.state.body,
        author: this.state.author,
      };

      await this.props.onCommentAdd(this.props.postData.id, commentData)
        .then(this.handleModalClose)
        .catch(() => this.setState({ isProcessing: false }));
    }
  }

  render() {
    const {
      isOpen,
      postData,
      onModalClose,
    } = this.props;

    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={onModalClose}
        className="modal-create-comment"
        overlayClassName="modal-overlay"
        shouldCloseOnOverlayClick={false}
      >
        <Post
          postData={postData}
          readMode
        />

        <hr />

        <div className="comment">
          {/* Loading para processamento */}
          <Placeholder
            isReady={!this.state.isProcessing}
            fallback={this.LOADING_COVER_COMPONENT}
            delay={250}
          />

          <h2 className="modal-header font-cursive">New Comment</h2>

          <form className="form">
            {/* Entrada do autor */}
            <label htmlFor="input-author">
              Author:
              <input
                className={`input ${this.state.authorErrorClass}`}
                id="input-author"
                type="text"
                placeholder="Author"
                value={this.state.author}
                onChange={this.handleAuthorChange}
              />
            </label>

            {/* Entrada da mensagem */}
            <label htmlFor="input-body">
              Message:
              <textarea
                className={`input ${this.state.bodyErrorClass}`}
                id="input-body"
                placeholder="Comment Message"
                value={this.state.body}
                onChange={this.handleBodyChange}
              />
            </label>
          </form>

          <OperationConfirm
            onConfirm={this.handleSubmit}
            onCancel={this.handleModalClose}
          />
        </div>

      </Modal>
    );
  }
}
