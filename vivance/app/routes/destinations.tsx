import type { Route } from "./+types/destinations";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import {
  MapPin,
  Package,
  ArrowRight,
  Globe,
  Sparkles,
  Star,
} from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Explore Destinations - Vivance Travels" },
    {
      name: "description",
      content:
        "Discover amazing destinations around the world with authentic local experiences",
    },
  ];
}

const destinations = [
  {
    name: "Dubai",
    country: "United Arab Emirates",
    region: "Middle East",
    image:
      "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&q=80",
    packages: 45,
    description:
      "Where ancient traditions meet futuristic innovation—experience luxury redefined in the desert",
    highlights: [
      "Burj Khalifa",
      "Desert Safari",
      "Dubai Mall",
      "Palm Jumeirah",
    ],
    startingPrice: 45000,
  },
  {
    name: "Bali",
    country: "Indonesia",
    region: "Southeast Asia",
    image:
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80",
    packages: 38,
    description:
      "Island of Gods where spiritual serenity meets tropical paradise—your soul's retreat awaits",
    highlights: [
      "Ubud Rice Terraces",
      "Beach Resorts",
      "Temples",
      "Water Sports",
    ],
    startingPrice: 52000,
  },
  {
    name: "Maldives",
    country: "Maldives",
    region: "South Asia",
    image:
      "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80",
    packages: 52,
    description:
      "Crystal-clear waters and pristine beaches define this paradise—where time stands still",
    highlights: [
      "Overwater Villas",
      "Diving",
      "Private Islands",
      "Marine Life",
    ],
    startingPrice: 85000,
  },
  {
    name: "Paris",
    country: "France",
    region: "Europe",
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80",
    packages: 67,
    description:
      "The City of Light offers timeless romance, world-class art, and culinary excellence at every corner",
    highlights: [
      "Eiffel Tower",
      "Louvre Museum",
      "Notre Dame",
      "Champs-Élysées",
    ],
    startingPrice: 75000,
  },
  {
    name: "Switzerland",
    country: "Switzerland",
    region: "Europe",
    image:
      "https://images.unsplash.com/photo-1527004013197-933c4bb611b3?w=800&q=80",
    packages: 34,
    description:
      "Alpine majesty meets pristine lakes—experience Europe's most breathtaking landscapes",
    highlights: ["Swiss Alps", "Lake Geneva", "Interlaken", "Zurich"],
    startingPrice: 95000,
  },
  {
    name: "Thailand",
    country: "Thailand",
    region: "Southeast Asia",
    image:
      "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&q=80",
    packages: 56,
    description:
      "Land of Smiles where ancient temples, tropical beaches, and vibrant culture create unforgettable memories",
    highlights: ["Bangkok", "Phuket", "Temples", "Night Markets"],
    startingPrice: 38000,
  },
  {
    name: "Singapore",
    country: "Singapore",
    region: "Southeast Asia",
    image:
      "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&q=80",
    packages: 42,
    description:
      "Where East meets West in perfect harmony—a modern marvel of culture, cuisine, and innovation",
    highlights: [
      "Marina Bay Sands",
      "Gardens by the Bay",
      "Sentosa",
      "Food Culture",
    ],
    startingPrice: 48000,
  },
  {
    name: "Kerala",
    country: "India",
    region: "South Asia",
    image:
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80",
    packages: 29,
    description:
      "God's Own Country—where tranquil backwaters, lush greenery, and Ayurvedic wellness rejuvenate the soul",
    highlights: ["Backwaters", "Houseboats", "Tea Gardens", "Ayurveda"],
    startingPrice: 25000,
  },
  {
    name: "Prayagraj",
    country: "India",
    region: "South Asia",
    image:
      "https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80",
    packages: 18,
    description:
      "Sacred confluence of rivers—witness ancient spirituality and the magnificent Kumbh Mela",
    highlights: [
      "Triveni Sangam",
      "Kumbh Mela",
      "Temples",
      "Spiritual Heritage",
    ],
    startingPrice: 15000,
  },
];

const regions = [
  { name: "All Destinations", count: destinations.length },
  { name: "South Asia", count: 3 },
  { name: "Southeast Asia", count: 3 },
  { name: "Middle East", count: 1 },
  { name: "Europe", count: 2 },
];

export default function Destinations() {
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
              <Globe className="w-5 h-5" />
              <span className="tracking-wide">Explore the World</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Discover Your Next{" "}
              <span className="text-[#FC6603]">Destination</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
              From sacred temples to modern marvels, tropical paradises to
              alpine peaks— your perfect journey awaits
            </p>
          </motion.div>
        </div>
      </section>

      {/* Region Filters */}
      <section className="sticky top-20 z-40 bg-white/95 backdrop-blur-lg border-b border-orange-100 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap gap-3 justify-center">
            {regions.map((region, idx) => (
              <button
                key={idx}
                className={`px-6 py-3 rounded-full font-semibold transition-all ${
                  idx === 0
                    ? "bg-[#FC6603] text-white shadow-lg shadow-orange-500/30"
                    : "bg-orange-50 text-gray-700 hover:bg-orange-100 border-2 border-orange-200"
                }`}
              >
                {region.name}{" "}
                <span className="opacity-75">({region.count})</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Destinations Grid */}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {destinations.map((dest, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group bg-white rounded-3xl shadow-lg hover:shadow-[0_20px_60px_-15px_rgba(252,102,3,0.3)] transition-all duration-500 overflow-hidden border border-gray-100 hover:border-orange-300"
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center transform group-hover:scale-110 transition-transform duration-700"
                    style={{ backgroundImage: `url(${dest.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur px-4 py-2 rounded-full shadow-lg">
                    <span className="text-sm font-bold text-gray-900">
                      {dest.region}
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-3xl font-bold text-white mb-1">
                      {dest.name}
                    </h3>
                    <p className="text-gray-200 text-sm">{dest.country}</p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                    {dest.description}
                  </p>

                  {/* Highlights */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {dest.highlights.slice(0, 3).map((highlight, hIdx) => (
                      <span
                        key={hIdx}
                        className="text-xs bg-orange-50 text-[#FC6603] font-semibold px-3 py-1 rounded-full border border-orange-200"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <div className="flex items-center gap-2 text-gray-600 mb-1">
                        <Package className="w-4 h-4 text-[#FC6603]" />
                        <span className="text-sm font-medium">
                          {dest.packages} packages
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        From ₹{dest.startingPrice.toLocaleString()}
                      </p>
                    </div>
                    <Link
                      to="/packages"
                      className="flex items-center gap-2 text-[#043560] font-bold group-hover:gap-3 transition-all"
                    >
                      <span>Explore</span>
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
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
              'url("https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&q=80")',
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
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur text-white px-5 py-2 rounded-full mb-6 font-semibold border border-white/30">
              <Sparkles className="w-4 h-4" />
              <span>Custom Experiences</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Dream Destination Not Listed?
            </h2>
            <p className="text-xl text-white/95 mb-8 max-w-2xl mx-auto">
              Tell us where you want to go, and we'll craft a personalized
              journey that exceeds your expectations
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+919625582301"
                className="inline-flex items-center justify-center gap-2 bg-white text-[#FC6603] hover:bg-gray-50 font-bold px-10 py-5 rounded-full transition-all shadow-2xl text-lg"
              >
                <span>Speak with Experts</span>
              </a>
              <Link
                to="/packages"
                className="inline-flex items-center justify-center gap-2 border-2 border-white text-white hover:bg-white hover:text-[#FC6603] font-bold px-10 py-5 rounded-full transition-all text-lg"
              >
                <span>View All Packages</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
