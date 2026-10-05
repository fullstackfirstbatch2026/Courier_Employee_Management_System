import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import StatusBadge from '../common/StatusBadge';
import { Tag, Sparkles, CheckCircle2 } from 'lucide-react';

const statuses = ['ASSIGNED', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'];

export const UpdateDeliveryStatusModal = ({
  isOpen,
  onClose,
  onSubmit,
  delivery,
  isLoading = false,
}) => {
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    if (delivery) {
      setSelectedStatus(delivery.deliveryStatus || 'ASSIGNED');
    }
  }, [delivery, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedStatus) return;
    onSubmit(delivery.deliveryId, selectedStatus);
  };

  if (!delivery) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Update Status: Delivery #${delivery.deliveryId}`}
      maxWidth="sm"
      footer={
        <div className="modal-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={isLoading || selectedStatus === delivery.deliveryStatus}
          >
            {isLoading ? 'Updating...' : 'Update Status'}
          </button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-group full-width">
          <div className="delivery-summary-card">
            <div className="summary-row">
              <span className="summary-label">Tracking Number:</span>
              <strong className="summary-value">{delivery.trackingNumber}</strong>
            </div>
            <div className="summary-row">
              <span className="summary-label">Assigned Courier:</span>
              <span className="summary-value">{delivery.employeeName}</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Current Status:</span>
              <StatusBadge status={delivery.deliveryStatus} />
            </div>
          </div>
        </div>

        <div className="form-group full-width">
          <label htmlFor="new-status" className="form-label">
            New Delivery Status <span className="required">*</span>
          </label>
          <div className="input-wrap">
            <Tag size={18} className="input-icon" />
            <select
              id="new-status"
              className="form-input has-icon"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              disabled={isLoading}
            >
              {statuses.map((st) => (
                <option key={st} value={st}>
                  {st.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedStatus === 'DELIVERED' && (
          <div className="form-group full-width">
            <div className="trigger-info-card">
              <Sparkles size={18} className="trigger-icon" />
              <div className="trigger-text">
                <strong>MySQL Trigger Active:</strong> Setting this delivery to <code>DELIVERED</code>{' '}
                will trigger <code>after_delivery_status_update</code> in MySQL, automatically setting
                parcel <code>{delivery.trackingNumber}</code> status to <code>DELIVERED</code>.
              </div>
            </div>
          </div>
        )}
      </form>
    </Modal>
  );
};

export default UpdateDeliveryStatusModal;
