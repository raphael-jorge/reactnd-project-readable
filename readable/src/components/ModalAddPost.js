import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import { capitalize } from '../util/utils';
import Loading from './Loading';
import OperationConfirm from './OperationConfirm';
import Placeholder from './Placeholder';

/**
 * Um componente modal para criação de novos posts
 */
export default class ModalAddPost extends Component {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onModalClose: PropTypes.func.isRequired,
    onPostAdd: PropTypes.func.isRequired,
    categories: PropTypes.array.isRequired,
    activeCategoryPath: PropTypes.string,
  }

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

  componentDidMount() {
    Modal.setAppElement('#root');
  }

  componentWillReceiveProps(nextProps) {
    // Atualiza o estado category com base na categoria atual
    if (nextProps.activeCategoryPath
        && this.state.category !== nextProps.activeCategoryPath) {
      this.setState({ category: nextProps.activeCategoryPath });
    }
  }

  /**
   * Configura os estados do modal para seus valores inicias
   */
  resetState = () => {
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
  }

  /**
   * Verifica se uma determinada entrada, cujo valor é armazenado
   * no state, foi devidamente fornecida pelo usuário. Caso contrário,
   * configura o respectivo estado ErrorClass, que acusará a existência
   * de um erro referente à entrada especificada.
   * @param  {String}  entry O nome da entrada, à ser verificada, no state.
   * @return {Boolean}       Indica se a entrada foi devidamente fornecida.
   */
  isEntryProvided = (entry) => {
    let valid = true;
    if (this.state[entry] === '') {
      valid = false;
      this.setState({ [`${entry}ErrorClass`]: 'input-error' });
    } else {
      this.setState({ [`${entry}ErrorClass`]: '' });
    }
    return valid;
  }

  /**
   * Verifia se todas as entradas necessários para a criação de um post
   * foram devidamente especificadas pelo usuário. Para cada uma delas
   * o método isEntryValid será chamado, configurando assim os respectivos
   * estados ErrorClass quando necessário.
   * @param  {Array}   entries Os nomes das entradas a serem verificadas.
   * @return {Boolean}         Indica se todas as entradas especificadas foram
   *                           devidamente fornecidas.
   */
  areAllEntriesProvided = (entries) => {
    let valid = true;
    entries.forEach((entry) => {
      valid = this.isEntryProvided(entry) && valid;
    });
    return valid;
  }

  /**
   * Realiza os procedimentos necessários para fechar o modal sem criar o
   * post. Para isso, reinicia o estado do modal para os valores iniciais
   * e chama a função onModalClose, fornecida via props.
   */
  handleModalClose = () => {
    this.props.onModalClose();
    this.resetState();
  }

  /**
   * Realiza os procedimentos necessários para efetivar a criação do post.
   * Para isso, verifica se as entradas necessárias foram fornecidas. Caso
   * tenham sido, configura o estado processing no state e chama a função
   * onPostAdd, fornecida via props, com os dados fornecidos para a criação
   * do post. Por fim, concluído o processo de criação do post, chama o
   * método handleModalClose para fechar o modal.
   * @return {Promise} O post criaddo, quando resolvida.
   */
  handleSubmit = async () => {
    const requiredEntries = ['title', 'body', 'author', 'category'];

    if (this.areAllEntriesProvided(requiredEntries)) {
      this.setState({ isProcessing: true });

      const postData = {
        title: this.state.title,
        body: this.state.body,
        author: this.state.author,
        category: this.state.category,
      };

      await this.props.onPostAdd(postData);
      this.handleModalClose();
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
        className="modal-create-post"
        overlayClassName="modal-overlay"
        shouldCloseOnOverlayClick={false}
      >
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
              onChange={(event) => this.setState({ author: event.target.value })}
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
              onChange={(event) => this.setState({ title: event.target.value })}
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
              onChange={(event) => this.setState({ body: event.target.value })}
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
                  onChange={(event) => this.setState({ category: event.target.value })}
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
