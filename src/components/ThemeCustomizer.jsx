import React, { useMemo, useState } from 'react';

const fontPairs = [
  {
    id: 'inter',
    label: 'Modern Sans',
    heading: 'Inter, system-ui, sans-serif',
    body: 'Inter, system-ui, sans-serif',
  },
  {
    id: 'serif',
    label: 'Classic Serif',
    heading: 'Georgia, serif',
    body: 'Arial, sans-serif',
  },
  {
    id: 'clean',
    label: 'Clean Display',
    heading: '"Trebuchet MS", Arial, sans-serif',
    body: 'Arial, sans-serif',
  },
  {
    id: 'mono',
    label: 'Technical Mono',
    heading: '"Courier New", monospace',
    body: 'Arial, sans-serif',
  },
];

const normalizeHex = (value) => {
  const trimmed = value.trim();
  if (!trimmed) return '';
  return trimmed.startsWith('#') ? trimmed : `#${trimmed}`;
};

const ThemeCustomizer = ({ currentTheme, onSave, onClose }) => {
  const [color, setColor] = useState(currentTheme?.color || '#007AFF');
  const [fontPairId, setFontPairId] = useState(currentTheme?.fontPairId || 'inter');

  const activePair = useMemo(
    () => fontPairs.find((pair) => pair.id === fontPairId) || fontPairs[0],
    [fontPairId]
  );

  const handleApply = () => {
    if (onSave) {
      onSave({
        color,
        fontPairId: activePair.id,
        headingFont: activePair.heading,
        bodyFont: activePair.body,
      });
    }
    if (onClose) onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(event) => event.stopPropagation()} style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)' }}>Theme</h3>
          <button
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-secondary)',
              fontSize: '18px',
              cursor: 'pointer',
              color: 'var(--text-primary)',
            }}
          >
            x
          </button>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-tertiary)', marginBottom: '8px' }}>
            Primary color
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <input
              type="color"
              value={color}
              onChange={(event) => setColor(event.target.value)}
              style={{ width: '48px', height: '40px', border: 'none', background: 'transparent', padding: 0 }}
              aria-label="Pick a primary color"
            />
            <input
              type="text"
              value={color}
              onChange={(event) => setColor(normalizeHex(event.target.value))}
              style={{
                flex: 1,
                height: '40px',
                borderRadius: '10px',
                border: '1px solid var(--border-color)',
                padding: '0 12px',
                fontSize: '14px',
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
              }}
            />
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-tertiary)', marginBottom: '8px' }}>
            Font pairing
          </label>
          <div style={{ display: 'grid', gap: '10px' }}>
            {fontPairs.map((pair) => {
              const isActive = pair.id === fontPairId;
              return (
                <button
                  key={pair.id}
                  type="button"
                  onClick={() => setFontPairId(pair.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px',
                    borderRadius: '12px',
                    border: isActive ? '1px solid var(--primary-color)' : '1px solid var(--border-color)',
                    backgroundColor: isActive ? 'var(--bg-accent)' : 'var(--bg-secondary)',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <div>
                    <div style={{ fontFamily: pair.heading, fontWeight: '700', color: 'var(--text-primary)' }}>{pair.label}</div>
                    <div style={{ fontFamily: pair.body, fontSize: '12px', color: 'var(--text-secondary)' }}>
                      Heading and body preview
                    </div>
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: isActive ? 'var(--primary-color)' : 'var(--text-secondary)' }}>
                    {isActive ? 'Selected' : 'Select'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ borderRadius: '12px', border: '1px solid var(--border-color)', padding: '12px', marginBottom: '20px' }}>
          <div style={{ fontFamily: activePair.heading, fontWeight: '700', fontSize: '16px', color }}>
            Preview heading
          </div>
          <p style={{ margin: '8px 0 0 0', fontFamily: activePair.body, fontSize: '12px', color: 'var(--text-secondary)' }}>
            This is how your typography and brand color will look.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              flex: 1,
              height: '44px',
              borderRadius: '12px',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-secondary)',
              fontWeight: '600',
              color: 'var(--text-primary)',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            style={{
              flex: 1,
              height: '44px',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: 'var(--primary-color)',
              fontWeight: '600',
              color: 'var(--white)',
              cursor: 'pointer',
            }}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThemeCustomizer;
