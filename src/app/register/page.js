'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, User, Phone, MapPin, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import FadeIn from '../../components/animations/FadeIn';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    contact: '',
    location: '',
  });
  const [slugPreview, setSlugPreview] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Generate slug preview as user types location
  useEffect(() => {
    if (formData.location) {
      const slug = formData.location.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');
      setSlugPreview(slug);
    } else {
      setSlugPreview('');
    }
  }, [formData.location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          contact: formData.contact,
          location: formData.location,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // Redirect to dashboard (with path fallback support for local and vercel preview domains)
      const isLocalhostOrVercel = window.location.hostname.includes('localhost') || window.location.hostname.endsWith('.vercel.app');
      if (isLocalhostOrVercel) {
        router.push(`/d/${data.user.location}`);
      } else {
        // In production custom domain, redirect to the subdomain dashboard
        const rootDomain = (process.env.NEXT_PUBLIC_ROOT_DOMAIN || window.location.hostname).replace(/^https?:\/\//, '').replace(/\/+$/, '');
        window.location.href = `https://${data.user.location}.${rootDomain}/dashboard`;
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col justify-center items-center p-4 relative overflow-hidden py-12">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-dark/5 to-emerald-light/5 w-full h-full" />
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-gold/10 blur-3xl pointer-events-none" />
      
      <FadeIn className="w-full max-w-xl z-10">
        <div className="bg-white rounded-3xl shadow-xl border border-emerald-dark/10 overflow-hidden">
          <div className="bg-emerald-dark p-6 sm:p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
               <svg className="w-full h-full" preserveAspectRatio="none">
                 <pattern id="hero-pattern-register" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                   <path d="M20 0 L40 20 L20 40 L0 20 Z" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-gold" />
                 </pattern>
                 <rect width="100%" height="100%" fill="url(#hero-pattern-register)" />
               </svg>
            </div>
            <h1 className="text-2xl font-heading font-bold text-gold relative z-10">Create Account</h1>
            <p className="text-cream/80 text-sm mt-2 relative z-10">Register to create your own Umoor Report dashboard</p>
          </div>

          <div className="p-6 sm:p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div>
                  <label className="block text-sm font-semibold text-charcoal/80 mb-1.5">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-charcoal/40">
                      <User size={18} />
                    </div>
                    <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-charcoal/10 bg-cream/50 focus:bg-white focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none transition-all text-sm" placeholder="John Doe" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-charcoal/80 mb-1.5">Contact Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-charcoal/40">
                      <Phone size={18} />
                    </div>
                    <input type="tel" name="contact" required value={formData.contact} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-charcoal/10 bg-cream/50 focus:bg-white focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none transition-all text-sm" placeholder="+91 9876543210" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-charcoal/80 mb-1.5">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-charcoal/40">
                    <Mail size={18} />
                  </div>
                  <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-charcoal/10 bg-cream/50 focus:bg-white focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none transition-all text-sm" placeholder="john@example.com" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-charcoal/80 mb-1.5">Location / City</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-charcoal/40">
                    <MapPin size={18} />
                  </div>
                  <input type="text" name="location" required value={formData.location} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-charcoal/10 bg-cream/50 focus:bg-white focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none transition-all text-sm" placeholder="e.g. Bhopal" />
                </div>
                {slugPreview && (
                  <p className="mt-1.5 text-xs text-charcoal/60 flex items-center gap-1">
                    <CheckCircle2 size={12} className="text-emerald-500" />
                    Your portal URL: <span className="font-mono text-emerald-dark bg-emerald-50 px-1 rounded">{slugPreview}.umoor-report.com</span>
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 pt-2">
                <div>
                  <label className="block text-sm font-semibold text-charcoal/80 mb-1.5">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-charcoal/40">
                      <Lock size={18} />
                    </div>
                    <input type="password" name="password" required value={formData.password} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-charcoal/10 bg-cream/50 focus:bg-white focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none transition-all text-sm" placeholder="Min 6 characters" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-charcoal/80 mb-1.5">Confirm Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-charcoal/40">
                      <Lock size={18} />
                    </div>
                    <input type="password" name="confirmPassword" required value={formData.confirmPassword} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-charcoal/10 bg-cream/50 focus:bg-white focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none transition-all text-sm" placeholder="Repeat password" />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-emerald-dark hover:bg-emerald-light text-gold font-bold py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 mt-6 group"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center pt-6 border-t border-charcoal/5">
              <p className="text-sm text-charcoal/60">
                Already have an account?{' '}
                <Link href="/login" className="text-emerald-dark font-bold hover:text-gold transition-colors">
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
