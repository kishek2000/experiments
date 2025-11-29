import type { Route } from "./+types/package.$id";
import { Link } from "react-router";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import {
  MapPin,
  Star,
  Clock,
  Users,
  Calendar,
  Check,
  Phone,
  Mail,
  Share2,
  Heart,
} from "lucide-react";

export function meta({ params }: Route.MetaArgs) {
  return [
    { title: `Package Details - Vivance Travels` },
    {
      name: "description",
      content: "Explore package details and book your perfect vacation",
    },
  ];
}

// Mock data - in real app, fetch based on params.id
const packageData = {
  id: 1,
  title: "Kumbh Experience for Groups",
  location: "Prayagraj (Allahabad), India",
  image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200",
  gallery: [
    "https://images.unsplash.com/photo-1532098953-c8822c5026fe?w=600",
    "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600",
    "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600",
  ],
  nights: 1,
  days: 2,
  price: 17600,
  rating: 4.2,
  reviews: 156,
  highlights: [
    "Comfortable tent accommodation",
    "All meals included",
    "Guided tours to sacred sites",
    "Transportation within Prayagraj",
    "24/7 support",
  ],
  itinerary: [
    {
      day: 1,
      title: "Arrival & Sacred Dip",
      description:
        "Arrive at Prayagraj, check-in to your comfortable tent accommodation. Evening visit to Triveni Sangam for the sacred dip. Witness the mesmerizing Ganga Aarti.",
    },
    {
      day: 2,
      title: "Temple Visits & Departure",
      description:
        "Early morning visit to important temples. Explore the Kumbh Mela grounds with our expert guide. Departure after lunch.",
    },
  ],
  included: [
    "Accommodation in premium tents",
    "All meals (breakfast, lunch, dinner)",
    "Transportation",
    "Professional guide",
    "Entry fees to temples",
  ],
  notIncluded: [
    "Personal expenses",
    "Travel insurance",
    "Any additional activities",
  ],
};

export default function PackageDetail({ params }: Route.ComponentProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      {/* Hero Image */}
      <section className="relative h-[500px] bg-gray-900">
        <img
          src={packageData.image}
          alt={packageData.title}
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
            <div className="flex items-center gap-2 mb-4">
              <Link
                to="/packages"
                className="text-white/80 hover:text-white text-sm"
              >
                Packages
              </Link>
              <span className="text-white/60">/</span>
              <span className="text-white text-sm">{packageData.title}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {packageData.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-white">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span>{packageData.location}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur px-3 py-1 rounded-full">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{packageData.rating}</span>
                <span className="text-sm">({packageData.reviews} reviews)</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>
                  {packageData.nights}N / {packageData.days}D
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Overview */}
              <div className="bg-white rounded-2xl shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Overview
                </h2>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Experience the spiritual grandeur of Kumbh Mela with our
                  carefully curated package. Immerse yourself in the rich
                  cultural heritage and witness one of the world's largest
                  religious gatherings. Our expert guides will ensure you have a
                  comfortable and memorable experience.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Users className="w-5 h-5 text-[#FC6603]" />
                    <span className="text-sm">Group Size: 10-20</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Calendar className="w-5 h-5 text-[#FC6603]" />
                    <span className="text-sm">Available Year Round</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <MapPin className="w-5 h-5 text-[#FC6603]" />
                    <span className="text-sm">Pickup Included</span>
                  </div>
                </div>
              </div>

              {/* Highlights */}
              <div className="bg-white rounded-2xl shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Highlights
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {packageData.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                        <Check className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-gray-700">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Itinerary */}
              <div className="bg-white rounded-2xl shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Itinerary
                </h2>
                <div className="space-y-6">
                  {packageData.itinerary.map((day, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-gradient-to-br from-[#FC6603] to-[#ff8534] text-white flex items-center justify-center font-bold">
                        Day {day.day}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                          {day.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          {day.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Inclusions */}
              <div className="bg-white rounded-2xl shadow-md p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-600" />
                      Included
                    </h3>
                    <ul className="space-y-2">
                      {packageData.included.map((item, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-gray-600"
                        >
                          <Check className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                      Not Included
                    </h3>
                    <ul className="space-y-2">
                      {packageData.notIncluded.map((item, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-gray-600"
                        >
                          <span className="text-red-500 mt-1">✕</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Gallery */}
              <div className="bg-white rounded-2xl shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Gallery
                </h2>
                <div className="grid grid-cols-3 gap-4">
                  {packageData.gallery.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative h-48 rounded-xl overflow-hidden group cursor-pointer"
                    >
                      <img
                        src={img}
                        alt={`Gallery ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Booking Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-28">
                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-1">Price per person</p>
                  <p className="text-4xl font-bold text-[#FC6603]">
                    ₹ {packageData.price.toLocaleString()}
                  </p>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Travel Date
                    </label>
                    <input
                      type="date"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#FC6603] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Number of Travelers
                    </label>
                    <select className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#FC6603] focus:outline-none">
                      <option>1 Person</option>
                      <option>2 People</option>
                      <option>3 People</option>
                      <option>4+ People</option>
                    </select>
                  </div>
                </div>

                <button className="w-full bg-gradient-to-r from-[#FC6603] to-[#ff7a1a] hover:from-[#e55a02] hover:to-[#FC6603] text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl mb-3">
                  Book Now
                </button>
                <button className="w-full border-2 border-[#043560] text-[#043560] hover:bg-[#043560] hover:text-white font-bold py-4 rounded-xl transition-all mb-6">
                  Enquire Now
                </button>

                <div className="flex items-center justify-between py-4 border-t border-gray-200">
                  <button className="flex items-center gap-2 text-gray-600 hover:text-[#FC6603] transition-colors">
                    <Heart className="w-5 h-5" />
                    <span className="text-sm font-medium">Save</span>
                  </button>
                  <button className="flex items-center gap-2 text-gray-600 hover:text-[#FC6603] transition-colors">
                    <Share2 className="w-5 h-5" />
                    <span className="text-sm font-medium">Share</span>
                  </button>
                </div>

                <div className="pt-6 border-t border-gray-200 space-y-3">
                  <p className="text-sm font-semibold text-gray-700">
                    Need help booking?
                  </p>
                  <a
                    href="tel:+919625582301"
                    className="flex items-center gap-2 text-gray-600 hover:text-[#FC6603] transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">+91 9625582301</span>
                  </a>
                  <a
                    href="mailto:info@vivancetravels.com"
                    className="flex items-center gap-2 text-gray-600 hover:text-[#FC6603] transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">info@vivancetravels.com</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
