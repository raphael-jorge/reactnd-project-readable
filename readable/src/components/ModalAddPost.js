import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import capitalize from '../util/capitalize';
import { areAllEntriesProvided } from '../util/objectsVerifier';
import Loading from './Loading';
import OperationConfirm from './OperationConfirm';
import Placeholder from './Placeholder';

/* Um componente modal para adição de novos posts */
export default class ModalAddPost extends PureComponent {
  static propTypes = {
    // Indica se o modal está aberto ou não
    isOpen: PropTypes.bool.isRequired,
    // Função a ser chamada quando o modal for fechado
    onModalClose: PropTypes.func.isRequired,
    // Função a ser chamada quando o a operação de adição for confirmada
    onPostAdd: PropTypes.func.isRequired,
    // As categorias disponíveis para adição de novos posts
    categories: PropTypes.array.isRequired,
    // O valor inicial da categoria a ser adicionado o novo post
    initialCategory: PropTypes.string,
  }

  /* Componente exibido enquanto a operação de adição do post é processada */
  LOADING_COVER_COMPONENT = <Loading type="cover-squares" />

  /**
   * Os estados do componente.
   * @property {Boolean} isProcessing Indica se a operação de adição está sendo processada.
   * @property {String} title O título do novo post.
   * @property {String} body A mensagem do novo post.
   * @property {String} author O autor do novo post.
   * @property {String} category A categoria na qual o novo post será adicionado.
   * @property {String} titleErrorClass Classe CSS a ser adicionada ao formulário de
   * inserção do título em caso de invalidação do conteúdo do formulário.
   * @property {String} bodyErrorClass Classe CSS a ser adicionada ao formulário de
   * inserção da mensagem em caso de invalidação do conteúdo do formulário.
   * @property {String} authorErrorClass Classe CSS a ser adicionada ao formulário de
   * inserção do autor em caso de invalidação do conteúdo do formulário.
   * @property {String} categoryErrorClass Classe CSS a ser adicionada ao formulário de
   * inserção da categoria em caso de invalidação do conteúdo do formulário.
   */
  state = {
    isProcessing: false,
    title: '',
    body: '',
    author: '',
    category: this.props.initialCategory || '',
    titleErrorClass: '',
    bodyErrorClass: '',
    authorErrorClass: '',
    categoryErrorClass: '',
  }

  /**
   * Atualiza o estado category ao receber um novo valor para a prop initialCategory.
   * Se o novo valor for undefined, e estado é configurado para ''.
   * @param {Object} nextProps As novas propriedades a serem recebidas pelo componente.
   */
  componentWillReceiveProps(nextProps) {
    const { initialCategory: currentInitialCategory } = this.props;
    const { initialCategory: nextInitialCategory } = nextProps;

    if (nextInitialCategory !== currentInitialCategory) {
      if (nextInitialCategory !== undefined) {
        this.setState({ category: nextProps.initialCategory });
      } else {
        this.setState({ category: '' });
      }
    }
  }

  /**
   * Atualiza os estados title e titleErrorClass com base em um evento
   * de mudança, especificamente aquele disparado no formulário de inserção do
   * título do post. O estado title armazenará o novo valor do formulário.
   * Se este valor for vazio, titleErrorClass será configurado para 'input-error'.
   * @param {Object} event O evento de mudança.
   */
  handleTitleChange = (event) => {
    const newTitle = event.target.value;
    const errorClass = newTitle ? '' : 'input-error';

    this.setState({
      title: newTitle,
      titleErrorClass: errorClass,
    });
  }

  /**
   * Atualiza os estados body e bodyErrorClass com base em um evento
   * de mudança, especificamente aquele disparado no formulário de inserção da
   * mensagem do post. O estado body armazenará o novo valor do formulário.
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
   * Atualiza os estados author e authorErrorClass com base em um evento
   * de mudança, especificamente aquele disparado no formulário de inserção do
   * autor do post. O estado author armazenará o novo valor do formulário.
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
   * Atualiza os estados category e categoryErrorClass com base em um evento
   * de mudança, especificamente aquele disparado no formulário de inserção da
   * categoria do post. O estado category armazenará o novo valor do formulário.
   * Se este valor for vazio, categoryErrorClass será configurado para 'input-error'.
   * @param {Object} event O evento de mudança.
   */
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

          {/* Entrada do título */}
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

          {/* Entrada da mensagem */}
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

          {/* Entrada da categoria */}
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
