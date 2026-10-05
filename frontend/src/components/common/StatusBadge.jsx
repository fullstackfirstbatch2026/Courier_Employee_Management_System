import React from 'react';

export const StatusBadge = ({ status }) => {
  if (!status) return null;

  const normalized = String(status).toUpperCase();

  let label = normalized.replace('_', ' ');
  let variant = 'default';

  switch (normalized) {
    case 'ACTIVE':
    case 'DELIVERED':
      variant = 'success';
      break;
    case 'ASSIGNED':
      variant = 'info';
      break;
    case 'IN_TRANSIT':
      variant = 'warning';
      break;
    case 'PENDING':
      variant = 'pending';
      break;
    case 'CANCELLED':
    case 'INACTIVE':
      variant = 'danger';
      break;
    default:
      variant = 'default';
  }

  return (
    <span className={`badge badge-${variant}`}>
      <span className="badge-dot" />
      {label}
    </span>
  );
};

export default StatusBadge;
