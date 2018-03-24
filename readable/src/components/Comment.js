import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { formatDate, areAllEntriesProvided, areKeysDifferent } from '../util/utils';
import Operations from './Operations';
import Loading from './Loading';
import Placeholder from './Placeholder';

export default class Comment extends PureComponent {
  static propTypes = {
    commentData: PropTypes.object.isRequired,
    onVote: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
  }

  state = {
    editMode: false,
    bodyInput: '',
    bodyInputErrorClass: '',
  }

  LOADING_COVER_COMPONENT = <Loading type="cover-squares" />

  handleBodyInputChange = (event) => {
    const newBody = event.target.value;
    const errorClass = newBody ? '' : 'input-error';

    this.setState({
      bodyInput: newBody,
      bodyInputErrorClass: errorClass,
    });
  }

  handleEditModeEnter = () => {
    this.setState({
      editMode: true,
      bodyInput: this.props.commentData.body,
    });
  }

  handleEditModeLeave = () => {
    this.setState({
      editMode: false,
      bodyInput: '',
      bodyInputErrorClass: '',
    });
  }

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
    voteUp: () => self.props.onVote(this.props.commentData, 1),
    voteDown: () => self.props.onVote(this.props.commentData, -1),
  }))()

  editHandler = ((self=this) => ({
    onRequest: self.handleEditModeEnter,
    onAbort: self.handleEditModeLeave,
    onSubmit: self.handleEditSubmit,
  }))()

  removeHandler = ((self=this) => ({
    onSubmit: () => self.props.onRemove(self.props.commentData),
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
