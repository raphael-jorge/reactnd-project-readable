import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { formatDate, areAllEntriesProvided, areKeysDifferent } from '../util/utils';
import Operations from './Operations';
import Loading from './Loading';
import Placeholder from './Placeholder';

export default class Comment extends Component {
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

  handleRemoveSubmit = async () => {
    await this.props.onRemove(this.props.commentData);
    return true;
  }

  render() {
    const {
      commentData,
      onVote,
    } = this.props;

    return (
      <article className="comment comment-operations">

        <Placeholder
          isReady={!commentData.processing}
          fallback={<Loading type="cover-squares" />}
          delay={250}
        />

        <div className="comment-info">
          <span>{ commentData.author }</span>
          { ' - ' }
          <span>{ formatDate(commentData.timestamp) }</span>
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
          voteData={{
            voteCount: commentData.voteScore,
            onVoteUp: () => onVote(commentData, 1),
            onVoteDown: () => onVote(commentData, -1),
          }}
          onEdit={{
            onRequest: this.handleEditModeEnter,
            onAbort: this.handleEditModeLeave,
            onSubmit: this.handleEditSubmit,
          }}
          onRemove={{ onSubmit: this.handleRemoveSubmit }}
        />

      </article>
    );
  }
}
