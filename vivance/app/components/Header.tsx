import { useState } from "react";
import { Link } from "@remix-run/react";
import { Plane, MapPin, Menu, X, Globe, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-gradient-to-br from-[#FC6603] to-[#ff8534] rounded-xl p-2.5 shadow-md group-hover:shadow-lg transition-all">
              <svg
                width="32"
                height="32"
                viewBox="0 0 40 40"
                fill="none"
                className="text-white"
              >
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dy=".35em"
                  fontSize="20"
                  fontWeight="bold"
                  fill="white"
                  fontFamily="Roboto"
                >
                  VT
                </text>
              </svg>
            </div>
            <div className="hidden sm:block">
              <span className="text-[#FC6603] text-xl font-bold block leading-tight">
                Vivance Travels
              </span>
              <span className="text-[#043560] text-xs font-medium">
                Your journey begins here
              </span>
            </div>
          </Link>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/flights"
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-[#FC6603] hover:bg-orange-50 rounded-lg transition-all font-medium"
            >
              <Plane className="w-4 h-4" />
              <span>Flights</span>
            </Link>
            <Link
              to="/packages"
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-[#FC6603] hover:bg-orange-50 rounded-lg transition-all font-medium"
            >
              <MapPin className="w-4 h-4" />
              <span>Holiday Packages</span>
            </Link>
            <Link
              to="/destinations"
              className="px-4 py-2 text-gray-700 hover:text-[#FC6603] hover:bg-orange-50 rounded-lg transition-all font-medium"
            >
              Destinations
            </Link>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button className="hidden md:block px-6 py-2.5 text-[#043560] hover:text-[#FC6603] transition-colors font-medium border border-gray-200 rounded-lg hover:border-[#FC6603]">
              Sign In / Sign Up
            </button>
            <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
              <img
                src="https://flagcdn.com/w20/in.png"
                alt="India"
                className="w-5 h-3"
              />
              <span className="text-sm font-medium text-gray-700">INR</span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-gray-100 bg-white overflow-hidden"
          >
            <div className="px-4 py-4 space-y-2">
              {/* Navigation Links */}
              <Link
                to="/flights"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-[#FC6603] hover:bg-orange-50 rounded-xl transition-all font-medium"
              >
                <Plane className="w-5 h-5 text-[#FC6603]" />
                <span>Flights</span>
              </Link>
              <Link
                to="/packages"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-[#FC6603] hover:bg-orange-50 rounded-xl transition-all font-medium"
              >
                <MapPin className="w-5 h-5 text-[#FC6603]" />
                <span>Holiday Packages</span>
              </Link>
              <Link
                to="/destinations"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-[#FC6603] hover:bg-orange-50 rounded-xl transition-all font-medium"
              >
                <Globe className="w-5 h-5 text-[#FC6603]" />
                <span>Destinations</span>
              </Link>

              {/* Divider */}
              <div className="border-t border-gray-100 my-3" />

              {/* Currency Selector */}
              <div className="flex items-center gap-3 px-4 py-3">
                <img
                  src="https://flagcdn.com/w20/in.png"
                  alt="India"
                  className="w-5 h-3"
                />
                <span className="text-sm font-medium text-gray-700">
                  INR - Indian Rupee
                </span>
              </div>

              {/* Contact */}
              <a
                href="tel:+919625582301"
                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-[#FC6603] hover:bg-orange-50 rounded-xl transition-all font-medium"
              >
                <Phone className="w-5 h-5 text-[#FC6603]" />
                <span>+91 9625582301</span>
              </a>

              {/* Sign In Button */}
              <button className="w-full mt-2 px-6 py-3 bg-[#FC6603] hover:bg-[#e55a02] text-white font-bold rounded-xl transition-colors">
                Sign In / Sign Up
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
