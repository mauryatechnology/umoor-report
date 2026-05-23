'use client';

import { useState, useEffect } from 'react';
import { User, Lock, Loader2, Upload, Trash2 } from 'lucide-react';
import FadeIn from '../../../components/animations/FadeIn';
import { useDashboard } from '../DashboardClientLayout';

export default function SettingsPage() {
  const { user } = useDashboard();
  
  // Profile Form
  const [profileData, setProfileData] = useState({ name: '', contact: '', profileImage: '' });
  const [isProfileSaving, setIsProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });
  const [uploadingImage, setUploadingImage] = useState(false);

  // Password Form
  const [pwdData, setPwdData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [isPwdSaving, setIsPwdSaving] = useState(false);
  const [pwdMsg, setPwdMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        contact: user.contact || '',
        profileImage: user.profileImage || ''
      });
    }
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsProfileSaving(true);
    setProfileMsg({ type: '', text: '' });

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update');
      
      setProfileMsg({ type: 'success', text: 'Profile updated successfully' });
      // Reload page to update sidebar avatar
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      setProfileMsg({ type: 'error', text: err.message });
    } finally {
      setIsProfileSaving(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setPwdMsg({ type: '', text: '' });

    if (pwdData.newPassword !== pwdData.confirmPassword) {
      return setPwdMsg({ type: 'error', text: 'New passwords do not match' });
    }

    setIsPwdSaving(true);

    try {
      const res = await fetch('/api/profile/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: pwdData.currentPassword,
          newPassword: pwdData.newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update password');
      
      setPwdMsg({ type: 'success', text: 'Password updated successfully' });
      setPwdData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPwdMsg({ type: 'error', text: err.message });
    } finally {
      setIsPwdSaving(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setProfileMsg({ type: '', text: '' });

    try {
      const res = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
        method: 'POST',
        body: file,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setProfileData(prev => ({ ...prev, profileImage: data.url }));
    } catch (error) {
      setProfileMsg({ type: 'error', text: 'Image upload failed' });
    } finally {
      setUploadingImage(false);
    }
  };

  if (!user) return <div className="p-8 text-center"><Loader2 className="animate-spin mx-auto text-emerald-dark" /></div>;

  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-2xl font-bold text-emerald-dark font-heading">Settings</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <FadeIn delay={0.1}>
          <div className="bg-white rounded-2xl shadow-sm border border-emerald-dark/5 overflow-hidden">
            <div className="p-5 border-b border-charcoal/5 bg-emerald-50/50 flex items-center gap-3">
              <User size={20} className="text-emerald-dark" />
              <h2 className="font-bold text-charcoal">Profile Information</h2>
            </div>
            
            <form onSubmit={handleProfileUpdate} className="p-6 space-y-5">
              {profileMsg.text && (
                <div className={`p-3 text-sm rounded-lg ${profileMsg.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                  {profileMsg.text}
                </div>
              )}

              {/* Avatar Upload */}
              <div className="flex items-center gap-6 pb-2 border-b border-charcoal/5">
                <div className="w-20 h-20 rounded-full bg-cream border border-charcoal/10 flex items-center justify-center overflow-hidden shrink-0">
                  {profileData.profileImage ? (
                    <img src={profileData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User size={32} className="text-charcoal/30" />
                  )}
                </div>
                <div>
                  <div className="flex flex-wrap gap-2">
                    <label className="bg-white border border-charcoal/10 hover:bg-charcoal/5 text-sm font-medium px-4 py-2 rounded-lg cursor-pointer transition-colors flex items-center gap-2">
                      {uploadingImage ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                      Upload New
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImage} />
                    </label>
                    {profileData.profileImage && (
                      <button type="button" onClick={() => setProfileData(p => ({...p, profileImage: ''}))} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors">
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-charcoal/50 mt-2">Recommended: Square image, max 2MB</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal/80 mb-1.5">Full Name</label>
                <input type="text" value={profileData.name} onChange={e => setProfileData({...profileData, name: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-charcoal/10 bg-white focus:ring-2 focus:ring-emerald-dark/20 outline-none" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal/80 mb-1.5">Email (Read-only)</label>
                <input type="email" value={user?.email || ''} disabled className="w-full px-4 py-2.5 rounded-xl border border-charcoal/10 bg-charcoal/5 text-charcoal/60 outline-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal/80 mb-1.5">Contact Number</label>
                <input type="tel" value={profileData.contact} onChange={e => setProfileData({...profileData, contact: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-charcoal/10 bg-white focus:ring-2 focus:ring-emerald-dark/20 outline-none" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal/80 mb-1.5">Portal Location (Read-only)</label>
                <input type="text" value={user?.location || ''} disabled className="w-full px-4 py-2.5 rounded-xl border border-charcoal/10 bg-charcoal/5 text-charcoal/60 outline-none" />
                <p className="text-xs text-charcoal/50 mt-1">Contact support to change your subdomain location.</p>
              </div>

              <div className="pt-2">
                <button type="submit" disabled={isProfileSaving} className="bg-emerald-dark hover:bg-emerald-light text-gold px-6 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2">
                  {isProfileSaving && <Loader2 size={16} className="animate-spin" />}
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </FadeIn>

        {/* Password Settings */}
        <FadeIn delay={0.2}>
          <div className="bg-white rounded-2xl shadow-sm border border-emerald-dark/5 overflow-hidden">
            <div className="p-5 border-b border-charcoal/5 bg-amber-50 flex items-center gap-3">
              <Lock size={20} className="text-amber-600" />
              <h2 className="font-bold text-charcoal">Change Password</h2>
            </div>
            
            <form onSubmit={handlePasswordUpdate} className="p-6 space-y-5">
              {pwdMsg.text && (
                <div className={`p-3 text-sm rounded-lg ${pwdMsg.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                  {pwdMsg.text}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-charcoal/80 mb-1.5">Current Password</label>
                <input type="password" value={pwdData.currentPassword} onChange={e => setPwdData({...pwdData, currentPassword: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-charcoal/10 bg-white focus:ring-2 focus:ring-amber-500/20 outline-none" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal/80 mb-1.5">New Password</label>
                <input type="password" value={pwdData.newPassword} onChange={e => setPwdData({...pwdData, newPassword: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-charcoal/10 bg-white focus:ring-2 focus:ring-amber-500/20 outline-none" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal/80 mb-1.5">Confirm New Password</label>
                <input type="password" value={pwdData.confirmPassword} onChange={e => setPwdData({...pwdData, confirmPassword: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-charcoal/10 bg-white focus:ring-2 focus:ring-amber-500/20 outline-none" required />
              </div>

              <div className="pt-2">
                <button type="submit" disabled={isPwdSaving} className="bg-charcoal hover:bg-black text-white px-6 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2">
                  {isPwdSaving && <Loader2 size={16} className="animate-spin" />}
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
