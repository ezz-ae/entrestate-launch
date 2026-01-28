import React, { useState } from 'react';
import { X, ArrowRight, Users, Target, Check, CheckCircle, Loader } from 'lucide-react';

const SIZE_MAP = ['1%', '2%', '3%', '5%', '10%'];

const Step1Source = ({ source, onChange }) => (
  <div className="space-y-4">
    <h3 className="text-xl font-bold text-gray-800">Select Source Leads</h3>
    <p className="text-gray-500 text-sm">Choose the set of accepted leads to build your lookalike audience from.</p>
    <div className="space-y-3">
      <label className={`block p-4 border rounded-lg cursor-pointer ${source === 'high_score' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'}`}>
        <input type="radio" name="source" value="high_score" checked={source === 'high_score'} onChange={(e) => onChange(e.target.value)} className="hidden" />
        <p className="font-bold">High-Scoring Leads (Recommended)</p>
        <p className="text-sm text-gray-500">Based on leads with a quality score over 75.</p>
      </label>
      <label className={`block p-4 border rounded-lg cursor-pointer ${source === 'facebook' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'}`}>
        <input type="radio" name="source" value="facebook" checked={source === 'facebook'} onChange={(e) => onChange(e.target.value)} className="hidden" />
        <p className="font-bold">Facebook Leads</p>
        <p className="text-sm text-gray-500">Based on all accepted leads from Facebook Ads.</p>
      </label>
    </div>
  </div>
);

const Step2Size = ({ size, onChange }) => (
  <div className="space-y-4">
    <h3 className="text-xl font-bold text-gray-800">Define Audience Size</h3>
    <p className="text-gray-500 text-sm">A smaller percentage is more similar to your source leads (higher precision), while a larger percentage increases your reach.</p>
    <div className="pt-4">
      <div className="flex justify-between mb-2">
        <label className="font-medium text-gray-700">Audience Size</label>
        <span className="font-bold text-indigo-600 text-lg">{SIZE_MAP[size]}</span>
      </div>
      <input type="range" min="0" max="4" step="1" value={size} onChange={(e) => onChange(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
      <div className="flex justify-between text-xs text-gray-400 mt-2">
        <span>Most Similar</span>
        <span>Broader Reach</span>
      </div>
    </div>
  </div>
);

const Step3Review = ({ source, size }) => (
  <div className="space-y-4">
    <h3 className="text-xl font-bold text-gray-800">Review & Create</h3>
    <div className="bg-gray-50 p-4 rounded-lg space-y-3 border border-gray-200">
      <div className="flex justify-between items-center border-b pb-2">
        <span className="text-gray-500 flex items-center gap-2"><Users size={16} /> Source</span>
        <span className="font-medium">{source === 'high_score' ? 'High-Scoring Leads' : 'Facebook Leads'}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-gray-500 flex items-center gap-2"><Target size={16} /> Size</span>
        <span className="font-medium">{SIZE_MAP[size]} of UAE Population</span>
      </div>
    </div>
    <p className="text-xs text-gray-500 text-center">This audience will be available in your Google & Facebook Ads managers within 24 hours.</p>
  </div>
);

const Step4Success = () => (
  <div className="text-center py-8 flex flex-col items-center">
    <CheckCircle className="text-green-500 mb-4" size={64} strokeWidth={1.5} />
    <h3 className="text-xl font-bold text-gray-800">Audience Created!</h3>
    <p className="text-gray-500 text-sm mt-2 max-w-sm mx-auto">
      Your new lookalike audience is being processed. It will be available in your ad platforms shortly.
    </p>
  </div>
);

const LookalikeBuilderWizard = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [source, setSource] = useState('high_score');
  const [size, setSize] = useState(2); // Corresponds to 3%
  const [isCreating, setIsCreating] = useState(false);

  const totalSteps = 4;

  const nextStep = () => setStep(prev => Math.min(prev + 1, totalSteps));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleCreate = async () => {
    if (isCreating) return;
    setIsCreating(true);
    console.log(`Creating audience: Source=${source}, Size=${SIZE_MAP[size]}`);
    // Simulate API call to your backend
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsCreating(false);
    nextStep(); // Go to success step
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh]">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-lg font-bold">Lookalike Audience Builder</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X /></button>
        </div>
        <div className="p-8 flex-1 overflow-y-auto">
          {step === 1 && <Step1Source source={source} onChange={setSource} />}
          {step === 2 && <Step2Size size={size} onChange={setSize} />}
          {step === 3 && <Step3Review source={source} size={size} />}
          {step === 4 && <Step4Success />}
        </div>
        <div className="p-6 border-t bg-gray-50 flex justify-between items-center">
          {step > 1 && step < totalSteps ? (
            <button onClick={prevStep} className="text-gray-600 font-medium hover:text-gray-900">Back</button>
          ) : <div />}
          
          {step < 3 ? (
            <button onClick={nextStep} className="bg-indigo-600 text-white font-medium px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2">
              Next <ArrowRight size={18} />
            </button>
          ) : step === 3 ? (
            <button onClick={handleCreate} disabled={isCreating} className="bg-green-600 text-white font-medium px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:bg-green-400 disabled:cursor-wait">
              {isCreating ? <><Loader size={18} className="animate-spin" /> Creating...</> : <><Check size={18} /> Create Audience</>}
            </button>
          ) : (
            <button onClick={onClose} className="bg-indigo-600 text-white font-medium px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors w-full">Done</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LookalikeBuilderWizard;
