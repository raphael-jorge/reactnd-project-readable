import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import CommentsIcon from 'react-icons/lib/md/comment';
import formatDate from '../util/formatDate';
import { areAllEntriesProvided, areKeysDifferent } from '../util/objectsVerifier';
import Operations from './Operations';
import Loading from './Loading';
import Placeholder from './Placeholder';

export default class Post extends PureComponent {
  static propTypes = {
    postData: PropTypes.object.isRequired,
    onVote: PropTypes.func,
    onRemove: PropTypes.func,
    onUpdate: PropTypes.func,
    linkMode: PropTypes.bool,
    readMode: PropTypes.bool,
  }

  LOADING_COVER_COMPONENT = <Loading type="cover-squares" />

  state = {
    editMode: false,
    bodyInput: '',
    titleInput: '',
    bodyInputErrorClass: '',
    titleInputErrorClass: '',
  }

  handleTitleInputChange = (event) => {
    const newTitle = event.target.value;
    const errorClass = newTitle ? '' : 'input-error';

    this.setState({
      titleInput: newTitle,
      titleInputErrorClass: errorClass,
    });
  }

  handleBodyInputChange = (event) => {
    const newBody = event.target.value;
    const errorClass = newBody ? '' : 'input-error';

    this.setState({
      bodyInput: newBody,
      bodyInputErrorClass: errorClass,
    });
  }

  handleVoteUp = () => this.props.onVote(this.props.postData, 1)

  handleVoteDown = () => this.props.onVote(this.props.postData, -1)

  handleRemoveSubmit = () => this.props.onRemove(this.props.postData)

  handleEditModeEnter = () => this.setState({
    editMode: true,
    bodyInput: this.props.postData.body,
    titleInput: this.props.postData.title,
  });

  handleEditModeLeave = () => this.setState({
    editMode: false,
    bodyInput: '',
    titleInput: '',
    bodyInputErrorClass: '',
    titleInputErrorClass: '',
  });

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
