import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import LoadingSpinner from '../common/LoadingSpinner';
import employeeService from '../../services/employeeService';
import { Award, PackageCheck, AlertCircle } from 'lucide-react';

export const EmployeeDeliveryCountModal = ({
  isOpen,
  onClose,
  employee,
}) => {
  const [count, setCount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    if (isOpen && employee && employee.employeeId) {
      setLoading(true);
      setError(null);
      setCount(null);

      employeeService
        .getEmployeeDeliveryCount(employee.employeeId)
        .then((res) => {
          if (isMounted) {
            setCount(res);
            setLoading(false);
          }
        })
        .catch((err) => {
          if (isMounted) {
            setError(err.message || 'Failed to fetch delivery count');
            setLoading(false);
          }
        });
    }

    return () => {
      isMounted = false;
    };
  }, [isOpen, employee]);

  if (!employee) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Employee Delivery Performance"
      maxWidth="sm"
      footer={
        <div className="modal-actions">
          <button type="button" className="btn btn-primary" onClick={onClose}>
            Close
          </button>
        </div>
      }
    >
      <div className="delivery-count-box">
        {loading ? (
          <LoadingSpinner message="Calculating delivery count via database function..." />
        ) : error ? (
          <div className="count-error-box">
            <AlertCircle size={28} className="text-danger" />
            <p>{error}</p>
          </div>
        ) : (
          <div className="count-result-content">
            <div className="count-icon-badge">
              <PackageCheck size={36} />
            </div>
            <div className="count-emp-name">
              Employee: <strong>{employee.name}</strong>
            </div>
            <div className="count-emp-sub">
              ID #{employee.employeeId} &bull; {employee.email}
            </div>

            <div className="count-highlight-box">
              <span className="count-label">Total Deliveries</span>
              <span className="count-number">{count !== null ? count : 0}</span>
              <span className="count-note">Computed by MySQL stored function</span>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default EmployeeDeliveryCountModal;
