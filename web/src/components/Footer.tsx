export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-md mx-auto md:max-w-none md:mx-0">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Product</h3>
            <ul className="space-y-2">
              <li><a href="/upload" className="text-gray-500 hover:text-blue-600 text-sm">ATS Scanner</a></li>
              <li><a href="/pricing" className="text-gray-500 hover:text-blue-600 text-sm">Pricing</a></li>
              <li><a href="/blog" className="text-gray-500 hover:text-blue-600 text-sm">Blog</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://linkedin.com/in/mikemeng428"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-blue-600 text-sm"
                >
                  Contact Founder
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Support Us</h3>
            <a
              href="https://buy.stripe.com/eVqcN78QdeJPbUP7JT48000"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-amber-50 border border-amber-200 text-amber-800 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-amber-100 transition-all"
            >
              <span>☕</span>
              <span>Buy me a coffee</span>
            </a>
          </div>
        </div>
        <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
          <p>&copy; 2026 RezzoBot AI. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <span>Made with ❤️ for Job Seekers</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
