import React, { useState } from 'react';
import { MessageSquare, CheckCircle, Smartphone, Globe, Shield, ArrowRight, X, Zap, Filter, Link as LinkIcon, QrCode, Lock, Play, ScanEye, FileText } from 'lucide-react';

const ChatAgentFunnel = () => {
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      {/* 1. Hero Section */}
      <header className="relative overflow-hidden bg-gray-900 text-white pt-24 pb-32 lg:pt-32 lg:pb-40">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20">
           <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-indigo-600 blur-[120px]"></div>
           <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-emerald-500 blur-[100px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-sm font-medium backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              Live AI Sales Agent
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight tracking-tight">
              Your 24/7 Real Estate <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">Sales Partner</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-lg leading-relaxed">
              Automate conversations, qualify buyers, and book viewings instantly. Works on Instagram, WhatsApp, and your Website—powered by real-time market inventory.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-900/50 hover:scale-105">
                Start Your AI Agent <ArrowRight size={20} />
              </button>
              <button onClick={() => setDemoOpen(true)} className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-8 py-4 rounded-2xl font-bold text-lg backdrop-blur-sm transition-all flex items-center justify-center gap-2">
                <Play size={18} fill="currentColor" /> See Demo
              </button>
            </div>
            <p className="text-sm text-gray-500">46 AED/month • No setup fees • Cancel anytime</p>
          </div>

          {/* Hero Widget Preview - Phone Mockup */}
          <div className="relative mx-auto lg:ml-auto w-full max-w-md">
             <div className="relative bg-gray-800 rounded-[3rem] border-8 border-gray-900 shadow-2xl overflow-hidden">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/3 h-6 bg-gray-900 rounded-b-xl z-20"></div>
                <div className="bg-gray-50 h-[600px] w-full flex flex-col">
                   {/* Chat Header */}
                   <div className="bg-white p-4 pt-12 border-b flex items-center gap-3 shadow-sm z-10">
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">AI</div>
                      <div>
                         <p className="font-bold text-sm text-gray-900">Sarah (Agent)</p>
                         <p className="text-xs text-green-600 flex items-center gap-1">● Online</p>
                      </div>
                   </div>
                   {/* Chat Body */}
                   <div className="flex-1 p-4 space-y-4 overflow-hidden relative">
                      <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm max-w-[85%] text-sm text-gray-700">
                         Hi! I can help you find properties in Dubai Hills. Looking for a 3BR?
                      </div>
                      <div className="bg-indigo-600 text-white p-3 rounded-2xl rounded-tr-none shadow-sm max-w-[85%] ml-auto text-sm">
                         Yes, what is the starting price?
                      </div>
                      <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm max-w-[85%] text-sm text-gray-700">
                         3BR units in <span className="font-bold text-indigo-600">Park Heights</span> start at <span className="font-bold text-indigo-600">AED 1.8M</span>. Would you like to see the floor plan?
                      </div>
                      
                      {/* Notification Pop */}
                      <div className="absolute bottom-4 left-4 right-4 bg-gray-900/90 backdrop-blur-md text-white p-3 rounded-xl shadow-xl flex items-center gap-3 animate-in slide-in-from-bottom-4 fade-in duration-700 delay-1000">
                         <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center"><CheckCircle size={16} /></div>
                         <div>
                            <p className="text-xs font-bold">Lead Qualified</p>
                            <p className="text-[10px] text-gray-300">Budget: 1.8M • Location: Dubai Hills</p>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </header>

      {/* 2. How It Works */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
           <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
           <p className="text-gray-500 max-w-2xl mx-auto">Setup takes less than 2 minutes. No coding required.</p>
        </div>
        <div className="grid md:grid-cols-4 gap-8">
           {[
              { icon: LinkIcon, title: "Connect", text: "Link your Instagram or paste the widget on your site in one click." },
              { icon: MessageSquare, title: "Engage", text: "The agent greets every visitor instantly, in their native language." },
              { icon: Filter, title: "Qualify", text: "It asks the right questions: Budget, Location, Timeline, and Intent." },
              { icon: CheckCircle, title: "Close", text: "Qualified leads are saved to your pipeline. You just step in to close." }
           ].map((step, i) => (
              <div key={i} className="relative group">
                 <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                    <step.icon size={32} />
                 </div>
                 <h3 className="text-xl font-bold mb-3 text-gray-900">{step.title}</h3>
                 <p className="text-gray-500 leading-relaxed text-sm">{step.text}</p>
                 {i < 3 && <div className="hidden md:block absolute top-8 right-[-20%] w-[40%] h-[2px] bg-gray-100"></div>}
              </div>
           ))}
        </div>
      </section>

      {/* 3. Comparison Section */}
      <section className="py-24 bg-gray-50 px-6">
         <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
               <h2 className="text-3xl font-bold text-gray-900 mb-4">Not Just Another Chatbot</h2>
               <p className="text-gray-500">Why top brokers choose Entrestate over generic AI.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
               {/* Generic Bot */}
               <div className="bg-white p-8 rounded-3xl border border-gray-200 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                  <h3 className="text-xl font-bold text-gray-500 mb-6 flex items-center gap-2"><X className="text-red-400" /> Generic Chatbots</h3>
                  <ul className="space-y-4">
                     <li className="flex items-start gap-3 text-gray-500"><X size={18} className="mt-1 text-red-300 shrink-0" /> "Sorry, I didn't get that."</li>
                     <li className="flex items-start gap-3 text-gray-500"><X size={18} className="mt-1 text-red-300 shrink-0" /> Empty shell. Knows nothing about property.</li>
                     <li className="flex items-start gap-3 text-gray-500"><X size={18} className="mt-1 text-red-300 shrink-0" /> Just collects emails (glorified form).</li>
                     <li className="flex items-start gap-3 text-gray-500"><X size={18} className="mt-1 text-red-300 shrink-0" /> Robotic & cold tone.</li>
                  </ul>
               </div>
               {/* Entrestate Bot */}
               <div className="bg-white p-8 rounded-3xl border-2 border-indigo-100 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">RECOMMENDED</div>
                  <h3 className="text-xl font-bold text-indigo-900 mb-6 flex items-center gap-2"><CheckCircle className="text-green-500" /> Entrestate Agent</h3>
                  <ul className="space-y-4">
                     <li className="flex items-start gap-3 text-gray-800"><CheckCircle size={18} className="mt-1 text-green-500 shrink-0" /> <strong>Context Aware:</strong> Understands real estate jargon.</li>
                     <li className="flex items-start gap-3 text-gray-800"><CheckCircle size={18} className="mt-1 text-green-500 shrink-0" /> <strong>Inventory Expert:</strong> Knows 3,000+ projects details.</li>
                     <li className="flex items-start gap-3 text-gray-800"><CheckCircle size={18} className="mt-1 text-green-500 shrink-0" /> <strong>Qualifies Intent:</strong> Asks budget, timeline & purpose.</li>
                     <li className="flex items-start gap-3 text-gray-800"><CheckCircle size={18} className="mt-1 text-green-500 shrink-0" /> <strong>Human-like:</strong> Professional, persuasive & multilingual.</li>
                  </ul>
               </div>
            </div>
         </div>
      </section>

      {/* 4. Lead Quality Focus */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
         <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
               <h2 className="text-3xl font-bold text-gray-900 mb-6">Stop Wasting Time on "Hi"</h2>
               <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Your time is expensive. Let the AI Agent filter out the window shoppers. It validates contact details and gauges seriousness before you ever lift a finger.
               </p>
               <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
                  <p className="text-indigo-900 font-medium flex items-center gap-2">
                     <Zap className="text-indigo-600" /> Brokers save an average of 15 hours/week on initial screening.
                  </p>
               </div>
            </div>
            <div className="relative">
               {/* Visual Funnel */}
               <div className="flex flex-col items-center space-y-2">
                  <div className="w-full bg-gray-100 p-4 rounded-xl text-center text-gray-400 text-sm">100 Casual Browsers</div>
                  <div className="w-3/4 bg-gray-200 p-4 rounded-xl text-center text-gray-500 text-sm">40 Engaged Chats</div>
                  <div className="w-1/2 bg-indigo-100 p-4 rounded-xl text-center text-indigo-600 font-bold text-sm border border-indigo-200">15 Qualified Leads</div>
                  <div className="w-1/4 bg-emerald-500 p-4 rounded-xl text-center text-white font-bold shadow-lg shadow-emerald-200">5 Deals</div>
               </div>
            </div>
         </div>
      </section>

      {/* 5. Deployment Everywhere */}
      <section className="py-24 bg-gray-900 text-white px-6">
         <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
               <h2 className="text-3xl font-bold mb-4">One Agent. Everywhere.</h2>
               <p className="text-gray-400">Capture leads wherever they find you.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
               <DeploymentCard icon={Smartphone} title="Instagram DM" tag="Popular" desc="Auto-reply to DMs instantly. Never leave a lead on 'Read'." />
               <DeploymentCard icon={Globe} title="Website Widget" tag="Web" desc="A floating chat bubble for your personal brand website." />
               <DeploymentCard icon={LinkIcon} title="Direct Link" tag="Social" desc="agent.entrestate.com/you. Perfect for your bio." />
               <DeploymentCard icon={QrCode} title="QR Code" tag="Offline" desc="Print on flyers. Scans open a direct chat with your AI." />
            </div>
         </div>
      </section>

      {/* 6. Pricing */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12 text-gray-900">Simple, Transparent Pricing</h2>
          <div className="bg-white text-gray-900 rounded-[2rem] p-8 md:p-12 shadow-2xl border border-gray-100 max-w-lg mx-auto relative overflow-hidden group hover:border-indigo-500 transition-colors duration-300">
            <div className="absolute top-0 right-0 bg-indigo-600 text-white text-xs font-bold px-4 py-2 rounded-bl-2xl">BEST VALUE</div>
            <h3 className="text-xl font-medium text-gray-500 mb-2">Agent Pro</h3>
            <div className="flex items-baseline justify-center gap-1 mb-8">
              <span className="text-6xl font-bold tracking-tight">46</span>
              <span className="text-2xl font-bold text-gray-400">AED</span>
              <span className="text-gray-400">/month</span>
            </div>
            <ul className="space-y-4 text-left mb-10 pl-4">
              {['Your Personal AI Agent', 'Access to 3,750+ Projects', 'Unlimited Conversations', 'Instagram & Web Integration', 'Lead Qualification & Export', '24/7 Support'].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                     <CheckCircle className="text-green-600 w-4 h-4" />
                  </div>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
            <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transform hover:-translate-y-1">
              Activate My Agent
            </button>
            <p className="text-xs text-gray-400 mt-4">14-day money-back guarantee. Cancel anytime.</p>
          </div>
        </div>
      </section>

      {/* 7. Trust & Control */}
      <section className="py-24 bg-gray-50 px-6">
         <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-12">You Are Always in Control</h2>
            <div className="grid md:grid-cols-3 gap-8">
               <div className="p-6 bg-white rounded-2xl shadow-sm">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4"><ScanEye size={24} /></div>
                  <h3 className="font-bold mb-2">Monitor Live</h3>
                  <p className="text-sm text-gray-500">Watch conversations happen in real-time from your dashboard.</p>
               </div>
               <div className="p-6 bg-white rounded-2xl shadow-sm">
                  <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center mx-auto mb-4"><Lock size={24} /></div>
                  <h3 className="font-bold mb-2">Take Over</h3>
                  <p className="text-sm text-gray-500">Jump into a chat whenever you want. The AI pauses immediately.</p>
               </div>
               <div className="p-6 bg-white rounded-2xl shadow-sm">
                  <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4"><FileText size={24} /></div>
                  <h3 className="font-bold mb-2">Custom Knowledge</h3>
                  <p className="text-sm text-gray-500">Upload your own PDFs or exclusive listings for the AI to prioritize.</p>
               </div>
            </div>
         </div>
      </section>

      {/* 8. Final CTA */}
      <section className="py-32 bg-indigo-900 text-white px-6 text-center relative overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
         <div className="relative z-10 max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Never Miss a Commission Again.</h2>
            <p className="text-xl text-indigo-200 mb-10 max-w-2xl mx-auto">Your competitors are sleeping. Your AI agent isn't. Capture every lead, day or night.</p>
            <button className="bg-white text-indigo-900 px-10 py-5 rounded-2xl font-bold text-xl hover:bg-indigo-50 transition-all shadow-2xl hover:scale-105">
               Start Your AI Agent Now
            </button>
            <p className="text-sm text-indigo-300 mt-6">Setup takes less than 2 minutes.</p>
         </div>
      </section>

      {/* Demo Modal */}
      {demoOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-2xl overflow-hidden flex flex-col max-h-[80vh] shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-900">Live Demo Simulator</h3>
              <button onClick={() => setDemoOpen(false)} className="p-2 hover:bg-gray-200 rounded-full"><X size={20} /></button>
            </div>
            <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-gray-100">
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md">AI</div>
                <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm max-w-[80%] text-sm text-gray-800">
                  Hello! I'm your demo agent. Ask me about "Dubai Hills" or "Payment Plans".
                </div>
              </div>
            </div>
            <div className="p-4 bg-white border-t">
              <div className="flex gap-2">
                <input className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Type a question..." />
                <button className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-indigo-700 transition-colors">Send</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper Components
const DeploymentCard = ({ icon: Icon, title, tag, desc }) => (
   <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 hover:border-indigo-500 transition-colors group">
      <div className="flex justify-between items-start mb-4">
         <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
            <Icon size={20} />
         </div>
         <span className="text-[10px] font-bold bg-gray-700 text-gray-300 px-2 py-1 rounded uppercase tracking-wide">{tag}</span>
      </div>
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
   </div>
);

export default ChatAgentFunnel;
