import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plane,
  Hotel,
  Umbrella,
  MapPin,
  Calendar,
  Users,
  ArrowLeftRight,
  Search,
  Sparkles,
} from "lucide-react";

type TripType = "one-way" | "round-trip" | "multi-city";
type TabType = "flights" | "hotels" | "holidays";

const Hero = () => {
  const [activeTab, setActiveTab] = useState<TabType>("flights");
  const [tripType, setTripType] = useState<TripType>("round-trip");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [departDate, setDepartDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [travelers, setTravelers] = useState("1 Adult");

  const tabs = [
    { id: "flights" as TabType, label: "Flights", icon: <Plane className="w-5 h-5" /> },
    { id: "hotels" as TabType, label: "Hotels", icon: <Hotel className="w-5 h-5" /> },
    { id: "holidays" as TabType, label: "Holidays", icon: <Umbrella className="w-5 h-5" /> },
  ];

  const tripTypes = [
    { id: "one-way" as TripType, label: "One Way" },
    { id: "round-trip" as TripType, label: "Round Trip" },
    { id: "multi-city" as TripType, label: "Multi City" },
  ];

  const popularRoutes = [
    { from: "Delhi", to: "Mumbai", price: "₹4,299" },
    { from: "Bangalore", to: "Dubai", price: "₹12,499" },
    { from: "Mumbai", to: "Goa", price: "₹3,199" },
  ];

  const swapLocations = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  return (
    <section className="relative min-h-screen pt-20 lg:pt-24 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80"
          alt="Beautiful beach destination"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-vivance-blue/90 via-vivance-blue/70 to-vivance-blue/90" />
      </div>

      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-vivance-orange/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-vivance-orange/10 rounded-full blur-3xl" />

        <motion.div
          className="absolute top-32 right-20 text-white/10"
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <Plane className="w-32 h-32 rotate-45" />
        </motion.div>
        <motion.div
          className="absolute bottom-40 left-20 text-white/5"
          animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          <Plane className="w-48 h-48 -rotate-12" />
        </motion.div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        {/* Hero Text */}
        <div className="text-center mb-10 lg:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-vivance-orange/20 backdrop-blur-sm rounded-full text-vivance-orange text-sm font-medium mb-6"
          >
            <Sparkles className="w-4 h-4" />
            Discover the world with us
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Your Journey
            <br />
            <span className="text-vivance-orange">Begins Here</span>
          </motion.h1>

          <motion.p
            className="text-lg lg:text-xl text-white/70 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Find the best deals on flights, hotels, and holiday packages. Hassle-free
            booking with 24/7 support.
          </motion.p>
        </div>

        {/* Search Card */}
        <motion.div
          className="max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="bg-white rounded-3xl shadow-2xl shadow-black/20 overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-gray-100">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 lg:py-5 font-semibold text-sm lg:text-base transition-all relative ${
                    activeTab === tab.id
                      ? "text-vivance-orange"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-vivance-orange"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Trip Type Selector */}
            <div className="px-6 lg:px-8 pt-6">
              <div className="flex flex-wrap gap-2 lg:gap-4">
                {tripTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setTripType(type.id)}
                    className={`px-4 lg:px-6 py-2 lg:py-2.5 rounded-full text-sm font-medium transition-all ${
                      tripType === type.id
                        ? "bg-vivance-orange text-white shadow-lg shadow-vivance-orange/30"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Fields */}
            <div className="p-6 lg:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* From */}
                <div className="lg:col-span-3 relative">
                  <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                    From
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-vivance-orange" />
                    <input
                      type="text"
                      placeholder="Departure City"
                      value={from}
                      onChange={(e) => setFrom(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl text-gray-800 font-medium placeholder:text-gray-400 focus:outline-none focus:border-vivance-orange focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Swap Button */}
                <div className="hidden lg:flex lg:col-span-1 items-end justify-center pb-3">
                  <motion.button
                    onClick={swapLocations}
                    className="p-3 bg-vivance-blue rounded-full text-white shadow-lg hover:shadow-xl transition-shadow"
                    whileHover={{ scale: 1.1, rotate: 180 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ArrowLeftRight className="w-5 h-5" />
                  </motion.button>
                </div>

                {/* To */}
                <div className="lg:col-span-3">
                  <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                    To
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-vivance-orange" />
                    <input
                      type="text"
                      placeholder="Destination City"
                      value={to}
                      onChange={(e) => setTo(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl text-gray-800 font-medium placeholder:text-gray-400 focus:outline-none focus:border-vivance-orange focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Departure Date */}
                <div className="lg:col-span-2">
                  <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                    Departure
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-vivance-orange" />
                    <input
                      type="date"
                      value={departDate}
                      onChange={(e) => setDepartDate(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl text-gray-800 font-medium focus:outline-none focus:border-vivance-orange focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Return Date */}
                {tripType === "round-trip" && (
                  <div className="lg:col-span-2">
                    <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                      Return
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-vivance-orange" />
                      <input
                        type="date"
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl text-gray-800 font-medium focus:outline-none focus:border-vivance-orange focus:bg-white transition-all"
                      />
                    </div>
                  </div>
                )}

                {/* Travelers */}
                <div className={tripType === "round-trip" ? "lg:col-span-1" : "lg:col-span-3"}>
                  <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                    Travelers
                  </label>
                  <div className="relative">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-vivance-orange" />
                    <select
                      value={travelers}
                      onChange={(e) => setTravelers(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl text-gray-800 font-medium focus:outline-none focus:border-vivance-orange focus:bg-white transition-all appearance-none cursor-pointer"
                    >
                      <option>1 Adult</option>
                      <option>2 Adults</option>
                      <option>3 Adults</option>
                      <option>4 Adults</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Search Button */}
              <motion.button
                className="w-full mt-6 py-4 lg:py-5 bg-gradient-to-r from-vivance-orange to-vivance-orange-light text-white font-bold text-lg rounded-xl shadow-lg shadow-vivance-orange/30 flex items-center justify-center gap-3"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Search className="w-5 h-5" />
                Search Flights
              </motion.button>
            </div>

            {/* Popular Routes */}
            <div className="px-6 lg:px-8 pb-6 lg:pb-8">
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="text-gray-500 font-medium">Popular:</span>
                {popularRoutes.map((route, index) => (
                  <button
                    key={index}
                    className="px-3 py-1.5 bg-gray-100 hover:bg-vivance-orange/10 hover:text-vivance-orange rounded-full text-gray-600 font-medium transition-colors"
                  >
                    {route.from} → {route.to}{" "}
                    <span className="text-vivance-orange">{route.price}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          className="flex flex-wrap justify-center gap-6 lg:gap-12 mt-12 text-white/60 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-vivance-green rounded-full" />
            Best Price Guarantee
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-vivance-green rounded-full" />
            24/7 Customer Support
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-vivance-green rounded-full" />
            Hassle-free Cancellation
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;

