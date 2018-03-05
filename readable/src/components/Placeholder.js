import React from 'react';
import PropTypes from 'prop-types';

export default function Placeholder(props) {
  const {
    isReady,
    fallback,
    children,
  } = props;

  return (
    <div>{ isReady ? children : (fallback || null) }</div>
  );
}

Placeholder.propTypes = {
  isReady: PropTypes.bool.isRequired,
  fallback: PropTypes.element,
};
