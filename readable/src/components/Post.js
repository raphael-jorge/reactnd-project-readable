import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import CommentsIcon from 'react-icons/lib/md/comment';
import { formatDate } from '../util/utils';
import Operations from './Operations';
import Loading from './Loading';
import Placeholder from './Placeholder';

export default class Post extends Component {
  static propTypes = {
    postData: PropTypes.object.isRequired,
    onVote: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
    linkMode: PropTypes.bool,
  }

  state = {
    editMode: false,
    bodyInputValue: '',
    titleInputValue: '',
    bodyInputErrorClass: '',
    titleInputErrorClass: '',
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
      bodyInputErrorClass: '',
      titleInputErrorClass: '',
    });
  }

  handleUpdateSubmit = async () => {
    let done = true;
    if (this.isUpdateValid()) {
      if (this.updateRequiresSubmit()) {
        const updatedData = {
          body: this.state.bodyInputValue,
          title: this.state.titleInputValue,
        };

        await this.props.onUpdate(this.props.postData, updatedData);
      }

      this.setState({
        editMode: false,
        bodyInputValue: '',
        titleInputValue: '',
        bodyInputErrorClass: '',
        titleInputErrorClass: '',
      });

    } else {
      done = false;
    }

    return done;
  }

  isUpdateValid = () => {
    let valid = true;
    if (this.state.bodyInputValue === '') {
      valid = false;
      this.setState({ bodyInputErrorClass: 'input-error' });
    } else {
      this.setState({ bodyInputErrorClass: '' });
    }
    if (this.state.titleInputValue === '') {
      valid = false;
      this.setState({ titleInputErrorClass: 'input-error' });
    } else {
      this.setState({ titleInputErrorClass: '' });
    }
    return valid;
  }

  updateRequiresSubmit = () => {
    let submitRequired = true;
    if (this.state.bodyInputValue === this.props.postData.body
        && this.state.titleInputValue === this.props.postData.title) {
      submitRequired = false;
    }
    return submitRequired;
  }

  render() {
    const {
      postData,
      onVote,
      onRemove,
      linkMode,
    } = this.props;

    return (
      <article className="post post-operations">

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
              className={`post-title input-edit ${this.state.titleInputErrorClass}`}
              placeholder="Post Title"
              value={this.state.titleInputValue}
              onClick={(event) => event.preventDefault()}
              onChange={(event) => this.setState({ titleInputValue: event.target.value })}
            />

            <textarea
              className={`post-body input-edit ${this.state.bodyInputErrorClass}`}
              placeholder="Post Body"
              value={this.state.bodyInputValue}
              onClick={(event) => event.preventDefault()}
              onChange={(event) => this.setState({ bodyInputValue: event.target.value })}
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

        <div className="post-comments-info">
          <span className="info-data">{postData.commentCount}</span>
          <CommentsIcon size={20} />
        </div>

        <Operations
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
