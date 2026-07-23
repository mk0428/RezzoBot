'use client';

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Check, X, Sparkles, Zap, Crown, ShieldCheck, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { trackEvent } from "@/lib/tracker";

const API_BASE = 'https://mk5188.duckdns.org/rezzobot-api/api';

const tiers = [
  {
    name: 'Free',
    price: '$0',
    description: 'Get a feel for how it works.',
    planType: null,
    icon: <Zap size={24} className="text-gray-500" />,
    features: [
      { text: 'ATS Score Check', included: true },
      { text: 'Keyword Analysis', included: true },
      { text: 'AI Resume Optimization', included: false },
      { text: 'PDF/DOCX Export', included: false },
      { text: 'Unlimited Scans', included: true },
    ],
    cta: 'Try for free',
    href: '/upload',
    highlight: false,
  },
  {
    name: 'Single',
    price: '$4.99',
    description: 'Perfect for a one-time boost.',
    planType: 'single' as const,
    icon: <Zap size={24} className="text-blue-500" />,
    features: [
      { text: 'Everything in Free', included: true },
      { text: '1 AI Optimization', included: true },
      { text: '1 PDF/DOCX Export', included: true },
      { text: '24h Data Retention', included: true },
      { text: 'Priority Support', included: false },
    ],
    cta: 'Buy Now',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$14.99',
    interval: '/mo',
    description: 'For active job seekers.',
    planType: 'monthly' as const,
    icon: <Sparkles size={24} className="text-purple-500" />,
    features: [
      { text: 'Everything in Single', included: true },
      { text: 'Unlimited Optimizations', included: true },
      { text: 'Unlimited Exports', included: true },
      { text: 'Priority Processing', included: true },
      { text: 'Early Access', included: true },
    ],
    cta: 'Subscribe',
    highlight: true,
  },
  {
    name: 'Lifetime',
    price: '$666',
    description: 'The ultimate career investment.',
    planType: 'lifetime' as const,
    icon: <Crown size={24} className="text-amber-500" />,
    features: [
      { text: 'Everything in Pro', included: true },
      { text: 'Pay Once, Use Forever', included: true },
      { text: 'Lifetime Updates', included: true },
      { text: 'VIP Support', included: true },
      { text: 'Early Access', included: true },
    ],
    cta: 'Get Lifetime',
    highlight: false,
  },
];

async function createCheckoutSession(type: string): Promise<string | null> {
  try {
    const res = await fetch(`${API_BASE}/create-checkout-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type }),
    });
    const data = await res.json();
    if (data.url) {
      window.open(data.url, '_blank');
      return data.url;
    }
    alert('Something went wrong. Please try again.');
    return null;
  } catch (err) {
    alert('Failed to connect. Please try again.');
    return null;
  }
}

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    trackEvent('page_view');
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-grow">
        {/* hero */}
        <section className="pt-28 pb-16 px-4">
          <div className="max-w-6xl mx-auto text-center space-y-6">
            <div className="inline-block px-4 py-1.5 bg-gray-900 text-white rounded-lg text-xs font-black uppercase tracking-widest">
              Pricing
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight leading-tight">
              The resume tool that <br className="hidden sm:block" />
              <span className="text-blue-600">actually gets you hired</span>
            </h1>
            <p className="text-lg text-gray-500 font-medium max-w-2xl mx-auto">
              We don&apos;t write your resume for you. We analyze, score, and optimize — so you show up prepared.
            </p>
          </div>
        </section>

        {/* pricing cards */}
        <section className="pb-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {tiers.map((tier) => (
                <div
                  key={tier.name}
                  className={`relative flex flex-col p-6 rounded-2xl border-2 transition-all ${
                    tier.highlight
                      ? 'border-blue-600 shadow-xl shadow-blue-100 scale-[1.02] z-1 bg-white'
                      : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-md'
                  }`}
                >
                  {tier.highlight && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest whitespace-nowrap">
                      Most Popular
                    </div>
                  )}

                  <div className="mb-4">{tier.icon}</div>
                  <h3 className="text-lg font-black text-gray-900 mb-1">{tier.name}</h3>
                  <p className="text-xs text-gray-400 font-medium mb-4">{tier.description}</p>

                  <div className="flex items-baseline mb-6">
                    <span className="text-3xl font-black text-gray-900">{tier.price}</span>
                    {tier.interval && <span className="text-gray-400 font-bold ml-1">{tier.interval}</span>}
                  </div>

                  <ul className="space-y-3 mb-8 flex-grow">
                    {tier.features.map((f) => (
                      <li key={f.text} className="flex items-start space-x-2">
                        {f.included ? (
                          <Check size={16} className="text-green-500 mt-0.5 shrink-0" />
                        ) : (
                          <X size={16} className="text-gray-300 mt-0.5 shrink-0" />
                        )}
                        <span className={`text-xs font-semibold leading-tight ${f.included ? 'text-gray-700' : 'text-gray-400'}`}>
                          {f.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {tier.planType ? (
                    <button
                      onClick={() => {
                        setLoading(tier.planType!);
                        createCheckoutSession(tier.planType!).finally(() => setLoading(null));
                      }}
                      disabled={loading === tier.planType}
                      className={`w-full py-3 rounded-xl font-black text-sm text-center transition-all cursor-pointer ${
                        loading === tier.planType ? 'opacity-60 cursor-not-allowed' : ''
                      } ${
                        tier.highlight
                          ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200'
                          : 'bg-gray-900 text-white hover:bg-black'
                      }`}
                    >
                      {loading === tier.planType ? 'Opening...' : tier.cta}
                    </button>
                  ) : (
                    <a
                      href={tier.href}
                      className="block w-full py-3 rounded-xl font-black text-sm text-center bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
                    >
                      {tier.cta}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* feature comparison table */}
        <section className="py-20 bg-gray-50/50 px-4 border-t border-gray-100">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12 space-y-4">
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">Compare all features</h2>
              <p className="text-gray-500 font-medium">Everything you need to land your next job.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 pr-4 font-bold text-gray-900 w-1/3">Feature</th>
                    <th className="text-center py-4 px-2 font-bold text-gray-900">Free</th>
                    <th className="text-center py-4 px-2 font-bold text-blue-600 bg-blue-50/50">Single</th>
                    <th className="text-center py-4 px-2 font-bold text-blue-600 bg-blue-100/50">Pro</th>
                    <th className="text-center py-4 px-2 font-bold text-gray-900">Lifetime</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'ATS Score Check', free: 'Limited', single: true, pro: true, lifetime: true },
                    { name: 'Keyword Analysis', free: 'Limited', single: true, pro: true, lifetime: true },
                    { name: 'AI Resume Optimization', free: false, single: '1 time', pro: true, lifetime: true },
                    { name: 'PDF Export', free: false, single: '1', pro: true, lifetime: true },
                    { name: 'DOCX Export', free: false, single: '1', pro: true, lifetime: true },
                    { name: 'Priority Processing', free: false, single: false, pro: true, lifetime: true },
                    { name: 'Early Access', free: false, single: false, pro: true, lifetime: true },
                    { name: 'VIP Support', free: false, single: false, pro: false, lifetime: true },
                  ].map((row) => (
                    <tr key={row.name} className="border-b border-gray-100 hover:bg-gray-50/50">
                      <td className="py-3 pr-4 font-semibold text-gray-800">{row.name}</td>
                      {[row.free, row.single, row.pro, row.lifetime].map((val, i) => (
                        <td key={i} className="text-center py-3 px-2">
                          {val === true ? (
                            <Check size={18} className="text-green-500 inline-block" />
                          ) : val === false ? (
                            <X size={18} className="text-gray-300 inline-block" />
                          ) : (
                            <span className="text-gray-500 text-xs font-medium">{val}</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
