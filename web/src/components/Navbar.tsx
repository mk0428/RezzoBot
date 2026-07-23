'use client';

import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">R</span>
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">RezzoBot</span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/upload" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">ATS Scanner</Link>
            <Link href="/blog" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Blog</Link>
            
            
            <Link href="/pricing" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Pricing</Link>
            <div className="flex items-center space-x-4 pl-4 border-l border-gray-100">
              
              <Link href="/upload" className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all shadow-sm">
                Try for free
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 px-4 py-4 space-y-4">
          <Link href="/upload" className="block text-base font-medium text-gray-600">ATS Scanner</Link>
              <Link href="/blog" className="block text-base font-medium text-gray-600">Blog</Link>
          
          
          <Link href="/pricing" className="block text-base font-medium text-gray-600">Pricing</Link>
          <div className="pt-4 border-t border-gray-100 flex flex-col space-y-4">
            
            <Link href="/upload" className="bg-blue-600 text-white px-4 py-3 rounded-lg text-base font-semibold text-center">
              Try for free
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
