import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { formatDate } from '../util/utils';
import Controls from './Controls';

export default class Comment extends Component {
  static propTypes = {
    commentData: PropTypes.object.isRequired,
    onVote: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
  }

  state = {
    editMode: false,
  }

  render() {
    const {
      commentData,
      onVote,
      onRemove,
    } = this.props;

    return (
      <article className="comment comment-control">

        <div className="comment-info">
          <span>{ commentData.author }</span>
          { ' - ' }
          <span>{ formatDate(commentData.timestamp) }</span>
        </div>

        {this.state.editMode ? (
          <textarea
            className="comment-body input-edit"
            placeholder="Comment Body"
            defaultValue={commentData.body}
            onClick={(event) => event.preventDefault()}
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
            onRequest: () => this.setState({ editMode: true }),
            onAbort: () => this.setState({ editMode: false }),
            onSubmit: () => this.setState({ editMode: false }),
          }}
          onRemove={{ onSubmit: () => onRemove(commentData) }}
        />

      </article>
    );
  }
}
