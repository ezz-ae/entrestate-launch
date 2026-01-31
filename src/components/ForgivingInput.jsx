import React, { useState, useEffect } from 'react';

const ForgivingInput = ({ label, helperText, error, className, children, ...props }) => {
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (error) {
      setShake(true);
      const timer = setTimeout(() => setShake(false), 500); // Shake duration
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div style={{ marginBottom: '24px' }}>
      <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: 'var(--text-tertiary)', marginBottom: '8px' }}>
        {label}
      </label>
      <input
        {...props}
        className={`${className || ''} ${shake ? 'shake-animation' : ''}`} // Apply shake to the input itself
        // If children are provided, this input is not rendered, and the children handle their own styling
        // The wrapper div below will get the border and shake for the custom input structure
        // This is a simplified approach for the diff; a more robust ForgivingInput might use a render prop
        // or a dedicated internal input component.
        style={{
          width: '100%',
          padding: '16px',
          fontSize: '16px',
          borderRadius: '12px',
          border: error ? '1px solid var(--danger)' : '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-secondary)',
          color: 'var(--text-primary)',
          outline: 'none',
          transition: 'border-color 0.2s ease-in-out'
        }}
      />
      {children && ( // If children are provided, render them inside a styled div
        <div className={`${className || ''} ${shake ? 'shake-animation' : ''}`} style={{ border: error ? '1px solid var(--danger)' : '1px solid var(--border-color)', borderRadius: '12px' }}>
          {children}
        </div>
      )}
      {helperText && !error && (
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '8px', fontWeight: '500' }}>
          {helperText}
        </p>
      )}
      {error && (
        <p style={{ color: 'var(--danger)', fontSize: '12px', marginTop: '8px', fontWeight: '500' }}>
          {error}
        </p>
      )}
    </div>
  );
};

export default ForgivingInput;