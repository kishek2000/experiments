import type { Route } from "./+types/home";
import { useState, useEffect } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plane,
  Calendar,
  Users,
  Search,
  ArrowRightLeft,
  MapPin,
  Star,
  ArrowRight,
  Sparkles,
  Shield,
  Heart,
  Award,
  Phone,
} from "lucide-react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Vivance Travels - Your Trusted Journey Companion" },
    {
      name: "description",
      content:
        "Experience authentic travel with trust and commitment. Discover spiritual journeys, cultural experiences, and unforgettable adventures.",
    },
  ];
}

const heroSlides = [
  {
    image:
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1920&q=80",
    title: "Sacred Journeys",
    subtitle: "Experience the spiritual heart of India",
    accent: "Kumbh Mela 2025",
  },
  {
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920&q=80",
    title: "Desert Dreams",
    subtitle: "Where tradition meets luxury",
    accent: "Dubai & Beyond",
  },
  {
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1920&q=80",
    title: "Island Paradise",
    subtitle: "Discover serenity in nature's embrace",
    accent: "Bali Experience",
  },
  {
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1920&q=80",
    title: "Cultural Odyssey",
    subtitle: "Walk through centuries of art and history",
    accent: "European Heritage",
  },
];

const featuredPackages = [
  {
    id: 1,
    title: "Kumbh Mela: Sacred Confluence Experience",
    location: "Prayagraj, India",
    image:
      "https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80",
    nights: 3,
    days: 4,
    price: 15000,
    rating: 4.8,
    reviews: 234,
    tag: "Spiritual Journey",
  },
  {
    id: 2,
    title: "Dubai: City of Gold & Desert Sands",
    location: "Dubai, UAE",
    image:
      "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&q=80",
    nights: 5,
    days: 6,
    price: 45000,
    rating: 4.9,
    reviews: 412,
    tag: "Luxury Escape",
  },
  {
    id: 3,
    title: "Bali: Island of Gods & Beaches",
    location: "Bali, Indonesia",
    image:
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80",
    nights: 7,
    days: 8,
    price: 52000,
    rating: 4.9,
    reviews: 567,
    tag: "Beach Paradise",
  },
];

const trustValues = [
  {
    icon: Shield,
    title: "Trust & Integrity",
    description:
      "Every journey backed by our commitment to your safety and satisfaction",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: Heart,
    title: "Crafted with Care",
    description:
      "Authentic experiences curated with passion and local expertise",
    color: "from-orange-500 to-amber-500",
  },
  {
    icon: Award,
    title: "Excellence Always",
    description:
      "Recognized for delivering exceptional travel experiences since inception",
    color: "from-orange-600 to-orange-400",
  },
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [tripType, setTripType] = useState<
    "oneWay" | "roundTrip" | "multiCity"
  >("oneWay");

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* Hero Section with Elegant Slideshow */}
      <section className="relative h-screen overflow-hidden">
        {/* Slideshow Background */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${heroSlides[currentSlide].image})`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className="group relative"
            >
              <div
                className={`h-1 rounded-full transition-all duration-500 ${
                  idx === currentSlide
                    ? "w-16 bg-[#FC6603]"
                    : "w-8 bg-white/40 group-hover:bg-white/60"
                }`}
              />
            </button>
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left side - Hero Text */}
              <div className="lg:col-span-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  >
                    {/* Accent Tag */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="inline-flex items-center gap-2 bg-[#FC6603] text-white px-6 py-3 rounded-full mb-6 shadow-xl"
                    >
                      <Sparkles className="w-5 h-5" />
                      <span className="font-bold text-sm tracking-wider">
                        {heroSlides[currentSlide].accent}
                      </span>
                    </motion.div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                      <span className="block">
                        {heroSlides[currentSlide].title}
                      </span>
                    </h1>
                    <p className="text-lg md:text-xl lg:text-2xl text-gray-200 mb-8 font-light">
                      {heroSlides[currentSlide].subtitle}
                    </p>

                    <div className="flex flex-wrap gap-4">
                      <Link
                        to="/packages"
                        className="group inline-flex items-center gap-3 bg-[#FC6603] hover:bg-[#e55a02] text-white font-bold px-8 py-4 rounded-full transition-all shadow-2xl hover:shadow-orange-500/50"
                      >
                        <span>Explore Journeys</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                      <Link
                        to="/destinations"
                        className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white font-bold px-8 py-4 rounded-full transition-all border-2 border-white/30"
                      >
                        <span>View Destinations</span>
                      </Link>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Right side - Floating Search Card */}
              <div className="lg:col-span-6 hidden lg:block">
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border-2 border-white/20"
                >
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Search Flights
                    </h3>
                    <p className="text-sm text-gray-600">
                      Find your perfect journey
                    </p>
                  </div>

                  {/* Trip Type Tabs */}
                  <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-xl">
                    {[
                      { value: "oneWay", label: "One Way" },
                      { value: "roundTrip", label: "Return" },
                    ].map((type) => (
                      <button
                        key={type.value}
                        onClick={() =>
                          setTripType(type.value as typeof tripType)
                        }
                        className={`flex-1 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                          tripType === type.value
                            ? "bg-[#FC6603] text-white shadow-md"
                            : "text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>

                  {/* Search Fields - Vertical Layout */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-2">
                        From
                      </label>
                      <div className="relative">
                        <Plane className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FC6603]" />
                        <input
                          type="text"
                          placeholder="Departure City"
                          className="w-full pl-10 pr-3 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-[#FC6603] focus:bg-white focus:outline-none transition-all text-sm"
                        />
                      </div>
                    </div>

                    <div className="flex justify-center -my-2">
                      <button className="p-2 rounded-full bg-orange-50 hover:bg-[#FC6603] hover:text-white text-[#FC6603] transition-all">
                        <ArrowRightLeft className="w-4 h-4 rotate-90" />
                      </button>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-2">
                        To
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FC6603]" />
                        <input
                          type="text"
                          placeholder="Destination City"
                          className="w-full pl-10 pr-3 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-[#FC6603] focus:bg-white focus:outline-none transition-all text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-2">
                          Departure
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FC6603]" />
                          <input
                            type="date"
                            className="w-full pl-10 pr-2 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-[#FC6603] focus:bg-white focus:outline-none transition-all text-xs"
                          />
                        </div>
                      </div>

                      {tripType === "roundTrip" && (
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-2">
                            Return
                          </label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FC6603]" />
                            <input
                              type="date"
                              className="w-full pl-10 pr-2 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-[#FC6603] focus:bg-white focus:outline-none transition-all text-xs"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-2">
                        Travelers
                      </label>
                      <div className="relative">
                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FC6603]" />
                        <input
                          type="text"
                          value="1 Traveller | Economy"
                          readOnly
                          className="w-full pl-10 pr-3 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl cursor-pointer text-sm"
                        />
                      </div>
                    </div>

                    <button className="w-full bg-gradient-to-r from-[#FC6603] to-[#ff7a1a] hover:from-[#e55a02] hover:to-[#FC6603] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl">
                      <Search className="w-5 h-5" />
                      <span>Search Flights</span>
                    </button>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 text-white/60 text-sm"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs tracking-widest">SCROLL</span>
            <div className="w-px h-12 bg-gradient-to-b from-white/60 to-transparent" />
          </div>
        </motion.div>
      </section>

      {/* Featured Packages Section - Moved to Top Priority */}
      <section className="py-20 relative overflow-hidden bg-white">
        {/* Subtle pattern background */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FC6603' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-orange-50 text-[#FC6603] px-5 py-2.5 rounded-full mb-6 font-bold border border-orange-200">
              <Sparkles className="w-5 h-5" />
              <span className="tracking-wide">Handpicked for You</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="text-gray-900">Experiences That </span>
              <span className="text-[#FC6603]">Transform</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Each journey is crafted with care, local expertise, and a deep
              commitment to authentic cultural immersion
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {featuredPackages.map((pkg, idx) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Link
                  to={`/packages/${pkg.id}`}
                  className="group block bg-white rounded-3xl shadow-lg hover:shadow-[0_20px_60px_-15px_rgba(252,102,3,0.3)] transition-all duration-500 overflow-hidden border border-gray-100 hover:border-orange-300"
                >
                  <div className="relative h-72 overflow-hidden">
                    <div
                      className="absolute inset-0 bg-cover bg-center transform group-hover:scale-110 transition-transform duration-700"
                      style={{ backgroundImage: `url(${pkg.image})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    <div className="absolute top-4 left-4">
                      <span className="inline-block bg-[#FC6603] text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg">
                        {pkg.tag}
                      </span>
                    </div>

                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur px-3 py-2 rounded-full flex items-center gap-1 shadow-lg">
                      <Star className="w-4 h-4 fill-[#FC6603] text-[#FC6603]" />
                      <span className="text-sm font-bold text-gray-900">
                        {pkg.rating}
                      </span>
                      <span className="text-xs text-gray-600">
                        ({pkg.reviews})
                      </span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-2xl font-bold text-white mb-2 line-clamp-2">
                        {pkg.title}
                      </h3>
                      <p className="text-gray-200 text-sm flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {pkg.location}
                      </p>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-gray-600 font-medium">
                        {pkg.nights}N / {pkg.days}D
                      </span>
                    </div>

                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">
                          Starting from
                        </p>
                        <p className="text-3xl font-bold text-[#FC6603]">
                          ₹{pkg.price.toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-[#FC6603] font-bold group-hover:gap-3 transition-all">
                        <span>Explore</span>
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/packages"
              className="group inline-flex items-center gap-3 bg-gradient-to-r from-[#FC6603] to-[#ff7a1a] hover:from-[#e55a02] hover:to-[#FC6603] text-white font-bold px-10 py-5 rounded-full transition-all shadow-xl shadow-orange-500/30 hover:shadow-2xl hover:shadow-orange-500/50 hover:scale-105"
            >
              <span className="text-lg">View All Experiences</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Values Section */}
      <section className="py-24 relative overflow-hidden">
        {/* Layered background */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-orange-50/50" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="text-gray-900">Why Travelers </span>
              <span className="text-[#FC6603]">Trust Us</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Travel is personal. That's why we're committed to earning your
              trust through genuine care, expertise, and unwavering dedication
              to your journey
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {trustValues.map((value, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group relative"
              >
                <div className="relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-[0_20px_60px_-15px_rgba(252,102,3,0.25)] transition-all duration-300 border border-orange-100 hover:border-orange-300">
                  <div
                    className={`inline-flex p-5 rounded-2xl bg-gradient-to-br ${value.color} mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <value.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Call to Action - Book with confidence */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="inline-block bg-gradient-to-r from-orange-50 to-orange-100 rounded-3xl p-8 border-2 border-orange-200">
              <p className="text-lg text-gray-900 mb-4 font-semibold">
                Ready to start your journey?
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/packages"
                  className="inline-flex items-center gap-2 bg-[#FC6603] hover:bg-[#e55a02] text-white font-bold px-8 py-4 rounded-full transition-all shadow-lg hover:shadow-xl"
                >
                  <span>Browse Packages</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <a
                  href="tel:+919625582301"
                  className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-[#FC6603] font-bold px-8 py-4 rounded-full transition-all border-2 border-[#FC6603]"
                >
                  <Phone className="w-5 h-5" />
                  <span>Talk to an Expert</span>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Values Section */}
      <section className="py-24 relative overflow-hidden">
        {/* Subtle pattern background */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-orange-50/20 to-white" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FC6603' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-orange-50 text-[#FC6603] px-5 py-2.5 rounded-full mb-6 font-bold border border-orange-200">
              <Sparkles className="w-5 h-5" />
              <span className="tracking-wide">Handpicked for You</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="text-gray-900">Experiences That </span>
              <span className="text-[#FC6603]">Transform</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Each journey is crafted with care, local expertise, and a deep
              commitment to authentic cultural immersion
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {featuredPackages.map((pkg, idx) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Link
                  to={`/packages/${pkg.id}`}
                  className="group block bg-white rounded-3xl shadow-lg hover:shadow-[0_20px_60px_-15px_rgba(252,102,3,0.3)] transition-all duration-500 overflow-hidden border border-gray-100 hover:border-orange-300"
                >
                  <div className="relative h-72 overflow-hidden">
                    <div
                      className="absolute inset-0 bg-cover bg-center transform group-hover:scale-110 transition-transform duration-700"
                      style={{ backgroundImage: `url(${pkg.image})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    <div className="absolute top-4 left-4">
                      <span className="inline-block bg-[#FC6603] text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg">
                        {pkg.tag}
                      </span>
                    </div>

                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur px-3 py-2 rounded-full flex items-center gap-1 shadow-lg">
                      <Star className="w-4 h-4 fill-[#FC6603] text-[#FC6603]" />
                      <span className="text-sm font-bold text-gray-900">
                        {pkg.rating}
                      </span>
                      <span className="text-xs text-gray-600">
                        ({pkg.reviews})
                      </span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-2xl font-bold text-white mb-2 line-clamp-2">
                        {pkg.title}
                      </h3>
                      <p className="text-gray-200 text-sm flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {pkg.location}
                      </p>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-gray-600 font-medium">
                        {pkg.nights}N / {pkg.days}D
                      </span>
                    </div>

                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">
                          Starting from
                        </p>
                        <p className="text-3xl font-bold text-[#FC6603]">
                          ₹{pkg.price.toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-[#FC6603] font-bold group-hover:gap-3 transition-all">
                        <span>Explore</span>
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/packages"
              className="group inline-flex items-center gap-3 bg-gradient-to-r from-[#FC6603] to-[#ff7a1a] hover:from-[#e55a02] hover:to-[#FC6603] text-white font-bold px-10 py-5 rounded-full transition-all shadow-xl shadow-orange-500/30 hover:shadow-2xl hover:shadow-orange-500/50 hover:scale-105"
            >
              <span className="text-lg">View All Experiences</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section - Orange Dominant */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FC6603] via-[#ff7a1a] to-[#ff8534]" />

        {/* Animated gradient overlay */}
        <motion.div
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.2) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.2) 0%, transparent 50%)",
            backgroundSize: "200% 200%",
          }}
        />

        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&q=80")',
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur text-white px-5 py-2 rounded-full mb-6 font-semibold border border-white/30">
              <Sparkles className="w-4 h-4" />
              <span>Start Your Adventure</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Your Journey Begins Here
            </h2>
            <p className="text-2xl text-white/95 mb-10 font-light max-w-2xl mx-auto leading-relaxed">
              Let us craft a personalized experience that speaks to your soul
              and creates memories for a lifetime
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+919625582301"
                className="group inline-flex items-center justify-center gap-2 bg-white text-[#FC6603] hover:bg-gray-50 font-bold px-10 py-5 rounded-full transition-all shadow-2xl text-lg hover:scale-105"
              >
                <Phone className="w-5 h-5" />
                <span>Call Our Travel Experts</span>
              </a>
              <Link
                to="/destinations"
                className="inline-flex items-center justify-center gap-2 border-2 border-white text-white hover:bg-white hover:text-[#FC6603] font-bold px-10 py-5 rounded-full transition-all text-lg"
              >
                <span>Explore Destinations</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-white/90">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <span className="text-sm font-medium">
                  Trusted by 10,000+ Travelers
                </span>
              </div>
              <div className="h-4 w-px bg-white/30" />
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-white" />
                <span className="text-sm font-medium">4.8 Average Rating</span>
              </div>
              <div className="h-4 w-px bg-white/30" />
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                <span className="text-sm font-medium">
                  Award-Winning Service
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
