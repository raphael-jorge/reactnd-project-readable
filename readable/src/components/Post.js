import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CommentsIcon from 'react-icons/lib/md/comment';
import { formatDate, trimStringToLength } from '../util/utils';
import Controls from './Controls';
import Loading from './Loading';
import Placeholder from './Placeholder';

export default class Post extends Component {
  static propTypes = {
    postData: PropTypes.object.isRequired,
    onVote: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
    maxBodyLength: PropTypes.number,
  }

  state = {
    editMode: false,
    bodyInputValue: '',
    titleInputValue: '',
  }

  handleUpdateRequest = () => {
    this.setState({
      editMode: true,
      bodyInputValue: this.props.postData.body,
      titleInputValue: this.props.postData.title,
    });
  }

  handleUpdateAbort = () => {
    this.setState({
      editMode: false,
      bodyInputValue: '',
      titleInputValue: '',
    });
  }

  handleUpdateSubmit = async () => {
    const updatedData = {
      body: this.state.bodyInputValue,
      title: this.state.titleInputValue,
    };

    await this.props.onUpdate(this.props.postData, updatedData);

    this.setState({
      editMode: false,
      bodyInputValue: '',
      titleInputValue: '',
    });
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

        <Placeholder
          isReady={!postData.processing}
          fallback={<Loading type="cover-squares" />}
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
              className="post-title input-edit"
              placeholder="Post Title"
              value={this.state.titleInputValue}
              onClick={(event) => event.preventDefault()}
              onChange={(event) => this.setState({ titleInputValue: event.target.value })}
            />

            <textarea
              className="post-body input-edit"
              placeholder="Post Body"
              value={this.state.bodyInputValue}
              onClick={(event) => event.preventDefault()}
              onChange={(event) => this.setState({ bodyInputValue: event.target.value })}
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
            onRequest: this.handleUpdateRequest,
            onAbort: this.handleUpdateAbort,
            onSubmit: this.handleUpdateSubmit,
          }}
          onRemove={{ onSubmit: () => onRemove(postData) }}
        />

      </article>
    );
  }
}
