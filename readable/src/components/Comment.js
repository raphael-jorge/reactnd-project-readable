import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { formatDate } from '../util/utils';

export default class Comment extends Component {
  static propTypes = {
    commentData: PropTypes.object.isRequired,
  }

  render() {
    const {
      commentData,
    } = this.props;

    return (
      <article className="comment">

        <div className="comment-info">
          <span>{ commentData.author }</span>
          { ' - ' }
          <span>{ formatDate(commentData.timestamp) }</span>
        </div>

        <p className="comment-body">
          { commentData.body }
        </p>

      </article>
    );
  }
}
