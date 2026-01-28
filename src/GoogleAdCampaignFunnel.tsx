import React, { useState } from 'react';
import StickyFooter from './StickyFooter';
import ProgressBar from '../ProgressBar';
import ForgivingInput from './ForgivingInput';
import AdCampaignPlanner from './SmartAdPlanner'; // Budget/keyword logic
import './mobile-styles.css';

interface GoogleAdCampaignFunnelProps {
  onComplete: (data: any) => void;
  onBack: () => void;
}

const GoogleAdCampaignFunnel: React.FC<GoogleAdCampaignFunnelProps> = ({ onComplete, onBack }) => {
  const [step, setStep] = useState(1);
  const [objective, setObjective] = useState('');
  const [targetLocation, setTargetLocation] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [budget, setBudget] = useState('500'); // Default budget
  const [headline1, setHeadline1] = useState('');
  const [headline2, setHeadline2] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalSteps = 5; // 1. Objective, 2. Audience, 3. Budget, 4. Creatives, 5. Review

  const handleLaunch = async () => {
    setLoading(true);
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      onComplete({ objective, targetLocation, targetAudience, budget, headline1, headline2, description });
    } catch (e: any) {
      setError(e?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    if (step < totalSteps) {
      setStep(step + 1);
      return;
    }
    await handleLaunch();
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
      case 1: return 'Campaign Objective';
      case 2: return 'Target Audience & Location';
      case 3: return 'Budget & Bidding';
      case 4: return 'Ad Creatives';
      case 5: return 'Review & Launch';
      default: return '';
    }
  };

  const isNextDisabled = () => {
    switch (step) {
      case 1: return !objective;
      case 2: return !targetLocation || !targetAudience;
      case 3: return !budget || parseFloat(budget) <= 0;
      case 4: return !headline1 || !description;
      default: return false;
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <p className="step-guidance">What do you want your Google Ad campaign to achieve?</p>
            <select
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              className="setup-select"
            >
              <option value="">Select an Objective...</option>
              <option value="leads">Generate Leads (Collect contact information)</option>
              <option value="traffic">Drive Website Traffic (Get more visitors to your site)</option>
              <option value="calls">Get Phone Calls (Directly connect with potential clients)</option>
            </select>
          </div>
        );
      case 2:
        return (
          <div>
            <p className="step-guidance">Define who you want to reach and where they are located.</p>
            <ForgivingInput
              label="Target Location"
              placeholder="e.g. Dubai, UAE (City, Region, or Country)"
              value={targetLocation}
              onChange={(e) => setTargetLocation(e.target.value)}
            />
            <ForgivingInput
              label="Target Audience"
              placeholder="e.g. Investors, First-time buyers, Luxury clients"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
            />
          </div>
        );
      case 3:
        return (
          <div>
            <p className="step-guidance">Set your daily budget and review recommended bidding strategies.</p>
            {/* AdCampaignPlanner will provide budget calculation and keyword suggestions */}
            <AdCampaignPlanner 
              market={targetLocation} // Pass target location as market for keyword suggestions
              budget={budget}
              onBudgetChange={(e) => setBudget(e.target.value)}
            />
          </div>
        );
      case 4:
        return (
          <div>
            <p className="step-guidance">Craft compelling headlines and descriptions to attract your audience.</p>
            <ForgivingInput
              label="Headline 1"
              placeholder="e.g. Discover Luxury Apartments"
              value={headline1}
              onChange={(e) => setHeadline1(e.target.value)}
              maxLength={30}
            />
            <ForgivingInput
              label="Headline 2 (Optional)"
              placeholder="e.g. Your Dream Home Awaits"
              value={headline2}
              onChange={(e) => setHeadline2(e.target.value)}
              maxLength={30}
            />
            <ForgivingInput
              label="Description"
              placeholder="e.g. Explore exclusive properties with stunning views and world-class amenities in Dubai."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={90}
            />
          </div>
        );
      case 5:
        return (
          <div className="review-panel">
            <p className="step-guidance">Review your campaign settings before launching. Ensure all details are accurate.</p>
            <div className="review-item"><span>Objective</span><strong>{objective}</strong></div>
            <div className="review-item"><span>Location</span><strong>{targetLocation}</strong></div>
            <div className="review-item"><span>Audience</span><strong>{targetAudience}</strong></div>
            <div className="review-item"><span>Daily Budget</span><strong>AED {budget}</strong></div>
            <div className="review-item"><span>Headline 1</span><strong>{headline1}</strong></div>
            {headline2 && <div className="review-item"><span>Headline 2</span><strong>{headline2}</strong></div>}
            <div className="review-item"><span>Description</span><strong>{description}</strong></div>
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

      {error ? <p style={{ color: 'red', textAlign: 'center', margin: '24px 0' }}>{error}</p> : null}

      <StickyFooter 
        label={loading ? 'Working…' : step === totalSteps ? 'Launch Campaign' : 'Next Step'}
        onClick={handleNext}
        disabled={isNextDisabled() || loading}
      />
    </div>
  );
};

export default GoogleAdCampaignFunnel;
