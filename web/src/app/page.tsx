'use client';

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FileDropZone from "@/components/FileDropZone";
import FeatureCards from "@/components/FeatureCards";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Star, ArrowRight, CheckCircle2 } from "lucide-react";
import { useEffect, useState, Suspense } from "react";
import { handlePaymentSuccess } from "@/lib/purchase";
import { trackEvent } from "@/lib/tracker";

function LandingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [paymentStatus, setPaymentStatus] = useState<'success' | 'cancelled' | null>(null);

  useEffect(() => {
    // Fire page_view on landing
    trackEvent("page_view");
    const payment = searchParams.get('payment');
    const type = searchParams.get('type'); // custom param we add to redirect URL

    if (payment === 'success') {
      handlePaymentSuccess(type);
      setPaymentStatus('success');
      // Clear URL params
      window.history.replaceState({}, '', '/');
    } else if (payment === 'cancelled') {
      setPaymentStatus('cancelled');
      window.history.replaceState({}, '', '/');
    }
  }, [searchParams]);

  return (
    <div className="flex flex-col min-h-screen bg-white overflow-x-hidden">
      <Navbar />

      <main className="flex-grow">
        {paymentStatus === 'success' && (
          <div className="bg-green-600 text-white px-4 py-3 text-center font-bold animate-in slide-in-from-top duration-500">
            Payment successful! You now have full access to AI optimization and exports.
          </div>
        )}
        {paymentStatus === 'cancelled' && (
          <div className="bg-amber-500 text-white px-4 py-3 text-center font-bold animate-in slide-in-from-top duration-500">
            Payment cancelled.
          </div>
        )}
        {/* Hero Section */}
        <section className="pt-20 pb-32 px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-full border border-blue-100">
              <span className="flex">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} size={14} className="text-yellow-400 fill-current" />
                ))}
              </span>
              <span className="text-sm font-bold text-blue-900 tracking-tight">4.7/5.0 • 4.5 million users</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-7xl font-black text-gray-900 leading-[1.1] tracking-tight">
              Your Resume, Your Story.<br />
              <span className="text-blue-600">Check, Score & Optimize</span>{' '}
              Before You Apply
            </h1>

            <p className="text-xl text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed">
              We don't write your resume for you. We analyze it, score it, and show you what's missing — so you can fix it yourself and actually own your story.
            </p>

            <div className="pt-8">
              <FileDropZone onFileSelect={() => router.push('/upload')} />
            </div>

            <div className="pt-12 flex flex-wrap justify-center gap-8 opacity-40 grayscale group hover:grayscale-0 transition-all duration-700">
              <div className="text-xl font-bold">Google</div>
              <div className="text-xl font-bold">Amazon</div>
              <div className="text-xl font-bold">Microsoft</div>
              <div className="text-xl font-bold">Meta</div>
              <div className="text-xl font-bold">Apple</div>
              <div className="text-xl font-bold">Netflix</div>
            </div>
          </div>
        </section>

        {/* Philosophy / CEO Section */}
        <section className="py-24 px-4 bg-gradient-to-b from-white to-blue-50/30">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <div className="inline-block px-4 py-1.5 bg-gray-900 text-white rounded-lg text-xs font-black uppercase tracking-widest">
              Our Philosophy
            </div>

            <div className="bg-white rounded-3xl p-10 md:p-14 shadow-lg border border-gray-100 text-left space-y-6">
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed font-medium">
                "After conducting countless interviews, I noticed a troubling trend — candidates who couldn&apos;t explain their own resumes. AI tools had written their stories for them, leaving them unprepared when it mattered most."
              </p>

              <div className="flex items-center space-x-4 border-t border-gray-100 pt-6">
                <div className="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">KM</div>
                <div>
                  <div className="font-bold text-gray-900">Michael Meng</div>
                  <div className="text-sm text-gray-500">CEO, RezzoBot</div>
                  <a
                    href="https://linkedin.com/in/mikemeng428"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-800 mt-1 font-medium"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    <span>Connect with me</span>
                  </a>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                <p className="text-blue-900 font-semibold mb-2">💬 Talk to the Founder</p>
                <p className="text-blue-800 text-sm leading-relaxed">
                  I personally review every piece of feedback. Message me on{' '}
                  <a href="https://linkedin.com/in/mikemeng428" target="_blank" rel="noopener noreferrer" className="text-blue-700 underline font-medium">LinkedIn</a>
                  {' '}with your suggestions, questions, or for 1-on-1 career advice. I read every message.
                </p>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
                <p className="text-amber-900 font-semibold mb-2">⚠️ Our Promise</p>
                <p className="text-amber-800 text-sm leading-relaxed">
                  We give you insights, suggestions, and feedback — but we won&apos;t write your resume for you.
                  Your experiences are yours. Your voice is yours. We just help you present it better.
                  If you can&apos;t explain every word on your resume in an interview, we haven&apos;t done our job.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-gray-50/50 px-4 border-y border-gray-100">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-sm font-black text-blue-600 uppercase tracking-[0.2em]">Our Platform</h2>
              <h3 className="text-4xl font-black text-gray-900 tracking-tight">Everything you need to get hired</h3>
            </div>
            <FeatureCards />
          </div>
        </section>

        {/* Telegram Bot Section */}
        <section className="py-24 px-4 border-b border-gray-100">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div className="space-y-6">
                <div className="inline-block px-4 py-1.5 bg-gray-900 text-white rounded-lg text-xs font-black uppercase tracking-widest">Telegram Bot</div>
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
                  Check your ATS score on the go
                </h2>
                <p className="text-xl text-gray-500 font-medium leading-relaxed">
                  Use RezzoBot directly on Telegram — send your resume and job description, get your ATS score in seconds. No app install, no signup.
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                  <a
                    href="https://t.me/RezzoBot"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-3 bg-blue-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-blue-600 transition-all shadow-xl shadow-blue-200"
                  >
                    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current"><path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                    <span>Try on Telegram</span>
                  </a>
                  <span className="inline-flex items-center text-sm text-gray-400 font-medium">
                    Free · No signup
                  </span>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-50 animate-pulse"></div>
                <div className="relative bg-white p-6 rounded-3xl border border-gray-100 shadow-2xl">
                  <div className="flex items-center space-x-3 border-b border-gray-100 pb-4 mb-4">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">R</div>
                    <div>
                      <div className="font-bold text-sm text-gray-900">RezzoBot</div>
                      <div className="text-xs text-gray-400">@RezzoBot</div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-gray-50 rounded-2xl p-4 text-sm text-gray-700 font-medium">
                      Send me your resume and job description — I'll analyze it for ATS compatibility.
                    </div>
                    <div className="flex justify-end">
                      <div className="bg-blue-500 text-white rounded-2xl rounded-br-sm p-4 text-sm max-w-[80%]">
                        Your ATS score: <strong>86/100</strong> — missing 3 key keywords from the JD.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonial Section */}
        <section className="py-24 px-4 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div className="inline-block px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-black uppercase tracking-widest">Success Story</div>
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">"I landed a job at Google in 3 weeks."</h2>
                <p className="text-xl text-gray-500 font-medium leading-relaxed italic">
                  "The ATS score analysis was a game changer. I never realized how many keywords I was missing until I used RezzoBot. Within two weeks of optimizing, I had three interviews lined up."
                </p>
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-gray-200 rounded-full"></div>
                  <div>
                    <div className="font-bold text-gray-900">Sarah Jenkins</div>
                    <div className="text-sm text-gray-500 font-medium">Software Engineer @ Google</div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -top-12 -left-12 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-50 animate-pulse"></div>
                <div className="relative bg-white p-8 rounded-3xl border border-gray-100 shadow-2xl">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                      <span className="font-bold text-gray-900">Resume Optimization</span>
                      <span className="bg-green-100 text-green-700 text-xs font-black px-3 py-1 rounded-full">Score: 94/100</span>
                    </div>
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-start space-x-3">
                        <CheckCircle2 className="text-green-500 mt-1 shrink-0" size={18} />
                        <div className="h-4 bg-gray-100 rounded-full w-full"></div>
                      </div>
                    ))}
                    <div className="pt-4">
                      <button
                        onClick={() => router.push('/upload')}
                        className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold flex items-center justify-center space-x-2 hover:bg-blue-700 transition-all cursor-pointer"
                      >
                        <span>Get your score</span>
                        <ArrowRight size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-blue-600 px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
              Ready to land your dream job?
            </h2>
            <p className="text-xl text-blue-100 font-medium opacity-90">
              Join 4.5 million users who checked and optimized their resumes with RezzoBot.
            </p>
            <Link href="/upload" className="inline-block bg-white text-blue-600 px-10 py-5 rounded-2xl font-black text-lg hover:bg-gray-50 transition-all shadow-xl shadow-blue-900/20">
              Check your resume for free
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-pulse text-gray-400 font-bold">Loading...</div></div>}>
      <LandingContent />
    </Suspense>
  );
}
