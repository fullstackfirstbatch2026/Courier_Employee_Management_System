import React, { useState, useEffect, useCallback, useMemo } from 'react';
import deliveryService from '../services/deliveryService';
import parcelService from '../services/parcelService';
import StatusBadge from '../components/common/StatusBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import ConfirmDialog from '../components/common/ConfirmDialog';
import AssignDeliveryModal from '../components/modules/AssignDeliveryModal';
import UpdateDeliveryStatusModal from '../components/modules/UpdateDeliveryStatusModal';
import DeliveryViewModal from '../components/modules/DeliveryViewModal';
import { useToast } from '../context/ToastContext';
import {
  Truck,
  PlusCircle,
  Search,
  Filter,
  Eye,
  RefreshCw,
  AlertCircle,
  Clock,
  Sparkles,
  Trash2,
  Calendar,
} from 'lucide-react';

export const DeliveriesPage = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [assignLoading, setAssignLoading] = useState(false);

  const [statusDelivery, setStatusDelivery] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);

  const [viewingDelivery, setViewingDelivery] = useState(null);

  // Delete dialog
  const [deletingDelivery, setDeletingDelivery] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { success, error: toastError, info } = useToast();

  const loadDeliveries = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const data = await deliveryService.getDeliveryDetails();
      setDeliveries(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err.message ||
          'Unable to load deliveries. Please check whether the backend server is running.'
      );
      toastError(err.message || 'Failed to fetch deliveries');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [toastError]);

  useEffect(() => {
    loadDeliveries();
  }, [loadDeliveries]);

  // Handle Assign Delivery
  const handleAssignSubmit = async (formData) => {
    try {
      setAssignLoading(true);
      await deliveryService.assignDelivery(formData);
      success('Delivery assigned successfully');
      setIsAssignOpen(false);
      loadDeliveries(true);
    } catch (err) {
      toastError(err.message || 'Failed to assign delivery');
    } finally {
      setAssignLoading(false);
    }
  };

  // Handle Update Delivery Status
  const handleStatusUpdate = async (deliveryId, newStatus) => {
    try {
      setStatusLoading(true);
      await deliveryService.updateDeliveryStatus(deliveryId, newStatus);
      success(`Delivery status updated successfully to ${newStatus}`);

      if (newStatus === 'DELIVERED') {
        info('Database trigger fired: Associated parcel status synchronized to DELIVERED');
      }

      setStatusDelivery(null);
      loadDeliveries(true);
    } catch (err) {
      toastError(err.message || 'Failed to update delivery status');
    } finally {
      setStatusLoading(false);
    }
  };

  // Handle Delete
  const handleDeleteConfirm = async () => {
    if (!deletingDelivery) return;
    try {
      setDeleteLoading(true);
      await deliveryService.deleteDelivery(deletingDelivery.deliveryId);
      success('Delivery deleted successfully');
      setDeletingDelivery(null);
      loadDeliveries(true);
    } catch (err) {
      toastError(err.message || 'Failed to delete delivery');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Filtered deliveries
  const filteredDeliveries = useMemo(() => {
    return deliveries.filter((d) => {
      const matchesSearch =
        d.employeeName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.trackingNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.receiverName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.routeName?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === 'ALL' || d.deliveryStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [deliveries, searchQuery, statusFilter]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return <LoadingSpinner fullPage message="Loading delivery details from database..." />;
  }

  return (
    <div className="module-page">
      {/* Page Header */}
      <div className="page-header-actions">
        <div>
          <h2 className="section-title">Delivery Operations</h2>
          <p className="section-subtitle">
            Track consignments, assign transit routes, and update real-time delivery progress
          </p>
        </div>
        <div className="header-action-buttons">
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => loadDeliveries(true)}
            disabled={refreshing}
            title="Refresh list"
          >
            <RefreshCw size={16} className={refreshing ? 'spin-icon' : ''} />
            <span>{refreshing ? 'Syncing...' : 'Refresh'}</span>
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setIsAssignOpen(true)}
          >
            <PlusCircle size={16} />
            <span>+ Assign Delivery</span>
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
            onClick={() => loadDeliveries()}
          >
            Retry
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="filter-bar-card">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search by courier employee, tracking number, receiver, or route..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => setSearchQuery('')}
            >
              &times;
            </button>
          )}
        </div>

        <div className="filter-select-group">
          <div className="filter-label-wrap">
            <Filter size={16} className="text-muted" />
            <span className="filter-label">Status:</span>
          </div>
          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Statuses ({deliveries.length})</option>
            <option value="ASSIGNED">
              Assigned ({deliveries.filter((d) => d.deliveryStatus === 'ASSIGNED').length})
            </option>
            <option value="IN_TRANSIT">
              In Transit ({deliveries.filter((d) => d.deliveryStatus === 'IN_TRANSIT').length})
            </option>
            <option value="DELIVERED">
              Delivered ({deliveries.filter((d) => d.deliveryStatus === 'DELIVERED').length})
            </option>
            <option value="CANCELLED">
              Cancelled ({deliveries.filter((d) => d.deliveryStatus === 'CANCELLED').length})
            </option>
          </select>
        </div>
      </div>

      {/* Deliveries Table Card */}
      <div className="content-card full-width">
        {filteredDeliveries.length === 0 ? (
          <EmptyState
            icon={Truck}
            title={searchQuery || statusFilter !== 'ALL' ? 'No matching deliveries' : 'No deliveries found'}
            message={
              searchQuery || statusFilter !== 'ALL'
                ? 'Try adjusting your search query or filters.'
                : 'No delivery assignments found. Click "+ Assign Delivery" to dispatch a parcel.'
            }
            actionText={searchQuery || statusFilter !== 'ALL' ? 'Clear Filters' : '+ Assign Delivery'}
            onAction={
              searchQuery || statusFilter !== 'ALL'
                ? () => {
                    setSearchQuery('');
                    setStatusFilter('ALL');
                  }
                : () => setIsAssignOpen(true)
            }
          />
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '80px' }}>Delivery ID</th>
                  <th>Employee</th>
                  <th>Parcel / Tracking</th>
                  <th>Receiver</th>
                  <th>Route</th>
                  <th>Status</th>
                  <th>Assigned Date</th>
                  <th>Delivery Date</th>
                  <th className="text-center" style={{ minWidth: '220px' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredDeliveries.map((deliv) => (
                  <tr key={deliv.deliveryId}>
                    <td>
                      <span className="code-badge">DEL-{deliv.deliveryId}</span>
                    </td>
                    <td>
                      <div className="cell-employee">
                        <strong className="text-dark font-medium">{deliv.employeeName}</strong>
                        <span className="sub-text">ID: #{deliv.employeeId}</span>
                      </div>
                    </td>
                    <td>
                      <div className="cell-parcel">
                        <span className="tracking-code">{deliv.trackingNumber}</span>
                        <span className="sub-text">Sender: {deliv.senderName}</span>
                      </div>
                    </td>
                    <td>
                      <div className="cell-receiver">
                        <strong className="text-dark">{deliv.receiverName}</strong>
                        <span className="sub-text cell-address" title={deliv.receiverAddress}>
                          {deliv.receiverAddress}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className="route-tag">
                        {deliv.routeName || `${deliv.source} - ${deliv.destination}`}
                      </span>
                    </td>
                    <td>
                      <StatusBadge status={deliv.deliveryStatus} />
                    </td>
                    <td>
                      <span className="text-muted text-sm">{formatDate(deliv.assignedDate)}</span>
                    </td>
                    <td>
                      <span className="text-muted text-sm">{formatDate(deliv.deliveryDate)}</span>
                    </td>
                    <td className="text-center">
                      <div className="table-action-group">
                        <button
                          type="button"
                          className="action-btn action-view"
                          onClick={() => setViewingDelivery(deliv)}
                          title="View Delivery Details"
                        >
                          <Eye size={15} />
                          <span>View</span>
                        </button>
                        <button
                          type="button"
                          className="action-btn action-status"
                          onClick={() => setStatusDelivery(deliv)}
                          title="Update Delivery Status"
                        >
                          <Sparkles size={15} />
                          <span>Status</span>
                        </button>
                        <button
                          type="button"
                          className="action-btn action-delete"
                          onClick={() => setDeletingDelivery(deliv)}
                          title="Delete Delivery Record"
                        >
                          <Trash2 size={15} />
                          <span>Delete</span>
                        </button>
                      </div>
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
        isOpen={isAssignOpen}
        onClose={() => setIsAssignOpen(false)}
        onSubmit={handleAssignSubmit}
        isLoading={assignLoading}
      />

      {/* Update Status Modal */}
      <UpdateDeliveryStatusModal
        isOpen={Boolean(statusDelivery)}
        onClose={() => setStatusDelivery(null)}
        onSubmit={handleStatusUpdate}
        delivery={statusDelivery}
        isLoading={statusLoading}
      />

      {/* View Delivery Details Modal */}
      <DeliveryViewModal
        isOpen={Boolean(viewingDelivery)}
        onClose={() => setViewingDelivery(null)}
        delivery={viewingDelivery}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deletingDelivery)}
        onClose={() => setDeletingDelivery(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Delivery Record"
        message={`Are you sure you want to delete delivery record DEL-${deletingDelivery?.deliveryId} (Tracking: ${deletingDelivery?.trackingNumber})? This action cannot be undone.`}
        confirmText="Yes, Delete Delivery"
        isLoading={deleteLoading}
        variant="danger"
      />
    </div>
  );
};

export default DeliveriesPage;
