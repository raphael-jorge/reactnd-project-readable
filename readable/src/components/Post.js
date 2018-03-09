import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CommentsIcon from 'react-icons/lib/md/comment';
import { formatDate, trimStringToLength } from '../util/utils';
import Controls from './Controls';

export default class Post extends Component {
  static propTypes = {
    postData: PropTypes.object.isRequired,
    onVote: PropTypes.func.isRequired,
    maxBodyLength: PropTypes.number,
  }

  render() {
    const {
      postData,
      onVote,
      maxBodyLength,
    } = this.props;

    return (
      <article className="post post-control">

        <div className="post-info">
          <span>{ postData.author }</span>
          { ' - ' }
          <span>{ formatDate(postData.timestamp) }</span>
        </div>

        <h4 className="post-title">{ postData.title }</h4>

        <p className="post-body">
          { maxBodyLength ? trimStringToLength(postData.body, maxBodyLength) : postData.body }
        </p>

        <div className="post-comments-info">
          <span className="info-data">{postData.commentCount}</span>
          <CommentsIcon size={20} />
        </div>

        <Controls
          voteData={{
            voteCount: postData.voteScore,
            onVoteUp: () => onVote(postData, 1),
            onVoteDown: () => onVote(postData, -1),
          }}
          onEdit={() => {}}
          onRemove={() => {}}
        />

      </article>
    );
  }
}
