import React, { useState } from 'react';
import ForgivingInput from './ForgivingInput';
import StickyFooter from './StickyFooter';
import { useAuth, User } from './AuthContext';

const LoginScreen: React.FC = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.email || !formData.password || loading) return;
    setLoading(true);
    setError(null);
    try {
      const user: User = { name: '', email: formData.email };
      await login(user);
      // The onAuthStateChanged in AuthContext will handle the redirect
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="screen-container" style={{ padding: '24px', paddingBottom: '100px', display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '80vh' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🚀</div>
        <h1 className="screen-title" style={{ marginBottom: '8px' }}>
          Welcome Back
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>
          Login to manage your campaigns.
        </p>
      </div>

      <ForgivingInput 
        label="Email Address" 
        type="email"
        placeholder="name@agency.com" 
        value={formData.email} 
        onChange={(e) => handleChange('email', e.target.value)} 
      />

      <ForgivingInput 
        label="Password" 
        type="password"
        placeholder="••••••••" 
        value={formData.password} 
        onChange={(e) => handleChange('password', e.target.value)} 
      />

      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      <StickyFooter 
        label={loading ? 'Logging in...' : 'Login'} 
        onClick={handleSubmit} 
      />
    </div>
  );
};

export default LoginScreen;
