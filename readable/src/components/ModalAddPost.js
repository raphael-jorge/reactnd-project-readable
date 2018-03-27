import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import capitalize from '../util/capitalize';
import { areAllEntriesProvided } from '../util/objectsVerifier';
import Loading from './Loading';
import OperationConfirm from './OperationConfirm';
import Placeholder from './Placeholder';

/**
 * Um componente modal para criação de novos posts
 */
export default class ModalAddPost extends PureComponent {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onModalClose: PropTypes.func.isRequired,
    onPostAdd: PropTypes.func.isRequired,
    categories: PropTypes.array.isRequired,
    activeCategoryPath: PropTypes.string,
  }

  LOADING_COVER_COMPONENT = <Loading type="cover-squares" />

  state = {
    isProcessing: false,
    title: '',
    body: '',
    author: '',
    category: this.props.activeCategoryPath || '',
    titleErrorClass: '',
    bodyErrorClass: '',
    authorErrorClass: '',
    categoryErrorClass: '',
  }

  componentWillReceiveProps(nextProps) {
    // Atualiza o estado category com base na categoria atual
    if (nextProps.activeCategoryPath
        && this.state.category !== nextProps.activeCategoryPath) {
      this.setState({ category: nextProps.activeCategoryPath });
    }
  }

  handleTitleChange = (event) => {
    const newTitle = event.target.value;
    const errorClass = newTitle ? '' : 'input-error';

    this.setState({
      title: newTitle,
      titleErrorClass: errorClass,
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

  handleAuthorChange = (event) => {
    const newAuthor = event.target.value;
    const errorClass = newAuthor ? '' : 'input-error';

    this.setState({
      author: newAuthor,
      authorErrorClass: errorClass,
    });
  }

  handleCategoryChange = (event) => {
    const newCategory = event.target.value;
    const errorClass = newCategory ? '' : 'input-error';

    this.setState({
      category: newCategory,
      categoryErrorClass: errorClass,
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
      title: '',
      body: '',
      author: '',
      category: '',
      titleErrorClass: '',
      bodyErrorClass: '',
      authorErrorClass: '',
      categoryErrorClass: '',
    });

    this.props.onModalClose();
  }

  /**
   * Realiza os procedimentos necessários para efetivar a criação do post.
   * Para isso, verifica se as entradas necessárias foram fornecidas. Caso
   * tenham sido, configura o estado processing no state e chama a função
   * onPostAdd, fornecida via props, com os dados fornecidos para a criação
   * do post. Por fim, concluído o processo de criação do post, chama o
   * método handleModalClose para fechar o modal.
   */
  handleSubmit = async () => {
    const requiredEntries = ['title', 'body', 'author', 'category'];

    if (areAllEntriesProvided(requiredEntries, this.state)) {
      this.setState({ isProcessing: true });

      const postData = {
        title: this.state.title,
        body: this.state.body,
        author: this.state.author,
        category: this.state.category,
      };

      await this.props.onPostAdd(postData)
        .then(this.handleModalClose)
        .catch(() => this.setState({ isProcessing: false }));
    }
  }

  render() {
    const {
      isOpen,
      onModalClose,
      categories,
    } = this.props;

    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={onModalClose}
        className={`modal-create-post ${this.state.category}`}
        overlayClassName="modal-overlay"
        shouldCloseOnOverlayClick={false}
      >
        <h2 className="modal-header font-cursive">New Post</h2>

        {/* Loading para processamento */}
        <Placeholder
          isReady={!this.state.isProcessing}
          fallback={this.LOADING_COVER_COMPONENT}
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

          {/* Entrada di Título */}
          <label htmlFor="input-title">
            Title:
            <input
              className={`input ${this.state.titleErrorClass}`}
              id="input-title"
              type="text"
              placeholder="Title"
              value={this.state.title}
              onChange={this.handleTitleChange}
            />
          </label>

          {/* Entrada da mensagem do post */}
          <label htmlFor="input-body">
            Message:
            <textarea
              className={`input ${this.state.bodyErrorClass}`}
              id="input-body"
              placeholder="Post Message"
              value={this.state.body}
              onChange={this.handleBodyChange}
            />
          </label>

          {/* Entrada da categoria do post */}
          <fieldset className={`options ${this.state.categoryErrorClass}`}>
            <legend>Category</legend>

            {categories.map((category) => (
              <label className="option" key={category.path} htmlFor={category.path}>
                <input
                  type="radio"
                  id={category.path}
                  value={category.path}
                  name="category"
                  checked={category.path === this.state.category}
                  onChange={this.handleCategoryChange}
                />
                {capitalize(category.name)}
              </label>
            ))}

          </fieldset>

        </form>

        <OperationConfirm
          onConfirm={this.handleSubmit}
          onCancel={this.handleModalClose}
        />
      </Modal>
    );
  }
}
