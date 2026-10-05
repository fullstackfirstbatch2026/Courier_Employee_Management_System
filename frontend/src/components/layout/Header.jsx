import React from 'react';
import { Menu, Shield, User, Activity } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const pageTitles = {
  '/': { title: 'System Dashboard', subtitle: 'Real-time overview of courier operations' },
  '/employees': { title: 'Employee Management', subtitle: 'Manage courier staff and track delivery performance' },
  '/parcels': { title: 'Parcel Inventory', subtitle: 'Monitor tracking, weights, and dispatch statuses' },
  '/routes': { title: 'Transit Routes', subtitle: 'Configure transit corridors and distance metrics' },
  '/deliveries': { title: 'Delivery Operations', subtitle: 'Assign consignments and track real-time delivery status' },
  '/reports': { title: 'Operational Analytics', subtitle: 'Key performance indicators and delivery metrics' },
};

export const Header = ({ onOpenSidebar }) => {
  const location = useLocation();
  const currentInfo = pageTitles[location.pathname] || {
    title: 'Courier Employee Management',
    subtitle: 'System Administration',
  };

  return (
    <header className="app-header">
      <div className="header-left">
        <button
          type="button"
          className="header-menu-btn"
          onClick={onOpenSidebar}
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
        <div className="header-title-box">
          <div className="header-system-tag">
            <span className="system-dot" />
            <span className="system-name">Courier Employee Management</span>
          </div>
          <h1 className="header-main-title">{currentInfo.title}</h1>
        </div>
      </div>

      <div className="header-right">
        <div className="api-status-pill">
          <Activity size={14} className="api-status-icon" />
          <span className="api-status-text">API Online</span>
        </div>

        <div className="user-profile-badge">
          <div className="user-avatar">
            <User size={18} />
          </div>
          <div className="user-details">
            <span className="user-name">System Admin</span>
            <span className="user-role">
              <Shield size={11} className="role-shield" />
              Administrator
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
