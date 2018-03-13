import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CheckIcon from 'react-icons/lib/fa/check';
import CrossIcon from 'react-icons/lib/fa/close';

export default class OperationConfirm extends Component {
  static propTypes = {
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
  }

  handleConfirmation = (event) => {
    event.preventDefault();
    this.props.onConfirm();
  }

  handleCancelation = (event) => {
    event.preventDefault();
    this.props.onCancel();
  }

  render() {

    return (
      <div className="operations">

        <button
          title="Confirm"
          className="operation-confirm"
          onClick={this.handleConfirmation}
        >
          <CheckIcon size={20} />
        </button>

        <button
          title="Cancel"
          className="operation-cancel"
          onClick={this.handleCancelation}
        >
          <CrossIcon size={20} />
        </button>

      </div>
    );
  }
}
