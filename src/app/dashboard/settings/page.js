'use client';

import { useState, useEffect } from 'react';
import { User, Lock, Loader2, Upload, Trash2, Download, Type, Palette, Image as ImageIcon, Save } from 'lucide-react';
import FadeIn from '../../../components/animations/FadeIn';
import { useDashboard } from '../DashboardClientLayout';

export default function SettingsPage() {
  const { user, location } = useDashboard();
  
  // Profile Form
  const [profileData, setProfileData] = useState({ name: '', contact: '', profileImage: '' });
  const [isProfileSaving, setIsProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });
  const [uploadingImage, setUploadingImage] = useState(false);

  // Password Form
  const [pwdData, setPwdData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [isPwdSaving, setIsPwdSaving] = useState(false);
  const [pwdMsg, setPwdMsg] = useState({ type: '', text: '' });

  // Header Customization Form
  const [headerData, setHeaderData] = useState({ logoUrl: '', title: '', subtitle: '' });
  const [isHeaderSaving, setIsHeaderSaving] = useState(false);
  const [headerMsg, setHeaderMsg] = useState({ type: '', text: '' });
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [headerLoaded, setHeaderLoaded] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        contact: user.contact || '',
        profileImage: user.profileImage || ''
      });
    }
  }, [user]);

  // Fetch existing header settings from the report
  useEffect(() => {
    const fetchHeaderSettings = async () => {
      if (!location) return;
      try {
        const res = await fetch(`/api/reports/${location}`);
        if (res.ok) {
          const data = await res.json();
          const hs = data.report?.headerSettings || {};
          setHeaderData({
            logoUrl: hs.logoUrl || '',
            title: hs.title || '',
            subtitle: hs.subtitle || '',
          });
        }
      } catch (err) {
        console.error('Failed to fetch header settings:', err);
      } finally {
        setHeaderLoaded(true);
      }
    };
    fetchHeaderSettings();
  }, [location]);

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

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    setHeaderMsg({ type: '', text: '' });

    try {
      const res = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
        method: 'POST',
        body: file,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setHeaderData(prev => ({ ...prev, logoUrl: data.url }));
    } catch (error) {
      setHeaderMsg({ type: 'error', text: 'Logo upload failed' });
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleHeaderSave = async (e) => {
    e.preventDefault();
    setIsHeaderSaving(true);
    setHeaderMsg({ type: '', text: '' });

    try {
      const res = await fetch(`/api/reports/${location}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ headerSettings: headerData }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update header');
      
      setHeaderMsg({ type: 'success', text: 'Header updated successfully! Changes will appear on your public report page.' });
    } catch (err) {
      setHeaderMsg({ type: 'error', text: err.message });
    } finally {
      setIsHeaderSaving(false);
    }
  };

  if (!user) return <div className="p-8 text-center"><Loader2 className="animate-spin mx-auto text-emerald-dark" /></div>;

  return (
    <div className="space-y-6 max-w-4xl pb-8">
      <h1 className="text-2xl font-bold text-emerald-dark font-heading">Settings</h1>

      {/* Header Customization — Full width, at the top for prominence */}
      <FadeIn delay={0.05}>
        <div className="bg-white rounded-2xl shadow-sm border border-emerald-dark/5 overflow-hidden">
          <div className="p-5 border-b border-charcoal/5 bg-gradient-to-r from-blue-50 to-indigo-50 flex items-center gap-3">
            <Palette size={20} className="text-indigo-600" />
            <div>
              <h2 className="font-bold text-charcoal">Public Report Header</h2>
              <p className="text-xs text-charcoal/50 mt-0.5">Customize the header shown on your public report page at /{location}</p>
            </div>
          </div>
          
          <form onSubmit={handleHeaderSave} className="p-6 space-y-5">
            {headerMsg.text && (
              <div className={`p-3 text-sm rounded-lg ${headerMsg.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                {headerMsg.text}
              </div>
            )}

            {/* Live Preview */}
            <div className="rounded-xl overflow-hidden border border-charcoal/10 shadow-sm">
              <div className="bg-emerald-dark text-gold flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center overflow-hidden shrink-0 border border-white/10">
                    {headerData.logoUrl ? (
                      <img src={headerData.logoUrl} alt="Logo preview" className="w-full h-full object-contain" />
                    ) : (
                      <img src="/bhplLogo.png" alt="Default logo" className="w-full h-full object-contain opacity-50" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-heading font-bold text-white leading-tight">
                      {headerData.title || 'Dawoodi Bohra'}
                    </h3>
                    <p className="text-xs text-gold font-medium">
                      {headerData.subtitle || 'Jamat Bhopal'}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/30 bg-white/5 px-3 py-1 rounded-full border border-white/10">Preview</span>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              {/* Logo Upload */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-charcoal/60 uppercase tracking-wider mb-2">Header Logo</label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-cream border border-charcoal/10 flex items-center justify-center overflow-hidden shrink-0">
                    {headerData.logoUrl ? (
                      <img src={headerData.logoUrl} alt="Logo" className="w-full h-full object-contain p-1" />
                    ) : (
                      <ImageIcon size={24} className="text-charcoal/20" />
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <label className="bg-white border border-charcoal/10 hover:bg-charcoal/5 text-sm font-medium px-4 py-2 rounded-lg cursor-pointer transition-colors flex items-center gap-2">
                      {uploadingLogo ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                      {headerData.logoUrl ? 'Change Logo' : 'Upload Logo'}
                      <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} disabled={uploadingLogo} />
                    </label>
                    {headerData.logoUrl && (
                      <button type="button" onClick={() => setHeaderData(p => ({ ...p, logoUrl: '' }))} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors" title="Remove custom logo">
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-charcoal/40 hidden sm:block">Leave empty to use the default logo.</p>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-charcoal/60 uppercase tracking-wider mb-1.5">Header Title</label>
                <input
                  type="text"
                  value={headerData.title}
                  onChange={e => setHeaderData({ ...headerData, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-charcoal/10 bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/30 outline-none text-sm transition-all"
                  placeholder="e.g. Dawoodi Bohra (default)"
                />
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-xs font-semibold text-charcoal/60 uppercase tracking-wider mb-1.5">Header Subtitle</label>
                <input
                  type="text"
                  value={headerData.subtitle}
                  onChange={e => setHeaderData({ ...headerData, subtitle: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-charcoal/10 bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/30 outline-none text-sm transition-all"
                  placeholder="e.g. Jamat Bhopal (default)"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-charcoal/5">
              <p className="text-xs text-charcoal/40">Empty fields will use default values.</p>
              <button type="submit" disabled={isHeaderSaving} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-medium transition-all shadow-sm active:scale-95 flex items-center gap-2 text-sm">
                {isHeaderSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                Save Header
              </button>
            </div>
          </form>
        </div>
      </FadeIn>

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
                <p className="text-xs text-charcoal/50 mt-1">Contact support to change your portal location.</p>
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

      {/* Resources & Typography */}
      <FadeIn delay={0.3}>
        <div className="bg-white rounded-2xl shadow-sm border border-emerald-dark/5 overflow-hidden">
          <div className="p-5 border-b border-charcoal/5 bg-purple-50 flex items-center gap-3">
            <Type size={20} className="text-purple-600" />
            <h2 className="font-bold text-charcoal">Resources &amp; Typography</h2>
          </div>
          <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="font-bold text-charcoal text-sm">Kanz-ul-Marjaan Font</h3>
              <p className="text-xs text-charcoal/60 max-w-xl">
                Download the official Kanz-ul-Marjaan TrueType font to render high-quality Urdu calligraphy and specialized typography correctly on all your devices.
              </p>
            </div>
            <a
              href="/KANZ-AL-MARJAAN.TTF"
              download="KANZ-AL-MARJAAN.TTF"
              className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 self-start sm:self-auto text-sm shrink-0"
            >
              <Download size={16} />
              Download Kanz Font
            </a>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
