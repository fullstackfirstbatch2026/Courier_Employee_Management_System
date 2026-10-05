import React, { useState, useEffect, useCallback, useMemo } from 'react';
import employeeService from '../services/employeeService';
import StatusBadge from '../components/common/StatusBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import ConfirmDialog from '../components/common/ConfirmDialog';
import EmployeeFormModal from '../components/modules/EmployeeFormModal';
import EmployeeViewModal from '../components/modules/EmployeeViewModal';
import EmployeeDeliveryCountModal from '../components/modules/EmployeeDeliveryCountModal';
import AboveAverageModal from '../components/modules/AboveAverageModal';
import { useToast } from '../context/ToastContext';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Eye,
  Edit2,
  Trash2,
  Award,
  TrendingUp,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';

export const EmployeesPage = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const [viewingEmployee, setViewingEmployee] = useState(null);
  const [countEmployee, setCountEmployee] = useState(null);
  const [isAboveAvgOpen, setIsAboveAvgOpen] = useState(false);

  // Delete confirm state
  const [deletingEmployee, setDeletingEmployee] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { success, error: toastError } = useToast();

  const loadEmployees = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const data = await employeeService.getAllEmployees();
      setEmployees(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Unable to load employees. Please check whether the backend server is running.');
      toastError(err.message || 'Failed to fetch employees');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [toastError]);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  // Handle Create or Update
  const handleFormSubmit = async (formData) => {
    try {
      setFormLoading(true);
      if (editingEmployee && editingEmployee.employeeId) {
        await employeeService.updateEmployee(editingEmployee.employeeId, formData);
        success('Employee updated successfully');
      } else {
        await employeeService.createEmployee(formData);
        success('Employee created successfully');
      }
      setIsFormOpen(false);
      setEditingEmployee(null);
      loadEmployees(true);
    } catch (err) {
      toastError(err.message || 'Failed to save employee details');
    } finally {
      setFormLoading(false);
    }
  };

  // Handle Delete
  const handleDeleteConfirm = async () => {
    if (!deletingEmployee) return;
    try {
      setDeleteLoading(true);
      await employeeService.deleteEmployee(deletingEmployee.employeeId);
      success('Employee deleted successfully');
      setDeletingEmployee(null);
      loadEmployees(true);
    } catch (err) {
      toastError(err.message || 'Failed to delete employee');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Filtered employees
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchesSearch =
        emp.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.address?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === 'ALL' || emp.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [employees, searchQuery, statusFilter]);

  if (loading) {
    return <LoadingSpinner fullPage message="Loading employees from database..." />;
  }

  return (
    <div className="module-page">
      {/* Page Header */}
      <div className="page-header-actions">
        <div>
          <h2 className="section-title">Courier Employees</h2>
          <p className="section-subtitle">
            Manage delivery staff profiles, contact data, and performance metrics
          </p>
        </div>
        <div className="header-action-buttons">
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => loadEmployees(true)}
            disabled={refreshing}
            title="Refresh list"
          >
            <RefreshCw size={16} className={refreshing ? 'spin-icon' : ''} />
            <span>{refreshing ? 'Syncing...' : 'Refresh'}</span>
          </button>
          <button
            type="button"
            className="btn btn-accent"
            onClick={() => setIsAboveAvgOpen(true)}
          >
            <TrendingUp size={16} />
            <span>View Above-Average Employees</span>
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              setEditingEmployee(null);
              setIsFormOpen(true);
            }}
          >
            <UserPlus size={16} />
            <span>+ Add Employee</span>
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
            onClick={() => loadEmployees()}
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
            placeholder="Search employees by name, email, phone, or location..."
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
            <option value="ALL">All Statuses ({employees.length})</option>
            <option value="ACTIVE">
              Active ({employees.filter((e) => e.status === 'ACTIVE').length})
            </option>
            <option value="INACTIVE">
              Inactive ({employees.filter((e) => e.status === 'INACTIVE').length})
            </option>
          </select>
        </div>
      </div>

      {/* Employees Table Card */}
      <div className="content-card full-width">
        {filteredEmployees.length === 0 ? (
          <EmptyState
            icon={Users}
            title={searchQuery || statusFilter !== 'ALL' ? 'No matching employees' : 'No employees found'}
            message={
              searchQuery || statusFilter !== 'ALL'
                ? 'Try adjusting your search query or filters.'
                : 'No employee records are available in the database. Click "+ Add Employee" to create one.'
            }
            actionText={searchQuery || statusFilter !== 'ALL' ? 'Clear Filters' : '+ Add Employee'}
            onAction={
              searchQuery || statusFilter !== 'ALL'
                ? () => {
                    setSearchQuery('');
                    setStatusFilter('ALL');
                  }
                : () => {
                    setEditingEmployee(null);
                    setIsFormOpen(true);
                  }
            }
          />
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '80px' }}>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Hire Date</th>
                  <th>Status</th>
                  <th className="text-center" style={{ minWidth: '240px' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((emp) => (
                  <tr key={emp.employeeId}>
                    <td>
                      <span className="code-badge">#{emp.employeeId}</span>
                    </td>
                    <td>
                      <strong className="font-semibold text-dark">{emp.name}</strong>
                    </td>
                    <td>
                      <span className="cell-email">{emp.email}</span>
                    </td>
                    <td>
                      <span className="text-muted">{emp.phone || '-'}</span>
                    </td>
                    <td>
                      <span className="text-muted">{emp.address || '-'}</span>
                    </td>
                    <td>
                      <span className="text-muted">{emp.hireDate || '-'}</span>
                    </td>
                    <td>
                      <StatusBadge status={emp.status} />
                    </td>
                    <td className="text-center">
                      <div className="table-action-group">
                        <button
                          type="button"
                          className="action-btn action-view"
                          onClick={() => setViewingEmployee(emp)}
                          title="View Employee Profile"
                        >
                          <Eye size={15} />
                          <span>View</span>
                        </button>
                        <button
                          type="button"
                          className="action-btn action-count"
                          onClick={() => setCountEmployee(emp)}
                          title="Check Total Deliveries"
                        >
                          <Award size={15} />
                          <span>Count</span>
                        </button>
                        <button
                          type="button"
                          className="action-btn action-edit"
                          onClick={() => {
                            setEditingEmployee(emp);
                            setIsFormOpen(true);
                          }}
                          title="Edit Employee"
                        >
                          <Edit2 size={15} />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          className="action-btn action-delete"
                          onClick={() => setDeletingEmployee(emp)}
                          title="Delete Employee"
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
      <EmployeeFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingEmployee(null);
        }}
        onSubmit={handleFormSubmit}
        employee={editingEmployee}
        isLoading={formLoading}
      />

      {/* View Profile Modal */}
      <EmployeeViewModal
        isOpen={Boolean(viewingEmployee)}
        onClose={() => setViewingEmployee(null)}
        employee={viewingEmployee}
        onCheckDeliveryCount={(emp) => setCountEmployee(emp)}
      />

      {/* Employee Delivery Count Modal */}
      <EmployeeDeliveryCountModal
        isOpen={Boolean(countEmployee)}
        onClose={() => setCountEmployee(null)}
        employee={countEmployee}
      />

      {/* Above Average Subquery Modal */}
      <AboveAverageModal
        isOpen={isAboveAvgOpen}
        onClose={() => setIsAboveAvgOpen(false)}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deletingEmployee)}
        onClose={() => setDeletingEmployee(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Employee"
        message={`Are you sure you want to delete employee "${deletingEmployee?.name}" (ID: #${deletingEmployee?.employeeId})? This action cannot be undone.`}
        confirmText="Yes, Delete Employee"
        isLoading={deleteLoading}
        variant="danger"
      />
    </div>
  );
};

export default EmployeesPage;
