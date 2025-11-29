import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plane,
  Calendar,
  Users,
  Search,
  ArrowRightLeft,
  MapPin,
  X,
} from "lucide-react";

export function SearchModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [tripType, setTripType] = useState<
    "oneWay" | "roundTrip" | "multiCity"
  >("oneWay");

  return (
    <>
      {/* Floating Search Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring" }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-[#FC6603] to-[#ff7a1a] hover:from-[#e55a02] hover:to-[#FC6603] text-white font-bold px-8 py-4 rounded-full shadow-2xl hover:shadow-orange-500/50 transition-all flex items-center gap-3 group"
      >
        <Search className="w-5 h-5" />
        <span>Search Flights</span>
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-5xl max-h-[90vh] overflow-y-auto"
            >
              <div className="relative bg-white rounded-3xl shadow-2xl p-8 m-4">
                {/* Close Button */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-gray-600" />
                </button>

                {/* Header */}
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Search Your Perfect Journey
                  </h2>
                  <p className="text-gray-600">
                    Find the best flights and packages for your next adventure
                  </p>
                </div>

                {/* Trip Type Tabs */}
                <div className="flex gap-2 mb-8 p-1 bg-orange-50 rounded-2xl w-fit">
                  {[
                    { value: "oneWay", label: "One Way" },
                    { value: "roundTrip", label: "Round Trip" },
                    { value: "multiCity", label: "Multi City" },
                  ].map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setTripType(type.value as typeof tripType)}
                      className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                        tripType === type.value
                          ? "bg-[#FC6603] text-white shadow-lg shadow-orange-500/30"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>

                {/* Search Fields */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
                  <div className="md:col-span-3">
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      From
                    </label>
                    <div className="relative">
                      <Plane className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#FC6603]" />
                      <input
                        type="text"
                        placeholder="Departure City"
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-[#FC6603] focus:bg-white focus:outline-none transition-all text-gray-900 placeholder:text-gray-400 font-medium"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-1 flex items-end justify-center pb-4">
                    <button className="p-3 rounded-full bg-orange-50 hover:bg-[#FC6603] hover:text-white text-[#FC6603] transition-all">
                      <ArrowRightLeft className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="md:col-span-3">
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      To
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#FC6603]" />
                      <input
                        type="text"
                        placeholder="Destination City"
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-[#FC6603] focus:bg-white focus:outline-none transition-all text-gray-900 placeholder:text-gray-400 font-medium"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#FC6603]" />
                      <input
                        type="date"
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-[#FC6603] focus:bg-white focus:outline-none transition-all text-gray-900 font-medium"
                      />
                    </div>
                  </div>

                  {tripType === "roundTrip" && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-gray-900 mb-2">
                        Return
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#FC6603]" />
                        <input
                          type="date"
                          className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-[#FC6603] focus:bg-white focus:outline-none transition-all text-gray-900 font-medium"
                        />
                      </div>
                    </div>
                  )}

                  <div
                    className={
                      tripType === "roundTrip"
                        ? "md:col-span-1"
                        : "md:col-span-3"
                    }
                  >
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      Travelers
                    </label>
                    <div className="relative">
                      <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#FC6603]" />
                      <input
                        type="text"
                        value="1 Traveller"
                        readOnly
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl cursor-pointer text-gray-900 font-medium"
                      />
                    </div>
                  </div>
                </div>

                {/* Search Button */}
                <button className="w-full bg-gradient-to-r from-[#FC6603] to-[#ff7a1a] hover:from-[#e55a02] hover:to-[#FC6603] text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50">
                  <Search className="w-6 h-6" />
                  <span className="text-lg">Search Flights</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
