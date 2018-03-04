import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { formatDate, trimStringToLength } from '../util/utils';

export default class Post extends Component {
  static propTypes = {
    postData: PropTypes.object.isRequired,
    maxBodyLength: PropTypes.number,
  }

  render() {
    const {
      postData,
      maxBodyLength,
    } = this.props;

    return (
      <Link to={ `/${postData.category}/${postData.id}` }>
        <article className="post">

          <div className="post-info">
            <span>{ postData.author }</span>
            { ' - ' }
            <span>{ formatDate(postData.timestamp) }</span>
          </div>

          <h4 className="post-title">{ postData.title }</h4>

          <p className="post-body">
            { maxBodyLength ? trimStringToLength(postData.body, maxBodyLength) : postData.body }
          </p>

        </article>
      </Link>
    );
  }
}
