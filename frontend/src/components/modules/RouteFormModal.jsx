import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { Route as RouteIcon, MapPin, Navigation, Gauge } from 'lucide-react';

const initialFormData = {
  routeName: '',
  source: '',
  destination: '',
  distance: '',
  routeStatus: 'ACTIVE',
};

export const RouteFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  route = null,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (route) {
      setFormData({
        routeName: route.routeName || '',
        source: route.source || '',
        destination: route.destination || '',
        distance: route.distance !== undefined ? String(route.distance) : '',
        routeStatus: route.routeStatus || 'ACTIVE',
      });
    } else {
      setFormData(initialFormData);
    }
    setErrors({});
  }, [route, isOpen]);

  // Auto-generate route name if empty when source & destination change
  const handleSourceChange = (e) => {
    const val = e.target.value;
    setFormData((prev) => {
      const newName = prev.destination && !route ? `${val}-${prev.destination}` : prev.routeName;
      return { ...prev, source: val, routeName: newName };
    });
    if (errors.source) setErrors((prev) => ({ ...prev, source: null }));
  };

  const handleDestinationChange = (e) => {
    const val = e.target.value;
    setFormData((prev) => {
      const newName = prev.source && !route ? `${prev.source}-${val}` : prev.routeName;
      return { ...prev, destination: val, routeName: newName };
    });
    if (errors.destination) setErrors((prev) => ({ ...prev, destination: null }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.routeName.trim()) {
      newErrors.routeName = 'Route name is required';
    }
    if (!formData.source.trim()) {
      newErrors.source = 'Source location is required';
    }
    if (!formData.destination.trim()) {
      newErrors.destination = 'Destination location is required';
    }
    if (!formData.distance || isNaN(formData.distance) || parseFloat(formData.distance) <= 0) {
      newErrors.distance = 'Distance must be a positive number (km)';
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
      routeName: formData.routeName.trim(),
      source: formData.source.trim(),
      destination: formData.destination.trim(),
      distance: parseFloat(formData.distance),
    });
  };

  const isEditing = Boolean(route && route.routeId);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Edit Route #${route.routeId}` : 'Add Transit Route'}
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
            {isLoading ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Route'}
          </button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-group full-width">
          <label htmlFor="route-name" className="form-label">
            Route Identifier / Name <span className="required">*</span>
          </label>
          <div className="input-wrap">
            <RouteIcon size={18} className="input-icon" />
            <input
              id="route-name"
              type="text"
              name="routeName"
              className={`form-input has-icon ${errors.routeName ? 'is-invalid' : ''}`}
              placeholder="e.g. Chennai-Coimbatore"
              value={formData.routeName}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
          {errors.routeName && <span className="error-message">{errors.routeName}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="route-source" className="form-label">
            Source City / Hub <span className="required">*</span>
          </label>
          <div className="input-wrap">
            <MapPin size={18} className="input-icon" />
            <input
              id="route-source"
              type="text"
              name="source"
              className={`form-input has-icon ${errors.source ? 'is-invalid' : ''}`}
              placeholder="e.g. Chennai"
              value={formData.source}
              onChange={handleSourceChange}
              disabled={isLoading}
            />
          </div>
          {errors.source && <span className="error-message">{errors.source}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="route-dest" className="form-label">
            Destination City / Hub <span className="required">*</span>
          </label>
          <div className="input-wrap">
            <Navigation size={18} className="input-icon" />
            <input
              id="route-dest"
              type="text"
              name="destination"
              className={`form-input has-icon ${errors.destination ? 'is-invalid' : ''}`}
              placeholder="e.g. Coimbatore"
              value={formData.destination}
              onChange={handleDestinationChange}
              disabled={isLoading}
            />
          </div>
          {errors.destination && <span className="error-message">{errors.destination}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="route-distance" className="form-label">
            Distance (km) <span className="required">*</span>
          </label>
          <div className="input-wrap">
            <Gauge size={18} className="input-icon" />
            <input
              id="route-distance"
              type="number"
              step="0.01"
              min="0.1"
              name="distance"
              className={`form-input has-icon ${errors.distance ? 'is-invalid' : ''}`}
              placeholder="e.g. 500.00"
              value={formData.distance}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
          {errors.distance && <span className="error-message">{errors.distance}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="route-status" className="form-label">
            Route Operational Status
          </label>
          <div className="input-wrap">
            <select
              id="route-status"
              name="routeStatus"
              className="form-input"
              value={formData.routeStatus}
              onChange={handleChange}
              disabled={isLoading}
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default RouteFormModal;
