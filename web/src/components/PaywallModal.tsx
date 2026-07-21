'use client';

import { X, Check, Sparkles, Zap, ShieldCheck, Crown } from 'lucide-react';
import { useEffect, useState } from 'react';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BASE_CHECKOUT_URL = process.env.NEXT_PUBLIC_LEMON_SQUEEZY_CHECKOUT_URL || 'https://damaiwushuang.lemonsqueezy.com/checkout/buy/a2bff8f6-cccb-45e1-92ff-e1342513eab2';
const SUCCESS_URL = 'https://rezzobot.com/?payment=success';

function buildCheckoutUrl(type: 'single' | 'monthly' | 'lifetime'): string {
  const params = new URLSearchParams({
    'checkout[success_url]': SUCCESS_URL,
    'checkout[custom][type]': type,
  });
  return `${BASE_CHECKOUT_URL}?${params.toString()}`;
}

export default function PaywallModal({ isOpen, onClose }: PaywallModalProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isOpen || !isMounted) return null;

  const tiers = [
    {
      name: 'Single Optimization',
      price: '$4.99',
      description: 'Perfect for a quick boost',
      icon: <Zap size={24} className="text-blue-500" />,
      features: [
        'One-time AI Optimization',
        'Unlimited ATS Diagnosis',
        'One PDF/DOCX Export',
        '24h Data Retention'
      ],
      cta: 'Buy Now',
      url: buildCheckoutUrl('single'),
      highlight: false
    },
    {
      name: 'Monthly Pro',
      price: '$14.90',
      interval: '/mo',
      description: 'For active job seekers',
      icon: <Sparkles size={24} className="text-purple-500" />,
      features: [
        'Unlimited AI Optimizations',
        'Unlimited PDF/DOCX Exports',
        'Priority AI Processing',
        'Early Access to Features'
      ],
      cta: 'Subscribe',
      url: buildCheckoutUrl('monthly'),
      highlight: true
    },
    {
      name: 'Lifetime Access',
      price: '$666',
      description: 'The ultimate career investment',
      icon: <Crown size={24} className="text-amber-500" />,
      features: [
        'Everything in Monthly Pro',
        'Pay Once, Use Forever',
        'Lifetime Updates',
        'VIP Support'
      ],
      cta: 'Get Lifetime',
      url: buildCheckoutUrl('lifetime'),
      highlight: false
    }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
        >
          <X size={20} className="text-gray-400" />
        </button>

        <div className="flex flex-col md:flex-row h-full">
          {/* Left Panel - Pricing */}
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

                  <a
                    href={tier.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full py-3 rounded-xl font-black text-sm text-center transition-all ${
                      tier.highlight
                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200'
                        : 'bg-gray-900 text-white hover:bg-black'
                    }`}
                  >
                    {tier.cta}
                  </a>
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
