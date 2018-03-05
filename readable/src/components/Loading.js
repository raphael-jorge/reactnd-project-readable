import React from 'react';
import PropTypes from 'prop-types';
import Message from './Message';

export default function Loading(props) {
  switch (props.type) {
    case 'squares':
      return <div className="loading-squares">Loading</div>;
    default:
      return <Message msg={'Loading...'}/>;
  }
}

Loading.propTypes = {
  type: PropTypes.string,
};
