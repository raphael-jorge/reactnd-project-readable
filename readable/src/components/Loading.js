import React from 'react';
import PropTypes from 'prop-types';
import Message from './Message';

Loading.propTypes = {
  type: PropTypes.string,
};

export default function Loading(props) {
  switch (props.type) {
    case 'icon-squares':
      return <div className="loading-icon loading-squares">Loading</div>;

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

    default:
      return <Message msg={'Loading...'}/>;
  }
}
