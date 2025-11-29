import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plane, Menu, X, ChevronDown, Globe, User } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { label: "Flights", href: "#flights", icon: <Plane className="w-4 h-4" /> },
    { label: "Holidays", href: "#holidays" },
    { label: "Hotels", href: "#hotels" },
    { label: "Deals", href: "#deals" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-vivance-blue/95 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <motion.a
            href="/"
            className="flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-vivance-orange rounded-lg flex items-center justify-center shadow-lg shadow-vivance-orange/30">
              <svg viewBox="0 0 40 40" className="w-7 h-7 lg:w-8 lg:h-8 text-white">
                <path
                  fill="currentColor"
                  d="M8 12 L12 8 L16 12 L16 28 L12 28 L12 16 L8 12 Z M24 12 L28 8 L32 12 L28 16 L28 28 L24 28 L24 16 L20 12 Z M20 20 L24 16 L28 20 L24 24 Z"
                />
              </svg>
            </div>
            <div className="hidden sm:block">
              <span className="text-xl lg:text-2xl font-bold text-white tracking-tight">
                Vivance<span className="text-vivance-orange">Travels</span>
              </span>
            </div>
          </motion.a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <motion.a
                key={item.label}
                href={item.href}
                className="px-4 py-2 text-white/80 hover:text-white font-medium text-sm flex items-center gap-2 rounded-lg hover:bg-white/10 transition-colors"
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
              >
                {item.icon}
                {item.label}
              </motion.a>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-1 text-white/80 hover:text-white cursor-pointer group">
              <Globe className="w-4 h-4" />
              <span className="text-sm font-medium">INR</span>
              <ChevronDown className="w-3 h-3 group-hover:rotate-180 transition-transform" />
            </div>

            <motion.button
              className="hidden sm:flex items-center gap-2 px-4 py-2 text-white/90 hover:text-white text-sm font-medium rounded-lg hover:bg-white/10 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <User className="w-4 h-4" />
              Sign In
            </motion.button>

            <motion.button
              className="hidden sm:block px-5 py-2.5 bg-vivance-orange text-white font-semibold text-sm rounded-lg shadow-lg shadow-vivance-orange/30 hover:bg-vivance-orange-light transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Book Now
            </motion.button>

            <motion.button
              className="lg:hidden p-2 text-white rounded-lg hover:bg-white/10"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              whileTap={{ scale: 0.9 }}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-vivance-blue-dark border-t border-white/10"
          >
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-2">
              {navItems.map((item, index) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 text-white/80 hover:text-white font-medium rounded-lg hover:bg-white/10 transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.icon}
                  {item.label}
                </motion.a>
              ))}
              <div className="pt-2 border-t border-white/10">
                <motion.button
                  className="w-full px-4 py-3 bg-vivance-orange text-white font-semibold rounded-lg"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Book Now
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;

