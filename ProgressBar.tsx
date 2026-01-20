import React from 'react';
import './mobile-styles.css';

interface ProgressBarProps {
  progress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  return (
    <div className="progress-container">
      <div className="progress-fill" style={{ width: `${progress}%` }}></div>
    </div>
  );
};

export default ProgressBar;