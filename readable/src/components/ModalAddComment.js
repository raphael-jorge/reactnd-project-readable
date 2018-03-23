import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import { areAllEntriesProvided } from '../util/utils';
import Loading from './Loading';
import OperationConfirm from './OperationConfirm';
import Placeholder from './Placeholder';
import Post from './Post';

/**
 * Um componente modal para criação de novos comentários
 */
export default class ModalAddComment extends Component {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    postData: PropTypes.object.isRequired,
    onModalClose: PropTypes.func.isRequired,
    onCommentAdd: PropTypes.func.isRequired,
  }

  state = {
    isProcessing: false,
    author: '',
    body: '',
    authorErrorClass: '',
    bodyErrorClass: '',
  }

  handleAuthorChange = (event) => {
    const newAuthor = event.target.value;
    const errorClass = newAuthor ? '' : 'input-error';

    this.setState({
      author: newAuthor,
      authorErrorClass: errorClass,
    });
  }

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
            fallback={<Loading type="cover-squares" />}
            delay={250}
          />

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

            {/* Entrada da mensagem do comentário */}
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
