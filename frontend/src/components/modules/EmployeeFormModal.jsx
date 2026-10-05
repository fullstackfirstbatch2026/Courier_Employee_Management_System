import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { User, Mail, Phone, MapPin, Calendar, CheckCircle } from 'lucide-react';

const initialFormData = {
  name: '',
  email: '',
  phone: '',
  address: '',
  hireDate: new Date().toISOString().split('T')[0],
  status: 'ACTIVE',
};

export const EmployeeFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  employee = null,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name || '',
        email: employee.email || '',
        phone: employee.phone || '',
        address: employee.address || '',
        hireDate: employee.hireDate ? employee.hireDate.substring(0, 10) : new Date().toISOString().split('T')[0],
        status: employee.status || 'ACTIVE',
      });
    } else {
      setFormData(initialFormData);
    }
    setErrors({});
  }, [employee, isOpen]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.hireDate) {
      newErrors.hireDate = 'Hire date is required';
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
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      address: formData.address.trim(),
    });
  };

  const isEditing = Boolean(employee && employee.employeeId);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Edit Employee #${employee.employeeId}` : 'Add New Employee'}
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
            {isLoading ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Employee'}
          </button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="form-grid">
        <div className="form-group full-width">
          <label htmlFor="emp-name" className="form-label">
            Full Name <span className="required">*</span>
          </label>
          <div className="input-wrap">
            <User size={18} className="input-icon" />
            <input
              id="emp-name"
              type="text"
              name="name"
              className={`form-input has-icon ${errors.name ? 'is-invalid' : ''}`}
              placeholder="e.g. Arun Kumar"
              value={formData.name}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="emp-email" className="form-label">
            Email Address <span className="required">*</span>
          </label>
          <div className="input-wrap">
            <Mail size={18} className="input-icon" />
            <input
              id="emp-email"
              type="email"
              name="email"
              className={`form-input has-icon ${errors.email ? 'is-invalid' : ''}`}
              placeholder="e.g. arun@gmail.com"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="emp-phone" className="form-label">
            Phone Number
          </label>
          <div className="input-wrap">
            <Phone size={18} className="input-icon" />
            <input
              id="emp-phone"
              type="tel"
              name="phone"
              className="form-input has-icon"
              placeholder="e.g. 9876543210"
              value={formData.phone}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="form-group full-width">
          <label htmlFor="emp-address" className="form-label">
            Address / City
          </label>
          <div className="input-wrap">
            <MapPin size={18} className="input-icon" />
            <input
              id="emp-address"
              type="text"
              name="address"
              className="form-input has-icon"
              placeholder="e.g. 12 Anna Salai, Chennai"
              value={formData.address}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="emp-hire-date" className="form-label">
            Hire Date <span className="required">*</span>
          </label>
          <div className="input-wrap">
            <Calendar size={18} className="input-icon" />
            <input
              id="emp-hire-date"
              type="date"
              name="hireDate"
              className={`form-input has-icon ${errors.hireDate ? 'is-invalid' : ''}`}
              value={formData.hireDate}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
          {errors.hireDate && <span className="error-message">{errors.hireDate}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="emp-status" className="form-label">
            Employment Status
          </label>
          <div className="input-wrap">
            <CheckCircle size={18} className="input-icon" />
            <select
              id="emp-status"
              name="status"
              className="form-input has-icon"
              value={formData.status}
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

export default EmployeeFormModal;
