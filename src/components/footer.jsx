import { Facebook, Globe, Instagram, Mail, MapPin, Phone, Send, Twitter } from 'lucide-react';

const Footer = () => {
 return (
  <footer className="bg-gradient-to-t from-gray-50 via-white to-gray-100 pt-14 pb-8 border-t shadow-inner">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 md:gap-16">
        {/* Brand & Description */}
        <div>
          <div className="flex items-center mb-5">
            <div className="w-14 h-14 rounded-xl bg-white shadow flex items-center justify-center mr-3 ring-2 ring-emerald-400">
              <img src='../src/assets/images/logo.png' alt="CarryLuxe Logo" className="h-10 w-auto" />
            </div>
            <div>
              <h3 className="text-2xl font-extrabold text-emerald-700">CarryLuxe</h3>
              <p className="text-xs text-gray-500 mt-1">Carry Style, Carry Confidence</p>
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-5">
            CarryLuxe brings you a curated collection of stylish and functional bags for every occasion. Shop with ease, style with confidence.
          </p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center text-gray-600">
              <MapPin className="w-4 h-4 text-emerald-500 mr-2" />
              Dillibazaar-29, Kathmandu, Nepal
            </li>
            <li className="flex items-center text-gray-600">
              <Mail className="w-4 h-4 text-emerald-500 mr-2" />
              CarryLuxe@gmail.com
            </li>
            <li className="flex items-center text-gray-600">
              <Phone className="w-4 h-4 text-emerald-500 mr-2" />
              +91 123 4567890
            </li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="text-lg font-bold text-gray-800 mb-5">Company</h4>
          <ul className="space-y-3">
            <li>
              <a href="/FAQ" className="text-gray-600 hover:text-emerald-600 transition">About Us</a>
            </li>
            <li>
              <a href="/myorders" className="text-gray-600 hover:text-emerald-600 transition">Delivery Information</a>
            </li>
            <li>
              <a href="#" className="text-gray-600 hover:text-emerald-600 transition">Privacy Policy</a>
            </li>
            <li>
              <a href="#" className="text-gray-600 hover:text-emerald-600 transition">Terms & Conditions</a>
            </li>
            <li>
              <a href="/contactus" className="text-gray-600 hover:text-emerald-600 transition">Contact Us</a>
            </li>
            <li>
              <a href="/contactus" className="text-gray-600 hover:text-emerald-600 transition">Support Center</a>
            </li>
          </ul>
        </div>

        {/* Category */}
        <div>
          <h4 className="text-lg font-bold text-gray-800 mb-5">Category</h4>
          <ul className="space-y-3">
            <li><a href="/travelbags" className="text-gray-600 hover:text-emerald-600 transition">Travel Bags</a></li>
            <li><a href="/officebags" className="text-gray-600 hover:text-emerald-600 transition">Office Bags</a></li>
            <li><a href="/womenbags" className="text-gray-600 hover:text-emerald-600 transition">Women Bags</a></li>
            <li><a href="/menbags" className="text-gray-600 hover:text-emerald-600 transition">Men Bags</a></li>
            <li><a href="/schoolbags" className="text-gray-600 hover:text-emerald-600 transition">School Bags</a></li>
            <li><a href="/partybags" className="text-gray-600 hover:text-emerald-600 transition">Party Bags</a></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="text-lg font-bold text-gray-800 mb-5">Subscribe Our Newsletter</h4>
          <div className="mb-6">
            <div className="flex">
              <input
                type="email"
                placeholder="Will Be Available Soon..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm bg-gray-100"
                disabled
              />
              <button className="bg-emerald-600 text-white px-4 py-3 rounded-r-lg hover:bg-emerald-700 transition-colors" disabled>
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="flex space-x-3">
            <a href="#" className="w-8 h-8 bg-white shadow rounded-full flex items-center justify-center hover:bg-emerald-100 transition">
              <Facebook className="w-4 h-4 text-emerald-600" />
            </a>
            <a href="#" className="w-8 h-8 bg-white shadow rounded-full flex items-center justify-center hover:bg-emerald-100 transition">
              <Twitter className="w-4 h-4 text-emerald-600" />
            </a>
            <a href="#" className="w-8 h-8 bg-white shadow rounded-full flex items-center justify-center hover:bg-emerald-100 transition">
              <Globe className="w-4 h-4 text-emerald-600" />
            </a>
            <a href="#" className="w-8 h-8 bg-white shadow rounded-full flex items-center justify-center hover:bg-emerald-100 transition">
              <Instagram className="w-4 h-4 text-emerald-600" />
            </a>
          </div>
        </div>
      </div>
      {/* Bottom Bar */}
      <div className="mt-12 pt-8 border-t border-gray-200 text-center">
        <p className="text-sm text-gray-500 tracking-wide">
          © 2025 &nbsp;&nbsp; All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);
}
export default Footer;