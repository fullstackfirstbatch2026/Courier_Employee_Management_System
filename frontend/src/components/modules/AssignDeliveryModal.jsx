import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import LoadingSpinner from '../common/LoadingSpinner';
import employeeService from '../../services/employeeService';
import parcelService from '../../services/parcelService';
import routeService from '../../services/routeService';
import { Truck, User, Package, Route as RouteIcon, Info, AlertCircle } from 'lucide-react';

export const AssignDeliveryModal = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const [employees, setEmployees] = useState([]);
  const [parcels, setParcels] = useState([]);
  const [routes, setRoutes] = useState([]);

  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedParcel, setSelectedParcel] = useState('');
  const [selectedRoute, setSelectedRoute] = useState('');

  const [loadingOptions, setLoadingOptions] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    let isMounted = true;
    if (isOpen) {
      setLoadingOptions(true);
      setFetchError(null);
      setValidationError('');
      setSelectedEmployee('');
      setSelectedParcel('');
      setSelectedRoute('');

      Promise.all([
        employeeService.getAllEmployees(),
        parcelService.getAllParcels(),
        routeService.getAllRoutes(),
      ])
        .then(([emps, parcs, rts]) => {
          if (isMounted) {
            setEmployees(Array.isArray(emps) ? emps : []);
            setParcels(Array.isArray(parcs) ? parcs : []);
            setRoutes(Array.isArray(rts) ? rts : []);
            setLoadingOptions(false);
          }
        })
        .catch((err) => {
          if (isMounted) {
            setFetchError(err.message || 'Failed to load options from backend');
            setLoadingOptions(false);
          }
        });
    }

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedEmployee) {
      setValidationError('Please select an employee.');
      return;
    }
    if (!selectedParcel) {
      setValidationError('Please select a parcel.');
      return;
    }
    if (!selectedRoute) {
      setValidationError('Please select a transit route.');
      return;
    }

    setValidationError('');
    onSubmit({
      employeeId: parseInt(selectedEmployee, 10),
      parcelId: parseInt(selectedParcel, 10),
      routeId: parseInt(selectedRoute, 10),
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Assign New Delivery"
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
            disabled={isLoading || loadingOptions}
          >
            {isLoading ? 'Assigning...' : 'Confirm Assignment'}
          </button>
        </div>
      }
    >
      <div className="assign-delivery-wrap">
        <div className="callout-card">
          <Info size={18} className="callout-icon" />
          <div className="callout-text">
            <strong>Database Stored Procedure:</strong> Submitting this assignment invokes{' '}
            <code>assign_delivery</code>, which creates the delivery record and updates the parcel
            status to <code>ASSIGNED</code>.
          </div>
        </div>

        {loadingOptions ? (
          <LoadingSpinner message="Fetching employees, parcels, and routes..." />
        ) : fetchError ? (
          <div className="error-banner">
            <AlertCircle size={20} />
            <span>{fetchError}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="form-grid">
            {validationError && (
              <div className="form-group full-width">
                <div className="error-banner">
                  <AlertCircle size={18} />
                  <span>{validationError}</span>
                </div>
              </div>
            )}

            {/* Employee Dropdown */}
            <div className="form-group full-width">
              <label htmlFor="assign-emp" className="form-label">
                Assigned Employee <span className="required">*</span>
              </label>
              <div className="input-wrap">
                <User size={18} className="input-icon" />
                <select
                  id="assign-emp"
                  className="form-input has-icon"
                  value={selectedEmployee}
                  onChange={(e) => {
                    setSelectedEmployee(e.target.value);
                    setValidationError('');
                  }}
                  disabled={isLoading}
                >
                  <option value="">-- Choose Courier Employee --</option>
                  {employees.map((emp) => (
                    <option key={emp.employeeId} value={emp.employeeId}>
                      {emp.name} (ID: #{emp.employeeId}) &bull; {emp.address || emp.email}{' '}
                      {emp.status === 'INACTIVE' ? '[INACTIVE]' : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Parcel Dropdown */}
            <div className="form-group full-width">
              <label htmlFor="assign-parcel" className="form-label">
                Consignment / Parcel <span className="required">*</span>
              </label>
              <div className="input-wrap">
                <Package size={18} className="input-icon" />
                <select
                  id="assign-parcel"
                  className="form-input has-icon"
                  value={selectedParcel}
                  onChange={(e) => {
                    setSelectedParcel(e.target.value);
                    setValidationError('');
                  }}
                  disabled={isLoading}
                >
                  <option value="">-- Choose Parcel to Dispatch --</option>
                  {parcels.map((p) => (
                    <option key={p.parcelId} value={p.parcelId}>
                      {p.trackingNumber} &bull; To: {p.receiverName} ({p.receiverAddress}) &bull;{' '}
                      {p.weight} kg [{p.parcelStatus}]
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Route Dropdown */}
            <div className="form-group full-width">
              <label htmlFor="assign-route" className="form-label">
                Transit Route <span className="required">*</span>
              </label>
              <div className="input-wrap">
                <RouteIcon size={18} className="input-icon" />
                <select
                  id="assign-route"
                  className="form-input has-icon"
                  value={selectedRoute}
                  onChange={(e) => {
                    setSelectedRoute(e.target.value);
                    setValidationError('');
                  }}
                  disabled={isLoading}
                >
                  <option value="">-- Choose Transit Route --</option>
                  {routes.map((r) => (
                    <option key={r.routeId} value={r.routeId}>
                      {r.routeName} ({r.source} &rarr; {r.destination}) &bull; {r.distance} km
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};

export default AssignDeliveryModal;
