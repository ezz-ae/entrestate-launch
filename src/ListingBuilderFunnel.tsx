import React, { useState } from 'react';
import StickyFooter from './StickyFooter';
import ProgressBar from '@/components/ProgressBar';
import './mobile-styles.css';
import { Database, FileText, LayoutTemplate, Square } from 'lucide-react';
import ForgivingInput from './ForgivingInput';

interface ListingBuilderFunnelProps {
  onComplete: (data: any) => void;
  onBack: () => void;
}

const ListingBuilderFunnel: React.FC<ListingBuilderFunnelProps> = ({ onComplete, onBack }) => {
  const [step, setStep] = useState(1);
  const [startMethod, setStartMethod] = useState('');
  const [pageTitle, setPageTitle] = useState('');
  const [propertyDescription, setPropertyDescription] = useState('');
  const [sections, setSections] = useState<string[]>(['Photo Gallery', 'Key Features']);
  const [brandColor, setBrandColor] = useState('#007AFF');
  
  const allSections = ['Photo Gallery', 'Key Features', 'Video Tour', 'Floor Plans', 'Location Map', 'Contact Form'];

  const toggleSection = (section: string) => {
    setSections(prev => 
      prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
    );
  };

  const totalSteps = 5; // 1. Start, 2. Details, 3. Content, 4. Style, 5. Publish

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // onComplete({});
      alert("Funnel Complete! (onComplete not yet implemented)");
    }
  };

  const handleStepBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      onBack();
    }
  };
  
  const getStepTitle = () => {
    switch (step) {
      case 1: return 'How do you want to start?';
      case 2: return 'Property Details';
      case 3: return 'Page Content';
      case 4: return 'Style & Branding';
      case 5: return 'Review & Publish';
      default: return '';
    }
  };

  const isNextDisabled = () => {
    switch (step) {
      case 1: return !startMethod;
      case 2: return !pageTitle || !propertyDescription;
      case 3: return sections.length === 0;
      case 4: return !brandColor;
      default: return false;
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <p className="step-guidance">Every great listing page needs a starting point. Choose one of the options below to prepare your page.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <StartOption 
                icon={<Database size={24} />}
                title="From Your Inventory"
                description="Use an existing project's details and media."
                isSelected={startMethod === 'inventory'}
                onClick={() => setStartMethod('inventory')}
              />
              <StartOption 
                icon={<FileText size={24} />}
                title="From a Brochure"
                description="Upload a PDF and we'll extract the relevant details."
                isSelected={startMethod === 'pdf'}
                onClick={() => setStartMethod('pdf')}
              />
              <StartOption 
                icon={<LayoutTemplate size={24} />}
                title="From a Layout"
                description="Select one of our pre-designed, high-performing layouts."
                isSelected={startMethod === 'template'}
                onClick={() => setStartMethod('template')}
              />
              <StartOption 
                icon={<Square size={24} />}
                title="From a Blank Page"
                description="For a fully custom design, start from scratch."
                isSelected={startMethod === 'blank'}
                onClick={() => setStartMethod('blank')}
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <p className="step-guidance">Provide the essential details for your property. This information will be featured prominently on the page.</p>
            <ForgivingInput 
              label="Page Title"
              placeholder="e.g. Emaar Beachfront - Exclusive 2BR"
              value={pageTitle}
              onChange={(e) => setPageTitle(e.target.value)}
            />
            <div style={{height: '16px'}} />
            <ForgivingInput 
              label="Property Description"
              placeholder="e.g. A stunning seaside apartment with breathtaking views..."
              value={propertyDescription}
              onChange={(e) => setPropertyDescription(e.target.value)}
            />
          </div>
        );
      case 3:
        return (
          <div>
            <p className="step-guidance">Select the sections you want to include on your page. You can reorder them later.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {allSections.map(section => (
                <CheckboxOption
                  key={section}
                  label={section}
                  isChecked={sections.includes(section)}
                  onToggle={() => toggleSection(section)}
                />
              ))}
            </div>
          </div>
        );
      case 4:
          return (
            <div>
              <p className="step-guidance">Customize the page's appearance to match your brand. Choose a primary color and upload your logo.</p>
              <div className="control-group">
                <label className="control-label">Brand Color</label>
                <div className="color-picker-row">
                  {['#007AFF', '#10B981', '#F59E0B', '#EF4444', '#6366F1', '#111827'].map(color => (
                    <div 
                      key={color}
                      className={`color-swatch ${brandColor === color ? 'selected' : ''}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setBrandColor(color)}
                    />
                  ))}
                </div>
              </div>
              <div className="control-group" style={{marginTop: '24px'}}>
                <label className="control-label">Your Logo</label>
                <div className="upload-zone" style={{padding: '24px'}}>
                  <span>Click to upload logo</span>
                </div>
              </div>
            </div>
          );
      case 5:
        return (
          <div className="review-panel">
            <p className="step-guidance">Review your new listing page details below. If everything looks good, you're ready to publish.</p>
            <div className="review-item"><span>Page Title</span><strong>{pageTitle}</strong></div>
            <div className="review-item"><span>Start Method</span><strong>{startMethod}</strong></div>
            <div className="review-item"><span>Page Sections</span><strong>{sections.join(', ')}</strong></div>
            <div className="review-item"><span>Brand Color</span>
              <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                <span>{brandColor}</span>
                <div style={{width: '16px', height: '16px', borderRadius: '4px', backgroundColor: brandColor}} />
              </div>
            </div>
          </div>
        );
      default:
        return <p className="step-guidance">Step {step} is under construction.</p>;
    }
  };

  return (
    <div className="screen-container" style={{ padding: '24px', paddingBottom: '100px' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
        <button onClick={handleStepBack} style={{ background: 'none', border: 'none', fontSize: '24px', marginRight: '16px', cursor: 'pointer', padding: 0, color: 'var(--text-tertiary)' }}>←</button>
        <h1 className="screen-title" style={{ marginBottom: 0, fontSize: '22px' }}>{getStepTitle()}</h1>
      </div>

      <ProgressBar progress={(step / totalSteps) * 100} />
      
      <div style={{ marginTop: '24px' }}>
        {renderStepContent()}
      </div>

      <StickyFooter 
        label={step === totalSteps ? 'Publish Page' : 'Next Step'}
        onClick={handleNext}
        disabled={isNextDisabled()}
      />
    </div>
  );
};


interface StartOptionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  isSelected: boolean;
  onClick: () => void;
}

const StartOption: React.FC<StartOptionProps> = ({ icon, title, description, isSelected, onClick }) => (
  <div 
    onClick={onClick}
    className={`recipient-option ${isSelected ? 'selected' : ''}`} // Re-using class from CampaignBuilder
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <div style={{ color: 'var(--primary-color)' }}>{icon}</div>
      <div>
        <div style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '16px' }}>{title}</div>
        <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{description}</div>
      </div>
    </div>
    {isSelected && <span style={{ color: 'var(--primary-color)', fontWeight: '700' }}>✓</span>}
  </div>
);

interface CheckboxOptionProps {
  label: string;
  isChecked: boolean;
  onToggle: () => void;
}

const CheckboxOption: React.FC<CheckboxOptionProps> = ({ label, isChecked, onToggle }) => (
  <div onClick={onToggle} className={`recipient-option ${isChecked ? 'selected' : ''}`}>
    <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{label}</div>
    {isChecked && <span style={{ color: 'var(--primary-color)', fontWeight: '700' }}>✓</span>}
  </div>
);


export default ListingBuilderFunnel;
