import React, { useState, useEffect, useCallback, useMemo } from 'react';
import parcelService from '../services/parcelService';
import StatusBadge from '../components/common/StatusBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import ConfirmDialog from '../components/common/ConfirmDialog';
import ParcelFormModal from '../components/modules/ParcelFormModal';
import ParcelViewModal from '../components/modules/ParcelViewModal';
import { useToast } from '../context/ToastContext';
import {
  Package,
  PackagePlus,
  Search,
  Filter,
  Eye,
  Edit2,
  Trash2,
  RefreshCw,
  AlertCircle,
  Scale,
} from 'lucide-react';

export const ParcelsPage = () => {
  const [parcels, setParcels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingParcel, setEditingParcel] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const [viewingParcel, setViewingParcel] = useState(null);

  // Delete dialog
  const [deletingParcel, setDeletingParcel] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { success, error: toastError } = useToast();

  const loadParcels = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const data = await parcelService.getAllParcels();
      setParcels(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Unable to load parcels. Please check whether the backend server is running.');
      toastError(err.message || 'Failed to fetch parcels');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [toastError]);

  useEffect(() => {
    loadParcels();
  }, [loadParcels]);

  // Handle Create or Update
  const handleFormSubmit = async (formData) => {
    try {
      setFormLoading(true);
      if (editingParcel && editingParcel.parcelId) {
        await parcelService.updateParcel(editingParcel.parcelId, formData);
        success('Parcel updated successfully');
      } else {
        await parcelService.createParcel(formData);
        success('Parcel created successfully');
      }
      setIsFormOpen(false);
      setEditingParcel(null);
      loadParcels(true);
    } catch (err) {
      toastError(err.message || 'Failed to save parcel');
    } finally {
      setFormLoading(false);
    }
  };

  // Handle Delete
  const handleDeleteConfirm = async () => {
    if (!deletingParcel) return;
    try {
      setDeleteLoading(true);
      await parcelService.deleteParcel(deletingParcel.parcelId);
      success('Parcel deleted successfully');
      setDeletingParcel(null);
      loadParcels(true);
    } catch (err) {
      toastError(err.message || 'Failed to delete parcel');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Filtered parcels
  const filteredParcels = useMemo(() => {
    return parcels.filter((p) => {
      const matchesSearch =
        p.trackingNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.receiverName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.senderName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.receiverAddress?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === 'ALL' || p.parcelStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [parcels, searchQuery, statusFilter]);

  if (loading) {
    return <LoadingSpinner fullPage message="Loading parcels from database..." />;
  }

  return (
    <div className="module-page">
      {/* Page Header */}
      <div className="page-header-actions">
        <div>
          <h2 className="section-title">Parcel Management</h2>
          <p className="section-subtitle">
            Manage parcel registry, dispatch status, sender-receiver records, and weights
          </p>
        </div>
        <div className="header-action-buttons">
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => loadParcels(true)}
            disabled={refreshing}
            title="Refresh list"
          >
            <RefreshCw size={16} className={refreshing ? 'spin-icon' : ''} />
            <span>{refreshing ? 'Syncing...' : 'Refresh'}</span>
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              setEditingParcel(null);
              setIsFormOpen(true);
            }}
          >
            <PackagePlus size={16} />
            <span>+ Add Parcel</span>
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
            onClick={() => loadParcels()}
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
            placeholder="Search by tracking number, receiver, sender, or address..."
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
            <option value="ALL">All Statuses ({parcels.length})</option>
            <option value="PENDING">
              Pending ({parcels.filter((p) => p.parcelStatus === 'PENDING').length})
            </option>
            <option value="ASSIGNED">
              Assigned ({parcels.filter((p) => p.parcelStatus === 'ASSIGNED').length})
            </option>
            <option value="IN_TRANSIT">
              In Transit ({parcels.filter((p) => p.parcelStatus === 'IN_TRANSIT').length})
            </option>
            <option value="DELIVERED">
              Delivered ({parcels.filter((p) => p.parcelStatus === 'DELIVERED').length})
            </option>
            <option value="CANCELLED">
              Cancelled ({parcels.filter((p) => p.parcelStatus === 'CANCELLED').length})
            </option>
          </select>
        </div>
      </div>

      {/* Parcels Table Card */}
      <div className="content-card full-width">
        {filteredParcels.length === 0 ? (
          <EmptyState
            icon={Package}
            title={searchQuery || statusFilter !== 'ALL' ? 'No matching parcels' : 'No parcels found'}
            message={
              searchQuery || statusFilter !== 'ALL'
                ? 'Try adjusting your search query or filters.'
                : 'No parcels exist in the database. Click "+ Add Parcel" to create one.'
            }
            actionText={searchQuery || statusFilter !== 'ALL' ? 'Clear Filters' : '+ Add Parcel'}
            onAction={
              searchQuery || statusFilter !== 'ALL'
                ? () => {
                    setSearchQuery('');
                    setStatusFilter('ALL');
                  }
                : () => {
                    setEditingParcel(null);
                    setIsFormOpen(true);
                  }
            }
          />
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '70px' }}>ID</th>
                  <th>Tracking Number</th>
                  <th>Sender</th>
                  <th>Receiver</th>
                  <th>Receiver Address</th>
                  <th>Weight</th>
                  <th>Status</th>
                  <th>Created At</th>
                  <th className="text-center" style={{ minWidth: '180px' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredParcels.map((p) => {
                  const createdDate = p.createdAt
                    ? new Date(p.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : '-';

                  return (
                    <tr key={p.parcelId}>
                      <td>
                        <span className="code-badge">#{p.parcelId}</span>
                      </td>
                      <td>
                        <span className="tracking-code">{p.trackingNumber}</span>
                      </td>
                      <td>
                        <span className="text-dark font-medium">{p.senderName}</span>
                      </td>
                      <td>
                        <strong className="text-dark">{p.receiverName}</strong>
                      </td>
                      <td>
                        <span className="text-muted cell-address" title={p.receiverAddress}>
                          {p.receiverAddress}
                        </span>
                      </td>
                      <td>
                        <div className="cell-weight">
                          <Scale size={14} className="text-muted" />
                          <span>{p.weight} kg</span>
                        </div>
                      </td>
                      <td>
                        <StatusBadge status={p.parcelStatus} />
                      </td>
                      <td>
                        <span className="text-muted">{createdDate}</span>
                      </td>
                      <td className="text-center">
                        <div className="table-action-group">
                          <button
                            type="button"
                            className="action-btn action-view"
                            onClick={() => setViewingParcel(p)}
                            title="View Parcel Details"
                          >
                            <Eye size={15} />
                            <span>View</span>
                          </button>
                          <button
                            type="button"
                            className="action-btn action-edit"
                            onClick={() => {
                              setEditingParcel(p);
                              setIsFormOpen(true);
                            }}
                            title="Edit Parcel"
                          >
                            <Edit2 size={15} />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            className="action-btn action-delete"
                            onClick={() => setDeletingParcel(p)}
                            title="Delete Parcel"
                          >
                            <Trash2 size={15} />
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      <ParcelFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingParcel(null);
        }}
        onSubmit={handleFormSubmit}
        parcel={editingParcel}
        isLoading={formLoading}
      />

      {/* View Modal */}
      <ParcelViewModal
        isOpen={Boolean(viewingParcel)}
        onClose={() => setViewingParcel(null)}
        parcel={viewingParcel}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deletingParcel)}
        onClose={() => setDeletingParcel(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Parcel"
        message={`Are you sure you want to delete parcel "${deletingParcel?.trackingNumber}" (ID: #${deletingParcel?.parcelId})? This action cannot be undone.`}
        confirmText="Yes, Delete Parcel"
        isLoading={deleteLoading}
        variant="danger"
      />
    </div>
  );
};

export default ParcelsPage;
