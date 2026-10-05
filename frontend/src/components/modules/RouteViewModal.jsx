import React from 'react';
import Modal from '../common/Modal';
import StatusBadge from '../common/StatusBadge';
import { Route as RouteIcon, MapPin, Navigation, Gauge } from 'lucide-react';

export const RouteViewModal = ({ isOpen, onClose, route }) => {
  if (!route) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Route Details: ${route.routeName}`}
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
          <div className="profile-avatar route-avatar">
            <RouteIcon size={36} />
          </div>
          <div className="profile-titles">
            <h4 className="profile-name">{route.routeName}</h4>
            <span className="profile-id">Route ID: #{route.routeId}</span>
          </div>
          <div className="profile-status">
            <StatusBadge status={route.routeStatus} />
          </div>
        </div>

        <div className="detail-grid">
          <div className="detail-item">
            <span className="detail-label">
              <MapPin size={14} className="detail-icon" /> Origin / Source
            </span>
            <span className="detail-value">{route.source || '-'}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">
              <Navigation size={14} className="detail-icon" /> Destination Hub
            </span>
            <span className="detail-value">{route.destination || '-'}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">
              <Gauge size={14} className="detail-icon" /> Total Transit Distance
            </span>
            <span className="detail-value font-semibold">
              {route.distance !== undefined ? `${route.distance} km` : '-'}
            </span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Status</span>
            <span className="detail-value">{route.routeStatus}</span>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default RouteViewModal;
