import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner = ({
  message = 'Loading...',
  size = 'md',
  fullPage = false,
}) => {
  const iconSize = size === 'sm' ? 18 : size === 'lg' ? 36 : 24;

  const content = (
    <div className={`spinner-container spinner-${size}`}>
      <Loader2 className="spinner-icon" size={iconSize} />
      {message && <span className="spinner-text">{message}</span>}
    </div>
  );

  if (fullPage) {
    return <div className="spinner-fullpage">{content}</div>;
  }

  return content;
};

export default LoadingSpinner;
