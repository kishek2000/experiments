import { Link } from "@remix-run/react";
import { Phone, Mail, Building2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#043560] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Column 1 - Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-[#FC6603] rounded-lg p-2">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 40 40"
                  fill="none"
                  className="text-white"
                >
                  <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dy=".35em"
                    fontSize="18"
                    fontWeight="bold"
                    fill="white"
                  >
                    VT
                  </text>
                </svg>
              </div>
              <span className="text-xl font-bold">Vivance Travels</span>
            </div>
            <p className="text-sm text-gray-300 mb-4">
              Your trusted partner for unforgettable journeys across the globe.
            </p>
            <div className="space-y-2 text-sm">
              <a
                href="#"
                className="flex items-center gap-2 text-gray-300 hover:text-[#FC6603] transition-colors"
              >
                <Building2 className="w-4 h-4" />
                <span>About us</span>
              </a>
              <a
                href="#"
                className="flex items-center gap-2 text-gray-300 hover:text-[#FC6603] transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>Contact us</span>
              </a>
            </div>
          </div>

          {/* Column 2 - Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/packages"
                  className="text-gray-300 hover:text-[#FC6603] transition-colors"
                >
                  Holiday Packages
                </Link>
              </li>
              <li>
                <Link
                  to="/destinations"
                  className="text-gray-300 hover:text-[#FC6603] transition-colors"
                >
                  Destinations
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-[#FC6603] transition-colors"
                >
                  Flight Booking
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3 - Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Customer Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-[#FC6603] transition-colors"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-[#FC6603] transition-colors"
                >
                  Cancel Your Flight
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-[#FC6603] transition-colors"
                >
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-[#FC6603] transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4 - Contact & Newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Get In Touch</h4>
            <div className="space-y-3 mb-6 text-sm">
              <a
                href="tel:+919625582301"
                className="flex items-center gap-2 text-gray-300 hover:text-[#FC6603] transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>+91 9625582301</span>
              </a>
              <a
                href="mailto:info@vivancetravels.com"
                className="flex items-center gap-2 text-gray-300 hover:text-[#FC6603] transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>info@vivancetravels.com</span>
              </a>
            </div>

            <div className="mb-4">
              <h5 className="font-semibold mb-2 text-sm">
                Subscribe to our newsletter
              </h5>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 rounded-lg text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#FC6603]"
                />
                <button className="bg-[#FC6603] hover:bg-[#e55a02] px-4 py-2 rounded-lg font-semibold transition-colors text-sm">
                  Subscribe
                </button>
              </div>
            </div>

            {/* Social Media */}
            <div className="flex gap-3">
              {[
                {
                  icon: "facebook",
                  path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
                },
                {
                  icon: "twitter",
                  path: "M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z",
                },
                {
                  icon: "instagram",
                  path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z",
                },
              ].map((social, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="w-9 h-9 bg-white/10 hover:bg-[#FC6603] rounded-full flex items-center justify-center transition-all"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d={social.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              © 2025 Vivance Travels. All rights reserved.
            </p>
            <div className="text-sm text-gray-400">
              <span>24/7 Customer Support Available</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
