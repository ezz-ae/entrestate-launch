import React, { useState } from 'react';
import StickyFooter from '@/mobile/StickyFooter';
import '@/mobile/mobile-styles.css';
import { Instagram, Link, BookOpen, Check, Shield, DollarSign, MessageCircle, MapPin, FileText, Globe, RefreshCcw, Database } from 'lucide-react';

interface InstagramAssistantSalesFunnelProps {
  onActivateConsultant: () => void;
}

const InstagramAssistantSalesFunnel: React.FC<InstagramAssistantSalesFunnelProps> = ({ onActivateConsultant }) => {
  const [activeFaq, setActiveFaq] = useState<string | null>(null);

  const toggleFaq = (question: string) => {
    setActiveFaq(activeFaq === question ? null : question);
  };

  return (
    <div className="screen-container" style={{ padding: '24px', paddingBottom: '100px' }}>
      {/* 1) Hero Section */}
      <div className="hero-section" style={{ textAlign: 'center', marginBottom: '48px', paddingTop: '24px' }}>
        <h1 className="screen-title" style={{ fontSize: '36px', marginBottom: '16px', fontWeight: '800' }}>Unlock Your Digital Consultant: Instant Buyer Engagement, Constant Lead Flow.</h1>
        <p style={{ fontSize: '18px', color: 'var(--text-secondary)', marginBottom: '32px', lineHeight: '1.5' }}>
          Your dedicated Digital Consultant for Instagram handles inquiries, qualifies leads, and books meetings—seamlessly, 24/7.
        </p>
        <button className="primary-button" onClick={onActivateConsultant}>Activate Your Consultant Today</button>
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '12px' }}>No long-term contracts. Cancel anytime.</p>
      </div>

      {/* 2) 3-step “How it works” */}
      <section style={{ marginBottom: '48px' }}>
        <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '32px' }}>Seamlessly Integrate Your Digital Consultant</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '40px' }}>Get set up in minutes and transform your Instagram into a powerful lead machine.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <StepCard 
            icon={<Instagram size={32} />}
            title="Connect Your Instagram Account"
            description="Securely link your professional Instagram profile. Your consultant will begin monitoring DMs and comments for new inquiries."
            stepNumber={1}
          />
          <StepCard 
            icon={<BookOpen size={32} />}
            title="Teach Your Consultant Your Portfolio"
            description="Upload brochures, property details, and FAQs. Your consultant will learn your specific offerings and communication style."
            stepNumber={2}
          />
          <StepCard 
            icon={<Link size={32} />}
            title="Go Live: Engage Buyers Instantly"
            description="Activate your consultant to respond, qualify prospects, and schedule meetings, ensuring no lead is ever missed."
            stepNumber={3}
          />
        </div>
      </section>

      {/* 3) Live demo section */}
      <section style={{ marginBottom: '48px' }}>
        <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '32px' }}>Experience Instant, Qualified Engagement.</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '40px' }}>Witness how your Digital Consultant transforms casual inquiries into actionable, warm leads.</p>
        
        <div style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '16px', padding: '20px', marginBottom: '24px' }}>
          <div className="chat-transcript" style={{ marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '20px' }}>
            <ChatMessage sender="Buyer" message="Hi, is the Skyline Tower project still available? What are the payment options?" type="incoming" />
            <ChatMessage sender="Consultant" message="Hello! Yes, Skyline Towers has limited availability. Standard payment plans include 30% down, 70% on handover. Would you like to schedule a quick call with a property advisor to discuss tailored options?" type="outgoing" />
            <ChatMessage sender="Buyer" message="Yes, please! This Friday morning works best for me." type="incoming" />
            <ChatMessage sender="Consultant" message="Understood. You'll receive a calendar invite shortly. Looking forward to connecting you with Elite Properties." type="outgoing" />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 16px 0', color: 'var(--text-primary)' }}>Clear Outcomes:</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', color: 'var(--text-primary)' }}><Check size={20} color="var(--primary-color)" />Lead Captured: Buyer expressed strong interest.</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', color: 'var(--text-primary)' }}><Check size={20} color="var(--primary-color)" />Meeting Booked: Qualified prospect scheduled for Friday.</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', color: 'var(--text-primary)' }}><Check size={20} color="var(--primary-color)" />Brand Consistency: Professional, accurate responses every time.</li>
          </ul>
        </div>
      </section>

      {/* 4) “What it knows” section */}
      <section style={{ marginBottom: '48px' }}>
        <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '32px' }}>Your Consultant's Knowledge Base.</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '40px' }}>Empower your Digital Consultant with comprehensive information, ensuring intelligent and informed client interactions.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <FeatureCard 
            icon={<Database size={32} />}
            title="Market Inventory Access"
            description="Connect to real-time property listings and market data for accurate, up-to-date information across multiple languages including Arabic and English."
          />
          <FeatureCard 
            icon={<FileText size={32} />}
            title="Uploaded Brochures & Documents"
            description="Upload property brochures, floor plans, and project details. Your consultant extracts and synthesizes key information for instant recall."
          />
          <FeatureCard 
            icon={<MessageCircle size={32} />}
            title="Custom FAQs & Policies"
            description="Teach your consultant your most common questions, company policies, and special offerings for personalized responses."
          />
        </div>
      </section>

      {/* 5) Trust section */}
      <section style={{ marginBottom: '48px' }}>
        <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '32px' }}>Your Control, Your Brand Integrity.</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '40px' }}>Entrestate supports your business, never replaces you. Your consultant operates with transparency and respect for your brand's reputation.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <TrustPoint 
            icon={<Check size={24} />}
            title="You Retain Full Control"
            description="Manually take over any conversation at any moment, ensuring you're always in command."
          />
          <TrustPoint 
            icon={<Shield size={24} />}
            title="Brand-Safe Communication"
            description="Responses are always aligned with your defined communication style and brand guidelines."
          />
          <TrustPoint 
            icon={<RefreshCcw size={24} />}
            title="No Unsolicited Outreach"
            description="Your consultant only responds to incoming inquiries, never initiates cold contacts."
          />
          <TrustPoint 
            icon={<FileText size={24} />}
            title="Clear Lead Handoff"
            description="Receive instant notifications and detailed transcripts for every qualified lead and booked meeting."
          />
        </div>
      </section>

      {/* 6) Pricing card */}
      <section style={{ marginBottom: '48px', textAlign: 'center' }}>
        <h2 className="section-title" style={{ marginBottom: '32px' }}>Simple Pricing, Powerful Results.</h2>
        <div className="pricing-card" style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '16px', padding: '32px 24px', border: '1px solid var(--border-color)', maxWidth: '380px', margin: '0 auto' }}>
          <h3 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px', color: 'var(--primary-color)' }}>Digital Consultant Pro</h3>
          <p style={{ fontSize: '40px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px' }}>46 AED<span style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-secondary)' }}> / month</span></p>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px' }}>Billed Monthly. Cancel Anytime.</p>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '15px', color: 'var(--text-primary)' }}><Check size={20} color="#10B981" />Unlimited Instagram DM & Comment Handling</li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '15px', color: 'var(--text-primary)' }}><Check size={20} color="#10B981" />Instant Lead Qualification & Meeting Booking</li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '15px', color: 'var(--text-primary)' }}><Check size={20} color="#10B981" />Access to Market Inventory & Data</li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '15px', color: 'var(--text-primary)' }}><Check size={20} color="#10B981" />Customizable Brand Identity & Learning Content</li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '15px', color: 'var(--text-primary)' }}><Check size={20} color="#10B981" />Shareable Chat Link & QR Code</li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '15px', color: 'var(--text-primary)' }}><Check size={20} color="#10B981" />Web Widget & Standalone Chat Page Deployment (Multi-language support: Arabic, English, and more)</li>
          </ul>
          <button className="primary-button" onClick={onActivateConsultant}>Activate Your Consultant Today</button>
        </div>
      </section>

      {/* 7) FAQ */}
      <section style={{ marginBottom: '48px' }}>
        <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '32px' }}>Frequently Asked Questions.</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <FaqItem 
            question="How long does it take to set up my Digital Consultant?"
            answer="Setup is quick and intuitive, typically taking less than 15 minutes. Connect Instagram, teach it your property details, and activate it to go live."
            isActive={activeFaq === "q1"}
            onToggle={() => toggleFaq("q1")}
          />
          <FaqItem 
            question="What languages does the consultant support?"
            answer="Your Digital Consultant communicates fluently in Arabic, English, and numerous other languages, providing truly global reach for your listings."
            isActive={activeFaq === "q2"}
            onToggle={() => toggleFaq("q2")}
          />
          <FaqItem 
            question="How does lead handover work?"
            answer="Upon qualifying a lead or booking a meeting, you receive immediate notifications and a full conversation transcript for seamless follow-up and control."
            isActive={activeFaq === "q3"}
            onToggle={() => toggleFaq("q3")}
          />
          <FaqItem 
            question="Can I share my consultant's chat link or QR code?"
            answer="Absolutely. Every consultant comes with a unique, shareable chat link (agentname.chat.entrestate.com) and a QR code for easy distribution across all your marketing channels."
            isActive={activeFaq === "q4"}
            onToggle={() => toggleFaq("q4")}
          />
          <FaqItem 
            question="What if I need to cancel my subscription?"
            answer="You can cancel your subscription at any time, directly from your dashboard, with no hidden fees or long-term commitments."
            isActive={activeFaq === "q5"}
            onToggle={() => toggleFaq("q5")}
          />
        </div>
      </section>

      <StickyFooter label="Activate Your Consultant Today" onClick={onActivateConsultant} />
    </div>
  );
};

// --- Helper Components for better readability and structure ---

interface StepCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  stepNumber: number;
}

const StepCard: React.FC<StepCardProps> = ({ icon, title, description, stepNumber }) => (
  <div style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '16px', padding: '24px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
    <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>{stepNumber}</div>
    <div style={{ marginBottom: '16px', color: 'var(--primary-color)' }}>{icon}</div>
    <h3 style={{ fontSize: '20px', fontWeight: '700', margin: '0 0 8px 0', color: 'var(--text-primary)' }}>{title}</h3>
    <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{description}</p>
  </div>
);

interface ChatMessageProps {
  sender: string;
  message: string;
  type: 'incoming' | 'outgoing';
}

const ChatMessage: React.FC<ChatMessageProps> = ({ sender, message, type }) => (
  <div style={{ display: 'flex', justifyContent: type === 'incoming' ? 'flex-start' : 'flex-end', marginBottom: '12px' }}>
    <div style={{
      maxWidth: '80%',
      padding: '10px 15px',
      borderRadius: '20px',
      backgroundColor: type === 'incoming' ? '#E5E7EB' : 'var(--primary-color)',
      color: type === 'incoming' ? 'var(--text-primary)' : 'white',
      fontSize: '14px',
      lineHeight: '1.4',
    }}>
      <span style={{ fontWeight: 'bold', marginRight: '5px' }}>{sender}:</span>{message}
    </div>
  </div>
);

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <div style={{ backgroundColor: 'var(--bg-primary)', borderRadius: '16px', padding: '24px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
    <div style={{ marginBottom: '16px', color: 'var(--primary-color)' }}>{icon}</div>
    <h3 style={{ fontSize: '20px', fontWeight: '700', margin: '0 0 8px 0', color: 'var(--text-primary)' }}>{title}</h3>
    <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{description}</p>
  </div>
);

interface TrustPointProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const TrustPoint: React.FC<TrustPointProps> = ({ icon, title, description }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', backgroundColor: 'var(--bg-secondary)', borderRadius: '12px', padding: '20px', border: '1px solid var(--border-color)' }}>
    <div style={{ color: 'var(--primary-color)', flexShrink: 0 }}>{icon}</div>
    <div>
      <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 6px 0', color: 'var(--text-primary)' }}>{title}</h3>
      <p style={{ fontSize: '15px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>{description}</p>
    </div>
  </div>
);

interface FaqItemProps {
  question: string;
  answer: string;
  isActive: boolean;
  onToggle: () => void;
}

const FaqItem: React.FC<FaqItemProps> = ({ question, answer, isActive, onToggle }) => (
  <div style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
    <button 
      onClick={onToggle}
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 20px',
        background: 'none',
        border: 'none',
        color: 'var(--text-primary)',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        textAlign: 'left'
      }}
    >
      {question}
      <span style={{ fontSize: '24px', transform: isActive ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>
        ▼
      </span>
    </button>
    {isActive && (
      <div style={{ padding: '0 20px 16px 20px', fontSize: '15px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
        {answer}
      </div>
    )}
  </div>
);

export default InstagramAssistantSalesFunnel;
