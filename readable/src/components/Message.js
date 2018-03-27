import React from 'react';
import PropTypes from 'prop-types';

Message.propTypes = {
  msg: PropTypes.string.isRequired,
};

export default function Message(props) {
  return (
    <p className="status-msg">{props.msg}</p>
  );
}
