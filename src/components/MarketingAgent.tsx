import React, { useState, useRef, useEffect } from 'react';
import TemplateCard from './TemplateCard';

interface Template {
  id: number;
  title: string;
  category: string;
  image: string | null;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  templates?: Template[];
}

interface MarketingAgentProps {
  onTemplateSelect?: (template: Template) => void;
}

const MarketingAgent: React.FC<MarketingAgentProps> = ({ onTemplateSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your Vertex Marketing Agent. I can help you analyze data, draft campaigns, or suggest templates. How can I assist you?",
      sender: 'agent'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestions = [
    "Show me templates",
    "Analyze market",
    "Draft email",
    "Optimize ads"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleClearChat = () => {
    setMessages([{
      id: Date.now().toString(),
      text: "Chat cleared. How can I help you now?",
      sender: 'agent'
    }]);
  };

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || inputText;
    if (!textToSend.trim()) return;

    setMessages(prev => [...prev, { id: Date.now().toString(), text: textToSend, sender: 'user' }]);
    setInputText('');
    setIsTyping(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      let responseText = "I can certainly help with that.";
      let suggestedTemplates: Template[] | undefined = undefined;

      const lowerText = textToSend.toLowerCase();

      if (lowerText.includes("template") || lowerText.includes("design") || lowerText.includes("website")) {
         responseText = "Based on your request, here are some high-converting templates that match your criteria:";
         suggestedTemplates = [
            { id: 1, title: "Modern Brokerage", category: "Broker", image: null },
            { id: 2, title: "Luxury Villa Showcase", category: "Luxury", image: null }
         ];
      } else if (lowerText.includes("price") || lowerText.includes("market")) {
         responseText = "I've analyzed the market data for Downtown Dubai. Prices have increased by 2.5% in the last quarter. Demand for 2-bedroom units is high.";
      } else if (lowerText.includes("email")) {
         responseText = "Here is a draft for your email campaign:\n\nSubject: Exclusive Opportunity in Downtown\n\nDear [Name],\n\nI came across a property that perfectly matches your investment criteria...";
      } else {
         responseText = "I've received your request. Would you like me to draft a campaign or show you some designs?";
      }

      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        text: responseText, 
        sender: 'agent',
        templates: suggestedTemplates
      }]);

    } catch (error) {
      console.error("Agent Error:", error);
      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        text: "I'm having trouble connecting to the server. Please try again.", 
        sender: 'agent' 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        className="marketing-agent-fab"
        onClick={() => setIsOpen(true)}
        aria-label="Open Marketing Agent"
      >
        🤖
      </button>
    );
  }

  return (
    <div className="marketing-agent-container">
      <div className="marketing-agent-header">
        <h3>Vertex Agent</h3>
        <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={handleClearChat} style={{ fontSize: '14px' }} title="Clear Chat">🗑️</button>
            <button onClick={() => setIsOpen(false)} title="Close">×</button>
        </div>
      </div>
      
      <div className="marketing-agent-messages">
        {messages.map(msg => (
          <div key={msg.id} className={`message ${msg.sender}`}>
            <div className="message-bubble">
              {msg.text.split('\n').map((line, i) => <div key={i}>{line}</div>)}
            </div>
            {msg.templates && msg.templates.length > 0 && (
              <div className="message-templates">
                {msg.templates.map(template => (
                  <div key={template.id} className="chat-template-wrapper">
                    <TemplateCard 
                        title={template.title} 
                        category={template.category} 
                        image={template.image} 
                        onSelect={() => {
                            if (onTemplateSelect) {
                                onTemplateSelect(template);
                                setIsOpen(false);
                            }
                        }} 
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        {isTyping && (
          <div className="message agent">
            <div className="message-bubble typing">
              <span>•</span><span>•</span><span>•</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="suggestions-row">
        {suggestions.map(s => (
            <button key={s} className="suggestion-chip" onClick={() => handleSend(s)}>
                {s}
            </button>
        ))}
      </div>

      <div className="marketing-agent-input">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask me anything..."
        />
        <button onClick={() => handleSend()}>➤</button>
      </div>
    </div>
  );
};

export default MarketingAgent;