import React, { useState, useEffect, useRef } from 'react';
import StickyFooter from './StickyFooter';
import ThemeCustomizer from '@/components/ThemeCustomizer';
import './mobile-styles.css';

const TEMPLATE_DATA = {
  'template-roadshow': [
    { id: 1, type: 'hero', variant: 'Image BG', content: 'Roadshow: Luxury Living' },
    { id: 2, type: 'offer', variant: 'Payment Plan', content: '10% Downpayment • 5 Years Post-Handover' },
    { id: 3, type: 'contact', variant: 'WhatsApp', content: 'Register for the Roadshow' }
  ],
  'template-map-focused': [
    { id: 1, type: 'hero', variant: 'Minimal', content: 'Prime Location in Downtown' },
    { id: 2, type: 'tools', variant: 'ROI Calculator', content: 'Calculate your potential returns' },
    { id: 3, type: 'contact', variant: 'Form', content: 'Get Location Details' }
  ],
  'template-ads-launch': [
    { id: 1, type: 'hero', variant: 'Minimal', content: 'Exclusive Pre-Launch Offer' },
    { id: 2, type: 'offer', variant: 'Features', content: 'High ROI • Prime Location' },
    { id: 3, type: 'contact', variant: 'Form', content: 'Get the Brochure' }
  ],
  'full-company': [
    { id: 1, type: 'hero', variant: 'Video BG', content: 'Your Trusted Real Estate Partner' },
    { id: 2, type: 'proof', variant: 'Stats', content: '10+ Years Experience • 1000+ Deals' },
    { id: 3, type: 'contact', variant: 'Booking', content: 'Consult with our Experts' }
  ],
  'developer-focus': [
    { id: 1, type: 'hero', variant: 'Image BG', content: 'New Project by Top Developer' },
    { id: 2, type: 'offer', variant: 'Packages', content: 'Studio, 1BR, 2BR Available' },
    { id: 3, type: 'contact', variant: 'WhatsApp', content: 'Chat with Sales' }
  ]
};

const BuilderScreen = ({ onBack, onPublish, templateId }) => {
  const [sections, setSections] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [previewDevice, setPreviewDevice] = useState('desktop');
  const [draggedIndex, setDraggedIndex] = useState(null);
  const sectionsRef = useRef(sections);

  const [theme, setTheme] = useState({
    color: '#007AFF',
    fontPairId: 'inter',
    headingFont: 'Inter, sans-serif',
    bodyFont: 'Inter, sans-serif'
  });
  const [showThemeCustomizer, setShowThemeCustomizer] = useState(false);

  // Keep ref in sync for auto-save
  useEffect(() => {
    sectionsRef.current = sections;
  }, [sections]);

  const handleStartOver = () => {
    if (window.confirm("Are you sure you want to start over? This will clear all sections.")) {
      setSections([]);
      setIsSidebarOpen(true);
    }
  };

  const handleSaveDraft = () => {
    localStorage.setItem('builder-draft', JSON.stringify(sections));
    alert("Draft saved to local storage!");
  };

  const handleSharePreview = () => {
    // Simulate generating a public link
    const mockId = Math.random().toString(36).substring(7);
    const shareUrl = `${window.location.origin}/preview/${mockId}`;
    
    navigator.clipboard.writeText(shareUrl);
    alert(`Temporary public link generated: ${shareUrl}\n\nLink copied to clipboard!`);
  };

  // Auto-save feature: triggers every 30 seconds
  useEffect(() => {
    const autoSaveTimer = setInterval(() => {
      if (sectionsRef.current.length > 0) {
        localStorage.setItem('builder-draft', JSON.stringify(sectionsRef.current));
        console.log('Auto-saved draft at', new Date().toLocaleTimeString());
      }
    }, 30000);

    return () => clearInterval(autoSaveTimer);
  }, []);

  useEffect(() => {
    // Check for template in URL if not provided via props
    const params = new URLSearchParams(window.location.search);
    const activeTemplateId = templateId || params.get('template');

    const defaultSections = [
      { id: 1, type: 'hero', variant: 'Image BG', content: 'Luxury Living in Downtown' },
      { id: 2, type: 'offer', variant: 'Features', content: '3 Bedrooms • 2,500 Sqft • Maid\'s Room' },
      { id: 3, type: 'contact', variant: 'WhatsApp', content: 'Book a Viewing Today' }
    ];
    
    if (activeTemplateId && TEMPLATE_DATA[activeTemplateId]) {
      setSections(TEMPLATE_DATA[activeTemplateId]);
      setIsSidebarOpen(true); // Automatically open the builder menu when a template is loaded
    } else {
      const savedDraft = localStorage.getItem('builder-draft');
      if (savedDraft) {
        setSections(JSON.parse(savedDraft));
      } else {
        setSections(defaultSections);
      }
    }
  }, [templateId]);

  const sectionTypes = {
    hero: { label: "Top Section", variants: ["Image BG", "Video BG", "Minimal"] },
    proof: { label: "Social Proof", variants: ["Reviews", "Stats", "Logos"] },
    offer: { label: "The Offer", variants: ["Payment Plan", "Packages", "Features"] },
    tools: { label: "Calculators", variants: ["ROI Calculator", "Valuation Request"] },
    contact: { label: "Contact Forms", variants: ["WhatsApp", "Form", "Booking"] },
    compliance: { label: "Legal/Footer", variants: ["Standard"] }
  };

  const addSectionFromLibrary = (type, variant) => {
    const newId = sections.length > 0 ? Math.max(...sections.map(s => s.id)) + 1 : 1;
    const newSection = { 
      id: newId, 
      type, 
      variant, 
      content: `New ${sectionTypes[type].label} - ${variant}` 
    };
    setSections([...sections, newSection]);
    if (window.innerWidth < 768) setIsSidebarOpen(false); // Close drawer on mobile after adding
  };

  const aiActions = [
    "Rewrite for luxury", "Shorten text", "Add social proof", "Make bilingual", "Add WhatsApp CTA"
  ];

  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDrop = (index) => {
    const updatedSections = [...sections];
    const [movedItem] = updatedSections.splice(draggedIndex, 1);
    updatedSections.splice(index, 0, movedItem);
    setSections(updatedSections);
    setDraggedIndex(null);
  };

  const handleAddSection = () => {
    setIsSidebarOpen(true);
  };

  const handleAIAction = (action) => {
    alert(`AI is working: ${action}...`);
    // Simulate AI update
    setTimeout(() => {
      setSections(sections.map(s => ({ ...s, content: s.content + ' (Optimized)' })));
    }, 1000);
  };

  return (
    <div className="screen-container" style={{ 
      padding: isPreviewMode ? '0' : '24px', 
      paddingBottom: isPreviewMode ? '0' : '120px', 
      height: '100vh', 
      overflowY: 'auto', 
      WebkitOverflowScrolling: 'touch',
      position: 'relative'
    }}>
      {showThemeCustomizer && (
        <ThemeCustomizer 
          currentTheme={theme}
          onSave={setTheme}
          onClose={() => setShowThemeCustomizer(false)}
        />
      )}

      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        marginBottom: isPreviewMode ? '0' : '16px',
        padding: isPreviewMode ? '16px 24px' : '0',
        borderBottom: isPreviewMode ? '1px solid var(--border-color)' : 'none',
        backgroundColor: isPreviewMode ? 'var(--bg-primary)' : 'transparent'
      }}>
        {!isPreviewMode ? (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button onClick={onBack} style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: 0, color: 'var(--text-tertiary)' }}>
              <span style={{ fontSize: '24px' }}>←</span>
              <span style={{ fontSize: '14px', fontWeight: '600' }}>Templates</span>
            </button>
            <h1 className="screen-title" style={{ marginBottom: 0, marginLeft: '16px' }}>Site Builder</h1>
          </div>
        ) : (
          <div style={{ fontWeight: '700', fontSize: '14px', color: 'var(--text-primary)' }}>Live Preview</div>
        )}
        <div style={{ display: 'flex', gap: '8px' }}>
          {!isPreviewMode && (
            <>
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '8px 12px', borderRadius: '8px', fontWeight: '600', fontSize: '12px', color: 'var(--text-primary)', cursor: 'pointer' }}
              >
                {isSidebarOpen ? '✕ Close Menu' : '☰ Menu'}
              </button>
              <button 
                onClick={() => setShowThemeCustomizer(true)}
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '8px 12px', borderRadius: '8px', fontWeight: '600', fontSize: '12px', color: 'var(--text-primary)', cursor: 'pointer' }}
              >
                🎨 Theme
              </button>
              <button 
                onClick={handleSaveDraft}
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '8px 12px', borderRadius: '8px', fontWeight: '600', fontSize: '12px', color: 'var(--text-primary)', cursor: 'pointer' }}
              >
                💾 Save Draft
              </button>
              <button 
                onClick={handleSharePreview}
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '8px 12px', borderRadius: '8px', fontWeight: '600', fontSize: '12px', color: 'var(--text-primary)', cursor: 'pointer' }}
              >
                🔗 Share Preview
              </button>
              <button 
                onClick={handleStartOver}
                style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '8px 12px', borderRadius: '8px', fontWeight: '600', fontSize: '12px', color: 'var(--danger)', cursor: 'pointer' }}
              >
                🗑️ Start Over
              </button>
            </>
          )}
          <button 
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            style={{ background: isPreviewMode ? 'var(--primary-color)' : 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '8px 12px', borderRadius: '8px', fontWeight: '600', fontSize: '12px', color: isPreviewMode ? 'white' : 'var(--text-primary)', cursor: 'pointer' }}
          >
            {isPreviewMode ? '🛠️ Edit Mode' : '👁️ Preview'}
          </button>
        </div>
      </div>

      {/* AI Actions */}
      {!isPreviewMode && (
        <div className="ai-action-bar" style={{ display: 'flex', overflowX: 'auto', gap: '8px', paddingBottom: '12px', marginBottom: '16px', whiteSpace: 'nowrap', WebkitOverflowScrolling: 'touch' }}>
          {aiActions.map((action, i) => (
            <button key={i} className="ai-action-chip" onClick={() => handleAIAction(action)}>
              ✨ {action}
            </button>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
        {/* Sidebar / Builder Menu */}
        {isSidebarOpen && !isPreviewMode && (
          <div className="builder-sidebar open">
            <div className="sidebar-header">
              <h3 style={{ fontSize: '16px', fontWeight: '700', margin: 0 }}>Add Sections</h3>
              <button className="mobile-close" onClick={() => setIsSidebarOpen(false)}>✕</button>
            </div>
            <div className="sidebar-scroll-area" style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 260px)', paddingRight: '4px' }}>
              {Object.entries(sectionTypes).map(([key, type]) => (
                <div key={key} style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-tertiary)', marginBottom: '8px' }}>{type.label}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {type.variants.map(v => (
                      <button 
                        key={v} 
                        onClick={() => addSectionFromLibrary(key, v)}
                        style={{ fontSize: '11px', padding: '6px 10px', borderRadius: '6px', border: '1px solid #eee', background: '#f9fafb', cursor: 'pointer' }}
                      >
                        + {v}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <button 
              onClick={onBack}
              style={{ width: '100%', marginTop: '16px', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)', fontWeight: '700', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <span>🔄</span> Change Template
            </button>
          </div>
        )}

        {/* Overlay for mobile drawer */}
        {isSidebarOpen && !isPreviewMode && <div className="drawer-overlay" onClick={() => setIsSidebarOpen(false)} />}

        {/* Canvas */}
        <div 
          className={`builder-canvas ${isPreviewMode && previewDevice === 'mobile' ? 'mobile-preview-frame' : ''}`} 
          style={{ 
            flex: 1,
            transition: 'all 0.3s ease'
          }}
        >
          {sections.map((section, index) => (
            <div 
              key={section.id} 
              className={`builder-section ${draggedIndex === index ? 'dragging' : ''} ${isPreviewMode ? 'preview' : ''}`}
              draggable={!isPreviewMode}
              onDragStart={() => !isPreviewMode && handleDragStart(index)}
              onDragOver={(e) => !isPreviewMode && e.preventDefault()}
              onDrop={() => !isPreviewMode && handleDrop(index)}
            >
              {!isPreviewMode && <div className="drag-handle">⠿</div>}
              {!isPreviewMode && (
                <span className="section-label" style={{ fontFamily: theme.bodyFont }}>
                  {sectionTypes[section.type]?.label || section.type} - {section.variant}
                </span>
              )}
              <div style={{ 
                fontSize: isPreviewMode ? '24px' : '16px', 
                fontWeight: isPreviewMode ? '700' : '600', 
                color: 'var(--text-primary)', 
                fontFamily: theme.headingFont,
                textAlign: isPreviewMode ? 'center' : 'left'
              }}>
                {section.content}
              </div>
              {!isPreviewMode && (
                <div style={{ position: 'absolute', top: '8px', right: '8px', display: 'flex', gap: '4px' }}>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}>✏️</button>
                  <button 
                    onClick={() => setSections(sections.filter(s => s.id !== section.id))}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}
                  >
                    🗑️
                  </button>
                </div>
              )}
            </div>
          ))}
          
          {!isPreviewMode && (
            <button className="add-section-btn" onClick={handleAddSection}>
              + Add Section
            </button>
          )}
        </div>
      </div>

      {!isPreviewMode && <StickyFooter label="Publish Website" onClick={onPublish} />}
    </div>
  );
};

export default BuilderScreen;
