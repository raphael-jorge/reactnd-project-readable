import React from 'react';
import PropTypes from 'prop-types';

Message.propTypes = {
  // A mensagem a ser exibida
  msg: PropTypes.string.isRequired,
};

/* Um componente para exibição de mensagems de status */
export default function Message(props) {
  return (
    <p className="status-msg">{props.msg}</p>
  );
}
