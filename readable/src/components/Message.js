import React from 'react';
import PropTypes from 'prop-types';

export default function Message(props) {
  return (
    <p className="status-msg">{props.msg}</p>
  );
}

Message.propTypes = {
  msg: PropTypes.string.isRequired,
};
