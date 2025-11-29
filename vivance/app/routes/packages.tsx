import type { Route } from "./+types/packages";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import {
  MapPin,
  Star,
  ArrowRight,
  Search,
  Sparkles,
  Calendar,
  Users,
} from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Curated Travel Experiences - Vivance Travels" },
    {
      name: "description",
      content:
        "Discover handpicked holiday packages crafted with care and local expertise",
    },
  ];
}

const packages = [
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
    highlights: ["Sacred Dips", "Temple Tours", "Cultural Immersion"],
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
    highlights: ["Burj Khalifa", "Desert Safari", "Luxury Stay"],
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
    highlights: ["Beach Resorts", "Temple Visits", "Spa Included"],
    tag: "Beach Paradise",
  },
  {
    id: 4,
    title: "Maldives: Overwater Villa Experience",
    location: "Maldives",
    image:
      "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80",
    nights: 5,
    days: 6,
    price: 85000,
    rating: 5.0,
    reviews: 234,
    highlights: ["Overwater Villa", "Water Sports", "Fine Dining"],
    tag: "Luxury Paradise",
  },
  {
    id: 5,
    title: "Paris: Romance & Cultural Heritage",
    location: "Paris, France",
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80",
    nights: 6,
    days: 7,
    price: 75000,
    rating: 4.8,
    reviews: 389,
    highlights: ["Eiffel Tower", "Museums", "Seine Cruise"],
    tag: "Cultural Odyssey",
  },
  {
    id: 6,
    title: "Switzerland: Alpine Paradise",
    location: "Switzerland",
    image:
      "https://images.unsplash.com/photo-1527004013197-933c4bb611b3?w=800&q=80",
    nights: 8,
    days: 9,
    price: 95000,
    rating: 4.9,
    reviews: 301,
    highlights: ["Swiss Alps", "Lake Cruises", "Mountain Railways"],
    tag: "Mountain Escape",
  },
];

export default function Packages() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden bg-gradient-to-br from-[#043560] via-[#065a94] to-[#043560]">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920&q=80")',
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

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
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, rgba(252, 102, 3, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(252, 102, 3, 0.3) 0%, transparent 50%)",
            backgroundSize: "200% 200%",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 bg-[#FC6603] text-white px-5 py-2.5 rounded-full mb-6 font-bold shadow-xl">
              <Sparkles className="w-5 h-5" />
              <span className="tracking-wide">Handpicked Experiences</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Curated Travel <span className="text-[#FC6603]">Experiences</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
              Every journey is crafted with expertise, care, and a commitment to
              authentic experiences
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search & Filter Bar */}
      <section className="sticky top-20 z-40 bg-white/95 backdrop-blur-lg border-b border-orange-100 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#FC6603]" />
              <input
                type="text"
                placeholder="Search destinations, experiences..."
                className="w-full pl-12 pr-4 py-4 bg-orange-50 border-2 border-orange-200 rounded-2xl focus:border-[#FC6603] focus:bg-white focus:outline-none transition-all text-gray-900 placeholder:text-gray-500 font-medium"
              />
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <select className="flex-1 md:flex-initial px-6 py-4 bg-orange-50 border-2 border-orange-200 rounded-2xl focus:border-[#FC6603] focus:outline-none font-medium text-gray-900">
                <option>All Destinations</option>
                <option>India</option>
                <option>International</option>
              </select>
              <select className="flex-1 md:flex-initial px-6 py-4 bg-orange-50 border-2 border-orange-200 rounded-2xl focus:border-[#FC6603] focus:outline-none font-medium text-gray-900">
                <option>Price: All</option>
                <option>Under ₹25,000</option>
                <option>₹25,000 - ₹50,000</option>
                <option>Above ₹50,000</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="py-20 relative overflow-hidden">
        {/* Subtle pattern background */}
        <div className="absolute inset-0 bg-gradient-to-b from-orange-50/30 via-white to-orange-50/30" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FC6603' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <p className="text-lg text-gray-600">
              <span className="font-bold text-[#FC6603]">
                {packages.length}
              </span>{" "}
              carefully curated experiences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map((pkg, idx) => (
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
                    <div className="flex flex-wrap gap-2 mb-4">
                      {pkg.highlights.map((highlight, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-orange-50 text-[#FC6603] font-semibold px-3 py-1 rounded-full border border-orange-200"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                      <div className="flex items-center gap-4 text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-[#FC6603]" />
                          <span className="text-sm font-medium">
                            {pkg.nights}N / {pkg.days}D
                          </span>
                        </div>
                      </div>
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
                      <div className="flex items-center gap-2 text-[#043560] font-bold group-hover:gap-3 transition-all">
                        <span>Explore</span>
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FC6603] via-[#ff7a1a] to-[#ff8534]" />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920&q=80")',
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Can't Find What You're Looking For?
            </h2>
            <p className="text-xl text-white/95 mb-8">
              Our travel experts will create a custom experience tailored just
              for you
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+919625582301"
                className="inline-flex items-center justify-center gap-2 bg-white text-[#FC6603] hover:bg-gray-50 font-bold px-10 py-5 rounded-full transition-all shadow-2xl text-lg"
              >
                <span>Call Us Now</span>
              </a>
              <a
                href="mailto:info@vivancetravels.com"
                className="inline-flex items-center justify-center gap-2 border-2 border-white text-white hover:bg-white hover:text-[#FC6603] font-bold px-10 py-5 rounded-full transition-all text-lg"
              >
                <span>Email Our Team</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
