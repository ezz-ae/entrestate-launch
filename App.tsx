import React, { useState } from 'react';
import MyProjectsScreen from './MyProjectsScreen';
import UniversalInputsScreen from './UniversalInputsScreen';
import LoadingScreen from './LoadingScreen';
import TemplateLibraryScreen from './TemplateLibraryScreen';
import SuccessScreen from './SuccessScreen';
import PaymentScreen from './PaymentScreen';
import LoginScreen from './LoginScreen';
import IntentSelectionScreen from './IntentSelectionScreen';
import SettingsScreen from './SettingsScreen';
import ToastNotification from '@/components/ToastNotification';
import ProgressBar from '@/components/ProgressBar';
import MarketingAgent from '@/components/MarketingAgent';
import './mobile-styles.css';

interface Toast {
  message: string;
}

const App = () => {
  // Simple State Machine: 'home' | 'inputs' | 'loading' | 'success'
  const [currentScreen, setCurrentScreen] = useState<string>('login');
  const [projectData, setProjectData] = useState<any>(null);
  const [toast, setToast] = useState<Toast | null>(null); // { message: string } or null
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [selectedIntent, setSelectedIntent] = useState<string | null>(null);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // --- Navigation Handlers ---

  const handleLogin = (userData: any) => {
    console.log("User Logged In:", userData);
    setToast({ message: `Welcome, ${userData.name || 'Agent'}!` });
    setCurrentScreen('intent'); // Go to Start Here screen
  };

  const handleStartNew = () => {
    setCurrentScreen('intent');
  };

  const handleIntentSelect = (intentId: string) => {
    setSelectedIntent(intentId);
    setCurrentScreen('inputs'); // Go to dynamic inputs
  };

  const handleGenerate = (data: any) => {
    console.log("User Data Submitted:", data);
    setProjectData(data);
    setToast({ message: "Details Saved!" });
    // Go to Template Selection instead of loading immediately
    setCurrentScreen('templates');
  };

  const handleTemplateSelect = (template: any) => {
    console.log("Template Selected:", template);
    setToast({ message: "Template Applied" });
    setCurrentScreen('payment'); // Go to payment before loading
  };

  const handlePaymentComplete = () => {
    setToast({ message: "Payment Successful!" });
    setCurrentScreen('loading');
    // Simulate AI Generation (matches the LoadingScreen text duration)
    setTimeout(() => {
      setCurrentScreen('success');
    }, 8000); 
  };

  const handleDashboard = () => {
    setCurrentScreen('home');
  };

  const handleNextStep = (type: string) => {
    // In a real app, this would route to the specific ad builder
    alert(`Opening ${type === 'meta' ? 'Facebook' : 'Google'} Ads Builder...`);
  };

  const handleSettings = () => {
    setCurrentScreen('settings');
  };

  const handleSaveSettings = (data: any) => {
    console.log("Settings Saved:", data);
    setToast({ message: "Settings Updated" });
    handleDashboard();
  };

  // --- Screen Router ---

  const renderScreen = () => {
    switch (currentScreen) {
      case 'login':
        return <LoginScreen onLogin={handleLogin} />;
      case 'home':
        return <MyProjectsScreen onCreateNew={handleStartNew} onSettings={handleSettings} />;
      case 'intent':
        return <IntentSelectionScreen onSelect={handleIntentSelect} onBack={handleDashboard} />;
      case 'inputs':
        return <UniversalInputsScreen onNext={handleGenerate} onBack={() => setCurrentScreen('intent')} serviceType={selectedIntent} />;
      case 'templates':
        return <TemplateLibraryScreen onSelect={handleTemplateSelect} onBack={() => setCurrentScreen('inputs')} />;
      case 'payment':
        return <PaymentScreen amount={projectData?.budget} onPaymentComplete={handlePaymentComplete} onBack={() => setCurrentScreen('templates')} />;
      case 'loading':
        return <LoadingScreen />;
      case 'success':
        return (
          <SuccessScreen 
            publishedUrl="https://agent-site.com/p/dubai-hills-estate" 
            onDashboardClick={handleDashboard}
            onNextStepClick={handleNextStep}
          />
        );
      case 'settings':
        return <SettingsScreen onBack={handleDashboard} onSave={handleSaveSettings} theme={theme} onToggleTheme={toggleTheme} />;
      default:
        return <MyProjectsScreen onCreateNew={handleStartNew} onSettings={handleSettings} />;
    }
  };

  // Calculate Progress based on screen
  const getProgress = () => {
    switch (currentScreen) {
      case 'login': return 0;
      case 'home': return 0;
      case 'intent': return 10;
      case 'inputs': return 30;
      case 'templates': return 50;
      case 'payment': return 65;
      case 'loading': return 80;
      case 'success': return 100;
      default: return 0;
    }
  };

  return (
    // Mobile Container Wrapper
    <div data-theme={theme} style={{ maxWidth: '480px', margin: '0 auto', minHeight: '100vh', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', position: 'relative', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>
      {/* Top Progress Bar */}
      {currentScreen !== 'home' && currentScreen !== 'login' && <ProgressBar progress={getProgress()} />}
      
      {/* Toast Notification Layer */}
      {toast && <ToastNotification message={toast.message} onClose={() => setToast(null)} />}
      
      {/* Floating Vertex Marketing Agent */}
      <MarketingAgent onTemplateSelect={handleTemplateSelect} />
      
      {renderScreen()}
    </div>
  );
};

export default App;