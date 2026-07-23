'use client';

import { X, Check, Sparkles, Zap, ShieldCheck, Crown } from 'lucide-react';
import { useEffect, useState } from 'react';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const API_BASE = 'https://mk5188.duckdns.org/rezzobot-api/api';

async function createCheckoutSession(type: 'single' | 'monthly' | 'lifetime'): Promise<string | null> {
  try {
    const res = await fetch(`${API_BASE}/create-checkout-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type }),
    });
    const data = await res.json();
    if (data.url) return data.url;
    console.error('Checkout error:', data);
    return null;
  } catch (err) {
    console.error('Failed to create checkout:', err);
    return null;
  }
}

export default function PaywallModal({ isOpen, onClose }: PaywallModalProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isOpen || !isMounted) return null;

  const handleCheckout = async (type: 'single' | 'monthly' | 'lifetime') => {
    setLoading(type);
    const url = await createCheckoutSession(type);
    setLoading(null);
    if (url) {
      window.open(url, '_blank');
    } else {
      alert('Failed to create checkout. Please try again.');
    }
  };

  const tiers = [
    {
      name: 'Single Optimization',
      price: '$4.99',
      description: 'Perfect for a quick boost',
      planType: 'single' as const,
      icon: <Zap size={24} className="text-blue-500" />,
      features: [
        'One-time AI Optimization',
        'Unlimited ATS Diagnosis',
        'One PDF/DOCX Export',
        '24h Data Retention'
      ],
      highlight: false
    },
    {
      name: 'Monthly Pro',
      price: '$14.99',
      interval: '/mo',
      description: 'For active job seekers',
      planType: 'monthly' as const,
      icon: <Sparkles size={24} className="text-purple-500" />,
      features: [
        'Unlimited AI Optimizations',
        'Unlimited PDF/DOCX Exports',
        'Priority AI Processing',
        'Early Access to Features'
      ],
      highlight: true
    },
    {
      name: 'Lifetime Access',
      price: '$666',
      description: 'The ultimate career investment',
      planType: 'lifetime' as const,
      icon: <Crown size={24} className="text-amber-500" />,
      features: [
        'Everything in Monthly Pro',
        'Pay Once, Use Forever',
        'Lifetime Updates',
        'VIP Support'
      ],
      highlight: false
    }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
        >
          <X size={20} className="text-gray-400" />
        </button>

        <div className="flex flex-col md:flex-row h-full">
          <div className="flex-grow p-8 md:p-12 overflow-y-auto max-h-[90vh] md:max-h-none">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-4">Unlock Your Career Potential</h2>
              <p className="text-gray-500 font-medium">Choose the plan that fits your career goals</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {tiers.map((tier) => (
                <div
                  key={tier.name}
                  className={`relative flex flex-col p-6 rounded-2xl border-2 transition-all ${
                    tier.highlight
                      ? 'border-blue-600 shadow-xl shadow-blue-100 scale-105 z-1'
                      : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  {tier.highlight && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                      Best Value
                    </div>
                  )}

                  <div className="mb-6">{tier.icon}</div>

                  <h3 className="text-lg font-black text-gray-900 mb-1">{tier.name}</h3>
                  <p className="text-xs text-gray-400 font-medium mb-4">{tier.description}</p>

                  <div className="flex items-baseline mb-6">
                    <span className="text-3xl font-black text-gray-900">{tier.price}</span>
                    {tier.interval && <span className="text-gray-400 font-bold ml-1">{tier.interval}</span>}
                  </div>

                  <ul className="space-y-3 mb-8 flex-grow">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start space-x-2">
                        <Check size={16} className="text-green-500 mt-0.5 shrink-0" />
                        <span className="text-[11px] font-bold text-gray-600 leading-tight">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleCheckout(tier.planType)}
                    disabled={loading === tier.planType}
                    className={`w-full py-3 rounded-xl font-black text-sm text-center transition-all ${
                      loading === tier.planType ? 'opacity-60 cursor-not-allowed' : ''
                    } ${
                      tier.highlight
                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200'
                        : 'bg-gray-900 text-white hover:bg-black'
                    }`}
                  >
                    {loading === tier.planType ? 'Opening...' : tier.planType === 'monthly' ? 'Subscribe' : 'Buy Now'}
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-12">
              <div className="flex items-center space-x-2 text-gray-400">
                <ShieldCheck size={18} />
                <span className="text-xs font-bold uppercase tracking-widest">Secure Payments</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <Check size={18} className="text-green-500" />
                <span className="text-xs font-bold uppercase tracking-widest">Instant Access</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
