import type { MetaFunction } from "@remix-run/node";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plane,
  Calendar,
  Users,
  Search,
  ArrowRightLeft,
  MapPin,
  Clock,
  Luggage,
  ChevronDown,
  ChevronUp,
  Filter,
  X,
  SlidersHorizontal,
  Sun,
  Sunrise,
  Sunset,
  Moon,
  Star,
  ArrowRight,
} from "lucide-react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

export const meta: MetaFunction = () => {
  return [
    { title: "Search Flights - Vivance Travels" },
    {
      name: "description",
      content:
        "Find and book the best flights at competitive prices. Search domestic and international flights with Vivance Travels.",
    },
  ];
};

// Popular airports data
const popularAirports = [
  {
    code: "DEL",
    city: "New Delhi",
    name: "Indira Gandhi International",
    country: "India",
  },
  {
    code: "BOM",
    city: "Mumbai",
    name: "Chhatrapati Shivaji Maharaj",
    country: "India",
  },
  {
    code: "BLR",
    city: "Bangalore",
    name: "Kempegowda International",
    country: "India",
  },
  {
    code: "MAA",
    city: "Chennai",
    name: "Chennai International",
    country: "India",
  },
  {
    code: "CCU",
    city: "Kolkata",
    name: "Netaji Subhas Chandra Bose",
    country: "India",
  },
  {
    code: "HYD",
    city: "Hyderabad",
    name: "Rajiv Gandhi International",
    country: "India",
  },
  { code: "DXB", city: "Dubai", name: "Dubai International", country: "UAE" },
  {
    code: "SIN",
    city: "Singapore",
    name: "Changi Airport",
    country: "Singapore",
  },
  {
    code: "BKK",
    city: "Bangkok",
    name: "Suvarnabhumi Airport",
    country: "Thailand",
  },
  { code: "LHR", city: "London", name: "Heathrow Airport", country: "UK" },
  { code: "SYD", city: "Sydney", name: "Sydney Airport", country: "Australia" },
  { code: "JFK", city: "New York", name: "John F. Kennedy", country: "USA" },
];

// Mock flight results
const mockFlights = [
  {
    id: 1,
    airline: "IndiGo",
    airlineCode: "6E",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/IndiGo_Airlines_logo.svg/200px-IndiGo_Airlines_logo.svg.png",
    flightNo: "6E-2341",
    departure: { time: "06:15", airport: "DEL", city: "New Delhi" },
    arrival: { time: "08:45", airport: "BOM", city: "Mumbai" },
    duration: "2h 30m",
    stops: 0,
    price: 4299,
    seatsLeft: 4,
    refundable: false,
    baggage: { cabin: "7 kg", checkin: "15 kg" },
  },
  {
    id: 2,
    airline: "Air India",
    airlineCode: "AI",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Air_India_logo.svg/200px-Air_India_logo.svg.png",
    flightNo: "AI-865",
    departure: { time: "08:30", airport: "DEL", city: "New Delhi" },
    arrival: { time: "10:50", airport: "BOM", city: "Mumbai" },
    duration: "2h 20m",
    stops: 0,
    price: 5199,
    seatsLeft: 12,
    refundable: true,
    baggage: { cabin: "8 kg", checkin: "25 kg" },
  },
  {
    id: 3,
    airline: "Vistara",
    airlineCode: "UK",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Vistara_Logo.svg/200px-Vistara_Logo.svg.png",
    flightNo: "UK-945",
    departure: { time: "11:45", airport: "DEL", city: "New Delhi" },
    arrival: { time: "14:05", airport: "BOM", city: "Mumbai" },
    duration: "2h 20m",
    stops: 0,
    price: 5899,
    seatsLeft: 8,
    refundable: true,
    baggage: { cabin: "7 kg", checkin: "20 kg" },
  },
  {
    id: 4,
    airline: "SpiceJet",
    airlineCode: "SG",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/SpiceJet_logo.svg/200px-SpiceJet_logo.svg.png",
    flightNo: "SG-8169",
    departure: { time: "14:20", airport: "DEL", city: "New Delhi" },
    arrival: { time: "17:10", airport: "BOM", city: "Mumbai" },
    duration: "2h 50m",
    stops: 1,
    stopCity: "Jaipur",
    price: 3499,
    seatsLeft: 2,
    refundable: false,
    baggage: { cabin: "7 kg", checkin: "15 kg" },
  },
  {
    id: 5,
    airline: "Air India",
    airlineCode: "AI",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Air_India_logo.svg/200px-Air_India_logo.svg.png",
    flightNo: "AI-677",
    departure: { time: "17:00", airport: "DEL", city: "New Delhi" },
    arrival: { time: "19:15", airport: "BOM", city: "Mumbai" },
    duration: "2h 15m",
    stops: 0,
    price: 4899,
    seatsLeft: 15,
    refundable: true,
    baggage: { cabin: "8 kg", checkin: "25 kg" },
  },
  {
    id: 6,
    airline: "IndiGo",
    airlineCode: "6E",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/IndiGo_Airlines_logo.svg/200px-IndiGo_Airlines_logo.svg.png",
    flightNo: "6E-5023",
    departure: { time: "20:30", airport: "DEL", city: "New Delhi" },
    arrival: { time: "22:55", airport: "BOM", city: "Mumbai" },
    duration: "2h 25m",
    stops: 0,
    price: 3999,
    seatsLeft: 6,
    refundable: false,
    baggage: { cabin: "7 kg", checkin: "15 kg" },
  },
];

type TripType = "oneWay" | "roundTrip";

interface Airport {
  code: string;
  city: string;
  name: string;
  country: string;
}

interface TravelersConfig {
  adults: number;
  children: number;
  infants: number;
  class: "economy" | "premiumEconomy" | "business" | "first";
}

// Airport search dropdown component
function AirportDropdown({
  value,
  onChange,
  placeholder,
  label,
  icon: Icon,
}: {
  value: Airport | null;
  onChange: (airport: Airport) => void;
  placeholder: string;
  label: string;
  icon: typeof Plane;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredAirports = popularAirports.filter(
    (airport) =>
      airport.city.toLowerCase().includes(search.toLowerCase()) ||
      airport.code.toLowerCase().includes(search.toLowerCase()) ||
      airport.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative">
      <label className="block text-xs font-bold text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#FC6603]" />
        <input
          type="text"
          value={value ? `${value.city} (${value.code})` : search}
          onChange={(e) => {
            setSearch(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-[#FC6603] focus:bg-white focus:outline-none transition-all text-sm font-medium"
        />
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-72 overflow-y-auto"
            >
              {filteredAirports.length > 0 ? (
                filteredAirports.map((airport) => (
                  <button
                    key={airport.code}
                    onClick={() => {
                      onChange(airport);
                      setSearch("");
                      setIsOpen(false);
                    }}
                    className="w-full px-4 py-3 flex items-start gap-3 hover:bg-orange-50 transition-colors text-left border-b border-gray-100 last:border-0"
                  >
                    <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-[#FC6603]">
                        {airport.code}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">
                        {airport.city}, {airport.country}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {airport.name}
                      </p>
                    </div>
                  </button>
                ))
              ) : (
                <div className="px-4 py-6 text-center text-gray-500 text-sm">
                  No airports found
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// Travelers dropdown component
function TravelersDropdown({
  config,
  onChange,
}: {
  config: TravelersConfig;
  onChange: (config: TravelersConfig) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const totalTravelers = config.adults + config.children + config.infants;
  const classLabels = {
    economy: "Economy",
    premiumEconomy: "Premium Economy",
    business: "Business",
    first: "First Class",
  };

  return (
    <div className="relative">
      <label className="block text-xs font-bold text-gray-700 mb-2">
        Travelers & Class
      </label>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-[#FC6603] focus:bg-white focus:outline-none transition-all text-sm font-medium text-left relative"
      >
        <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#FC6603]" />
        <span>
          {totalTravelers} Traveler{totalTravelers > 1 ? "s" : ""} |{" "}
          {classLabels[config.class]}
        </span>
        <ChevronDown
          className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 p-4"
            >
              {/* Travelers count */}
              <div className="space-y-4 mb-6">
                {[
                  { key: "adults", label: "Adults", desc: "12+ years" },
                  { key: "children", label: "Children", desc: "2-12 years" },
                  { key: "infants", label: "Infants", desc: "Under 2 years" },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">
                        {item.label}
                      </p>
                      <p className="text-xs text-gray-500">{item.desc}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() =>
                          onChange({
                            ...config,
                            [item.key]: Math.max(
                              item.key === "adults" ? 1 : 0,
                              (config[
                                item.key as keyof TravelersConfig
                              ] as number) - 1
                            ),
                          })
                        }
                        className="w-8 h-8 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-600 hover:border-[#FC6603] hover:text-[#FC6603] transition-colors"
                      >
                        -
                      </button>
                      <span className="w-6 text-center font-semibold">
                        {config[item.key as keyof TravelersConfig]}
                      </span>
                      <button
                        onClick={() =>
                          onChange({
                            ...config,
                            [item.key]:
                              (config[
                                item.key as keyof TravelersConfig
                              ] as number) + 1,
                          })
                        }
                        className="w-8 h-8 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-600 hover:border-[#FC6603] hover:text-[#FC6603] transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Class selection */}
              <div className="border-t border-gray-100 pt-4">
                <p className="text-xs font-bold text-gray-700 mb-3">
                  Cabin Class
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {(
                    ["economy", "premiumEconomy", "business", "first"] as const
                  ).map((cls) => (
                    <button
                      key={cls}
                      onClick={() => onChange({ ...config, class: cls })}
                      className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                        config.class === cls
                          ? "bg-[#FC6603] text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-orange-50"
                      }`}
                    >
                      {classLabels[cls]}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="w-full mt-4 py-2.5 bg-[#FC6603] text-white font-semibold rounded-lg hover:bg-[#e55a02] transition-colors"
              >
                Done
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// Search loading animation
function SearchingAnimation({
  from,
  to,
  date,
  tripType,
}: {
  from: Airport | null;
  to: Airport | null;
  date: string;
  tripType: TripType;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white rounded-3xl p-8 max-w-lg w-full mx-4 relative overflow-hidden"
      >
        {/* Background cityscape */}
        <div
          className="absolute inset-x-0 bottom-0 h-40 bg-cover bg-bottom opacity-20"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80")',
          }}
        />

        {/* Animated elements */}
        <div className="relative">
          {/* Flying plane animation */}
          <div className="h-24 relative mb-6 overflow-hidden">
            <motion.div
              animate={{
                x: ["-100%", "200%"],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute top-1/2 -translate-y-1/2"
            >
              <Plane className="w-12 h-12 text-[#FC6603] transform -rotate-12" />
            </motion.div>
            {/* Clouds */}
            <motion.div
              animate={{ x: [0, -50, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute top-2 right-10 w-16 h-8 bg-orange-100 rounded-full"
            />
            <motion.div
              animate={{ x: [0, 30, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute top-8 right-32 w-12 h-6 bg-orange-50 rounded-full"
            />
            {/* Sun */}
            <div className="absolute top-2 left-4 w-10 h-10 bg-gradient-to-br from-amber-300 to-orange-400 rounded-full" />
          </div>

          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              We are seeking the best results for your search
            </h3>
            <p className="text-gray-600">This will take a few seconds...</p>
          </div>

          {/* Flight details card */}
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {from?.code || "---"}
                </p>
                <p className="text-sm text-gray-600">
                  {from?.city || "Origin"}
                </p>
              </div>
              <div className="flex-1 px-4 flex items-center justify-center">
                <ArrowRightLeft className="w-5 h-5 text-[#FC6603]" />
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {to?.code || "---"}
                </p>
                <p className="text-sm text-gray-600">
                  {to?.city || "Destination"}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {date
                  ? new Date(date).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : "Select Date"}
              </span>
              <span className="capitalize">
                {tripType === "roundTrip" ? "Round Trip" : "One Way"}
              </span>
            </div>
          </div>

          {/* Loading dots */}
          <div className="flex justify-center gap-2 mt-6">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
                className="w-3 h-3 rounded-full bg-[#FC6603]"
              />
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Filter content component (used by both desktop and mobile)
function FilterContent({
  filters,
  setFilters,
}: {
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
}) {
  const timeSlots = [
    {
      key: "earlyMorning",
      label: "Early Morning",
      desc: "12AM - 6AM",
      icon: Moon,
    },
    { key: "morning", label: "Morning", desc: "6AM - 12PM", icon: Sunrise },
    { key: "afternoon", label: "Afternoon", desc: "12PM - 6PM", icon: Sun },
    { key: "evening", label: "Evening", desc: "6PM - 12AM", icon: Sunset },
  ];

  const airlines = ["IndiGo", "Air India", "Vistara", "SpiceJet"];

  return (
    <div className="space-y-6">
      {/* Price Range */}
      <div>
        <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-1 h-5 bg-[#FC6603] rounded-full" />
          Price Range
        </h4>
        <div className="space-y-3">
          <input
            type="range"
            min="0"
            max="20000"
            value={filters.maxPrice}
            onChange={(e) =>
              setFilters({ ...filters, maxPrice: Number(e.target.value) })
            }
            className="w-full accent-[#FC6603]"
          />
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">₹0</span>
            <span className="font-semibold text-[#FC6603]">
              ₹{filters.maxPrice.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Stops */}
      <div>
        <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-1 h-5 bg-[#FC6603] rounded-full" />
          No. of Stops
        </h4>
        <div className="flex gap-2">
          {[
            { value: -1, label: "Any" },
            { value: 0, label: "Non-stop" },
            { value: 1, label: "1 Stop" },
          ].map((stop) => (
            <button
              key={stop.value}
              onClick={() => setFilters({ ...filters, stops: stop.value })}
              className={`flex-1 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                filters.stops === stop.value
                  ? "bg-[#FC6603] text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-orange-50"
              }`}
            >
              {stop.label}
            </button>
          ))}
        </div>
      </div>

      {/* Departure Time */}
      <div>
        <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-1 h-5 bg-[#FC6603] rounded-full" />
          Departure Time
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {timeSlots.map((slot) => (
            <button
              key={slot.key}
              onClick={() => {
                const newTimes = filters.departureTime.includes(slot.key)
                  ? filters.departureTime.filter((t) => t !== slot.key)
                  : [...filters.departureTime, slot.key];
                setFilters({ ...filters, departureTime: newTimes });
              }}
              className={`p-3 rounded-xl border-2 transition-all ${
                filters.departureTime.includes(slot.key)
                  ? "border-[#FC6603] bg-orange-50"
                  : "border-gray-200 hover:border-orange-200"
              }`}
            >
              <slot.icon
                className={`w-5 h-5 mx-auto mb-1 ${
                  filters.departureTime.includes(slot.key)
                    ? "text-[#FC6603]"
                    : "text-gray-400"
                }`}
              />
              <p
                className={`text-xs font-semibold ${
                  filters.departureTime.includes(slot.key)
                    ? "text-[#FC6603]"
                    : "text-gray-700"
                }`}
              >
                {slot.label}
              </p>
              <p className="text-[10px] text-gray-500">{slot.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Airlines */}
      <div>
        <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-1 h-5 bg-[#FC6603] rounded-full" />
          Airlines
        </h4>
        <div className="space-y-2">
          {airlines.map((airline) => (
            <label
              key={airline}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                checked={filters.airlines.includes(airline)}
                onChange={() => {
                  const newAirlines = filters.airlines.includes(airline)
                    ? filters.airlines.filter((a) => a !== airline)
                    : [...filters.airlines, airline];
                  setFilters({ ...filters, airlines: newAirlines });
                }}
                className="w-4 h-4 accent-[#FC6603] rounded"
              />
              <span className="text-sm font-medium text-gray-700">
                {airline}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Reset filters */}
      <button
        onClick={() =>
          setFilters({
            maxPrice: 20000,
            stops: -1,
            departureTime: [],
            airlines: [],
          })
        }
        className="w-full py-3 border-2 border-gray-200 rounded-xl text-gray-700 font-semibold hover:border-[#FC6603] hover:text-[#FC6603] transition-all"
      >
        Reset All Filters
      </button>
    </div>
  );
}

// Mobile filter drawer component
function MobileFilterDrawer({
  filters,
  setFilters,
  isOpen,
  onClose,
}: {
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-y-0 left-0 w-80 bg-white shadow-2xl z-50 lg:hidden overflow-y-auto"
          >
            {/* Mobile header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Filter className="w-5 h-5 text-[#FC6603]" />
                Filters
              </h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5">
              <FilterContent filters={filters} setFilters={setFilters} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Flight card component
function FlightCard({
  flight,
  onSelect,
}: {
  flight: (typeof mockFlights)[0];
  onSelect: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100 overflow-hidden"
    >
      <div className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Airline info */}
          <div className="flex items-center gap-3 md:w-32 flex-shrink-0">
            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
              <span className="text-sm font-bold text-gray-700">
                {flight.airlineCode}
              </span>
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">
                {flight.airline}
              </p>
              <p className="text-xs text-gray-500">{flight.flightNo}</p>
            </div>
          </div>

          {/* Flight times */}
          <div className="flex-1 flex items-center gap-4">
            <div className="text-center">
              <p className="text-xl md:text-2xl font-bold text-gray-900">
                {flight.departure.time}
              </p>
              <p className="text-xs text-gray-500">
                {flight.departure.airport}
              </p>
            </div>

            <div className="flex-1 relative px-4">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-[#FC6603]" />
                <div className="flex-1 h-px bg-gray-300 relative">
                  {flight.stops > 0 && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-orange-300" />
                  )}
                </div>
                <div className="w-2 h-2 rounded-full bg-[#FC6603]" />
              </div>
              <div className="text-center mt-1">
                <p className="text-xs text-gray-500">{flight.duration}</p>
                <p className="text-xs text-gray-400">
                  {flight.stops === 0
                    ? "Non-stop"
                    : `${flight.stops} stop${flight.stops > 1 ? "s" : ""}${
                        flight.stopCity ? ` via ${flight.stopCity}` : ""
                      }`}
                </p>
              </div>
            </div>

            <div className="text-center">
              <p className="text-xl md:text-2xl font-bold text-gray-900">
                {flight.arrival.time}
              </p>
              <p className="text-xs text-gray-500">{flight.arrival.airport}</p>
            </div>
          </div>

          {/* Price and book */}
          <div className="flex items-center gap-4 md:w-48 md:flex-col md:items-end">
            <div className="flex-1 md:text-right">
              <p className="text-2xl font-bold text-[#FC6603]">
                ₹{flight.price.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">per person</p>
            </div>
            <button
              onClick={onSelect}
              className="px-6 py-3 bg-gradient-to-r from-[#FC6603] to-[#ff7a1a] text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-orange-500/30 transition-all"
            >
              Book Now
            </button>
          </div>
        </div>

        {/* Quick info */}
        <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap items-center gap-4 text-xs text-gray-500">
          {flight.seatsLeft <= 5 && (
            <span className="px-2 py-1 bg-red-50 text-red-600 rounded-full font-semibold">
              Only {flight.seatsLeft} seats left
            </span>
          )}
          <span
            className={`px-2 py-1 rounded-full font-semibold ${
              flight.refundable
                ? "bg-green-50 text-green-600"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {flight.refundable ? "Refundable" : "Non-refundable"}
          </span>
          <span className="flex items-center gap-1">
            <Luggage className="w-3.5 h-3.5" />
            Cabin: {flight.baggage.cabin}
          </span>
          <span className="flex items-center gap-1">
            <Luggage className="w-3.5 h-3.5" />
            Check-in: {flight.baggage.checkin}
          </span>

          <button
            onClick={() => setExpanded(!expanded)}
            className="ml-auto flex items-center gap-1 text-[#FC6603] font-semibold hover:underline"
          >
            {expanded ? "Hide Details" : "Flight Details"}
            {expanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Expanded details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-gray-100 bg-gray-50 overflow-hidden"
          >
            <div className="p-4 md:p-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h5 className="font-semibold text-gray-900 mb-3">
                    Departure
                  </h5>
                  <div className="space-y-2 text-sm">
                    <p className="font-bold text-gray-900">
                      {flight.departure.time}
                    </p>
                    <p className="text-gray-600">
                      {flight.departure.city} ({flight.departure.airport})
                    </p>
                    <p className="text-gray-500">Terminal 3</p>
                  </div>
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900 mb-3">Arrival</h5>
                  <div className="space-y-2 text-sm">
                    <p className="font-bold text-gray-900">
                      {flight.arrival.time}
                    </p>
                    <p className="text-gray-600">
                      {flight.arrival.city} ({flight.arrival.airport})
                    </p>
                    <p className="text-gray-500">Terminal 2</p>
                  </div>
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900 mb-3">
                    Baggage Info
                  </h5>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>Cabin Baggage: {flight.baggage.cabin}</p>
                    <p>Check-in Baggage: {flight.baggage.checkin}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

interface FilterState {
  maxPrice: number;
  stops: number;
  departureTime: string[];
  airlines: string[];
}

export default function FlightsPage() {
  const [tripType, setTripType] = useState<TripType>("oneWay");
  const [from, setFrom] = useState<Airport | null>(null);
  const [to, setTo] = useState<Airport | null>(null);
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [travelers, setTravelers] = useState<TravelersConfig>({
    adults: 1,
    children: 0,
    infants: 0,
    class: "economy",
  });

  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<"price" | "duration" | "departure">(
    "price"
  );
  const [filters, setFilters] = useState<FilterState>({
    maxPrice: 20000,
    stops: -1,
    departureTime: [],
    airlines: [],
  });

  const swapLocations = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  const handleSearch = useCallback(() => {
    if (!from || !to || !departureDate) return;

    setIsSearching(true);
    // Simulate search delay
    setTimeout(() => {
      setIsSearching(false);
      setHasSearched(true);
    }, 2500);
  }, [from, to, departureDate]);

  // Filter and sort flights
  const filteredFlights = mockFlights
    .filter((flight) => {
      if (flight.price > filters.maxPrice) return false;
      if (filters.stops !== -1 && flight.stops !== filters.stops) return false;
      if (
        filters.airlines.length > 0 &&
        !filters.airlines.includes(flight.airline)
      )
        return false;
      // Time filtering would go here
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "price") return a.price - b.price;
      if (sortBy === "duration")
        return (
          parseInt(a.duration.replace(/\D/g, "")) -
          parseInt(b.duration.replace(/\D/g, ""))
        );
      return a.departure.time.localeCompare(b.departure.time);
    });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      {/* Search Section */}
      <section className="bg-gradient-to-br from-[#FC6603] via-[#ff7a1a] to-[#ff8534] pt-8 pb-16 relative overflow-hidden">
        {/* Background pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1920&q=80")',
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Search Flights
            </h1>
            <p className="text-white/80">
              Find the best deals on domestic and international flights
            </p>
          </motion.div>

          {/* Search Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl shadow-2xl p-4 md:p-6"
          >
            {/* Trip Type Toggle */}
            <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-xl w-fit">
              {[
                { value: "oneWay", label: "One Way" },
                { value: "roundTrip", label: "Round Trip" },
              ].map((type) => (
                <button
                  key={type.value}
                  onClick={() => setTripType(type.value as TripType)}
                  className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                    tripType === type.value
                      ? "bg-[#FC6603] text-white shadow-md"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>

            {/* Mobile Search Fields */}
            <div className="md:hidden space-y-3">
              {/* From */}
              <AirportDropdown
                value={from}
                onChange={setFrom}
                placeholder="Where from?"
                label="From"
                icon={Plane}
              />

              {/* Swap button */}
              <div className="flex justify-center -my-1 relative z-10">
                <button
                  onClick={swapLocations}
                  className="p-2.5 rounded-full bg-orange-50 hover:bg-[#FC6603] hover:text-white text-[#FC6603] transition-all border-2 border-orange-200"
                >
                  <ArrowRightLeft className="w-4 h-4 rotate-90" />
                </button>
              </div>

              {/* To */}
              <AirportDropdown
                value={to}
                onChange={setTo}
                placeholder="Where to?"
                label="To"
                icon={MapPin}
              />

              {/* Dates */}
              <div
                className={`grid gap-3 ${
                  tripType === "roundTrip" ? "grid-cols-2" : "grid-cols-1"
                }`}
              >
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2">
                    Departure
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#FC6603]" />
                    <input
                      type="date"
                      value={departureDate}
                      onChange={(e) => setDepartureDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full pl-11 pr-3 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-[#FC6603] focus:bg-white focus:outline-none transition-all text-sm font-medium"
                    />
                  </div>
                </div>

                {tripType === "roundTrip" && (
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2">
                      Return
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#FC6603]" />
                      <input
                        type="date"
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                        min={
                          departureDate ||
                          new Date().toISOString().split("T")[0]
                        }
                        className="w-full pl-11 pr-3 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-[#FC6603] focus:bg-white focus:outline-none transition-all text-sm font-medium"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Travelers */}
              <TravelersDropdown config={travelers} onChange={setTravelers} />

              {/* Search Button */}
              <button
                onClick={handleSearch}
                disabled={!from || !to || !departureDate}
                className="w-full h-[52px] bg-gradient-to-r from-[#FC6603] to-[#ff7a1a] hover:from-[#e55a02] hover:to-[#FC6603] disabled:from-gray-300 disabled:to-gray-400 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl disabled:shadow-none disabled:cursor-not-allowed"
              >
                <Search className="w-5 h-5" />
                <span>Search</span>
              </button>
            </div>

            {/* Desktop Search Fields */}
            <div className="hidden md:block">
              <div className="space-y-4">
                {/* Row 1: From, Swap, To */}
                <div className="flex gap-4 items-end">
                  <div className="flex-1">
                    <AirportDropdown
                      value={from}
                      onChange={setFrom}
                      placeholder="Where from?"
                      label="From"
                      icon={Plane}
                    />
                  </div>
                  <div className="pb-1">
                    <button
                      onClick={swapLocations}
                      className="p-3 rounded-full bg-orange-50 hover:bg-[#FC6603] hover:text-white text-[#FC6603] transition-all border-2 border-orange-200 hover:border-[#FC6603]"
                    >
                      <ArrowRightLeft className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex-1">
                    <AirportDropdown
                      value={to}
                      onChange={setTo}
                      placeholder="Where to?"
                      label="To"
                      icon={MapPin}
                    />
                  </div>
                </div>

                {/* Row 2: Dates, Travelers, Search */}
                <div className="flex gap-4 items-end">
                  <div className="w-40">
                    <label className="block text-xs font-bold text-gray-700 mb-2">
                      Departure
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#FC6603]" />
                      <input
                        type="date"
                        value={departureDate}
                        onChange={(e) => setDepartureDate(e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                        className="w-full pl-11 pr-3 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-[#FC6603] focus:bg-white focus:outline-none transition-all text-sm font-medium"
                      />
                    </div>
                  </div>

                  {tripType === "roundTrip" && (
                    <div className="w-40">
                      <label className="block text-xs font-bold text-gray-700 mb-2">
                        Return
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#FC6603]" />
                        <input
                          type="date"
                          value={returnDate}
                          onChange={(e) => setReturnDate(e.target.value)}
                          min={
                            departureDate ||
                            new Date().toISOString().split("T")[0]
                          }
                          className="w-full pl-11 pr-3 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-[#FC6603] focus:bg-white focus:outline-none transition-all text-sm font-medium"
                        />
                      </div>
                    </div>
                  )}

                  <div className="w-52">
                    <TravelersDropdown
                      config={travelers}
                      onChange={setTravelers}
                    />
                  </div>

                  <button
                    onClick={handleSearch}
                    disabled={!from || !to || !departureDate}
                    className="px-8 h-[52px] bg-gradient-to-r from-[#FC6603] to-[#ff7a1a] hover:from-[#e55a02] hover:to-[#FC6603] disabled:from-gray-300 disabled:to-gray-400 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl disabled:shadow-none disabled:cursor-not-allowed"
                  >
                    <Search className="w-5 h-5" />
                    <span>Search</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Results Section */}
      {hasSearched && (
        <section className="flex-1 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Results header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {from?.city} → {to?.city}
                </h2>
                <p className="text-sm text-gray-600">
                  {filteredFlights.length} flights found •{" "}
                  {new Date(departureDate).toLocaleDateString("en-US", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                  })}
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* Mobile filter button */}
                <button
                  onClick={() => setShowFilters(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl font-semibold text-sm hover:border-[#FC6603] transition-colors"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                </button>

                {/* Sort dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl font-semibold text-sm focus:border-[#FC6603] focus:outline-none cursor-pointer"
                >
                  <option value="price">Sort by Price</option>
                  <option value="duration">Sort by Duration</option>
                  <option value="departure">Sort by Departure</option>
                </select>
              </div>
            </div>

            {/* Main content */}
            <div className="flex gap-6">
              {/* Desktop Filters */}
              <div className="hidden lg:block w-80 flex-shrink-0">
                <div className="bg-white rounded-2xl shadow-lg p-5 sticky top-24">
                  <h3 className="font-bold text-lg text-gray-900 mb-6 flex items-center gap-2">
                    <Filter className="w-5 h-5 text-[#FC6603]" />
                    Filters
                  </h3>
                  <FilterContent filters={filters} setFilters={setFilters} />
                </div>
              </div>

              {/* Mobile Filters */}
              <MobileFilterDrawer
                filters={filters}
                setFilters={setFilters}
                isOpen={showFilters}
                onClose={() => setShowFilters(false)}
              />

              {/* Flight Results */}
              <div className="flex-1 space-y-4">
                {filteredFlights.length > 0 ? (
                  filteredFlights.map((flight) => (
                    <FlightCard
                      key={flight.id}
                      flight={flight}
                      onSelect={() => {
                        // Handle flight selection
                        alert(
                          `Selected ${flight.airline} ${flight.flightNo} - ₹${flight.price}`
                        );
                      }}
                    />
                  ))
                ) : (
                  <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
                      <Plane className="w-8 h-8 text-[#FC6603]" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      No flights found
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Try adjusting your filters or search for different dates
                    </p>
                    <button
                      onClick={() =>
                        setFilters({
                          maxPrice: 20000,
                          stops: -1,
                          departureTime: [],
                          airlines: [],
                        })
                      }
                      className="px-6 py-3 bg-[#FC6603] text-white font-semibold rounded-xl hover:bg-[#e55a02] transition-colors"
                    >
                      Reset Filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Empty state before search */}
      {!hasSearched && (
        <section className="flex-1 py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="w-20 h-20 mx-auto mb-6 bg-orange-100 rounded-full flex items-center justify-center">
                <Plane className="w-10 h-10 text-[#FC6603]" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Find Your Perfect Flight
              </h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Search from hundreds of airlines and compare prices to get the
                best deals on your next trip
              </p>

              {/* Popular routes */}
              <div className="mt-12">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-6">
                  Popular Routes
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { from: "Delhi", to: "Mumbai", price: "₹3,499" },
                    { from: "Bangalore", to: "Delhi", price: "₹4,199" },
                    { from: "Mumbai", to: "Dubai", price: "₹12,999" },
                    { from: "Delhi", to: "Singapore", price: "₹15,499" },
                    { from: "Chennai", to: "Bangkok", price: "₹11,299" },
                    { from: "Mumbai", to: "London", price: "₹38,999" },
                  ].map((route, idx) => (
                    <motion.button
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + idx * 0.05 }}
                      onClick={() => {
                        const fromAirport = popularAirports.find(
                          (a) =>
                            a.city.toLowerCase() === route.from.toLowerCase()
                        );
                        const toAirport = popularAirports.find(
                          (a) => a.city.toLowerCase() === route.to.toLowerCase()
                        );
                        if (fromAirport) setFrom(fromAirport);
                        if (toAirport) setTo(toAirport);
                      }}
                      className="group p-4 bg-white rounded-2xl border border-gray-200 hover:border-[#FC6603] hover:shadow-lg transition-all text-left"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-semibold text-gray-900">
                          {route.from}
                        </span>
                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#FC6603]" />
                        <span className="font-semibold text-gray-900">
                          {route.to}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        Starting from{" "}
                        <span className="font-bold text-[#FC6603]">
                          {route.price}
                        </span>
                      </p>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Search Animation Modal */}
      <AnimatePresence>
        {isSearching && (
          <SearchingAnimation
            from={from}
            to={to}
            date={departureDate}
            tripType={tripType}
          />
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
