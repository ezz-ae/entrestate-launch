import React, { useState, useRef } from 'react';
import StickyFooter from './StickyFooter';
import ForgivingInput from './ForgivingInput'; // Assuming ForgivingInput is suitable for single-line text
import './mobile-styles.css';

interface KnowledgeBaseScreenProps {
  onBack: () => void;
  onSave: () => void; // This will trigger a navigation back to the dashboard, etc.
  agentId: string; // The ID of the agent whose knowledge base we are updating
}

const KnowledgeBaseScreen: React.FC<KnowledgeBaseScreenProps> = ({ onBack, onSave, agentId }) => {
  const [activeTab, setActiveTab] = useState<'text' | 'file' | 'structured'>('structured');
  const [textData, setTextData] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State for structured data
  const [chatName, setChatName] = useState('');
  const [companyDetails, setCompanyDetails] = useState('');
  const [importantInfo, setImportantInfo] = useState('');
  const [exclusiveListing, setExclusiveListing] = useState('');
  const [contactDetails, setContactDetails] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles([...files, ...newFiles]);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (!agentId) {
        throw new Error('Agent ID is missing.');
      }

      let payload: any = {};
      let endpoint = '';
      let method = '';

      if (activeTab === 'text') {
        if (!textData) {
          throw new Error('Please enter some text data.');
        }
        endpoint = `/api/agent/${agentId}/knowledge`; // Using the new structured data endpoint for text for simplicity
        method = 'POST';
        payload = { importantInfo: textData }; // Map free text to importantInfo for now
      } else if (activeTab === 'file') {
        if (files.length === 0) {
          throw new Error('Please upload at least one file.');
        }
        // For file uploads, we'll use a FormData approach, likely to a different endpoint
        // For now, let's just simulate or send a placeholder
        // throw new Error('File upload processing is not yet implemented fully.');
        // Assuming /api/agent/train for PDFs, which handles FormData
        endpoint = `/api/agent/train`; // Existing endpoint for PDF training
        method = 'POST';
        const formData = new FormData();
        files.forEach(file => formData.append('file', file));
        // This endpoint expects a file, so it's a special case for FormData
        const fileUploadResponse = await fetch(endpoint, { method: method, body: formData });
        if (!fileUploadResponse.ok) {
          const err = await fileUploadResponse.json();
          throw new Error(err.error || 'Failed to upload file.');
        }
        setSuccess('Files uploaded successfully!');
        setLoading(false);
        onSave(); // Trigger parent's onSave (e.g., navigate back)
        return;
      } else if (activeTab === 'structured') {
        if (!chatName && !companyDetails && !importantInfo && !exclusiveListing && !contactDetails) {
          throw new Error('Please enter at least one piece of structured data.');
        }
        endpoint = `/api/agent/${agentId}/knowledge`;
        method = 'POST';
        payload = {
          chatName,
          companyDetails,
          importantInfo,
          exclusiveListing,
          contactDetails,
        };
      }

      const response = await fetch(endpoint, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to save knowledge.');
      }

      setSuccess('Knowledge saved successfully!');
      onSave(); // Trigger parent's onSave (e.g., navigate back)
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="screen-container" style={{ padding: '24px', paddingBottom: '100px' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', fontSize: '24px', marginRight: '16px', cursor: 'pointer', padding: 0, color: 'var(--text-tertiary)' }}>←</button>
        <h1 className="screen-title" style={{ marginBottom: 0 }}>Knowledge Base</h1>
      </div>

      <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
        Teach your AI agent about your projects, pricing, and FAQs.
      </p>

      {/* Tabs */}
      <div style={{ display: 'flex', marginBottom: '24px', backgroundColor: 'var(--bg-secondary)', padding: '4px', borderRadius: '12px' }}>
        <button 
          onClick={() => setActiveTab('structured')}
          style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', backgroundColor: activeTab === 'structured' ? 'var(--bg-primary)' : 'transparent', color: activeTab === 'structured' ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: '600', boxShadow: activeTab === 'structured' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none' }}
        >
          Structured Data
        </button>
        <button 
          onClick={() => setActiveTab('text')}
          style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', backgroundColor: activeTab === 'text' ? 'var(--bg-primary)' : 'transparent', color: activeTab === 'text' ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: '600', boxShadow: activeTab === 'text' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none' }}
        >
          Paste Text
        </button>
        <button 
          onClick={() => setActiveTab('file')}
          style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', backgroundColor: activeTab === 'file' ? 'var(--bg-primary)' : 'transparent', color: activeTab === 'file' ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: '600', boxShadow: activeTab === 'file' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none' }}
        >
          Upload PDF
        </button>
      </div>

      {activeTab === 'structured' && (
        <>
          <ForgivingInput
            label="Chat Name"
            placeholder="e.g. My Awesome Real Estate Bot"
            value={chatName}
            onChange={(e) => setChatName(e.target.value)}
          />
          <textarea
            placeholder="Company Details (e.g., Elite Properties, established 2005, specializing in luxury villas...)"
            value={companyDetails}
            onChange={(e) => setCompanyDetails(e.target.value)}
            style={{
              width: '100%',
              height: '100px',
              padding: '16px',
              borderRadius: '16px',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              fontSize: '16px',
              resize: 'vertical',
              outline: 'none',
              marginBottom: '16px',
            }}
          />
          <textarea
            placeholder="Important Info (e.g., Our commission is 2%, we offer free consultations...)"
            value={importantInfo}
            onChange={(e) => setImportantInfo(e.target.value)}
            style={{
              width: '100%',
              height: '100px',
              padding: '16px',
              borderRadius: '16px',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              fontSize: '16px',
              resize: 'vertical',
              outline: 'none',
              marginBottom: '16px',
            }}
          />
          <textarea
            placeholder="Exclusive Listing/Event (e.g., New launch: 'Skyline Towers', 10% discount this month, event on Oct 25th...)"
            value={exclusiveListing}
            onChange={(e) => setExclusiveListing(e.target.value)}
            style={{
              width: '100%',
              height: '100px',
              padding: '16px',
              borderRadius: '16px',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              fontSize: '16px',
              resize: 'vertical',
              outline: 'none',
              marginBottom: '16px',
            }}
          />
          <ForgivingInput
            label="Contact Details"
            placeholder="e.g. WhatsApp: +971501234567, Email: info@eliteproperties.com"
            value={contactDetails}
            onChange={(e) => setContactDetails(e.target.value)}
          />
        </>
      )}

      {activeTab === 'text' && (
        <textarea
          placeholder="Paste your project details, payment plans, or FAQs here..."
          value={textData}
          onChange={(e) => setTextData(e.target.value)}
          style={{
            width: '100%',
            height: '300px',
            padding: '16px',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            fontSize: '16px',
            resize: 'none',
            outline: 'none'
          }}
        />
      )}

      {activeTab === 'file' && (
        <div>
          <div className="upload-zone" onClick={() => fileInputRef.current?.click()}>
            <span style={{ fontSize: '32px', display: 'block', marginBottom: '8px' }}>📄</span>
            <span style={{ fontWeight: '600', color: 'var(--primary-color)' }}>Tap to Upload PDF</span>
            <span style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>Max 10MB</span>
            <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept=".pdf,.doc,.docx" onChange={handleFileUpload} multiple />
          </div>

          {files.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {files.map((file, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', padding: '12px', backgroundColor: 'var(--bg-accent)', borderRadius: '8px', border: '1px solid var(--primary-color)' }}>
                  <span style={{ marginRight: '8px' }}>📎</span>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--primary-color)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>{file.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {error && <p style={{ color: 'red', textAlign: 'center', marginTop: '16px' }}>{error}</p>}
      {success && <p style={{ color: 'green', textAlign: 'center', marginTop: '16px' }}>{success}</p>}

      <StickyFooter 
        label={loading ? 'Saving...' : 'Save Knowledge'} 
        onClick={handleSave} 
        disabled={loading || (activeTab === 'text' && !textData) || (activeTab === 'file' && files.length === 0 && !success) || (activeTab === 'structured' && !chatName && !companyDetails && !importantInfo && !exclusiveListing && !contactDetails)} 
      />
    </div>
  );
};

export default KnowledgeBaseScreen;