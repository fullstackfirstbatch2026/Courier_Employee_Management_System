import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { Package, User, MapPin, Scale, Tag } from 'lucide-react';

const initialFormData = {
  trackingNumber: '',
  senderName: '',
  receiverName: '',
  receiverAddress: '',
  weight: '',
  parcelStatus: 'PENDING',
};

export const ParcelFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  parcel = null,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (parcel) {
      setFormData({
        trackingNumber: parcel.trackingNumber || '',
        senderName: parcel.senderName || '',
        receiverName: parcel.receiverName || '',
        receiverAddress: parcel.receiverAddress || '',
        weight: parcel.weight !== undefined ? String(parcel.weight) : '',
        parcelStatus: parcel.parcelStatus || 'PENDING',
      });
    } else {
      // Suggest random tracking number TRK + 5 digits
      const randomTrack = 'TRK' + Math.floor(10000 + Math.random() * 90000);
      setFormData({
        ...initialFormData,
        trackingNumber: randomTrack,
      });
    }
    setErrors({});
  }, [parcel, isOpen]);

  const validate = () => {
    const newErrors = {};
    if (!formData.trackingNumber.trim()) {
      newErrors.trackingNumber = 'Tracking number is required';
    }
    if (!formData.senderName.trim()) {
      newErrors.senderName = 'Sender name is required';
    }
    if (!formData.receiverName.trim()) {
      newErrors.receiverName = 'Receiver name is required';
    }
    if (!formData.receiverAddress.trim()) {
      newErrors.receiverAddress = 'Receiver address is required';
    }
    if (!formData.weight || isNaN(formData.weight) || parseFloat(formData.weight) <= 0) {
      newErrors.weight = 'Weight must be a positive number (kg)';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      ...formData,
      trackingNumber: formData.trackingNumber.trim().toUpperCase(),
      senderName: formData.senderName.trim(),
      receiverName: formData.receiverName.trim(),
      receiverAddress: formData.receiverAddress.trim(),
      weight: parseFloat(formData.weight),
    });
  };

  const isEditing = Boolean(parcel && parcel.parcelId);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Edit Parcel #${parcel.parcelId}` : 'Create New Parcel'}
      maxWidth="md"
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
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Parcel'}
          </button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-group">
          <label htmlFor="parcel-track" className="form-label">
            Tracking Number <span className="required">*</span>
          </label>
          <div className="input-wrap">
            <Package size={18} className="input-icon" />
            <input
              id="parcel-track"
              type="text"
              name="trackingNumber"
              className={`form-input has-icon ${errors.trackingNumber ? 'is-invalid' : ''}`}
              placeholder="e.g. TRK10009"
              value={formData.trackingNumber}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
          {errors.trackingNumber && <span className="error-message">{errors.trackingNumber}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="parcel-weight" className="form-label">
            Weight (in kg) <span className="required">*</span>
          </label>
          <div className="input-wrap">
            <Scale size={18} className="input-icon" />
            <input
              id="parcel-weight"
              type="number"
              step="0.01"
              min="0.01"
              name="weight"
              className={`form-input has-icon ${errors.weight ? 'is-invalid' : ''}`}
              placeholder="e.g. 2.50"
              value={formData.weight}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
          {errors.weight && <span className="error-message">{errors.weight}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="parcel-sender" className="form-label">
            Sender Name <span className="required">*</span>
          </label>
          <div className="input-wrap">
            <User size={18} className="input-icon" />
            <input
              id="parcel-sender"
              type="text"
              name="senderName"
              className={`form-input has-icon ${errors.senderName ? 'is-invalid' : ''}`}
              placeholder="e.g. Amazon India"
              value={formData.senderName}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
          {errors.senderName && <span className="error-message">{errors.senderName}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="parcel-receiver" className="form-label">
            Receiver Name <span className="required">*</span>
          </label>
          <div className="input-wrap">
            <User size={18} className="input-icon" />
            <input
              id="parcel-receiver"
              type="text"
              name="receiverName"
              className={`form-input has-icon ${errors.receiverName ? 'is-invalid' : ''}`}
              placeholder="e.g. Ravi Sundaram"
              value={formData.receiverName}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
          {errors.receiverName && <span className="error-message">{errors.receiverName}</span>}
        </div>

        <div className="form-group full-width">
          <label htmlFor="parcel-address" className="form-label">
            Receiver Address / Destination <span className="required">*</span>
          </label>
          <div className="input-wrap">
            <MapPin size={18} className="input-icon" />
            <input
              id="parcel-address"
              type="text"
              name="receiverAddress"
              className={`form-input has-icon ${errors.receiverAddress ? 'is-invalid' : ''}`}
              placeholder="e.g. 45 Gandhi Road, Coimbatore"
              value={formData.receiverAddress}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
          {errors.receiverAddress && <span className="error-message">{errors.receiverAddress}</span>}
        </div>

        <div className="form-group full-width">
          <label htmlFor="parcel-status" className="form-label">
            Parcel Status
          </label>
          <div className="input-wrap">
            <Tag size={18} className="input-icon" />
            <select
              id="parcel-status"
              name="parcelStatus"
              className="form-input has-icon"
              value={formData.parcelStatus}
              onChange={handleChange}
              disabled={isLoading}
            >
              <option value="PENDING">PENDING</option>
              <option value="ASSIGNED">ASSIGNED</option>
              <option value="IN_TRANSIT">IN_TRANSIT</option>
              <option value="DELIVERED">DELIVERED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default ParcelFormModal;
