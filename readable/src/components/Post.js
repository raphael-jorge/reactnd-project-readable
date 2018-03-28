import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import CommentsIcon from 'react-icons/lib/md/comment';
import formatDate from '../util/formatDate';
import { areAllEntriesProvided, areKeysDifferent } from '../util/objectsVerifier';
import Operations from './Operations';
import Loading from './Loading';
import Placeholder from './Placeholder';

/* Representa um post */
export default class Post extends PureComponent {
  static propTypes = {
    // Os dados do post
    postData: PropTypes.object.isRequired,
    // Função chamado quando uma operação de voto é acionada
    onVote: PropTypes.func,
    // Função chamado quando a operação de remoção do post é acionada
    onRemove: PropTypes.func,
    // Função chamado quando a operação de edição do post é confirmada
    onUpdate: PropTypes.func,
    // Indica renderização na forma de um link para a página do post
    linkMode: PropTypes.bool,
    // Indica renderização na forma de leitura, com as operações indisponíveis
    readMode: PropTypes.bool,
  }

  /* Componente exibido enquanto alguma operação é realizada */
  LOADING_COVER_COMPONENT = <Loading type="cover-squares" />

  /**
   * Os estados do componente.
   * @property {Boolean} editMode Indica se o componente está em modo de edição.
   * @property {String} bodyInput A mensagem do post no modo de edição.
   * @property {String} titleInput O título do post no modo de edição.
   * @property {String} bodyInputErrorClass Classe CSS a ser adicionada ao formulário de
   * inserção da mensagem em caso de invalidação do conteúdo do formulário.
   * @property {String} titleInputErrorClass Classe CSS a ser adicionada ao formulário de
   * inserção do título em caso de invalidação do conteúdo do formulário.
   */
  state = {
    editMode: false,
    bodyInput: '',
    titleInput: '',
    bodyInputErrorClass: '',
    titleInputErrorClass: '',
  }

  /**
   * Atualiza os estados titleInput e titleInputErrorClass com base em um evento
   * de mudança, especificamente aquele disparado no formulário de edição do
   * título do post. titleInput armazenará o novo valor do formulário.
   * Se este valor for vazio, titleInputErrorClass será configurado para
   * 'input-error'.
   * @param {Object} event O evento de mudança.
   */
  handleTitleInputChange = (event) => {
    const newTitle = event.target.value;
    const errorClass = newTitle ? '' : 'input-error';

    this.setState({
      titleInput: newTitle,
      titleInputErrorClass: errorClass,
    });
  }

  /**
   * Atualiza os estados bodyInput e bodyInputErrorClass com base em um evento
   * de mudança, especificamente aquele disparado no formulário de edição da
   * mensagem do post. bodyInput armazenará o novo valor do formulário.
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

  /* Realiza a operação de voto positivo no post */
  handleVoteUp = () => this.props.onVote(this.props.postData, 1)

  /* Realiza a operação de voto negativo no post */
  handleVoteDown = () => this.props.onVote(this.props.postData, -1)

  /* Realiza a operação de remoção do post */
  handleRemoveSubmit = () => this.props.onRemove(this.props.postData)

  /**
   * Inicializa o modo de edição do post. Para isso configura o estado
   * editMode para true, o estado bodyInput para o valor atual da mensagem
   * do post e o estado titleInput para o valor atual do título do post.
   */
  handleEditModeEnter = () => this.setState({
    editMode: true,
    bodyInput: this.props.postData.body,
    titleInput: this.props.postData.title,
  });

  /**
   * Finaliza o modo de edição do post. Para isso configura o estado editMode
   * para false e os estados bodyInput, titleInput, bodyInputErrorClass e
   * titleInputErrorClass para ''.
   */
  handleEditModeLeave = () => this.setState({
    editMode: false,
    bodyInput: '',
    titleInput: '',
    bodyInputErrorClass: '',
    titleInputErrorClass: '',
  });

  /**
   * Realiza a operação de edição do post chamando a função onUpdate
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
    const requiredEntries = ['bodyInput', 'titleInput'];

    if (areAllEntriesProvided(requiredEntries, this.state)) {
      const oldData = {
        body: this.props.postData.body,
        title: this.props.postData.title,
      };
      const updatedData = {
        body: this.state.bodyInput,
        title: this.state.titleInput,
      };

      if (areKeysDifferent(oldData, updatedData)) {
        await this.props.onUpdate(this.props.postData, updatedData);
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
      postData,
      linkMode,
      readMode,
    } = this.props;

    return (
      <article className={`post ${readMode ? '' : 'post-operations'}`}>

        <Placeholder
          isReady={!postData.processing}
          fallback={this.LOADING_COVER_COMPONENT}
          delay={250}
        />

        <div className="post-info">
          <span>{ postData.author }</span>
          { ' - ' }
          <span>{ formatDate(postData.timestamp) }</span>
        </div>

        {this.state.editMode ? (
          <div>
            <input
              className={`post-title input-edit ${this.state.titleInputErrorClass}`}
              placeholder="Post Title"
              value={this.state.titleInput}
              onChange={this.handleTitleInputChange}
            />

            <textarea
              className={`post-body input-edit ${this.state.bodyInputErrorClass}`}
              placeholder="Post Body"
              value={this.state.bodyInput}
              onChange={this.handleBodyInputChange}
            />
          </div>
        ) : (
          linkMode ? (
            <h4 className="post-title">
              <Link to={`/${postData.category}/${postData.id}`}>
                { postData.title }
              </Link>
            </h4>
          ) : (
            <div>
              <h4 className="post-title">{ postData.title }</h4>

              <p className="post-body">{postData.body}</p>
            </div>
          )
        )}

        {!readMode &&
          <div>
            <div className="post-comments-info">
              <span className="info-data">{postData.commentCount}</span>
              <CommentsIcon size={20} />
            </div>

            <div className="post-vote-score">
              {postData.voteScore}
            </div>

            <Operations
              voteHandler={this.voteHandler}
              editHandler={this.editHandler}
              removeHandler={this.removeHandler}
            />
          </div>
        }

      </article>
    );
  }
}
