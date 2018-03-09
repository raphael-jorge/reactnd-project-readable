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

        <p className="comment-body">
          { commentData.body }
        </p>

        <Controls
          voteData={{
            voteCount: commentData.voteScore,
            onVoteUp: () => onVote(commentData, 1),
            onVoteDown: () => onVote(commentData, -1),
          }}
          onEdit={() => {}}
          onRemove={() => onRemove(commentData)}
        />

      </article>
    );
  }
}
