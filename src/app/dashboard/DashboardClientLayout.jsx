'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, FileText, Settings, LogOut, Menu, X, ExternalLink, User as UserIcon } from 'lucide-react';

export const DashboardContext = createContext({ user: null, location: '' });

export function useDashboard() {
  return useContext(DashboardContext);
}

export default function DashboardClientLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [headerSettings, setHeaderSettings] = useState({ logoUrl: '/bhplLogo.png', title: 'Dashboard' });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch user profile to ensure authentication and get details
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [router]);

  useEffect(() => {
    const fetchHeaderSettings = async () => {
      if (!user?.location) return;
      try {
        const res = await fetch(`/api/reports/${user.location}`);
        if (res.ok) {
          const data = await res.json();
          const hs = data.report?.headerSettings || {};
          if (hs.logoUrl || hs.title) {
            setHeaderSettings({
              logoUrl: hs.logoUrl || '/bhplLogo.png',
              title: hs.title || 'Dashboard',
            });
            
            // Dynamically update the favicon
            const iconUrl = hs.logoUrl || '/favicon.svg';
            let link = document.querySelector("link[rel~='icon']");
            if (!link) {
              link = document.createElement('link');
              link.rel = 'icon';
              document.head.appendChild(link);
            }
            link.href = iconUrl;
          }
        }
      } catch (err) {
        console.error('Failed to fetch header settings:', err);
      }
    };
    fetchHeaderSettings();
  }, [user?.location]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const location = user?.location || '';

  const navLinks = [
    { name: 'Overview', href: `/dashboard`, exact: true, icon: LayoutDashboard },
    { name: 'English Data', href: `/dashboard/english`, exact: false, icon: FileText },
    { name: 'Urdu Data', href: `/dashboard/urdu`, exact: false, icon: FileText },
    { name: 'Settings', href: `/dashboard/settings`, exact: false, icon: Settings },
  ];

  const getPublicUrl = () => {
    if (!location) return '#';
    // Simplified public url pointing to standard dynamic route
    return `/${location}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-dark"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <DashboardContext.Provider value={{ user, location }}>
      <div className="h-screen overflow-hidden bg-cream flex font-body">
        {/* Mobile sidebar overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-charcoal/50 z-40 lg:hidden backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`fixed lg:sticky lg:top-0 inset-y-0 left-0 z-50 w-64 h-screen bg-emerald-dark text-white transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} flex flex-col shadow-2xl shrink-0`}>
          <div className="p-6 flex items-center justify-between border-b border-white/10 shrink-0">
            <Link href="/dashboard" className="flex items-center gap-3">
              <img src={headerSettings.logoUrl} alt="Logo" className="h-8 w-auto object-contain" />
              <span className="font-heading font-bold text-lg text-gold">{headerSettings.title}</span>
            </Link>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-white/70 hover:text-white">
              <X size={24} />
            </button>
          </div>

          <div className="p-4 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center overflow-hidden shrink-0">
                {user?.profileImage ? (
                  <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <UserIcon size={20} className="text-gold" />
                )}
              </div>
              <div className="overflow-hidden">
                <p className="font-semibold text-sm truncate">{user?.name || 'User'}</p>
                <p className="text-xs text-white/50 truncate capitalize">{location.replace('-', ' ')}</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-hide">
            {navLinks.map((link) => {
              const isActive = link.exact 
                ? pathname === link.href 
                : pathname.startsWith(link.href);
                
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive 
                      ? 'bg-gold text-emerald-dark font-bold shadow-md' 
                      : 'text-white/80 hover:bg-white/10 hover:text-white font-medium'
                  }`}
                >
                  <link.icon size={18} className={isActive ? 'text-emerald-dark' : 'text-white/70'} />
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-white/10 shrink-0 space-y-2">
            <a
              href={getPublicUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/90 transition-colors text-sm font-medium border border-white/10"
            >
              <span>View Public Report</span>
              <ExternalLink size={14} className="text-gold" />
            </a>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-300 hover:bg-red-500/10 transition-colors text-sm font-medium"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
          {/* Mobile Header */}
          <header className="lg:hidden bg-white border-b border-charcoal/10 px-4 py-4 flex items-center justify-between z-30">
            <div className="flex items-center gap-3">
              <button onClick={() => setIsSidebarOpen(true)} className="text-charcoal p-1">
                <Menu size={24} />
              </button>
              <span className="font-heading font-bold text-emerald-dark truncate">Dashboard</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-emerald-dark/10 flex items-center justify-center overflow-hidden border border-emerald-dark/20">
              {user?.profileImage ? (
                <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <UserIcon size={16} className="text-emerald-dark" />
              )}
            </div>
          </header>

          <div className="flex-1 overflow-auto bg-cream/50 p-4 lg:p-8">
            <div className="max-w-6xl mx-auto">
              {children}
            </div>
          </div>
        </main>
      </div>
    </DashboardContext.Provider>
  );
}
