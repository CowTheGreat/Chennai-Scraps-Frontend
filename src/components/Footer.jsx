import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-200 border-t border-slate-800 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <Link to="/" className="inline-flex items-center gap-3">
            <img src="/logo.png" alt="Chennai Scraps logo" className="w-10 h-10 object-contain" />
            <span className="text-xl font-bold text-white">Chennai Scraps</span>
          </Link>
          <p className="mt-3 text-sm text-slate-400 leading-6">
            Responsible recycling and doorstep pickup for used electronics and appliances.
          </p>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-3">Company</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about-us" className="hover:text-blue-400">About Us</Link></li>
            <li><Link to="/sell-used-appliances" className="hover:text-blue-400">Sell Now</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-3">Policies</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/policies/cancellation" className="hover:text-blue-400">Cancellation Policy</Link></li>
            <li><Link to="/policies/shipping" className="hover:text-blue-400">Shipping Policy</Link></li>
            <li><Link to="/policies/privacy" className="hover:text-blue-400">Privacy Policy</Link></li>
            <li><Link to="/policies/terms" className="hover:text-blue-400">Terms and Conditions</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-3">Help</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/faqs" className="hover:text-blue-400">FAQs</Link></li>
            <li><Link to="/services" className="hover:text-blue-400">Bulk Pickup Request</Link></li>
            <li><Link to="/services" className="hover:text-blue-400">Service</Link></li>
          </ul>
          <p className="mt-4 text-sm text-slate-400">Support: care@chennaiscraps.in</p>
        </div>
      </div>

      <div className="border-t border-slate-800 py-4 px-4 sm:px-6">
        <p className="max-w-7xl mx-auto text-xs text-slate-500">© {new Date().getFullYear()} Chennai Scraps. All rights reserved.</p>
      </div>
    </footer>
  );
}
