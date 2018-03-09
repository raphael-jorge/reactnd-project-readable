import React from 'react';
import PropTypes from 'prop-types';
import ArrowUpIcon from 'react-icons/lib/fa/caret-up';
import ArrowDownIcon from 'react-icons/lib/fa/caret-down';
import EditIcon from 'react-icons/lib/ti/edit';
import RemoveIcon from 'react-icons/lib/fa/trash';

/**
 * Interface de controle para manipulação de votos, eventos de edição
 * e remoção de posts ou comentários.
 */
export default function Controls(props) {
  const {
    voteData,
    onEdit,
    onRemove,
  } = props;

  return (
    <div className="control">

      {/* Interface de votos */}
      <div className="vote">
        <button
          title="Vote Up"
          className="vote-up"
          onClick={(event) => {
            event.preventDefault();
            voteData.onVoteUp();
          }}
        >
          <ArrowUpIcon size={20} />
        </button>

        <div className="vote-count">{voteData.voteCount}</div>

        <button
          title="Vote Down"
          className="vote-down"
          onClick={(event) => {
            event.preventDefault();
            voteData.onVoteDown();
          }}
        >
          <ArrowDownIcon size={20} />
        </button>
      </div>

      {/* Interface de edição/remoção */}
      <div className="edit">
        <button
          title="Edit"
          className="edit-control"
          onClick={(event) => {
            event.preventDefault();
            onEdit();
          }}
        >
          <EditIcon size={22} />
        </button>

        <button
          title="Delete"
          className="edit-control"
          onClick={(event) => {
            event.preventDefault();
            onRemove();
          }}
        >
          <RemoveIcon size={20} />
        </button>
      </div>

    </div>
  );
}

Controls.propTypes = {
  voteData: PropTypes.shape({
    voteCount: PropTypes.number.isRequired,
    onVoteUp: PropTypes.func.isRequired,
    onVoteDown: PropTypes.func.isRequired,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};
