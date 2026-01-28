import React, { useState } from 'react';
import StickyFooter from './StickyFooter';
import ProgressBar from './ProgressBar';
import ForgivingInput from './ForgivingInput';
import AdCampaignPlanner from './SmartAdPlanner';
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

  const handleNext = () => {
    if (loading) return;
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      setLoading(true);
      setError(null);
      try {
        onComplete({
          objective,
          targetLocation,
          targetAudience,
          budget,
          headline1,
          headline2,
          description,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to launch campaign.');
      } finally {
        setLoading(false);
      }
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
    // AdPreview sub-component for live preview
    const AdPreview: React.FC<{ headline1: string; headline2: string; description: string; }> = ({ headline1, headline2, description }) => {
      const displayHeadline1 = headline1 || "Discover Exclusive Properties";
      const displayHeadline2 = headline2 ? ` - ${headline2}` : ' - Your Dream Home Awaits';
      const displayDescription = description || "Explore luxury apartments, villas, and townhouses with stunning views and world-class amenities.";

      return (
        <div style={{
          border: '1px solid #dadce0', // Google Ad border color
          borderRadius: '8px',
          padding: '12px',
          marginBottom: '24px',
          backgroundColor: 'white',
          fontFamily: 'Roboto, Arial, sans-serif',
          fontSize: '14px',
          color: '#202124',
          boxShadow: '0 1px 1px rgba(0,0,0,0.1)',
        }}>
          <div style={{ color: '#1a0dab', fontSize: '16px', fontWeight: 'bold', lineHeight: '1.2', marginBottom: '4px' }}>
            {displayHeadline1}{displayHeadline2}
          </div>
          <div style={{ color: '#006621', fontSize: '12px', marginBottom: '4px' }}>
            www.entrestate.com/your-page
          </div>
          <div style={{ lineHeight: '1.5' }}>
            {displayDescription}
          </div>
        </div>
      );
    };

    switch (step) {
      case 1:
        return (
          <div>
            <p className="step-guidance">Choosing the right objective defines your campaign's success. Select what you want your Google Ad to achieve.</p>
            <select
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              className="setup-select"
            >
              <option value="">Select an Objective...</option>
              <option value="leads">Generate Leads</option>
              <option value="traffic">Drive Website Traffic</option>
              <option value="calls">Get Phone Calls</option>
            </select>
          </div>
        );
      case 2:
        return (
          <div>
            <p className="step-guidance">Precisely define who should see your ad and their geographical area. This ensures your message reaches the most relevant prospects.</p>
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
            <p className="step-guidance">Allocate your daily budget and understand the bidding strategies to maximize your campaign's reach and efficiency.</p>
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
            <AdPreview headline1={headline1} headline2={headline2} description={description} />
            <p className="step-guidance">Craft compelling headlines and descriptions. Use strong keywords and a clear call-to-action to attract your audience.</p>
            <ForgivingInput
              label="Headline 1"
              placeholder="e.g. Discover Luxury Apartments"
              value={headline1}
              onChange={(e) => setHeadline1(e.target.value)}
              maxLength={30}
            />
            <div style={{textAlign: 'right', fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px'}}>
                {headline1.length}/30 characters
            </div>
            <ForgivingInput
              label="Headline 2 (Optional)"
              placeholder="e.g. Your Dream Home Awaits"
              value={headline2}
              onChange={(e) => setHeadline2(e.target.value)}
              maxLength={30}
            />
            <div style={{textAlign: 'right', fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px'}}>
                {headline2.length}/30 characters
            </div>
            <div style={{ marginTop: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: 'var(--text-tertiary)', marginBottom: '8px' }}>
                Description
              </label>
              <textarea
                placeholder="e.g. Explore exclusive properties with stunning views and world-class amenities in Dubai."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={90}
                style={{
                  width: '100%',
                  minHeight: '120px',
                  padding: '14px',
                  borderRadius: '12px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  fontSize: '14px',
                  outline: 'none',
                  resize: 'vertical',
                }}
              />
            </div>
            <div style={{textAlign: 'right', fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px'}}>
                {description.length}/90 characters
            </div>
          </div>
        );
      case 5:
        return (
          <div className="review-panel">
            <p className="step-guidance">This is your final opportunity to verify all details. A thorough review ensures your campaign launches effectively and without errors.</p>
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

      {error && (
        <p style={{ color: 'red', textAlign: 'center', margin: '24px 0' }}>
          {error}
        </p>
      )}

      <StickyFooter 
        label={loading ? 'Launching...' : step === totalSteps ? 'Launch Campaign' : 'Next Step'}
        onClick={handleNext}
        disabled={isNextDisabled() || loading}
      />
    </div>
  );
};

export default GoogleAdCampaignFunnel;
