import React, { useState, useEffect } from 'react';
import { Home, Users, Calendar, TrendingUp, Bell, Search, Menu, ArrowRight, Layout, MessageSquare, Megaphone, FileText, Upload, AlertCircle, Check, Loader } from 'lucide-react';
import { supabase } from './supabaseClient';
import AddListingWizard from './AddListingWizard';
import LeadValidator from './LeadValidator';
import LookalikeBuilderWizard from './LookalikeBuilderWizard';

const Dashboard = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isWizardOpen, setWizardOpen] = useState(false);
  const [isLookalikeWizardOpen, setLookalikeWizardOpen] = useState(false);
  const [listings, setListings] = useState([]);
  const [validationLeads, setValidationLeads] = useState([]);
  const [isLoadingLeads, setIsLoadingLeads] = useState(true);
  const [acceptedLeadsCount, setAcceptedLeadsCount] = useState(0);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'builder', 'leads', 'chat', 'ads'

  useEffect(() => {
    fetchListings();
    fetchValidationLeads();
    fetchAcceptedLeadsCount();
  }, []);

  const fetchListings = async () => {
    try {
      let { data, error } = await supabase
        .from('listings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      if (data) setListings(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchValidationLeads = async () => {
    setIsLoadingLeads(true);
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('status', 'New')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setValidationLeads(data);
    } catch (error) {
      console.error('Error fetching validation leads:', error.message);
    } finally {
      setIsLoadingLeads(false);
    }
  };

  const fetchAcceptedLeadsCount = async () => {
    try {
      const { count, error } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'accepted');

      if (error) throw error;
      setAcceptedLeadsCount(count || 0);
    } catch (error) {
      console.error('Error fetching accepted leads count:', error.message);
    }
  };

  const handleAcceptLead = async (id) => {
    // Optimistic UI update
    setValidationLeads(currentLeads => currentLeads.filter(lead => lead.id !== id));
    setAcceptedLeadsCount(prevCount => prevCount + 1);

    const { error } = await supabase.from('leads').update({ status: 'accepted' }).eq('id', id);
    if (error) {
      console.error('Error accepting lead:', error.message);
      // Optional: Revert UI on error
      fetchValidationLeads();
      fetchAcceptedLeadsCount();
    }
  };

  const handleRejectLead = async (id) => {
    setValidationLeads(currentLeads => currentLeads.filter(lead => lead.id !== id));
    const { error } = await supabase.from('leads').update({ status: 'rejected' }).eq('id', id);
    if (error) console.error('Error rejecting lead:', error.message);
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-800 relative overflow-hidden">
      {isWizardOpen && (
        <AddListingWizard 
          onClose={() => setWizardOpen(false)} 
          onListingAdded={() => { fetchListings(); setWizardOpen(false); }} 
        />
      )}

      {isLookalikeWizardOpen && (
        <LookalikeBuilderWizard
          onClose={() => setLookalikeWizardOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-xl transition-all duration-300 flex flex-col z-20`}>
        <div className="p-6 flex items-center justify-between">
          <span className={`font-bold text-xl text-indigo-600 ${!isSidebarOpen && 'hidden'}`}>Entrestate</span>
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-1 hover:bg-gray-100 rounded">
            <Menu size={20} />
          </button>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <NavItem icon={Home} label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} isOpen={isSidebarOpen} />
          <NavItem icon={Layout} label="Site Builder" active={activeTab === 'builder'} onClick={() => setActiveTab('builder')} isOpen={isSidebarOpen} />
          <NavItem icon={Users} label="Lead Pipe" active={activeTab === 'leads'} onClick={() => setActiveTab('leads')} isOpen={isSidebarOpen} />
          <NavItem icon={MessageSquare} label="Chat Agent" active={activeTab === 'chat'} onClick={() => setActiveTab('chat')} isOpen={isSidebarOpen} />
          <NavItem icon={Megaphone} label="Google Ads" active={activeTab === 'ads'} onClick={() => setActiveTab('ads')} isOpen={isSidebarOpen} />
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <header className="bg-white shadow-sm p-6 flex justify-between items-center sticky top-0 z-10">
          <h1 className="text-2xl font-bold text-gray-800 capitalize">{activeTab.replace(/([A-Z])/g, ' $1').trim()}</h1>
          <div className="flex items-center gap-4">
            {activeTab === 'overview' && (
              <button onClick={() => setWizardOpen(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
                + Add Listing
              </button>
            )}
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <QuickAction label="Add Listing" icon="+" color="bg-blue-50 text-blue-600" onClick={() => setWizardOpen(true)} />
                  <QuickAction label="New Client" icon="+" color="bg-green-50 text-green-600" />
                  <QuickAction label="Create Campaign" icon="+" color="bg-purple-50 text-purple-600" onClick={() => setActiveTab('ads')} />
                  <QuickAction label="Build Site" icon="+" color="bg-orange-50 text-orange-600" onClick={() => setActiveTab('builder')} />
                </div>
              </section>

              <section>
                <h2 className="text-lg font-bold mb-4">Recent Listings</h2>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                      <tr>
                        <th className="px-6 py-4 font-medium">Address</th>
                        <th className="px-6 py-4 font-medium">Price</th>
                        <th className="px-6 py-4 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {listings.length === 0 ? (
                        <tr><td colSpan="3" className="p-8 text-center text-gray-500">No listings found. Click "Add Listing" to start.</td></tr>
                      ) : (
                        listings.map((listing) => (
                          <tr key={listing.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium">{listing.address}</td>
                            <td className="px-6 py-4 text-green-600 font-medium">${listing.price}</td>
                            <td className="px-6 py-4"><span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">Active</span></td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          )}

          {/* 1. Builder UX Repairs */}
          {activeTab === 'builder' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
                  <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Layout size={32} />
                  </div>
                  <h2 className="text-xl font-bold mb-2">Start New Project</h2>
                  <p className="text-gray-500 mb-6">Create a high-converting landing page in minutes.</p>
                  <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                    <button className="p-4 border rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all text-left group">
                      <span className="font-bold block group-hover:text-indigo-600">Use Template</span>
                      <span className="text-xs text-gray-400">Choose from gallery</span>
                    </button>
                    <button className="p-4 border rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all text-left group">
                      <span className="font-bold block group-hover:text-indigo-600">AI Generator</span>
                      <span className="text-xs text-gray-400">Build from text</span>
                    </button>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="font-bold mb-4">Recent Drafts</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg opacity-60">
                      <div className="w-10 h-10 bg-gray-200 rounded"></div>
                      <div>
                        <p className="font-medium text-sm">Dubai Hills Villa</p>
                        <p className="text-xs text-gray-400">Edited 2 days ago</p>
                      </div>
                    </div>
                    <div className="text-center text-sm text-gray-400 py-4">No other drafts</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. Lead Pipe UX Repairs */}
          {activeTab === 'leads' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <LeadValidator 
                    leads={validationLeads}
                    loading={isLoadingLeads}
                    onRejectLead={handleRejectLead}
                  />
                </div>
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-bold mb-4 flex items-center gap-2"><Upload size={18} /> Ingestion Sources</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-green-50 text-green-700 rounded-lg text-sm">
                        <span>Facebook Ads</span> <span className="font-bold">Active</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 text-gray-500 rounded-lg text-sm">
                        <span>Google Ads</span> <span>Not Configured</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setLookalikeWizardOpen(true)}
                    disabled={acceptedLeadsCount < 5}
                    className="w-full bg-gradient-to-br from-indigo-600 to-purple-700 text-white p-6 rounded-xl shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                  >
                    <div className="text-left">
                      <h3 className="font-bold mb-2">Lookalike Builder</h3>
                      <p className="text-indigo-100 text-sm mb-4">Unlock AI audience targeting when you reach 5 accepted leads.</p>
                    </div>
                    <div className="w-full bg-white/20 h-2 rounded-full mb-2">
                      <div className="bg-white h-full rounded-full" style={{ width: `${(acceptedLeadsCount / 5) * 100}%` }}></div>
                    </div>
                    <p className="text-xs text-right">{acceptedLeadsCount}/5 Leads</p>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 3. Chat Agent UX Repairs */}
          {activeTab === 'chat' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold mb-6">Knowledge Base Configuration</h2>
                
                {/* PDF Upload State Demo */}
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                      <FileText size={24} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="font-medium text-sm">Brochure_v2.pdf</span>
                        <span className="text-xs text-blue-600 font-bold">Analyzing...</span>
                      </div>
                      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-blue-600 h-full w-[65%] animate-pulse"></div>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-red-500"><AlertCircle size={20} /></button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Embed Code</label>
                    <textarea readOnly className="w-full p-3 bg-gray-50 border rounded-lg text-xs font-mono text-gray-600 h-24" value="<script src='https://entrestate.com/chat/v1.js' data-id='123'></script>" />
                  </div>
                  <div className="flex items-center justify-center bg-gray-50 rounded-lg border">
                    <div className="text-center">
                      <div className="w-24 h-24 bg-white mx-auto mb-2 p-2 shadow-sm"><div className="w-full h-full bg-gray-900"></div></div>
                      <button className="text-xs text-indigo-600 font-bold hover:underline">Download QR Code</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. Google Ads Plan UX Repairs */}
          {activeTab === 'ads' && (
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold mb-6">Campaign Budget Planner</h2>
              
              <div className="mb-8">
                <div className="flex justify-between mb-2">
                  <label className="font-medium text-gray-700">Daily Budget</label>
                  <span className="font-bold text-indigo-600 text-lg">AED 150/day</span>
                </div>
                <input type="range" min="50" max="500" step="10" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                <div className="flex justify-between text-xs text-gray-400 mt-2">
                  <span>Min: AED 50</span>
                  <span>Max: AED 500</span>
                </div>
              </div>

              <div className="bg-indigo-50 rounded-xl p-6 mb-8 grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-indigo-900">~45</div>
                  <div className="text-xs text-indigo-600 uppercase font-bold tracking-wide">Clicks</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-indigo-900">~8</div>
                  <div className="text-xs text-indigo-600 uppercase font-bold tracking-wide">Leads</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-indigo-900">AED 18</div>
                  <div className="text-xs text-indigo-600 uppercase font-bold tracking-wide">Cost/Lead</div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t">
                <div>
                  <p className="font-bold text-gray-900">Total Prepaid: AED 4,500</p>
                  <p className="text-xs text-gray-500">For 30 days duration</p>
                </div>
                <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-green-200 transition-all">
                  Confirm & Launch
                </button>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

// --- Helper Components ---

const NavItem = ({ icon: Icon, label, active, onClick, isOpen }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors mb-1
      ${active ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
  >
    <Icon size={20} />
    {isOpen && <span className="font-medium text-sm">{label}</span>}
  </button>
);

const QuickAction = ({ label, icon, color, onClick }) => (
  <button onClick={onClick} className={`${color} p-4 rounded-xl font-medium text-sm hover:opacity-80 transition-opacity flex flex-col items-center justify-center gap-2 h-24 shadow-sm`}>
    <span className="text-2xl">{icon}</span>
    {label}
  </button>
);

export default Dashboard;