import Link from 'next/link';
import { FileText, Target, Zap, ChevronRight, ArrowRight } from 'lucide-react';

const features = [
  {
    title: 'Analyze',
    description: 'Upload your resume and get instant ATS compatibility analysis with detailed, actionable feedback.',
    icon: FileText,
    color: 'bg-blue-50 text-blue-600',
    hoverColor: 'group-hover:bg-blue-100',
    href: '/analyze'
  },
  {
    title: 'Score',
    description: 'Get an instant ATS score benchmarked against your industry — free daily analysis.',
    icon: Zap,
    color: 'bg-yellow-50 text-yellow-600',
    hoverColor: 'group-hover:bg-yellow-100',
    href: '/score'
  },
  {
    title: 'Target',
    description: 'Match your resume to a specific job description to increase your interview chances.',
    icon: Target,
    color: 'bg-green-50 text-green-600',
    hoverColor: 'group-hover:bg-green-100',
    href: '/upload'
  }
];

export default function FeatureCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {features.map((feature, idx) => (
        <Link
          key={idx}
          href={feature.href}
          className="group bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-200/20 transition-all block"
        >
          <div className={`w-14 h-14 ${feature.color} ${feature.hoverColor} rounded-xl flex items-center justify-center mb-6 transition-colors duration-300`}>
            <feature.icon className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3 tracking-tight">{feature.title}</h3>
          <p className="text-gray-500 text-sm leading-relaxed mb-6 font-medium">
            {feature.description}
          </p>
          <div className="flex items-center text-sm font-bold text-blue-600 space-x-1 group-hover:translate-x-1 transition-transform">
            <span>Learn more</span>
            <ArrowRight size={16} />
          </div>
        </Link>
      ))}
    </div>
  );
}
