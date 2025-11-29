import { motion } from "framer-motion";
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Plane,
  Send,
  Shield,
  Clock,
  Award,
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: "About Us", href: "#" },
    { label: "Our Team", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Contact Us", href: "#" },
  ];

  const services = [
    { label: "Flight Booking", href: "#" },
    { label: "Hotel Reservations", href: "#" },
    { label: "Holiday Packages", href: "#" },
    { label: "Visa Assistance", href: "#" },
  ];

  const support = [
    { label: "FAQs", href: "#" },
    { label: "Terms & Conditions", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Cancellation Policy", href: "#" },
  ];

  const popularRoutes = [
    "Delhi - Mumbai",
    "Bangalore - Hyderabad",
    "Dubai - Hyderabad",
    "New York - Bangalore",
    "Chennai - Mumbai",
    "Goa - Dubai",
  ];

  return (
    <footer className="bg-vivance-blue-dark text-white">
      {/* Newsletter Section */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <motion.h3
                className="text-2xl lg:text-3xl font-bold mb-3"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                Don't Miss Our <span className="text-vivance-orange">Best Deals</span>
              </motion.h3>
              <p className="text-white/60">
                Subscribe to our newsletter and get exclusive offers, travel tips, and more!
              </p>
            </div>
            <motion.div
              className="flex flex-col sm:flex-row gap-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="relative flex-1">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-vivance-orange transition-colors"
                />
              </div>
              <motion.button
                className="px-8 py-4 bg-vivance-orange text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-vivance-orange/30"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Subscribe
                <Send className="w-4 h-4" />
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-vivance-orange rounded-lg flex items-center justify-center">
                <svg viewBox="0 0 40 40" className="w-8 h-8 text-white">
                  <path
                    fill="currentColor"
                    d="M8 12 L12 8 L16 12 L16 28 L12 28 L12 16 L8 12 Z M24 12 L28 8 L32 12 L28 16 L28 28 L24 28 L24 16 L20 12 Z M20 20 L24 16 L28 20 L24 24 Z"
                  />
                </svg>
              </div>
              <span className="text-2xl font-bold">
                Vivance<span className="text-vivance-orange">Travels</span>
              </span>
            </div>
            <p className="text-white/60 mb-6 max-w-xs">
              Your trusted partner for flights, hotels, and holiday packages. Making travel dreams
              come true since 2015.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <a
                href="tel:+919625582301"
                className="flex items-center gap-3 text-white/70 hover:text-vivance-orange transition-colors"
              >
                <Phone className="w-5 h-5" />
                +91 9625582301
              </a>
              <a
                href="mailto:info@vivancetravels.com"
                className="flex items-center gap-3 text-white/70 hover:text-vivance-orange transition-colors"
              >
                <Mail className="w-5 h-5" />
                info@vivancetravels.com
              </a>
              <div className="flex items-start gap-3 text-white/70">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>New Delhi, India</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3 mt-6">
              {[Facebook, Twitter, Youtube, Instagram].map((Icon, index) => (
                <motion.a
                  key={index}
                  href="#"
                  className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-vivance-orange transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-4">Company</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-white/60 hover:text-vivance-orange transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bold text-lg mb-4">Services</h4>
            <ul className="space-y-3">
              {services.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-white/60 hover:text-vivance-orange transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold text-lg mb-4">Support</h4>
            <ul className="space-y-3">
              {support.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-white/60 hover:text-vivance-orange transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Routes */}
          <div>
            <h4 className="font-bold text-lg mb-4">Popular Routes</h4>
            <ul className="space-y-3">
              {popularRoutes.map((route) => (
                <li key={route}>
                  <a
                    href="#"
                    className="text-white/60 hover:text-vivance-orange transition-colors flex items-center gap-2"
                  >
                    <Plane className="w-3 h-3" />
                    {route}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-wrap justify-center gap-8 lg:gap-16">
            <div className="flex items-center gap-3 text-white/60">
              <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-vivance-orange" />
              </div>
              <div>
                <p className="font-semibold text-white">Secure Payments</p>
                <p className="text-sm">100% Protected</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-white/60">
              <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-vivance-orange" />
              </div>
              <div>
                <p className="font-semibold text-white">24/7 Support</p>
                <p className="text-sm">Always Available</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-white/60">
              <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-vivance-orange" />
              </div>
              <div>
                <p className="font-semibold text-white">IATA Accredited</p>
                <p className="text-sm">Certified Agent</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-white/60 text-sm">
            <p>© {currentYear} Vivance Travels. All rights reserved.</p>
            <p>Made with ❤️ in India</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

