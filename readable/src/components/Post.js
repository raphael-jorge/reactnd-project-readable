import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export default class Post extends Component {
  static propTypes = {
    postData: PropTypes.object.isRequired,
    maxBodyLength: PropTypes.number,
  }

  /**
   * Formata o parâmetro timestamp presente na propriedade postData.
   * @return {string} A data formatada: <Data Local> HH:MM.
   */
  getFormattedDate() {
    const date = new Date(this.props.postData.timestamp);
    const dateStr = date.toLocaleDateString();

    // Hora e minutos com leading 0
    const hours = `0${ date.getHours().toString() }`.slice(-2);
    const minutes = `0${ date.getMinutes().toString() }`.slice(-2);
    const timeStr = `${ hours }:${ minutes }`;

    return `${ dateStr } ${ timeStr }`;
  }

  /**
   * Formata o parâmetro body presente na propriedade postData. A mensagem formatada
   * corresponde à porção inicial da mensagem original com um tamanho máximo definido
   * pela propriedade maxBodyLength.
   * @return {string} A mensagem formatada.
   */
  getFormattedBody() {
    const postBody = this.props.postData.body;
    const maxBodyLength = this.props.maxBodyLength;
    const bodyLength = postBody.length;

    const formattedPostBody = bodyLength > maxBodyLength ?
      `${postBody.slice(0, maxBodyLength - 3)}...` :
      postBody;

    return formattedPostBody;
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
            <span>{ this.getFormattedDate() }</span>
          </div>

          <h4 className="post-title">{ postData.title }</h4>

          <p className="post-body">
            { maxBodyLength ? this.getFormattedBody() : postData.body }
          </p>

        </article>
      </Link>
    );
  }
}
