import React from 'react';
import Modal from '../common/Modal';
import StatusBadge from '../common/StatusBadge';
import { Truck, User, Package, Route as RouteIcon, Calendar, Clock, MapPin } from 'lucide-react';

export const DeliveryViewModal = ({ isOpen, onClose, delivery }) => {
  if (!delivery) return null;

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Not yet recorded';
    return new Date(dateStr).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Delivery Details: #${delivery.deliveryId}`}
      maxWidth="lg"
      footer={
        <div className="modal-actions">
          <button type="button" className="btn btn-primary" onClick={onClose}>
            Close
          </button>
        </div>
      }
    >
      <div className="delivery-view-container">
        <div className="profile-header">
          <div className="profile-avatar delivery-avatar">
            <Truck size={36} />
          </div>
          <div className="profile-titles">
            <h4 className="profile-name">Tracking #{delivery.trackingNumber}</h4>
            <span className="profile-id">Consignment Delivery #{delivery.deliveryId}</span>
          </div>
          <div className="profile-status">
            <StatusBadge status={delivery.deliveryStatus} />
          </div>
        </div>

        <div className="delivery-sections-grid">
          {/* Employee Section */}
          <div className="delivery-card-section">
            <div className="section-head">
              <User size={18} className="text-primary" />
              <h5>Assigned Personnel</h5>
            </div>
            <div className="section-content">
              <div className="info-pair">
                <span className="label">Name:</span>
                <span className="val font-semibold">{delivery.employeeName || '-'}</span>
              </div>
              <div className="info-pair">
                <span className="label">Staff ID:</span>
                <span className="val">#{delivery.employeeId || '-'}</span>
              </div>
              <div className="info-pair">
                <span className="label">Email:</span>
                <span className="val">{delivery.employeeEmail || '-'}</span>
              </div>
            </div>
          </div>

          {/* Parcel Section */}
          <div className="delivery-card-section">
            <div className="section-head">
              <Package size={18} className="text-info" />
              <h5>Parcel & Consignment</h5>
            </div>
            <div className="section-content">
              <div className="info-pair">
                <span className="label">Sender:</span>
                <span className="val">{delivery.senderName || '-'}</span>
              </div>
              <div className="info-pair">
                <span className="label">Receiver:</span>
                <span className="val font-semibold">{delivery.receiverName || '-'}</span>
              </div>
              <div className="info-pair">
                <span className="label">Destination:</span>
                <span className="val">{delivery.receiverAddress || '-'}</span>
              </div>
            </div>
          </div>

          {/* Route Section */}
          <div className="delivery-card-section">
            <div className="section-head">
              <RouteIcon size={18} className="text-warning" />
              <h5>Transit Corridor</h5>
            </div>
            <div className="section-content">
              <div className="info-pair">
                <span className="label">Route Name:</span>
                <span className="val font-semibold">{delivery.routeName || '-'}</span>
              </div>
              <div className="info-pair">
                <span className="label">Transit Path:</span>
                <span className="val">
                  {delivery.source} &rarr; {delivery.destination}
                </span>
              </div>
            </div>
          </div>

          {/* Timeline Section */}
          <div className="delivery-card-section">
            <div className="section-head">
              <Clock size={18} className="text-success" />
              <h5>Assignment Timeline</h5>
            </div>
            <div className="section-content">
              <div className="info-pair">
                <span className="label">Assigned At:</span>
                <span className="val">{formatDate(delivery.assignedDate)}</span>
              </div>
              <div className="info-pair">
                <span className="label">Delivered At:</span>
                <span className="val">{formatDate(delivery.deliveryDate)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default DeliveryViewModal;
