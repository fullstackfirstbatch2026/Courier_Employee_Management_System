import React from 'react';
import Modal from '../common/Modal';
import StatusBadge from '../common/StatusBadge';
import { Package, User, MapPin, Scale, Calendar } from 'lucide-react';

export const ParcelViewModal = ({ isOpen, onClose, parcel }) => {
  if (!parcel) return null;

  const formattedDate = parcel.createdAt
    ? new Date(parcel.createdAt).toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : '-';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Parcel Details: ${parcel.trackingNumber}`}
      maxWidth="md"
      footer={
        <div className="modal-actions">
          <button type="button" className="btn btn-primary" onClick={onClose}>
            Close
          </button>
        </div>
      }
    >
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar parcel-avatar">
            <Package size={36} />
          </div>
          <div className="profile-titles">
            <h4 className="profile-name">{parcel.trackingNumber}</h4>
            <span className="profile-id">Parcel ID: #{parcel.parcelId}</span>
          </div>
          <div className="profile-status">
            <StatusBadge status={parcel.parcelStatus} />
          </div>
        </div>

        <div className="detail-grid">
          <div className="detail-item">
            <span className="detail-label">
              <User size={14} className="detail-icon" /> Sender
            </span>
            <span className="detail-value">{parcel.senderName || '-'}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">
              <User size={14} className="detail-icon" /> Receiver
            </span>
            <span className="detail-value">{parcel.receiverName || '-'}</span>
          </div>

          <div className="detail-item full-width">
            <span className="detail-label">
              <MapPin size={14} className="detail-icon" /> Delivery Destination Address
            </span>
            <span className="detail-value">{parcel.receiverAddress || '-'}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">
              <Scale size={14} className="detail-icon" /> Weight
            </span>
            <span className="detail-value font-semibold">
              {parcel.weight !== undefined ? `${parcel.weight} kg` : '-'}
            </span>
          </div>

          <div className="detail-item">
            <span className="detail-label">
              <Calendar size={14} className="detail-icon" /> Registration Date
            </span>
            <span className="detail-value">{formattedDate}</span>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ParcelViewModal;
