import React from 'react';

function ConfirmationModal({ show, onClose, onConfirm }) {
  if (!show) return null;

  return (
    <div className="confirmation-modal">
      <div className="modal-content">
        <div className="modal-header">
          <h5>Confirm Order</h5>
          <button type="button" className="btn-close" onClick={onClose}></button>
        </div>
        <div className="modal-body">
          <p>Are you sure you want to place this order?</p>
          <p className="text-muted small">Please verify all details before confirming.</p>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-light" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn btn-dark" onClick={onConfirm}>
            Confirm Order
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal; 