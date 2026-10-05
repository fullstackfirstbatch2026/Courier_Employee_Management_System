import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import employeeService from '../services/employeeService';
import parcelService from '../services/parcelService';
import routeService from '../services/routeService';
import deliveryService from '../services/deliveryService';
import StatCard from '../components/common/StatCard';
import StatusBadge from '../components/common/StatusBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import AssignDeliveryModal from '../components/modules/AssignDeliveryModal';
import { useToast } from '../context/ToastContext';
import {
  Users,
  Package,
  Route as RouteIcon,
  Truck,
  CheckCircle2,
  Clock,
  Send,
  AlertTriangle,
  RefreshCw,
  PlusCircle,
  ArrowRight,
  TrendingUp,
  Activity,
  Layers,
} from 'lucide-react';

export const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const [employees, setEmployees] = useState([]);
  const [parcels, setParcels] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [deliveries, setDeliveries] = useState([]);

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assignLoading, setAssignLoading] = useState(false);

  const { success, error: toastError } = useToast();

  const fetchDashboardData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const [empRes, parcRes, routeRes, delivRes] = await Promise.all([
        employeeService.getAllEmployees(),
        parcelService.getAllParcels(),
        routeService.getAllRoutes(),
        deliveryService.getDeliveryDetails(),
      ]);

      setEmployees(Array.isArray(empRes) ? empRes : []);
      setParcels(Array.isArray(parcRes) ? parcRes : []);
      setRoutes(Array.isArray(routeRes) ? routeRes : []);
      setDeliveries(Array.isArray(delivRes) ? delivRes : []);
    } catch (err) {
      setError(err.message || 'Unable to load dashboard data.');
      toastError(err.message || 'Failed to connect to backend server.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [toastError]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleAssignDelivery = async (formData) => {
    try {
      setAssignLoading(true);
      await deliveryService.assignDelivery(formData);
      success('Delivery assigned successfully!');
      setIsAssignModalOpen(false);
      fetchDashboardData(true);
    } catch (err) {
      toastError(err.message || 'Failed to assign delivery');
    } finally {
      setAssignLoading(false);
    }
  };

  // Computations for statistics
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter((e) => e.status === 'ACTIVE').length;

  const totalParcels = parcels.length;
  const pendingParcels = parcels.filter((p) => p.parcelStatus === 'PENDING').length;
  const deliveredParcels = parcels.filter((p) => p.parcelStatus === 'DELIVERED').length;

  const totalRoutes = routes.length;
  const activeRoutes = routes.filter((r) => r.routeStatus === 'ACTIVE').length;

  const totalDeliveries = deliveries.length;
  const deliveredDeliveries = deliveries.filter((d) => d.deliveryStatus === 'DELIVERED').length;
  const inTransitDeliveries = deliveries.filter((d) => d.deliveryStatus === 'IN_TRANSIT').length;
  const assignedDeliveries = deliveries.filter((d) => d.deliveryStatus === 'ASSIGNED').length;
  const cancelledDeliveries = deliveries.filter((d) => d.deliveryStatus === 'CANCELLED').length;

  // Recent deliveries (sorted by ID descending or assigned date)
  const recentDeliveries = [...deliveries]
    .sort((a, b) => (b.deliveryId || 0) - (a.deliveryId || 0))
    .slice(0, 6);

  // Delivery status breakdown metrics
  const deliveryStatusCounts = {
    ASSIGNED: assignedDeliveries,
    IN_TRANSIT: inTransitDeliveries,
    DELIVERED: deliveredDeliveries,
    CANCELLED: cancelledDeliveries,
  };

  const getPercentage = (count, total) => {
    if (!total || total === 0) return 0;
    return Math.round((count / total) * 100);
  };

  if (loading) {
    return <LoadingSpinner fullPage message="Fetching live operational data from Spring Boot..." />;
  }

  return (
    <div className="dashboard-page">
      {/* Top Header Controls */}
      <div className="page-header-actions">
        <div>
          <h2 className="section-title">Operational Overview</h2>
          <p className="section-subtitle">
            Synchronized with MySQL database and Spring Boot REST services
          </p>
        </div>
        <div className="header-action-buttons">
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => fetchDashboardData(true)}
            disabled={refreshing}
            title="Reload from backend"
          >
            <RefreshCw size={16} className={refreshing ? 'spin-icon' : ''} />
            <span>{refreshing ? 'Syncing...' : 'Sync Backend'}</span>
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setIsAssignModalOpen(true)}
          >
            <PlusCircle size={17} />
            <span>Assign Delivery</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="error-alert-banner">
          <AlertTriangle size={20} />
          <div className="error-alert-text">
            <strong>Backend Connection Alert:</strong> {error}
          </div>
          <button
            type="button"
            className="btn btn-sm btn-outline-danger"
            onClick={() => fetchDashboardData()}
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* Main 4 Primary Metric Cards */}
      <div className="stat-cards-grid">
        <StatCard
          title="Total Staff"
          value={totalEmployees}
          icon={Users}
          color="blue"
          badge={`${activeEmployees} Active`}
          subtitle="Registered staff"
        />

        <StatCard
          title="Total Parcels"
          value={totalParcels}
          icon={Package}
          color="indigo"
          badge={`${pendingParcels} Pending`}
          subtitle={`${deliveredParcels} Delivered`}
        />

        <StatCard
          title="Transit Routes"
          value={totalRoutes}
          icon={RouteIcon}
          color="orange"
          badge={`${activeRoutes} Active`}
          subtitle="Corridors operating"
        />

        <StatCard
          title="Total Deliveries"
          value={totalDeliveries}
          icon={Truck}
          color="emerald"
          badge={`${deliveredDeliveries} Completed`}
          subtitle={`${inTransitDeliveries} On Road`}
        />
      </div>

      {/* Secondary Quick Metrics Row */}
      <div className="stat-mini-row">
        <div className="mini-stat-card">
          <div className="mini-icon icon-assigned">
            <Send size={18} />
          </div>
          <div className="mini-info">
            <span className="mini-label">Assigned</span>
            <strong className="mini-val">{assignedDeliveries}</strong>
          </div>
        </div>

        <div className="mini-stat-card">
          <div className="mini-icon icon-transit">
            <Clock size={18} />
          </div>
          <div className="mini-info">
            <span className="mini-label">In Transit</span>
            <strong className="mini-val">{inTransitDeliveries}</strong>
          </div>
        </div>

        <div className="mini-stat-card">
          <div className="mini-icon icon-delivered">
            <CheckCircle2 size={18} />
          </div>
          <div className="mini-info">
            <span className="mini-label">Delivered</span>
            <strong className="mini-val">{deliveredDeliveries}</strong>
          </div>
        </div>

        <div className="mini-stat-card">
          <div className="mini-icon icon-cancelled">
            <AlertTriangle size={18} />
          </div>
          <div className="mini-info">
            <span className="mini-label">Cancelled</span>
            <strong className="mini-val">{cancelledDeliveries}</strong>
          </div>
        </div>
      </div>

      {/* Middle Section: Chart / Visual Status Summary + Quick Shortcuts */}
      <div className="dashboard-grid-two-col">
        {/* Delivery Status Overview (Visual Bar / Distribution) */}
        <div className="content-card">
          <div className="card-header-row">
            <div>
              <h3 className="card-title">Delivery Status Overview</h3>
              <p className="card-subtitle">Current status breakdown of all consignments</p>
            </div>
            <Link to="/deliveries" className="card-header-link">
              View All <ArrowRight size={15} />
            </Link>
          </div>

          <div className="status-bars-container">
            {/* Visual multi-segment progress bar */}
            <div className="progress-stacked-bar">
              <div
                className="progress-slice slice-assigned"
                style={{ width: `${getPercentage(assignedDeliveries, totalDeliveries)}%` }}
                title={`Assigned: ${assignedDeliveries}`}
              />
              <div
                className="progress-slice slice-transit"
                style={{ width: `${getPercentage(inTransitDeliveries, totalDeliveries)}%` }}
                title={`In Transit: ${inTransitDeliveries}`}
              />
              <div
                className="progress-slice slice-delivered"
                style={{ width: `${getPercentage(deliveredDeliveries, totalDeliveries)}%` }}
                title={`Delivered: ${deliveredDeliveries}`}
              />
              <div
                className="progress-slice slice-cancelled"
                style={{ width: `${getPercentage(cancelledDeliveries, totalDeliveries)}%` }}
                title={`Cancelled: ${cancelledDeliveries}`}
              />
            </div>

            {/* Individual Breakdown Cards */}
            <div className="status-breakdown-list">
              <div className="status-breakdown-item">
                <div className="item-meta">
                  <span className="status-dot dot-assigned" />
                  <span className="item-name">Assigned</span>
                </div>
                <div className="item-stats">
                  <strong className="item-count">{assignedDeliveries}</strong>
                  <span className="item-percent">
                    {getPercentage(assignedDeliveries, totalDeliveries)}%
                  </span>
                </div>
              </div>

              <div className="status-breakdown-item">
                <div className="item-meta">
                  <span className="status-dot dot-transit" />
                  <span className="item-name">In Transit</span>
                </div>
                <div className="item-stats">
                  <strong className="item-count">{inTransitDeliveries}</strong>
                  <span className="item-percent">
                    {getPercentage(inTransitDeliveries, totalDeliveries)}%
                  </span>
                </div>
              </div>

              <div className="status-breakdown-item">
                <div className="item-meta">
                  <span className="status-dot dot-delivered" />
                  <span className="item-name">Delivered</span>
                </div>
                <div className="item-stats">
                  <strong className="item-count">{deliveredDeliveries}</strong>
                  <span className="item-percent">
                    {getPercentage(deliveredDeliveries, totalDeliveries)}%
                  </span>
                </div>
              </div>

              <div className="status-breakdown-item">
                <div className="item-meta">
                  <span className="status-dot dot-cancelled" />
                  <span className="item-name">Cancelled</span>
                </div>
                <div className="item-stats">
                  <strong className="item-count">{cancelledDeliveries}</strong>
                  <span className="item-percent">
                    {getPercentage(cancelledDeliveries, totalDeliveries)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Parcel Status Distribution Card */}
        <div className="content-card">
          <div className="card-header-row">
            <div>
              <h3 className="card-title">Parcel Pipeline</h3>
              <p className="card-subtitle">Real-time status of items in warehouse & transit</p>
            </div>
            <Link to="/parcels" className="card-header-link">
              Inventory <ArrowRight size={15} />
            </Link>
          </div>

          <div className="pipeline-stats-grid">
            <div className="pipeline-item">
              <span className="pipeline-label">Warehouse Pending</span>
              <strong className="pipeline-val text-pending">{pendingParcels}</strong>
              <div className="progress-track">
                <div
                  className="progress-fill fill-pending"
                  style={{ width: `${getPercentage(pendingParcels, totalParcels)}%` }}
                />
              </div>
            </div>

            <div className="pipeline-item">
              <span className="pipeline-label">Dispatched / Assigned</span>
              <strong className="pipeline-val text-info">
                {parcels.filter((p) => p.parcelStatus === 'ASSIGNED').length}
              </strong>
              <div className="progress-track">
                <div
                  className="progress-fill fill-info"
                  style={{
                    width: `${getPercentage(
                      parcels.filter((p) => p.parcelStatus === 'ASSIGNED').length,
                      totalParcels
                    )}%`,
                  }}
                />
              </div>
            </div>

            <div className="pipeline-item">
              <span className="pipeline-label">On The Road</span>
              <strong className="pipeline-val text-warning">
                {parcels.filter((p) => p.parcelStatus === 'IN_TRANSIT').length}
              </strong>
              <div className="progress-track">
                <div
                  className="progress-fill fill-warning"
                  style={{
                    width: `${getPercentage(
                      parcels.filter((p) => p.parcelStatus === 'IN_TRANSIT').length,
                      totalParcels
                    )}%`,
                  }}
                />
              </div>
            </div>

            <div className="pipeline-item">
              <span className="pipeline-label">Successfully Delivered</span>
              <strong className="pipeline-val text-success">{deliveredParcels}</strong>
              <div className="progress-track">
                <div
                  className="progress-fill fill-success"
                  style={{ width: `${getPercentage(deliveredParcels, totalParcels)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Deliveries Table */}
      <div className="content-card full-width">
        <div className="card-header-row">
          <div>
            <h3 className="card-title">Recent Deliveries</h3>
            <p className="card-subtitle">
              Live joined records displaying delivery, employee, parcel, and transit route
            </p>
          </div>
          <Link to="/deliveries" className="btn btn-sm btn-outline">
            View All Deliveries
          </Link>
        </div>

        {recentDeliveries.length === 0 ? (
          <EmptyState
            title="No Deliveries Found"
            message="There are no delivery records in the database. Use Assign Delivery to create one."
            actionText="Assign Delivery"
            onAction={() => setIsAssignModalOpen(true)}
          />
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Delivery ID</th>
                  <th>Employee</th>
                  <th>Tracking Number</th>
                  <th>Route</th>
                  <th>Status</th>
                  <th>Assigned Date</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentDeliveries.map((item) => (
                  <tr key={item.deliveryId}>
                    <td>
                      <span className="code-badge">DEL-{item.deliveryId}</span>
                    </td>
                    <td>
                      <div className="cell-employee">
                        <strong className="text-dark">{item.employeeName || 'Unassigned'}</strong>
                        <span className="sub-text">{item.employeeEmail || ''}</span>
                      </div>
                    </td>
                    <td>
                      <span className="tracking-code">{item.trackingNumber}</span>
                    </td>
                    <td>
                      <span className="route-tag">
                        {item.routeName || `${item.source} - ${item.destination}`}
                      </span>
                    </td>
                    <td>
                      <StatusBadge status={item.deliveryStatus} />
                    </td>
                    <td>
                      <span className="text-muted">
                        {item.assignedDate
                          ? new Date(item.assignedDate).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : '-'}
                      </span>
                    </td>
                    <td className="text-right">
                      <Link to="/deliveries" className="table-action-link">
                        Details &rarr;
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Assign Delivery Modal */}
      <AssignDeliveryModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        onSubmit={handleAssignDelivery}
        isLoading={assignLoading}
      />
    </div>
  );
};

export default DashboardPage;
