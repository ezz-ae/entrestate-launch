import React, { useState, useEffect } from 'react';
import { Button } from './components/ui/button'; // Assuming button component path
import ForgivingInput from './ForgivingInput';
import StickyFooter from './StickyFooter';
import { useFirebaseAuth } from './components/firebase-auth-provider';
import { getAuth, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

const SettingsScreen: React.FC = () => {
  const { user } = useFirebaseAuth();
  const router = useRouter();
  const [profile, setProfile] = useState({
    name: user?.displayName || '',
    email: user?.email || '',
    phone: (user as any)?.phoneNumber || '',
  });

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.displayName || '',
        email: user.email || '',
        phone: (user as any).phoneNumber || '',
      });
    }
  }, [user]);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', phone: '' });
  const [showChangePassword, setShowChangePassword] = useState(false);

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
    router.push('/login');
  };

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match!");
      return;
    }
    // Simulate password change logic here
    alert("Password changed successfully!");
    // Reset fields
    setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
  };

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone: string) => {
    // Basic phone validation: allows +, spaces, dashes, and digits, min length 7
    const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    return re.test(phone);
  };

  const handleSave = () => {
    let valid = true;
    const newErrors = { email: '', phone: '' };

    if (!validateEmail(profile.email)) {
      newErrors.email = 'Please enter a valid email address.';
      valid = false;
    }

    if (!validatePhone(profile.phone)) {
      newErrors.phone = 'Please enter a valid phone number.';
      valid = false;
    }

    setErrors(newErrors);
    if (valid) {
      // Handle profile save logic
      console.log('Profile saved:', profile);
    }
  };

  return (
    <div className="screen-container" style={{ padding: '24px', paddingBottom: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 className="screen-title">Settings</h1>
        <Button onClick={handleLogout} variant="destructive">Logout</Button>
      </div>

      {/* Profile Section */}
      <div style={{ marginBottom: '32px' }}>
        <div className="settings-section-title">Personal Profile</div>
        <div style={{ backgroundColor: 'var(--bg-primary)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <ForgivingInput 
            label="Full Name" 
            value={profile.name} 
            onChange={(e) => setProfile({...profile, name: e.target.value})} 
          />
          <ForgivingInput 
            label="Email Address" 
            value={profile.email} 
            onChange={(e) => setProfile({...profile, email: e.target.value})} 
            style={errors.email ? { borderColor: 'var(--danger)' } : {}}
          />
          {errors.email && <div style={{ color: 'var(--danger)', fontSize: '12px', marginTop: '-12px', marginBottom: '12px' }}>{errors.email}</div>}
          
          <ForgivingInput 
            label="Phone Number" 
            type="tel"
            value={profile.phone} 
            onChange={(e) => setProfile({...profile, phone: e.target.value})} 
            style={errors.phone ? { borderColor: 'var(--danger)' } : {}}
          />
          {errors.phone && <div style={{ color: 'var(--danger)', fontSize: '12px', marginTop: '-12px', marginBottom: '12px' }}>{errors.phone}</div>}
        </div>
      </div>

      {/* Security Section */}
      <div className="settings-section-title">Security</div>
      <div style={{ backgroundColor: 'var(--bg-primary)', padding: '0 16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
        <div 
          onClick={() => setShowChangePassword(true)}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div className="settings-icon-container">🔒</div>
            <span style={{ fontSize: '16px', fontWeight: '500', color: 'var(--text-primary)' }}>Change Password</span>
          </div>
          <span style={{ color: 'var(--text-tertiary)' }}>›</span>
        </div>
      </div>

      {/* Change Password Modal */}
      {showChangePassword && (
        <div className="modal-overlay" onClick={() => setShowChangePassword(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '24px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: 'var(--text-primary)' }}>Change Password</h3>
            
            <ForgivingInput 
              label="Current Password" 
              type="password"
              value={currentPassword} 
              onChange={(e) => setCurrentPassword(e.target.value)} 
            />
            
            <ForgivingInput 
              label="New Password" 
              type="password"
              value={newPassword} 
              onChange={(e) => setNewPassword(e.target.value)} 
            />

            <ForgivingInput 
              label="Confirm New Password" 
              type="password"
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
            />

            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <button onClick={() => setShowChangePassword(false)} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', fontWeight: 600, cursor: 'pointer' }}>
                Cancel
              </button>
              <button 
                onClick={handlePasswordChange} 
                style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', backgroundColor: 'var(--primary-color)', color: '#fff', fontWeight: 600, cursor: 'pointer', opacity: (!currentPassword || !newPassword || !confirmPassword) ? 0.5 : 1 }}
                disabled={!currentPassword || !newPassword || !confirmPassword}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      <StickyFooter label="Save Changes" onClick={handleSave} />
    </div>
  );
};

export default SettingsScreen;