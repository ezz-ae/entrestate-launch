import React from 'react';
import Image from 'next/image';

const PreviewModal: React.FC<{ template: any, onClose: () => void, onSelect: (template: any) => void }> = ({ template, onClose, onSelect }) => (
  <div className="modal-overlay" onClick={onClose}>
    <div className="modal-content" style={{ padding: 0, height: '80vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '16px', borderBottom: '1px solid var(--border-color)', textAlign: 'center', position: 'relative' }}>
        <h3 style={{ margin: 0 }}>{template?.title || 'Preview'}</h3>
        <button onClick={onClose} style={{ position: 'absolute', right: '16px', top: '12px', background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>×</button>
      </div>
      <div style={{ flex: 1, position: 'relative', backgroundColor: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
        {template?.image ? (
          <Image src={template.image} alt={template.title} layout="fill" objectFit="cover" />
        ) : (
          'Image Preview'
        )}
      </div>
      <div style={{ padding: '16px', borderTop: '1px solid var(--border-color)' }}>
        <button 
          className="primary-button" 
          onClick={() => onSelect(template)}
        >
          Select this Design
        </button>
      </div>
    </div>
  </div>
);

export default PreviewModal;