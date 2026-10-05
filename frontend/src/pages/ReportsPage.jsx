import React, { useState, useEffect, useCallback } from 'react';
import employeeService from '../services/employeeService';
import deliveryService from '../services/deliveryService';
import parcelService from '../services/parcelService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import StatusBadge from '../components/common/StatusBadge';
import {
  BarChart3,
  Award,
  Package,
  Truck,
  TrendingUp,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Clock,
  Send,
  AlertTriangle,
  Scale,
  Users,
  Printer,
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const ReportsPage = () => {
  const [aboveAverageEmployees, setAboveAverageEmployees] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [parcels, setParcels] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const { error: toastError } = useToast();

  const loadReportData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const [aboveRes, delivRes, parcRes, empRes] = await Promise.all([
        employeeService.getAboveAverageEmployees(),
        deliveryService.getDeliveryDetails(),
        parcelService.getAllParcels(),
        employeeService.getAllEmployees(),
      ]);

      setAboveAverageEmployees(Array.isArray(aboveRes) ? aboveRes : []);
      setDeliveries(Array.isArray(delivRes) ? delivRes : []);
      setParcels(Array.isArray(parcRes) ? parcRes : []);
      setEmployees(Array.isArray(empRes) ? empRes : []);
    } catch (err) {
      setError(err.message || 'Unable to generate reports. Please check backend server.');
      toastError(err.message || 'Failed to fetch analytics');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [toastError]);

  useEffect(() => {
    loadReportData();
  }, [loadReportData]);

  // Delivery status counts
  const totalDeliveries = deliveries.length;
  const delivAssigned = deliveries.filter((d) => d.deliveryStatus === 'ASSIGNED').length;
  const delivInTransit = deliveries.filter((d) => d.deliveryStatus === 'IN_TRANSIT').length;
  const delivDelivered = deliveries.filter((d) => d.deliveryStatus === 'DELIVERED').length;
  const delivCancelled = deliveries.filter((d) => d.deliveryStatus === 'CANCELLED').length;

  // Parcel status counts
  const totalParcels = parcels.length;
  const parcPending = parcels.filter((p) => p.parcelStatus === 'PENDING').length;
  const parcAssigned = parcels.filter((p) => p.parcelStatus === 'ASSIGNED').length;
  const parcInTransit = parcels.filter((p) => p.parcelStatus === 'IN_TRANSIT').length;
  const parcDelivered = parcels.filter((p) => p.parcelStatus === 'DELIVERED').length;
  const parcCancelled = parcels.filter((p) => p.parcelStatus === 'CANCELLED').length;

  const totalWeight = parcels.reduce((sum, p) => sum + (parseFloat(p.weight) || 0), 0);

  const getPercent = (count, total) => {
    if (!total || total === 0) return 0;
    return Math.round((count / total) * 100);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <LoadingSpinner fullPage message="Compiling analytical summaries and subquery results..." />;
  }

  return (
    <div className="module-page reports-page">
      {/* Page Header */}
      <div className="page-header-actions">
        <div>
          <h2 className="section-title">Operational Reports & Analytics</h2>
          <p className="section-subtitle">
            Database subquery performance analysis, delivery throughput, and inventory status
          </p>
        </div>
        <div className="header-action-buttons">
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => loadReportData(true)}
            disabled={refreshing}
            title="Refresh analytics"
          >
            <RefreshCw size={16} className={refreshing ? 'spin-icon' : ''} />
            <span>{refreshing ? 'Syncing...' : 'Refresh Reports'}</span>
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handlePrint}
            title="Print report summary"
          >
            <Printer size={16} />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="error-alert-banner">
          <AlertCircle size={20} />
          <div className="error-alert-text">{error}</div>
          <button
            type="button"
            className="btn btn-sm btn-outline-danger"
            onClick={() => loadReportData()}
          >
            Retry
          </button>
        </div>
      )}

      {/* SECTION 1: Above-Average Employee Delivery Report */}
      <div className="content-card full-width report-section-card">
        <div className="report-header">
          <div className="report-icon-box bg-accent-soft">
            <Award size={24} className="text-accent" />
          </div>
          <div>
            <h3 className="card-title">Employee Delivery Report</h3>
            <p className="card-subtitle">
              Calculated via SQL Subquery: <code>GET /api/employees/above-average</code>
            </p>
          </div>
        </div>

        <div className="report-meta-box">
          <div className="meta-stat">
            <span className="label">Total Workforce</span>
            <strong className="val">{employees.length}</strong>
          </div>
          <div className="meta-stat">
            <span className="label">Above-Average Performers</span>
            <strong className="val text-success">{aboveAverageEmployees.length}</strong>
          </div>
          <div className="meta-stat">
            <span className="label">Average Deliveries / Employee</span>
            <strong className="val">
              {employees.length > 0 ? (totalDeliveries / employees.length).toFixed(1) : 0}
            </strong>
          </div>
        </div>

        {aboveAverageEmployees.length === 0 ? (
          <div className="empty-sub-state">
            <TrendingUp size={36} className="text-muted" />
            <p>No employees currently have deliveries exceeding the company average.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '80px' }}>Rank</th>
                  <th>Employee ID</th>
                  <th>Employee Name</th>
                  <th className="text-right">Total Deliveries</th>
                  <th className="text-center">Performance Status</th>
                </tr>
              </thead>
              <tbody>
                {aboveAverageEmployees.map((emp, index) => (
                  <tr key={emp.employeeId || index}>
                    <td>
                      <div className={`rank-badge rank-${index + 1}`}>
                        {index === 0 ? <Award size={14} /> : `#${index + 1}`}
                      </div>
                    </td>
                    <td>
                      <span className="code-badge">EMP-{emp.employeeId}</span>
                    </td>
                    <td>
                      <strong className="text-dark font-medium">{emp.employeeName}</strong>
                    </td>
                    <td className="text-right">
                      <span className="delivery-stat-num">{emp.deliveryCount}</span>
                    </td>
                    <td className="text-center">
                      <span className="badge badge-success">
                        <TrendingUp size={12} style={{ marginRight: '4px' }} />
                        Above Average
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* SECTION 2 & 3: Two Column Layout for Delivery & Parcel Status Reports */}
      <div className="dashboard-grid-two-col">
        {/* SECTION 2: Delivery Status Report */}
        <div className="content-card report-section-card">
          <div className="report-header">
            <div className="report-icon-box bg-primary-soft">
              <Truck size={24} className="text-primary" />
            </div>
            <div>
              <h3 className="card-title">Delivery Status Report</h3>
              <p className="card-subtitle">
                Calculated from delivery operations API ({totalDeliveries} total records)
              </p>
            </div>
          </div>

          {/* Delivery stacked progress bar */}
          <div className="progress-stacked-bar mt-3">
            <div
              className="progress-slice slice-assigned"
              style={{ width: `${getPercent(delivAssigned, totalDeliveries)}%` }}
              title={`Assigned: ${delivAssigned}`}
            />
            <div
              className="progress-slice slice-transit"
              style={{ width: `${getPercent(delivInTransit, totalDeliveries)}%` }}
              title={`In Transit: ${delivInTransit}`}
            />
            <div
              className="progress-slice slice-delivered"
              style={{ width: `${getPercent(delivDelivered, totalDeliveries)}%` }}
              title={`Delivered: ${delivDelivered}`}
            />
            <div
              className="progress-slice slice-cancelled"
              style={{ width: `${getPercent(delivCancelled, totalDeliveries)}%` }}
              title={`Cancelled: ${delivCancelled}`}
            />
          </div>

          <div className="report-kpi-grid">
            <div className="report-kpi-item">
              <div className="kpi-icon-wrap icon-assigned">
                <Send size={18} />
              </div>
              <div className="kpi-body">
                <span className="kpi-label">Assigned</span>
                <strong className="kpi-val">{delivAssigned}</strong>
                <span className="kpi-sub">{getPercent(delivAssigned, totalDeliveries)}% of deliveries</span>
              </div>
            </div>

            <div className="report-kpi-item">
              <div className="kpi-icon-wrap icon-transit">
                <Clock size={18} />
              </div>
              <div className="kpi-body">
                <span className="kpi-label">In Transit</span>
                <strong className="kpi-val">{delivInTransit}</strong>
                <span className="kpi-sub">{getPercent(delivInTransit, totalDeliveries)}% of deliveries</span>
              </div>
            </div>

            <div className="report-kpi-item">
              <div className="kpi-icon-wrap icon-delivered">
                <CheckCircle2 size={18} />
              </div>
              <div className="kpi-body">
                <span className="kpi-label">Delivered</span>
                <strong className="kpi-val">{delivDelivered}</strong>
                <span className="kpi-sub">{getPercent(delivDelivered, totalDeliveries)}% completed</span>
              </div>
            </div>

            <div className="report-kpi-item">
              <div className="kpi-icon-wrap icon-cancelled">
                <AlertTriangle size={18} />
              </div>
              <div className="kpi-body">
                <span className="kpi-label">Cancelled</span>
                <strong className="kpi-val">{delivCancelled}</strong>
                <span className="kpi-sub">{getPercent(delivCancelled, totalDeliveries)}% cancelled</span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: Parcel Status Report */}
        <div className="content-card report-section-card">
          <div className="report-header">
            <div className="report-icon-box bg-indigo-soft">
              <Package size={24} className="text-info" />
            </div>
            <div>
              <h3 className="card-title">Parcel Status Report</h3>
              <p className="card-subtitle">
                Calculated from parcel inventory API ({totalParcels} items, {totalWeight.toFixed(1)} kg)
              </p>
            </div>
          </div>

          <div className="parcel-weight-banner">
            <Scale size={18} />
            <span>
              Total Consignment Weight Managed: <strong>{totalWeight.toFixed(2)} kg</strong>
            </span>
          </div>

          <div className="report-kpi-grid">
            <div className="report-kpi-item">
              <div className="kpi-icon-wrap icon-pending">
                <Clock size={18} />
              </div>
              <div className="kpi-body">
                <span className="kpi-label">Pending</span>
                <strong className="kpi-val">{parcPending}</strong>
                <span className="kpi-sub">{getPercent(parcPending, totalParcels)}% awaiting dispatch</span>
              </div>
            </div>

            <div className="report-kpi-item">
              <div className="kpi-icon-wrap icon-assigned">
                <Send size={18} />
              </div>
              <div className="kpi-body">
                <span className="kpi-label">Assigned</span>
                <strong className="kpi-val">{parcAssigned}</strong>
                <span className="kpi-sub">{getPercent(parcAssigned, totalParcels)}% allocated</span>
              </div>
            </div>

            <div className="report-kpi-item">
              <div className="kpi-icon-wrap icon-transit">
                <Clock size={18} />
              </div>
              <div className="kpi-body">
                <span className="kpi-label">In Transit</span>
                <strong className="kpi-val">{parcInTransit}</strong>
                <span className="kpi-sub">{getPercent(parcInTransit, totalParcels)}% in transport</span>
              </div>
            </div>

            <div className="report-kpi-item">
              <div className="kpi-icon-wrap icon-delivered">
                <CheckCircle2 size={18} />
              </div>
              <div className="kpi-body">
                <span className="kpi-label">Delivered</span>
                <strong className="kpi-val">{parcDelivered}</strong>
                <span className="kpi-sub">{getPercent(parcDelivered, totalParcels)}% final destination</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
