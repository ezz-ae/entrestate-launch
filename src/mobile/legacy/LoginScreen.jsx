import React, { useState, useEffect } from 'react';
import ForgivingInput from '@/components/ForgivingInput';
import StickyFooter from './StickyFooter';
import { COUNTRY_CODES } from './config/countries';
import PhoneInputWithCountryCode from '@/components/PhoneInputWithCountryCode';
const OTP_LENGTH = 6; // Assuming a 6-digit OTP, adjust if needed

const LoginScreen = ({ onLogin, authLoading, signInWithOtp, verifyOtp }) => {
  const [otpSent, setOtpSent] = useState(false);
  const [channel, setChannel] = useState('sms'); // 'sms' or 'whatsapp'
  const [countryCode, setCountryCode] = useState('+971');
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const [formData, setFormData] = useState({ phoneNumber: '', email: '', token: '', rememberMe: true });
  const [timer, setTimer] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (field, value) => {
    setError(''); // Clear error on change
    // PhoneInputWithCountryCode already passes formatted value for phoneNumber
    // For other fields, just update directly.
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSendCode = async () => {
    setError('');
    setShakeInput(false); // Reset shake on new attempt
    const cleanedNumber = formData.phoneNumber.replace(/\s/g, '');
    // Validation: Ensure minimum length and numeric content
    const country = COUNTRY_CODES.find(c => c.code === countryCode);

    if (!country) {
      setError("Invalid country code selected.");
      setShakeInput(true); // Shake on error
      return;
    }

    if (cleanedNumber.length < country.minLen || cleanedNumber.length > country.maxLen || !/^\d+$/.test(cleanedNumber)) {
      setError(`Please enter a valid phone number for ${country.label} (between ${country.minLen} and ${country.maxLen} digits).`);
      setShakeInput(true); // Shake on error
      return;
    }

    const fullNumber = `${countryCode}${cleanedNumber}`;
    const { error: authError } = await signInWithOtp(fullNumber, formData.email); // Pass email for optional metadata

    if (authError) {
      setError(authError.message);
      setShakeInput(true); // Shake on error
    } else {
      setOtpSent(true);
      setTimer(60);
    }
  };

  const handleVerifyCode = async () => {
    setError('');
    const fullNumber = `${countryCode}${formData.phoneNumber.replace(/\s/g, '')}`;
    // Pass rememberMe to useAuth for session persistence logic
    const { data, error: authError } = await verifyOtp(fullNumber, formData.token, formData.rememberMe); // Pass rememberMe
    if (authError) {
      setError(authError.message);
      setShakeInput(true); // Shake on error
    } else if (data.user) {
      onLogin(data.user);
    }
  };

  const filteredCountries = COUNTRY_CODES.filter(c => 
    c.label.toLowerCase().includes(countrySearch.toLowerCase()) || 
    c.code.includes(countrySearch)
  );

  return (
    <div className="screen-container" style={{ padding: '24px', paddingBottom: '100px', display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '80vh' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🚀</div>
        <h1 className="screen-title" style={{ marginBottom: '8px' }}>
          {otpSent ? 'Enter Code' : 'Welcome'}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>
          {otpSent 
            ? `We sent a code to ${countryCode} ${formData.phoneNumber} via ${channel.toUpperCase()}` 
            : 'Enter your phone number to access your command center.'}
        </p>
      </div>

      {!otpSent ? (
        <>
          <PhoneInputWithCountryCode
            label="Phone Number"
            value={formData.phoneNumber}
            onChange={(val) => handleChange('phoneNumber', val)}
            countryCode={countryCode}
            onCountryCodeChange={setCountryCode}
            error={error}
          />

          {countryCode !== '+971' && (
            <ForgivingInput 
              label="Email Address (Optional)" 
              placeholder="name@example.com" 
              value={formData.email} 
              onChange={(e) => handleChange('email', e.target.value)} 
            />
          )}
          
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: 'var(--text-tertiary)', marginBottom: '12px' }}>
              Receive code via:
            </label>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={() => setChannel('sms')}
                style={{ 
                  flex: 1, padding: '12px', borderRadius: '12px', 
                  border: `1px solid ${channel === 'sms' ? 'var(--primary-color)' : 'var(--border-color)'}`,
                  backgroundColor: channel === 'sms' ? 'var(--bg-accent)' : 'var(--bg-secondary)',
                  color: channel === 'sms' ? 'var(--primary-color)' : 'var(--text-primary)',
                  fontWeight: '600', cursor: 'pointer'
                }}
              >
                💬 SMS
              </button>
              <button 
                onClick={() => setChannel('whatsapp')}
                style={{ 
                  flex: 1, padding: '12px', borderRadius: '12px', 
                  border: `1px solid ${channel === 'whatsapp' ? '#25D366' : 'var(--border-color)'}`,
                  backgroundColor: channel === 'whatsapp' ? '#DCFCE7' : 'var(--bg-secondary)',
                  color: channel === 'whatsapp' ? '#15803D' : 'var(--text-primary)',
                  fontWeight: '600', cursor: 'pointer'
                }}
              >
                📱 WhatsApp
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <input 
              type="checkbox" 
              id="rememberMe" 
              checked={formData.rememberMe} 
              onChange={(e) => handleChange('rememberMe', e.target.checked)}
              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
            />
            <label htmlFor="rememberMe" style={{ fontSize: '14px', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              Don't ask again for 7 days
            </label>
          </div>
        </>
      ) : (
        <>
          <ForgivingInput 
            label="Verification Code" 
            placeholder="123456" 
            value={formData.token} 
            onChange={(e) => handleChange('token', e.target.value)} 
          />
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '8px' }}>
            <button
              onClick={() => {
                setOtpSent(false);
                setFormData(prev => ({ ...prev, token: '' }));
                setTimer(0);
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-secondary)',
                fontWeight: '600',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              Change Number
            </button>
            <button
              disabled={timer > 0 || authLoading}
              onClick={handleSendCode}
              style={{
                background: 'none',
                border: 'none',
                color: timer > 0 ? 'var(--text-secondary)' : 'var(--primary-color)',
                fontWeight: '600',
                fontSize: '14px',
                cursor: timer > 0 ? 'default' : 'pointer'
              }}
            >
              {timer > 0 ? `Resend code in ${timer}s` : 'Resend Code'}
            </button>
          </div>
          {/* "Forgot Code?" / Help text */}
          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Didn't receive the code or forgot it? You can{' '}
              <button onClick={handleSendCode} disabled={timer > 0 || authLoading} style={{ background: 'none', border: 'none', color: 'var(--primary-color)', fontWeight: '600', fontSize: '12px', cursor: timer > 0 ? 'default' : 'pointer', textDecoration: 'underline' }}>
                resend it
              </button>{' '}
              or{' '}
              <button onClick={() => { setOtpSent(false); setFormData(prev => ({ ...prev, token: '' })); setTimer(0); setError(''); }} style={{ background: 'none', border: 'none', color: 'var(--primary-color)', fontWeight: '600', fontSize: '12px', cursor: 'pointer', textDecoration: 'underline' }}>
                change your number
              </button>.
            </p>
          </div>
        </>
      )}

      {/* StickyFooter with loading spinner */}
      <StickyFooter 
        label={authLoading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <div className="spinner-small"></div> Processing...
          </div>
        ) : (
          otpSent ? 'Verify & Login' : 'Send Magic Code'
        )} 
        onClick={otpSent ? handleVerifyCode : handleSendCode} 
        disabled={authLoading || !formData.phoneNumber || (otpSent && !formData.token)}
      />
    </div>
  );
};

export default LoginScreen;

      <StickyFooter 
        label={authLoading ? 'Processing...' : (otpSent ? 'Verify & Login' : 'Send Magic Code')} 
        onClick={otpSent ? handleVerifyCode : handleSendCode} 
        disabled={authLoading || !formData.phoneNumber || (otpSent && !formData.token)}
      />
    </div>
  );
};

export default LoginScreen;
