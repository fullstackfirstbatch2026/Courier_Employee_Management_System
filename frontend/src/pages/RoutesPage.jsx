import React, { useState, useEffect, useCallback, useMemo } from 'react';
import routeService from '../services/routeService';
import StatusBadge from '../components/common/StatusBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import ConfirmDialog from '../components/common/ConfirmDialog';
import RouteFormModal from '../components/modules/RouteFormModal';
import RouteViewModal from '../components/modules/RouteViewModal';
import { useToast } from '../context/ToastContext';
import {
  Route as RouteIcon,
  PlusCircle,
  Search,
  Filter,
  Eye,
  Edit2,
  Trash2,
  RefreshCw,
  AlertCircle,
  MapPin,
  Navigation,
  Gauge,
} from 'lucide-react';

export const RoutesPage = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const [viewingRoute, setViewingRoute] = useState(null);

  // Delete dialog
  const [deletingRoute, setDeletingRoute] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { success, error: toastError } = useToast();

  const loadRoutes = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const data = await routeService.getAllRoutes();
      setRoutes(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Unable to load transit routes. Please check whether the backend server is running.');
      toastError(err.message || 'Failed to fetch routes');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [toastError]);

  useEffect(() => {
    loadRoutes();
  }, [loadRoutes]);

  // Handle Create or Update
  const handleFormSubmit = async (formData) => {
    try {
      setFormLoading(true);
      if (editingRoute && editingRoute.routeId) {
        await routeService.updateRoute(editingRoute.routeId, formData);
        success('Route updated successfully');
      } else {
        await routeService.createRoute(formData);
        success('Route created successfully');
      }
      setIsFormOpen(false);
      setEditingRoute(null);
      loadRoutes(true);
    } catch (err) {
      toastError(err.message || 'Failed to save route');
    } finally {
      setFormLoading(false);
    }
  };

  // Handle Delete
  const handleDeleteConfirm = async () => {
    if (!deletingRoute) return;
    try {
      setDeleteLoading(true);
      await routeService.deleteRoute(deletingRoute.routeId);
      success('Route deleted successfully');
      setDeletingRoute(null);
      loadRoutes(true);
    } catch (err) {
      toastError(err.message || 'Failed to delete route');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Filtered routes
  const filteredRoutes = useMemo(() => {
    return routes.filter((r) => {
      const matchesSearch =
        r.routeName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.source?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.destination?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === 'ALL' || r.routeStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [routes, searchQuery, statusFilter]);

  if (loading) {
    return <LoadingSpinner fullPage message="Loading transit routes from database..." />;
  }

  return (
    <div className="module-page">
      {/* Page Header */}
      <div className="page-header-actions">
        <div>
          <h2 className="section-title">Transit Routes</h2>
          <p className="section-subtitle">
            Configure origin-to-destination transport corridors and distance tracking
          </p>
        </div>
        <div className="header-action-buttons">
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => loadRoutes(true)}
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
              setEditingRoute(null);
              setIsFormOpen(true);
            }}
          >
            <PlusCircle size={16} />
            <span>+ Add Route</span>
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
            onClick={() => loadRoutes()}
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
            placeholder="Search by route name, origin, or destination..."
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
            <option value="ALL">All Statuses ({routes.length})</option>
            <option value="ACTIVE">
              Active ({routes.filter((r) => r.routeStatus === 'ACTIVE').length})
            </option>
            <option value="INACTIVE">
              Inactive ({routes.filter((r) => r.routeStatus === 'INACTIVE').length})
            </option>
          </select>
        </div>
      </div>

      {/* Routes Table Card */}
      <div className="content-card full-width">
        {filteredRoutes.length === 0 ? (
          <EmptyState
            icon={RouteIcon}
            title={searchQuery || statusFilter !== 'ALL' ? 'No matching routes' : 'No routes found'}
            message={
              searchQuery || statusFilter !== 'ALL'
                ? 'Try adjusting your search query or filters.'
                : 'No routes exist in the database. Click "+ Add Route" to configure one.'
            }
            actionText={searchQuery || statusFilter !== 'ALL' ? 'Clear Filters' : '+ Add Route'}
            onAction={
              searchQuery || statusFilter !== 'ALL'
                ? () => {
                    setSearchQuery('');
                    setStatusFilter('ALL');
                  }
                : () => {
                    setEditingRoute(null);
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
                  <th>Route Name</th>
                  <th>Source</th>
                  <th>Destination</th>
                  <th>Distance</th>
                  <th>Status</th>
                  <th className="text-center" style={{ minWidth: '180px' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredRoutes.map((r) => (
                  <tr key={r.routeId}>
                    <td>
                      <span className="code-badge">#{r.routeId}</span>
                    </td>
                    <td>
                      <div className="cell-route-name">
                        <RouteIcon size={16} className="text-primary" />
                        <strong className="text-dark font-medium">{r.routeName}</strong>
                      </div>
                    </td>
                    <td>
                      <div className="cell-location">
                        <MapPin size={14} className="text-muted" />
                        <span>{r.source}</span>
                      </div>
                    </td>
                    <td>
                      <div className="cell-location">
                        <Navigation size={14} className="text-muted" />
                        <span>{r.destination}</span>
                      </div>
                    </td>
                    <td>
                      <div className="cell-weight">
                        <Gauge size={14} className="text-muted" />
                        <span className="font-semibold">{r.distance} km</span>
                      </div>
                    </td>
                    <td>
                      <StatusBadge status={r.routeStatus} />
                    </td>
                    <td className="text-center">
                      <div className="table-action-group">
                        <button
                          type="button"
                          className="action-btn action-view"
                          onClick={() => setViewingRoute(r)}
                          title="View Route Details"
                        >
                          <Eye size={15} />
                          <span>View</span>
                        </button>
                        <button
                          type="button"
                          className="action-btn action-edit"
                          onClick={() => {
                            setEditingRoute(r);
                            setIsFormOpen(true);
                          }}
                          title="Edit Route"
                        >
                          <Edit2 size={15} />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          className="action-btn action-delete"
                          onClick={() => setDeletingRoute(r)}
                          title="Delete Route"
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

      {/* Add / Edit Modal */}
      <RouteFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingRoute(null);
        }}
        onSubmit={handleFormSubmit}
        route={editingRoute}
        isLoading={formLoading}
      />

      {/* View Modal */}
      <RouteViewModal
        isOpen={Boolean(viewingRoute)}
        onClose={() => setViewingRoute(null)}
        route={viewingRoute}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deletingRoute)}
        onClose={() => setDeletingRoute(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Route"
        message={`Are you sure you want to delete route "${deletingRoute?.routeName}" (ID: #${deletingRoute?.routeId})? This action cannot be undone.`}
        confirmText="Yes, Delete Route"
        isLoading={deleteLoading}
        variant="danger"
      />
    </div>
  );
};

export default RoutesPage;
