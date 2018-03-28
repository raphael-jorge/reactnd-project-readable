import React from 'react';
import PropTypes from 'prop-types';
import Message from './Message';

Loading.propTypes = {
  // O tipo do loading
  type: PropTypes.string,
};

/* Um componente que representa uma operação de loading */
export default function Loading(props) {
  switch (props.type) {
    // Um ícone de loading
    case 'icon-squares':
      return <div className="loading-icon loading-squares">Loading</div>;

    // Um ícone de loading e um overlay que impede cliques
    case 'cover-squares':
      return (
        <div>
          <div className="loading-cover-overlay" />
          <div
            className="loading-cover loading-squares"
            onClick={(event) => event.preventDefault()}
          >
            Loading
          </div>
        </div>
      );

    // Uma mensagem de loading
    default:
      return <Message msg={'Loading...'}/>;
  }
}
