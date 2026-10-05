import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Package,
  Route as RouteIcon,
  Truck,
  BarChart3,
  X,
  ShieldCheck,
} from 'lucide-react';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/employees', label: 'Employees', icon: Users },
  { to: '/parcels', label: 'Parcels', icon: Package },
  { to: '/routes', label: 'Routes', icon: RouteIcon },
  { to: '/deliveries', label: 'Deliveries', icon: Truck },
  { to: '/reports', label: 'Reports', icon: BarChart3 },
];

export const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="sidebar-backdrop"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside className={`app-sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-brand">
          <div className="brand-logo-wrap">
            <Truck size={24} className="brand-icon" />
          </div>
          <div className="brand-text-wrap">
            <span className="brand-title">Courier Flow</span>
            <span className="brand-subtitle">Management System</span>
          </div>
          <button
            type="button"
            className="sidebar-close-btn"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <div className="sidebar-divider" />

        <div className="sidebar-section-label">MAIN NAVIGATION</div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `nav-item ${isActive ? 'nav-item-active' : ''}`
                }
                onClick={onClose}
              >
                <Icon size={19} className="nav-item-icon" />
                <span className="nav-item-text">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-meta">
            <div className="meta-badge">
              <ShieldCheck size={14} className="meta-badge-icon" />
              <span>Academic Edition</span>
            </div>
            <p className="meta-text">Spring Boot 3.4 + React</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
