import Link from 'next/link';
import { ArrowRight, BarChart3, Globe2, ShieldCheck, Languages } from 'lucide-react';
import FadeIn from '../components/animations/FadeIn';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-cream font-body overflow-x-hidden">
      {/* Navbar */}
      <nav className="absolute top-0 w-full z-50 px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/bhplLogo.png" alt="Logo" className="h-12 w-auto object-contain filter drop-shadow-lg" />
            <span className="text-white font-heading font-bold text-xl drop-shadow-md">Umoor Report</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-white/90 hover:text-gold font-medium transition-colors">Sign In</Link>
            <Link href="/register" className="bg-gold hover:bg-gold-light text-emerald-dark font-bold px-6 py-2.5 rounded-full transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-emerald-dark">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-dark via-emerald-light/80 to-emerald-dark" />
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" preserveAspectRatio="none">
            <pattern id="hero-pattern-main" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M20 0 L40 20 L20 40 L0 20 Z" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-gold" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#hero-pattern-main)" />
          </svg>
        </div>
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-gold/10 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <FadeIn direction="right">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-white leading-tight mb-6 drop-shadow-lg">
                Manage your <span className="text-gold">Umoor Reports</span> with elegance
              </h1>
              <p className="text-lg text-cream/80 mb-8 max-w-xl leading-relaxed">
                A unified, bilingual dashboard to track achievements, improvements, and gallery highlights across all active Umoors and cities.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Link href="/register" className="bg-gold hover:bg-gold-light text-emerald-dark font-bold px-8 py-4 rounded-full transition-all shadow-lg hover:shadow-xl flex items-center gap-2 group text-lg">
                  Create Your Portal
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/login" className="bg-white/10 hover:bg-white/20 text-white font-medium px-8 py-4 rounded-full backdrop-blur-md transition-all border border-white/20">
                  Login to Dashboard
                </Link>
              </div>
            </FadeIn>

            <FadeIn direction="left" delay={0.2} className="hidden lg:block relative">
              <div className="absolute -inset-4 bg-gold/20 rounded-[2.5rem] blur-xl transform -rotate-3" />
              <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200" alt="Dashboard Preview" className="relative rounded-3xl shadow-2xl border border-white/10 transform rotate-2 hover:rotate-0 transition-transform duration-500" />
            </FadeIn>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-4">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl font-heading font-bold text-emerald-dark mb-4">Powerful Features</h2>
            <p className="text-charcoal/60 max-w-2xl mx-auto">Everything you need to maintain and present your comprehensive reports.</p>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Globe2, title: "Custom Subdomains", desc: "Get your own dedicated portal URL (e.g., yourcity.umoor-report.com) automatically upon registration." },
              { icon: Languages, title: "Bilingual Support", desc: "Manage and present data in both English and Urdu simultaneously with perfect RTL layout support." },
              { icon: BarChart3, title: "Dynamic Dashboards", desc: "Beautiful, interactive presentation of your achievements, improvements, and image galleries." }
            ].map((feature, i) => (
              <FadeIn key={i} delay={0.1 * i} direction="up">
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-emerald-dark/5 hover:shadow-md transition-shadow h-full">
                  <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-dark mb-6">
                    <feature.icon size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-charcoal mb-3">{feature.title}</h3>
                  <p className="text-charcoal/70 leading-relaxed">{feature.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-emerald-dark py-12 text-center border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4">
          <img src="/bhplLogo.png" alt="Logo" className="h-10 mx-auto mb-6 opacity-80" />
          <p className="text-cream/50 text-sm">© {new Date().getFullYear()} Dawoodi Bohra Jamat. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
