import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CommentsIcon from 'react-icons/lib/md/comment';
import { formatDate, trimStringToLength } from '../util/utils';
import Controls from './Controls';

export default class Post extends Component {
  static propTypes = {
    postData: PropTypes.object.isRequired,
    onVote: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    maxBodyLength: PropTypes.number,
  }

  state = {
    editMode: false,
  }

  render() {
    const {
      postData,
      onVote,
      onRemove,
      maxBodyLength,
    } = this.props;

    return (
      <article className="post post-control">

        <div className="post-info">
          <span>{ postData.author }</span>
          { ' - ' }
          <span>{ formatDate(postData.timestamp) }</span>
        </div>

        {this.state.editMode ? (
          <div>
            <input
              className="post-title input-edit"
              placeholder="Post Title"
              defaultValue={postData.title}
              onClick={(event) => event.preventDefault()}
            />

            <textarea
              className="post-body input-edit"
              placeholder="Post Body"
              defaultValue={postData.body}
              onClick={(event) => event.preventDefault()}
            />
          </div>
        ) : (
          <div>
            <h4 className="post-title">{ postData.title }</h4>

            <p className="post-body">
              { maxBodyLength ? trimStringToLength(postData.body, maxBodyLength) : postData.body }
            </p>
          </div>
        )}

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
          onEdit={{
            onRequest: () => this.setState({ editMode: true }),
            onAbort: () => this.setState({ editMode: false }),
            onSubmit: () => this.setState({ editMode: false }),
          }}
          onRemove={{ onSubmit: () => onRemove(postData) }}
        />

      </article>
    );
  }
}
