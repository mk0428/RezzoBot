'use client';

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FileDropZone from "@/components/FileDropZone";
import FeatureCards from "@/components/FeatureCards";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Star, ArrowRight, CheckCircle2 } from "lucide-react";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen bg-white overflow-x-hidden">
      <Navbar />

      <main className="flex-grow">
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

            <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-[1.1] tracking-tight">
              Free AI Resume Builder. <br />
              <span className="text-blue-600">Build, improve, & score </span>
              your resume
            </h1>

            <p className="text-xl text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed">
              The smartest way to build a resume. RezzoBot helps you create a professional resume that gets past ATS and lands you more interviews.
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
                      <button className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold flex items-center justify-center space-x-2">
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
              Join 4.5 million users who built their careers with our AI tools.
            </p>
            <Link href="/upload" className="inline-block bg-white text-blue-600 px-10 py-5 rounded-2xl font-black text-lg hover:bg-gray-50 transition-all shadow-xl shadow-blue-900/20">
              Create your resume for free
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
