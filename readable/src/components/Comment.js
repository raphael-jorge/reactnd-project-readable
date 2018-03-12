import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { formatDate } from '../util/utils';
import Controls from './Controls';
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
    bodyInputValue: '',
  }

  handleUpdateRequest = () => {
    this.setState({
      editMode: true,
      bodyInputValue: this.props.commentData.body,
    });
  }

  handleUpdateAbort = () => {
    this.setState({
      editMode: false,
      bodyInputValue: '',
    });
  }

  handleUpdateSubmit = async () => {
    const updatedData = {
      body: this.state.bodyInputValue,
    };

    await this.props.onUpdate(this.props.commentData, updatedData);

    this.setState({
      editMode: false,
      bodyInputValue: '',
    });
  }

  render() {
    const {
      commentData,
      onVote,
      onRemove,
    } = this.props;

    return (
      <article className="comment comment-control">

        <Placeholder
          isReady={!commentData.processing}
          fallback={<Loading type="cover-squares" />}
        />

        <div className="comment-info">
          <span>{ commentData.author }</span>
          { ' - ' }
          <span>{ formatDate(commentData.timestamp) }</span>
        </div>

        {this.state.editMode ? (
          <textarea
            className="comment-body input-edit"
            placeholder="Comment Body"
            value={this.state.bodyInputValue}
            onClick={(event) => event.preventDefault()}
            onChange={(event) => this.setState({ bodyInputValue: event.target.value })}
          />
        ) : (
          <p className="comment-body">
            { commentData.body }
          </p>
        )}

        <Controls
          voteData={{
            voteCount: commentData.voteScore,
            onVoteUp: () => onVote(commentData, 1),
            onVoteDown: () => onVote(commentData, -1),
          }}
          onEdit={{
            onRequest: this.handleUpdateRequest,
            onAbort: this.handleUpdateAbort,
            onSubmit: this.handleUpdateSubmit,
          }}
          onRemove={{ onSubmit: () => onRemove(commentData) }}
        />

      </article>
    );
  }
}
