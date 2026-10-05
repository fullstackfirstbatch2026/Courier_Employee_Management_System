import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import LoadingSpinner from '../common/LoadingSpinner';
import employeeService from '../../services/employeeService';
import { TrendingUp, Award, AlertCircle, Info } from 'lucide-react';

export const AboveAverageModal = ({ isOpen, onClose }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    if (isOpen) {
      setLoading(true);
      setError(null);
      employeeService
        .getAboveAverageEmployees()
        .then((res) => {
          if (isMounted) {
            setData(Array.isArray(res) ? res : []);
            setLoading(false);
          }
        })
        .catch((err) => {
          if (isMounted) {
            setError(err.message || 'Failed to load above-average employees');
            setLoading(false);
          }
        });
    }

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Top Performers: Above-Average Deliveries"
      maxWidth="md"
      footer={
        <div className="modal-actions">
          <button type="button" className="btn btn-primary" onClick={onClose}>
            Close
          </button>
        </div>
      }
    >
      <div className="above-avg-container">
        <div className="callout-card">
          <Info size={18} className="callout-icon" />
          <div className="callout-text">
            <strong>Subquery Execution:</strong> Displays all employees whose completed/assigned
            deliveries exceed the company-wide average across all staff.
          </div>
        </div>

        {loading ? (
          <LoadingSpinner message="Calculating above-average performers..." />
        ) : error ? (
          <div className="error-banner">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        ) : data.length === 0 ? (
          <div className="empty-sub-state">
            <TrendingUp size={36} className="text-muted" />
            <p>No employees currently exceed the average delivery threshold.</p>
          </div>
        ) : (
          <div className="table-responsive modal-table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '80px' }}>Rank</th>
                  <th>Employee ID</th>
                  <th>Employee Name</th>
                  <th className="text-right">Total Deliveries</th>
                  <th className="text-center">Performance</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={item.employeeId || index}>
                    <td>
                      <div className={`rank-badge rank-${index + 1}`}>
                        {index === 0 ? <Award size={14} /> : `#${index + 1}`}
                      </div>
                    </td>
                    <td>
                      <span className="code-badge">EMP-{item.employeeId}</span>
                    </td>
                    <td>
                      <strong className="font-medium text-dark">{item.employeeName}</strong>
                    </td>
                    <td className="text-right">
                      <span className="delivery-stat-num">{item.deliveryCount}</span>
                    </td>
                    <td className="text-center">
                      <span className="badge badge-success">
                        <TrendingUp size={12} style={{ marginRight: '4px' }} />
                        High Performer
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default AboveAverageModal;
