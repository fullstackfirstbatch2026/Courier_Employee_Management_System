import React from 'react';

export const StatCard = ({
  title,
  value,
  icon: Icon,
  color = 'blue',
  subtitle,
  badge,
}) => {
  return (
    <div className={`stat-card stat-card-${color}`}>
      <div className="stat-card-header">
        <div>
          <span className="stat-card-title">{title}</span>
          <div className="stat-card-value">{value !== undefined && value !== null ? value : '-'}</div>
        </div>
        {Icon && (
          <div className={`stat-card-icon-wrap icon-bg-${color}`}>
            <Icon size={24} />
          </div>
        )}
      </div>
      {(subtitle || badge) && (
        <div className="stat-card-footer">
          {badge && <span className="stat-card-badge">{badge}</span>}
          {subtitle && <span className="stat-card-subtitle">{subtitle}</span>}
        </div>
      )}
    </div>
  );
};

export default StatCard;
