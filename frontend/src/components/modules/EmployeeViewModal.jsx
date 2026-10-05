import React from 'react';
import Modal from '../common/Modal';
import StatusBadge from '../common/StatusBadge';
import { User, Mail, Phone, MapPin, Calendar, Award } from 'lucide-react';

export const EmployeeViewModal = ({
  isOpen,
  onClose,
  employee,
  onCheckDeliveryCount,
}) => {
  if (!employee) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Employee Profile: ${employee.name}`}
      maxWidth="md"
      footer={
        <div className="modal-actions">
          {onCheckDeliveryCount && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                onClose();
                onCheckDeliveryCount(employee);
              }}
            >
              <Award size={16} /> Check Delivery Count
            </button>
          )}
          <button type="button" className="btn btn-primary" onClick={onClose}>
            Close
          </button>
        </div>
      }
    >
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            <User size={36} />
          </div>
          <div className="profile-titles">
            <h4 className="profile-name">{employee.name}</h4>
            <span className="profile-id">Employee ID: #{employee.employeeId}</span>
          </div>
          <div className="profile-status">
            <StatusBadge status={employee.status} />
          </div>
        </div>

        <div className="detail-grid">
          <div className="detail-item">
            <span className="detail-label">
              <Mail size={14} className="detail-icon" /> Email Address
            </span>
            <span className="detail-value">{employee.email || '-'}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">
              <Phone size={14} className="detail-icon" /> Phone Number
            </span>
            <span className="detail-value">{employee.phone || '-'}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">
              <MapPin size={14} className="detail-icon" /> Work / Base Location
            </span>
            <span className="detail-value">{employee.address || '-'}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">
              <Calendar size={14} className="detail-icon" /> Hire Date
            </span>
            <span className="detail-value">{employee.hireDate || '-'}</span>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default EmployeeViewModal;
