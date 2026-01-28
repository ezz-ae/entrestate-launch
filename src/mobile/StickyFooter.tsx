import React from 'react';
import './mobile-styles.css';

interface StickyFooterProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

const StickyFooter: React.FC<StickyFooterProps> = ({ label, onClick, disabled }) => {
  return (
    <div className="sticky-footer-action">
      <button className="primary-button" onClick={onClick} disabled={disabled}>
        {label}
      </button>
    </div>
  );
};

export default StickyFooter;