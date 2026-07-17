export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Product</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-500 hover:text-blue-600 text-sm">Resume Builder</a></li>
              <li><a href="#" className="text-gray-500 hover:text-blue-600 text-sm">AI Resume Editor</a></li>
              <li><a href="#" className="text-gray-500 hover:text-blue-600 text-sm">ATS Checker</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-500 hover:text-blue-600 text-sm">Resume Samples</a></li>
              <li><a href="#" className="text-gray-500 hover:text-blue-600 text-sm">Career Advice</a></li>
              <li><a href="#" className="text-gray-500 hover:text-blue-600 text-sm">ATS Guide</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-500 hover:text-blue-600 text-sm">Help Center</a></li>
              <li><a href="#" className="text-gray-500 hover:text-blue-600 text-sm">Contact Us</a></li>
              <li><a href="#" className="text-gray-500 hover:text-blue-600 text-sm">Privacy Policy</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-500 hover:text-blue-600 text-sm">About Us</a></li>
              <li><a href="#" className="text-gray-500 hover:text-blue-600 text-sm">Blog</a></li>
              <li><a href="#" className="text-gray-500 hover:text-blue-600 text-sm">Careers</a></li>
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
