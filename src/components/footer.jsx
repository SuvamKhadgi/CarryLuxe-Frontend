import { Facebook, Globe, Instagram, Mail, MapPin, Phone, Send, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand & Description */}
          <div className="col-span-1">
            <div className="flex items-center mb-6">
              <div className="w-20  rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-lg"><img src='../src/assets/images/logo.png'></img></span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">LuxeCarry</h3>
                <p className="text-xs text-gray-500">Carry Style, Carry Confidence</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              LuxeCarry brings you a curated collection of stylish and functional bags for every occasion. Shop with ease, style with confidence.            </p>
            <div className="space-y-2">
              <div className="flex items-center text-gray-600 text-sm">
                <MapPin className="w-4 h-4 text-red-500 mr-2" />
                <span>Dillibazaar-29, Kathmandu, Nepal</span>
              </div>
              <div className="flex items-center text-gray-600 text-sm">
                <Mail className="w-4 h-4 text-red-500 mr-2" />
                <span>luxecarry@gmail.com</span>
              </div>
              <div className="flex items-center text-gray-600 text-sm">
                <Phone className="w-4 h-4 text-red-500 mr-2" />
                <span>+91 123 4567890</span>
              </div>
            </div>
          </div>

          {/* Company */}
          <div className="col-span-1">
            <h4 className="text-lg font-semibold text-gray-800 mb-6">Company</h4>
            <ul className="space-y-3">
              <li>
                <a href="/FAQ" className="text-gray-600 hover:text-gray-800 transition-colors text-sm">About Us</a>
              </li>
              <li>
                <a href="/myorders" className="text-gray-600 hover:text-gray-800 transition-colors text-sm">Delivery Information</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-800 transition-colors text-sm">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-800 transition-colors text-sm">Terms & Conditions</a>
              </li>
              <li>
                <a href="/contactus" className="text-gray-600 hover:text-gray-800 transition-colors text-sm">Contact Us</a>
              </li>
              <li>
                <a href="/contactus" className="text-gray-600 hover:text-gray-800 transition-colors text-sm">Support Center</a>
              </li>
            </ul>
          </div>

          {/* Category */}
          <div className="col-span-1">
            <h4 className="text-lg font-semibold text-gray-800 mb-6">Category</h4>
            <ul className="space-y-3">
              <li>
                <a href="/travelbags" className="text-gray-600 hover:text-gray-800 transition-colors text-sm">Travel Bags</a>
              </li>
              <li>
                <a href="/officebags" className="text-gray-600 hover:text-gray-800 transition-colors text-sm">Office Bags</a>
              </li>
              <li>
                <a href="/womenbags" className="text-gray-600 hover:text-gray-800 transition-colors text-sm">Women Bags</a>
              </li>
              <li>
                <a href="/menbags" className="text-gray-600 hover:text-gray-800 transition-colors text-sm">Men Bags</a>
              </li>
              <li>
                <a href="/schoolbags" className="text-gray-600 hover:text-gray-800 transition-colors text-sm">School Bags</a>
              </li>
              <li>
                <a href="/partybags" className="text-gray-600 hover:text-gray-800 transition-colors text-sm">Party Bags</a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-span-1">
            <h4 className="text-lg font-semibold text-gray-800 mb-6">Subscribe Our Newsletter</h4>
            <div className="mb-6">
              <div className="flex">
                <input
                  type="email"
                  placeholder="Will Be Avilable Soon..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                <button className="bg-gray-800 text-white px-4 py-3 rounded-r-lg hover:bg-gray-700 transition-colors">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors">
                <Facebook className="w-4 h-4 text-gray-600" />
              </a>
              <a href="#" className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors">
                <Twitter className="w-4 h-4 text-gray-600" />
              </a>
              <a href="#" className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors">
                <Globe className="w-4 h-4 text-gray-600" />
              </a>
              <a href="#" className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors">
                <Instagram className="w-4 h-4 text-gray-600" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600">
            © 2025 &nbsp;&nbsp;&nbsp;&nbsp; All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;