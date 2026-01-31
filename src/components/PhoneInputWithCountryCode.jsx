import React, { useState, useEffect, useMemo } from 'react';
import ForgivingInput from './ForgivingInput';
import { COUNTRY_CODES } from '../../config/countries';

const PhoneInputWithCountryCode = ({
  label,
  value, // phoneNumber value
  onChange, // (newPhoneNumber) => {}
  countryCode: initialCountryCode, // current selected country code
  onCountryCodeChange, // (newCountryCode) => {}
  error,
  ...props
}) => {
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');

  // Internal state for countryCode if not controlled by parent
  const [internalCountryCode, setInternalCountryCode] = useState(initialCountryCode || '+971');

  useEffect(() => {
    if (initialCountryCode) {
      setInternalCountryCode(initialCountryCode);
    }
  }, [initialCountryCode]);

  const currentCountry = useMemo(() => COUNTRY_CODES.find(c => c.code === (onCountryCodeChange ? initialCountryCode : internalCountryCode)), [initialCountryCode, internalCountryCode, onCountryCodeChange]);

  const handleCountryCodeSelect = (code) => {
    if (onCountryCodeChange) {
      onCountryCodeChange(code);
    } else {
      setInternalCountryCode(code);
    }
    setShowCountryModal(false);
    setCountrySearch('');
  };

  const formatPhoneNumber = (val, code) => {
    const cleaned = val.replace(/\D/g, '');
    const country = COUNTRY_CODES.find(c => c.code === code);
    
    if (!country || !country.format) {
      let formatted = cleaned;
      if (cleaned.length > 2) {
        formatted = `${cleaned.slice(0, 2)} ${cleaned.slice(2)}`;
      }
      if (cleaned.length > 5) {
        formatted = `${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5, 10)}`;
      }
      return formatted.trim();
    }

    let formattedNumber = '';
    let cleanedIndex = 0;
    for (let i = 0; i < country.format.length; i++) {
      if (cleanedIndex >= cleaned.length) break;

      if (country.format[i] === 'X') {
        formattedNumber += cleaned[cleanedIndex];
        cleanedIndex++;
      } else {
        formattedNumber += country.format[i];
      }
    }
    return formattedNumber;
  };

  const handlePhoneNumberChange = (e) => {
    const newRawValue = e.target.value;
    const newFormattedValue = formatPhoneNumber(newRawValue, (onCountryCodeChange ? initialCountryCode : internalCountryCode));
    onChange(newFormattedValue);
  };

  const filteredCountries = useMemo(() => COUNTRY_CODES.filter(c => 
    c.label.toLowerCase().includes(countrySearch.toLowerCase()) || 
    c.code.includes(countrySearch)
  ), [countrySearch]);

  const selectedCountryCode = onCountryCodeChange ? initialCountryCode : internalCountryCode;

  return (
    <>
      <ForgivingInput label={label} error={error} {...props}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', padding: '0px', borderRadius: '0px' }}> {/* No padding/border here, ForgivingInput wrapper handles it */}
          <button
            type="button" // Prevent form submission
            onClick={() => setShowCountryModal(true)}
            style={{
              width: '110px',
              padding: '16px',
              borderRadius: '12px',
              border: 'none', // Border is handled by ForgivingInput wrapper
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              fontSize: '16px',
              textAlign: 'left',
              cursor: 'pointer',
              flexShrink: 0,
              outline: 'none'
            }}
          >
            {currentCountry?.label.split(' ')[0]} {selectedCountryCode}
          </button>
          <div style={{ flex: 1 }}>
            <input 
              type="tel"
              placeholder={currentCountry?.format.replace(/X/g, '0') || "000 000 0000"} 
              value={value} 
              onChange={handlePhoneNumberChange} 
              style={{ 
                width: '100%', 
                padding: '16px', 
                fontSize: '16px', 
                borderRadius: '12px', 
                border: 'none', // Border is handled by ForgivingInput wrapper
                backgroundColor: 'var(--bg-secondary)', 
                color: 'var(--text-primary)', 
                outline: 'none' 
              }}
            />
          </div>
        </div>
      </ForgivingInput>

      {currentCountry && !error && (
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '-16px', marginBottom: '24px', fontWeight: '500', textAlign: 'right' }}>
          {value.replace(/\s/g, '').length}/{currentCountry.maxLen} digits
        </p>
      )}

      {showCountryModal && (
        <div className="modal-overlay" style={{ zIndex: 3000 }} onClick={() => setShowCountryModal(false)}>
          <div className="modal-content" style={{ padding: '20px', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '700' }}>Select Country</h3>
            <input 
              type="text"
              placeholder="Search country or code..."
              value={countrySearch}
              onChange={(e) => setCountrySearch(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                marginBottom: '16px',
                outline: 'none'
              }}
            />
            <div style={{ overflowY: 'auto', flex: 1 }}>
              {filteredCountries.map((c) => (
                <div 
                  key={c.code}
                  onClick={() => handleCountryCodeSelect(c.code)}
                  style={{
                    padding: '14px',
                    borderBottom: '1px solid var(--bg-tertiary)',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <span style={{ fontSize: '16px', color: 'var(--text-primary)' }}>{c.label}</span>
                  <span style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: '600' }}>{c.code}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PhoneInputWithCountryCode;