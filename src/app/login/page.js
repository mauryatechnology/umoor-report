'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import FadeIn from '../../components/animations/FadeIn';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Redirect to dashboard (with path fallback support)
      const isLocalhost = window.location.hostname.includes('localhost');
      if (isLocalhost) {
        router.push(`/d/${data.user.location}`);
      } else {
        // In production, we can either redirect to subdomain or let middleware handle it
        // We'll redirect to the subdomain dashboard
        const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'umoor-report.vercel.app';
        window.location.href = `https://${data.user.location}.${rootDomain}/dashboard`;
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-dark/5 to-emerald-light/5 w-full h-full" />
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-gold/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-emerald-dark/10 blur-3xl pointer-events-none" />

      <FadeIn className="w-full max-w-md z-10">
        <div className="bg-white rounded-3xl shadow-xl border border-emerald-dark/10 overflow-hidden">
          <div className="bg-emerald-dark p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
               <svg className="w-full h-full" preserveAspectRatio="none">
                 <pattern id="hero-pattern-login" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                   <path d="M20 0 L40 20 L20 40 L0 20 Z" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-gold" />
                 </pattern>
                 <rect width="100%" height="100%" fill="url(#hero-pattern-login)" />
               </svg>
            </div>
            <Link href="/" className="inline-block relative z-10">
              <img src="/bhplLogo.png" alt="Logo" className="h-16 mx-auto mb-4 object-contain filter drop-shadow-md" />
            </Link>
            <h1 className="text-2xl font-heading font-bold text-gold relative z-10">Welcome Back</h1>
            <p className="text-cream/80 text-sm mt-2 relative z-10">Login to manage your Umoor Report</p>
          </div>

          <div className="p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-charcoal/80 mb-1.5">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-charcoal/40">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-charcoal/10 bg-cream/50 focus:bg-white focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none transition-all text-charcoal"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-sm font-semibold text-charcoal/80">Password</label>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-charcoal/40">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-charcoal/10 bg-cream/50 focus:bg-white focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none transition-all text-charcoal"
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-emerald-dark hover:bg-emerald-light text-gold font-bold py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 mt-4 group"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-charcoal/60">
                Don't have an account?{' '}
                <Link href="/register" className="text-emerald-dark font-bold hover:text-gold transition-colors">
                  Register here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
