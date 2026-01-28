import React, { useState } from 'react';
import StickyFooter from './StickyFooter';
import ForgivingInput from './ForgivingInput';
import ProgressBar from './ProgressBar';
import './mobile-styles.css';

interface ChatAgentSetupProps {
  onComplete: () => void;
  onBack: () => void;
  onNavigateTo: (screen: string) => void; // New prop for navigation
}

const ChatAgentSetup: React.FC<ChatAgentSetupProps> = ({
  onComplete,
  onBack,
  onNavigateTo,
}) => {
  const [step, setStep] = useState(1);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedProject, setSelectedProject] = useState('');
  const [agentName, setAgentName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [communicationStyle, setCommunicationStyle] = useState('professional');
  const [conversionGoal, setConversionGoal] = useState('booking');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalSteps = 5; // 1. Connect, 2. Inventory, 3. Profile, 4. Objective, 5. Review

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleActivate();
    }
  };

  const handleStepBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      onBack();
    }
  };
  
  const handleConnect = () => {
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnected(true);
      setIsConnecting(false);
    }, 1500);
  };

  const handleActivate = async () => {
    if (!isConnected || !selectedProject || !agentName || !companyName || !communicationStyle || loading) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/agents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: agentName,
          companyName,
          knowledgeSource: selectedProject,
          conversionGoal,
          communicationStyle,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to activate consultant.');
      }

      onComplete();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const getStepTitle = () => {
    switch (step) {
      case 1: return 'Connect Instagram';
      case 2: return 'Select Inventory';
      case 3: return 'Consultant Profile';
      case 4: return 'Primary Objective';
      case 5: return 'Review and Activate';
      default: return '';
    }
  };

  const isNextDisabled = () => {
    switch (step) {
      case 1: return !isConnected;
      case 2: return !selectedProject;
      case 3: return !agentName || !companyName || !communicationStyle;
      case 4: return !conversionGoal;
      default: return false;
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <p className="step-guidance">First, connect the Instagram account you want your consultant to manage. This allows it to reply to your DMs.</p>
            <button 
              onClick={handleConnect}
              disabled={isConnecting || isConnected}
              className="instagram-connect-button"
              style={{
                backgroundColor: isConnecting ? '#ccc' : (isConnected ? '#ECFDF5' : '#E1306C'),
                color: isConnected ? '#065F46' : 'white',
              }}
            >
              {isConnecting ? 'Connecting...' : isConnected ? '✅ Connected as @RealEstatePro' : '📸 Connect Instagram Account'}
            </button>
          </div>
        );
      case 2:
        return (
          <div>
            <p className="step-guidance">Choose which properties or projects the consultant should know about. It will only answer questions about this inventory.</p>
            <select 
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="setup-select"
            >
              <option value="">Select a Project...</option>
              <option value="downtown">Downtown Luxury Loft</option>
              <option value="marina">Marina 2-Bed</option>
              <option value="all">All Projects</option>
            </select>
          </div>
        );
      case 3:
        return (
          <div>
            <p className="step-guidance">Give your consultant a name and assign it to your company. This is how it will introduce itself to clients.</p>
            <ForgivingInput 
              label="Consultant Name" 
              placeholder="e.g. Sarah" 
              value={agentName} 
              onChange={(e) => setAgentName(e.target.value)} 
            />
            <ForgivingInput 
              label="Company Name" 
              placeholder="e.g. Elite Properties" 
              value={companyName} 
              onChange={(e) => setCompanyName(e.target.value)} 
            />
            <div style={{height: '16px'}} />
            <label className="control-label" style={{marginBottom: '8px'}}>Communication Style</label>
            <select
              value={communicationStyle}
              onChange={(e) => setCommunicationStyle(e.target.value)}
              className="setup-select"
            >
              <option value="professional">Professional</option>
              <option value="friendly">Friendly</option>
              <option value="direct">Direct</option>
            </select>
            <p className="step-guidance" style={{fontSize: '12px', marginTop: '12px', marginBottom: '0'}}>For advanced knowledge (timings, special offerings), go to <span style={{color: 'var(--primary-color)', cursor: 'pointer'}} onClick={() => onNavigateTo('agentLearning')}>Agent Learning & Content.</span></p>
          </div>
        );
      case 4:
        return (
          <div>
            <p className="step-guidance">What is the main goal for this consultant? This will determine its primary call-to-action.</p>
            <select 
              value={conversionGoal}
              onChange={(e) => setConversionGoal(e.target.value)}
              className="setup-select"
            >
              <option value="booking">📅 Book a Meeting</option>
              <option value="whatsapp">💬 Send to WhatsApp</option>
              <option value="phone">📞 Collect Phone Number</option>
              <option value="event">🎟️ Register for Event</option>
            </select>
          </div>
        );
      case 5:
        return (
          <div className="review-panel">
            <p className="step-guidance">Review your settings below. If everything looks good, activate your new Digital Consultant.</p>
            <div className="review-item"><span>Instagram Account</span><strong>@RealEstatePro</strong></div>
            <div className="review-item"><span>Inventory</span><strong>{selectedProject || 'Not Set'}</strong></div>
            <div className="review-item"><span>Consultant Name</span><strong>{agentName || 'Not Set'}</strong></div>
            <div className="review-item"><span>Company Name</span><strong>{companyName || 'Not Set'}</strong></div>
            <div className="review-item"><span>Communication Style</span><strong>{communicationStyle || 'Not Set'}</strong></div>
            <div className="review-item"><span>Primary Objective</span><strong>{conversionGoal || 'Not Set'}</strong></div>
          </div>
        );
      default:
        return null;
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

      {error && <p style={{ color: 'red', textAlign: 'center', margin: '24px 0' }}>{error}</p>}

      <StickyFooter 
        label={loading ? 'Preparing...' : (step === totalSteps ? 'Activate Consultant' : 'Next Step')}
        onClick={handleNext}
        disabled={isNextDisabled() || loading}
      />
    </div>
  );
};

export default ChatAgentSetup;
