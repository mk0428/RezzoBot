export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 max-w-md mx-auto md:max-w-none md:mx-0">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Product</h3>
            <ul className="space-y-2">
              <li><a href="/upload" className="text-gray-500 hover:text-blue-600 text-sm">ATS Scanner</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Support</h3>
            <ul className="space-y-2">
              <li><a href="/upload" className="text-gray-500 hover:text-blue-600 text-sm">Contact</a></li>
            </ul>
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
