'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, FileText, Settings, LogOut, Menu, X, ExternalLink, User } from 'lucide-react';

export default function DashboardClientLayout({ children, location }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
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
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      // Redirect to main domain login or local login
      const rootDomain = (process.env.NEXT_PUBLIC_ROOT_DOMAIN || window.location.hostname).replace(/^https?:\/\//, '').replace(/\/+$/, '');
      const isLocalhostOrVercel = window.location.hostname.includes('localhost') || window.location.hostname.endsWith('.vercel.app');
      
      if (isLocalhostOrVercel) {
        window.location.href = '/login';
      } else {
        window.location.href = `https://${rootDomain}/login`;
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navLinks = [
    { name: 'Overview', href: `/d/${location}`, pathPrefix: `/dashboard/${location}`, exact: true, icon: LayoutDashboard },
    { name: 'English Data', href: `/d/${location}/english`, pathPrefix: `/dashboard/${location}/english`, exact: false, icon: FileText },
    { name: 'Urdu Data', href: `/d/${location}/urdu`, pathPrefix: `/dashboard/${location}/urdu`, exact: false, icon: FileText },
    { name: 'Settings', href: `/d/${location}/settings`, pathPrefix: `/dashboard/${location}/settings`, exact: false, icon: Settings },
  ];

  const getPublicUrl = () => {
    const rootDomain = (process.env.NEXT_PUBLIC_ROOT_DOMAIN || window.location.hostname).replace(/^https?:\/\//, '').replace(/\/+$/, '');
    const isLocalhostOrVercel = window.location.hostname.includes('localhost') || window.location.hostname.endsWith('.vercel.app');
    return isLocalhostOrVercel ? `/r/${location}` : `https://${location}.${rootDomain}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-dark"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream flex font-body">
      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-charcoal/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-emerald-dark text-white transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} flex flex-col shadow-2xl`}>
        <div className="p-6 flex items-center justify-between border-b border-white/10 shrink-0">
          <Link href={`/d/${location}`} className="flex items-center gap-3">
            <img src="/bhplLogo.png" alt="Logo" className="h-8 w-auto object-contain" />
            <span className="font-heading font-bold text-lg text-gold">Dashboard</span>
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
                <User size={20} className="text-gold" />
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
              ? pathname === link.pathPrefix || pathname === `/d/${location}` 
              : pathname.startsWith(link.pathPrefix) || pathname.startsWith(`/d/${location}/${link.href.split('/').pop()}`);
              
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
              <User size={16} className="text-emerald-dark" />
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
  );
}
