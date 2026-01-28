import React, { useState } from 'react';
import StickyFooter from '@/mobile/StickyFooter';
import '@/mobile/mobile-styles.css';
import { MessageSquare, Phone, Upload, Check, MapPin, DollarSign, Image as ImageIcon, Info, PlayCircle, Clock, Globe } from 'lucide-react';

interface SiteBuilderSalesFunnelProps {
  onStartBuilding: () => void;
  onAddDigitalConsultant: () => void;
}

const SiteBuilderSalesFunnel: React.FC<SiteBuilderSalesFunnelProps> = ({ onStartBuilding, onAddDigitalConsultant }) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'call' | 'upload'>('upload');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [callPurpose, setCallPurpose] = useState('Sales');
  const [callInitiated, setCallInitiated] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'reading' | 'extracting' | 'preparing' | 'complete'>('idle');
  const [uploadedFileName, setUploadedFileName] = useState('');

  const handleCallRequest = () => {
    if (phoneNumber) {
      setCallInitiated(true);
      // Simulate API call
      setTimeout(() => setCallInitiated(false), 5000); // Reset after 5 seconds
    }
  };

  const handleFileUpload = (file: File | null) => {
    if (!file) return;

    setUploadedFileName(file.name);
    setUploadState('uploading');
    setUploadProgress(0);

    const stages = [
      { state: 'reading', duration: 1000, progress: 30 },
      { state: 'extracting', duration: 1500, progress: 60 },
      { state: 'preparing', duration: 1500, progress: 90 },
      { state: 'complete', duration: 500, progress: 100 }
    ];

    let currentProgress = 0;
    let stageIndex = 0;

    const animateUpload = () => {
      if (stageIndex < stages.length) {
        const stage = stages[stageIndex];
        setUploadState(stage.state as any); // Type assertion for now
        const interval = setInterval(() => {
          currentProgress += 5;
          if (currentProgress >= stage.progress) {
            currentProgress = stage.progress;
            clearInterval(interval);
            stageIndex++;
            animateUpload();
          }
          setUploadProgress(currentProgress);
        }, stage.duration / ((stage.progress - (stages[stageIndex - 1]?.progress || 0)) / 5));
      }
    };

    animateUpload();
  };

  const renderUploadContent = () => {
    switch (uploadState) {
      case 'idle':
        return (
          <div
            className="drop-zone"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleFileUpload(e.dataTransfer.files[0]);
            }}
            onClick={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = '.pdf,.jpg,.jpeg,.png';
              input.onchange = (e) => handleFileUpload((e.target as HTMLInputElement).files?.[0] || null);
              input.click();
            }}
            style={{
              border: '2px dashed var(--border-color)',
              borderRadius: '12px',
              padding: '40px 20px',
              textAlign: 'center',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              backgroundColor: 'var(--bg-secondary)',
              transition: 'background-color 0.3s ease'
            }}
          >
            <Upload size={36} style={{ marginBottom: '16px', color: 'var(--text-tertiary)' }} />
            <p style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 8px 0' }}>Drop any project brochure.</p>
            <p style={{ margin: 0 }}>Watch it turn into a live page.</p>
          </div>
        );
      case 'uploading':
      case 'reading':
      case 'extracting':
      case 'preparing':
        return (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <p style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 16px 0', color: 'var(--text-primary)' }}>
              {uploadState === 'uploading' && `Uploading ${uploadedFileName}...`}
              {uploadState === 'reading' && `Reading structure of ${uploadedFileName}...`}
              {uploadState === 'extracting' && `Extracting listings from ${uploadedFileName}...`}
              {uploadState === 'preparing' && `Preparing page layout for ${uploadedFileName}...`}
            </p>
            <div style={{ width: '100%', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px', height: '10px', overflow: 'hidden' }}>
              <div style={{ width: `${uploadProgress}%`, height: '100%', backgroundColor: 'var(--primary-color)', borderRadius: '8px', transition: 'width 0.3s ease-in-out' }}></div>
            </div>
          </div>
        );
      case 'complete':
        return (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--primary-color)', marginBottom: '16px' }}>Your page is ready!</h3>
            <div className="mobile-page-preview" style={{
              backgroundColor: 'white', border: '1px solid var(--border-color)', borderRadius: '8px',
              minHeight: '250px', marginBottom: '24px', position: 'relative', overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              <div style={{ position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)', width: '80%', height: '15px', backgroundColor: 'var(--bg-secondary)', borderRadius: '4px' }} />
              <div style={{ position: 'absolute', top: '35px', left: '50%', transform: 'translateX(-50%)', width: '60%', height: '10px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '4px' }} />
              <div style={{ marginTop: '60px', padding: '0 15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ height: '70px', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px' }}></div>
                <div style={{ height: '40px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '8px' }}></div>
                <div style={{ height: '50px', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px' }}></div>
              </div>
              <p style={{ margin: '15px', fontSize: '14px', color: 'var(--text-secondary)' }}>Live preview of your property page generated from {uploadedFileName}.</p>
            </div>
            <button className="primary-button" onClick={onStartBuilding}>View My New Page</button>
          </div>
        );
    }
  };

  return (
    <div className="screen-container" style={{ padding: '24px', paddingBottom: '100px' }}>
      {/* 1) Above the fold: “Try it now” */}
      <section className="try-it-now-section" style={{ marginBottom: '48px', paddingTop: '24px' }}>
        <h1 className="screen-title" style={{ fontSize: '36px', marginBottom: '32px', fontWeight: '800', textAlign: 'center' }}>Launch a Property Page Instantly.</h1>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px', gap: '12px' }}>
          <button
            className={`tab-button ${activeTab === 'upload' ? 'active' : ''}`}
            onClick={() => setActiveTab('upload')}
            style={{ flex: 1, padding: '12px 0', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: activeTab === 'upload' ? 'var(--primary-color)' : 'var(--bg-secondary)', color: activeTab === 'upload' ? 'white' : 'var(--text-primary)' }}
          >
            <Upload size={18} style={{ marginRight: '8px' }} /> Brochure
          </button>
          <button
            className={`tab-button ${activeTab === 'chat' ? 'active' : ''}`}
            onClick={() => setActiveTab('chat')}
            style={{ flex: 1, padding: '12px 0', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: activeTab === 'chat' ? 'var(--primary-color)' : 'var(--bg-secondary)', color: activeTab === 'chat' ? 'white' : 'var(--text-primary)' }}
          >
            <MessageSquare size={18} style={{ marginRight: '8px' }} /> Chat
          </button>
          <button
            className={`tab-button ${activeTab === 'call' ? 'active' : ''}`}
            onClick={() => setActiveTab('call')}
            style={{ flex: 1, padding: '12px 0', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: activeTab === 'call' ? 'var(--primary-color)' : 'var(--bg-secondary)', color: activeTab === 'call' ? 'white' : 'var(--text-primary)' }}
          >
            <Phone size={18} style={{ marginRight: '8px' }} /> Call
          </button>
        </div>

        <div className="tab-content" style={{ backgroundColor: 'var(--bg-primary)', borderRadius: '16px', padding: '24px', border: '1px solid var(--border-color)' }}>
          {activeTab === 'chat' && (
            <div className="chat-ui">
              <p style={{ fontSize: '16px', color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '24px' }}>Tell me about the page you want to launch. I'll help you prepare it quickly.</p>
              <div className="chat-message-bubble incoming" style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '18px 18px 18px 4px', padding: '12px 16px', maxWidth: '80%', marginBottom: '16px' }}>
                <p style={{ margin: 0, color: 'var(--text-primary)' }}>"I need a sleek page for a luxury villa in Emirates Hills. Focus on the high-end finishes and the golf course view."</p>
              </div>
              <div className="chat-message-bubble outgoing" style={{ backgroundColor: 'var(--primary-color)', color: 'white', borderRadius: '18px 18px 4px 18px', padding: '12px 16px', maxWidth: '80%', marginLeft: 'auto', marginBottom: '24px' }}>
                <p style={{ margin: 0 }}>"Understood. Preparing a custom layout focusing on premium visuals and an interactive amenities map. Your draft will be ready in moments."</p>
              </div>
              <input
                type="text"
                placeholder="Describe your property or vision..."
                style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
              />
              <button className="primary-button" style={{ width: '100%', marginTop: '16px' }}>Send</button>
            </div>
          )}
          {activeTab === 'call' && (
            <div className="cold-call-ui" style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px', color: 'var(--text-primary)' }}>Prefer a direct conversation?</h3>
              {!callInitiated ? (
                <>
                  <input
                    type="tel"
                    placeholder="Your number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', marginBottom: '16px' }}
                  />
                  <select
                    value={callPurpose}
                    onChange={(e) => setCallPurpose(e.target.value)}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', marginBottom: '24px' }}
                  >
                    <option value="Sales">Discuss Page Strategy</option>
                    <option value="Listings">Review Property Details</option>
                    <option value="Buyer follow-up">Lead Follow-up</option>
                  </select>
                  <button className="primary-button" onClick={handleCallRequest} style={{ width: '100%' }}>Call me now</button>
                </>
              ) : (
                <div style={{ padding: '40px 20px', backgroundColor: 'var(--bg-secondary)', borderRadius: '12px' }}>
                  <Phone size={36} style={{ marginBottom: '16px', color: 'var(--primary-color)' }} />
                  <p style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)', margin: 0 }}>You’ll receive a call shortly from your assistant.</p>
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '8px' }}>We'll connect you with a specialist to discuss your property page needs.</p>
                </div>
              )}
            </div>
          )}
          {activeTab === 'upload' && renderUploadContent()}
        </div>
      </section>

      {/* Social Proof / Why Brokers Love It */}
      <section style={{ marginBottom: '48px' }}>
        <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '32px' }}>Trusted by Dubai's Top Brokers.</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '40px' }}>
          Real estate professionals choose Entrestate to launch stunning property pages that convert.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="testimonial-card" style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '16px', padding: '24px', border: '1px solid var(--border-color)' }}>
            <p style={{ fontSize: '16px', color: 'var(--text-primary)', fontStyle: 'italic', marginBottom: '16px' }}>"Launching a page used to take days. Now, with Entrestate, my listings are live and generating leads in under an hour. It's a game-changer for speed-to-market."</p>
            <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', margin: 0 }}>— Ahmed Al-Fahim, Elite Properties</p>
          </div>
          <div className="testimonial-card" style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '16px', padding: '24px', border: '1px solid var(--border-color)' }}>
            <p style={{ fontSize: '16px', color: 'var(--text-primary)', fontStyle: 'italic', marginBottom: '16px' }}>"The ability to turn a simple brochure into a full-fledged lead page instantly is incredible. My clients are impressed, and my lead flow has never been stronger."</p>
            <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', margin: 0 }}>— Layla Mansour, Oasis Realty</p>
          </div>
        </div>
      </section>

      {/* How it works: Build Your Page in 3 Steps */}
      <section style={{ marginBottom: '48px' }}>
        <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '32px' }}>Your Property Page, Live in Three Steps.</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '40px' }}>
          From initial idea to published page, Entrestate streamlines your workflow for maximum impact.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div className="step-card" style={{ display: 'flex', alignItems: 'flex-start', gap: '24px', backgroundColor: 'var(--bg-secondary)', borderRadius: '16px', padding: '24px', border: '1px solid var(--border-color)' }}>
            <div style={{ width: '48px', height: '48px', minWidth: '48px', borderRadius: '50%', backgroundColor: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: '700' }}>1</div>
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: '700', margin: '0 0 8px 0', color: 'var(--text-primary)' }}>Select Your Source</h3>
              <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Choose to start from an existing inventory project, upload a brochure, or simply describe your vision.</p>
            </div>
          </div>
          <div className="step-card" style={{ display: 'flex', alignItems: 'flex-start', gap: '24px', backgroundColor: 'var(--bg-secondary)', borderRadius: '16px', padding: '24px', border: '1px solid var(--border-color)' }}>
            <div style={{ width: '48px', height: '48px', minWidth: '48px', borderRadius: '50%', backgroundColor: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: '700' }}>2</div>
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: '700', margin: '0 0 8px 0', color: 'var(--text-primary)' }}>Refine & Customize</h3>
              <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Adjust layouts, add essential real estate sections like payment plans and location maps, and ensure every detail is perfect.</p>
            </div>
          </div>
          <div className="step-card" style={{ display: 'flex', alignItems: 'flex-start', gap: '24px', backgroundColor: 'var(--bg-secondary)', borderRadius: '16px', padding: '24px', border: '1px solid var(--border-color)' }}>
            <div style={{ width: '48px', height: '48px', minWidth: '48px', borderRadius: '50%', backgroundColor: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: '700' }}>3</div>
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: '700', margin: '0 0 8px 0', color: 'var(--text-primary)' }}>Publish & Promote</h3>
              <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Launch your page with a free custom subdomain, capture leads, and integrate directly with your marketing efforts.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Block system section - Renamed to Page Sections */}
      <section style={{ marginBottom: '48px' }}>
        <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '32px' }}>Comprehensive Page Sections for Real Estate.</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '40px' }}>
          Every Entrestate page comes equipped with all the critical components agents need to convert visitors into leads.
        </p>
        <div style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '16px', padding: '24px', border: '1px solid var(--border-color)' }}>
          <div className="mobile-page-mockup" style={{
            backgroundColor: 'white', border: '1px solid var(--border-color)', borderRadius: '8px',
            minHeight: '300px', marginBottom: '24px', position: 'relative', overflow: 'hidden',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
          }}>
            {/* Minimalist mock of a property page layout */}
            <div style={{ position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)', width: '80%', height: '15px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '4px' }} />
            <div style={{ position: 'absolute', top: '35px', left: '50%', transform: 'translateX(-50%)', width: '60%', height: '10px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '4px' }} />
            <div style={{ marginTop: '70px', padding: '0 15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ height: '80px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '8px' }}></div>
              <div style={{ height: '50px', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px' }}></div>
              <div style={{ height: '60px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '8px' }}></div>
            </div>
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', color: 'var(--text-primary)' }}>Key Sections for Every Property:</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <SectionFeature icon={<ImageIcon size={20} />} text="Photo & Video Gallery: Showcase stunning visuals of your property." />
            <SectionFeature icon={<MapPin size={20} />} text="Interactive Location Map: Highlight nearby amenities and key areas." />
            <SectionFeature icon={<DollarSign size={20} />} text="Transparent Pricing & Payment Plans: Clearly present financial details." />
            <SectionFeature icon={<PlayCircle size={20} />} text="Virtual Tour Integration: Offer immersive property experiences." />
            <SectionFeature icon={<MessageSquare size={20} />} text="WhatsApp & Call Actions: Instant client communication options." />
            <SectionFeature icon={<Clock size={20} />} text="Real-time Availability: Display current status and unit availability." />
            <SectionFeature icon={<Info size={20} />} text="FAQs & Key Features: Address common buyer queries proactively." />
          </ul>
        </div>
      </section>

      {/* Proof section (before/after mock) - Emphasizing Brochure to Page */}
      <section style={{ marginBottom: '48px' }}>
        <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '32px' }}>From Brochure to Live Page: A Seamless Transformation.</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '40px' }}>
          Witness how Entrestate transforms your property documents into professional, lead-generating online assets.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <BeforeAfterCard
            imageUrl="https://via.placeholder.com/300x200?text=Property+Brochure+PDF"
            caption="Your Property Brochure (PDF)"
            type="before"
          />
          <BeforeAfterCard
            imageUrl="https://via.placeholder.com/300x200?text=Live+Entrestate+Page"
            caption="Your Live Entrestate Page"
            type="after"
          />
        </div>
      </section>


      {/* Pricing (150/month) with CTA */}
      <section style={{ marginBottom: '48px', textAlign: 'center' }}>
        <h2 className="section-title" style={{ marginBottom: '32px' }}>Unlock Unlimited Property Pages.</h2>
        <div className="pricing-card" style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '16px', padding: '32px 24px', border: '1px solid var(--border-color)', maxWidth: '380px', margin: '0 auto' }}>
          <h3 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px', color: 'var(--primary-color)' }}>Broker Page System</h3>
          <p style={{ fontSize: '40px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px' }}>150 AED<span style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-secondary)' }}> / month</span></p>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px' }}>Billed Monthly. Cancel Anytime.</p>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '15px', color: 'var(--text-primary)' }}><Check size={20} color="#10B981" />Unlimited Lead-Generating Pages</li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '15px', color: 'var(--text-primary)' }}><Check size={20} color="#10B981" />Free Custom Subdomain (e.g., `yourname.entrestate.com`)</li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '15px', color: 'var(--text-primary)' }}><Check size={20} color="#10B981" />Access to Comprehensive Page Sections</li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '15px', color: 'var(--text-primary)' }}><Check size={20} color="#10B981" />Integrated Lead Capture & Analytics</li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '15px', color: 'var(--text-primary)' }}><Check size={20} color="#10B981" />Multi-language support (Arabic, English, and more)</li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '15px', color: 'var(--text-primary)' }}><Check size={20} color="#10B981" />Dedicated Dashboard for Domain Management</li>
          </ul>
          <button className="primary-button" onClick={onStartBuilding}>Build My Page</button>
        </div>
      </section>

      {/* Cross-sell: “Add Digital Consultant for Instagram” */}
      <section style={{ marginBottom: '48px', textAlign: 'center' }}>
        <h2 className="section-title" style={{ marginBottom: '32px' }}>Maximize Your Lead Capture.</h2>
        <div style={{ backgroundColor: 'var(--bg-accent)', borderRadius: '16px', padding: '32px 24px', border: '1px solid var(--primary-color)', maxWidth: '380px', margin: '0 auto' }}>
          <h3 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px', color: 'var(--text-primary)' }}>Add a Digital Consultant for Instagram</h3>
          <p style={{ fontSize: '16px', color: 'var(--text-secondary)', marginBottom: '16px' }}>Pair your new landing pages with a Digital Consultant to capture inquiries directly from social media.</p>
          <p style={{ fontSize: '32px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '24px' }}>46 AED<span style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-secondary)' }}> / month</span></p>
          <button className="primary-button" onClick={onAddDigitalConsultant} style={{ backgroundColor: '#10B981' }}>Activate Digital Consultant (46 AED)</button>
        </div>
      </section>

      {/* FAQ Section */}
      <section style={{ marginBottom: '48px' }}>
        <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '32px' }}>Common Questions, Clear Answers.</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <AccordionItem
            question="How quickly can I launch a property page?"
            answer="With Entrestate, you can launch a professional, lead-generating property page in minutes. Simply upload your brochure or select from inventory, customize, and publish."
          />
          <AccordionItem
            question="Do I need technical skills or a designer?"
            answer="Absolutely not. Entrestate is built for real estate professionals. Our intuitive system allows you to create stunning pages without any coding or design experience."
          />
          <AccordionItem
            question="Can I use my own domain name?"
            answer="Yes, every page comes with a free subdomain (e.g., yourname.entrestate.com). You can also easily connect your own custom domain name through your dashboard."
          />
          <AccordionItem
            question="Are the pages optimized for mobile?"
            answer="All pages created with Entrestate are automatically responsive and optimized for mobile devices, ensuring a seamless experience for all your visitors."
          />
          <AccordionItem
            question="What kind of lead capture tools are included?"
            answer="Your pages include integrated inquiry forms, direct WhatsApp call-to-action buttons, and detailed analytics to help you capture and understand your leads effectively."
          />
        </div>
      </section>


      <StickyFooter label="Build My Page" onClick={onStartBuilding} />
    </div>
  );
};

// --- Helper Components ---

interface SectionFeatureProps {
  icon: React.ReactNode;
  text: string;
}

const SectionFeature: React.FC<SectionFeatureProps> = ({ icon, text }) => (
  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '15px', color: 'var(--text-primary)' }}>
    <span style={{ color: 'var(--primary-color)', flexShrink: 0 }}>{icon}</span>
    <span>{text}</span>
  </li>
);

interface BeforeAfterCardProps {
  imageUrl: string;
  caption: string;
  type: 'before' | 'after';
}

const BeforeAfterCard: React.FC<BeforeAfterCardProps> = ({ imageUrl, caption, type }) => (
  <div style={{ backgroundColor: 'var(--bg-primary)', borderRadius: '16px', border: '1px solid var(--border-color)', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
    <img src={imageUrl} alt={caption} style={{ width: '100%', height: 'auto', display: 'block' }} />
    <div style={{ padding: '16px', textAlign: 'center' }}>
      <p style={{ fontSize: '15px', fontWeight: '600', color: type === 'before' ? 'var(--text-secondary)' : 'var(--primary-color)', margin: 0 }}>{caption}</p>
    </div>
  </div>
);

interface AccordionItemProps {
  question: string;
  answer: string;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '16px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 24px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          color: 'var(--text-primary)',
          fontSize: '16px',
          fontWeight: '600',
        }}
      >
        {question}
        <span>{isOpen ? '-' : '+'}</span>
      </button>
      {isOpen && (
        <div style={{ padding: '0 24px 16px 24px', borderTop: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '15px' }}>
          {answer}
        </div>
      )}
    </div>
  );
};


export default SiteBuilderSalesFunnel;
