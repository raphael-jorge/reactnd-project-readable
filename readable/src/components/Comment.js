import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { formatDate } from '../util/utils';
import Controls from './Controls';

export default class Comment extends Component {
  static propTypes = {
    commentData: PropTypes.object.isRequired,
  }

  render() {
    const {
      commentData,
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
            onVoteUp: () => {},
            onVoteDown: () => {},
          }}
          onEdit={() => {}}
          onRemove={() => {}}
        />

      </article>
    );
  }
}
