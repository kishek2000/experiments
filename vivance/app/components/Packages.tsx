import { motion } from "framer-motion";
import { Clock, Users, Utensils, Plane, Hotel, Camera, Check, ArrowRight } from "lucide-react";

const packages = [
  {
    id: 1,
    title: "Magical Rajasthan",
    subtitle: "Heritage & Culture Tour",
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&q=80",
    duration: "6 Nights / 7 Days",
    groupSize: "Up to 12",
    price: "₹42,999",
    originalPrice: "₹52,999",
    discount: "19% OFF",
    includes: ["Flights", "Hotels", "Meals", "Sightseeing"],
    highlights: ["Jaipur", "Udaipur", "Jodhpur", "Jaisalmer"],
  },
  {
    id: 2,
    title: "Kerala Backwaters",
    subtitle: "Tropical Paradise Escape",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80",
    duration: "4 Nights / 5 Days",
    groupSize: "Up to 8",
    price: "₹28,499",
    originalPrice: "₹34,999",
    discount: "18% OFF",
    includes: ["Flights", "Houseboat", "Meals", "Transfers"],
    highlights: ["Munnar", "Alleppey", "Kovalam"],
  },
  {
    id: 3,
    title: "Ladakh Adventure",
    subtitle: "Mountain Expedition",
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80",
    duration: "7 Nights / 8 Days",
    groupSize: "Up to 10",
    price: "₹55,999",
    originalPrice: "₹68,999",
    discount: "19% OFF",
    includes: ["Flights", "Camps", "Meals", "Bike Rental"],
    highlights: ["Leh", "Nubra Valley", "Pangong Lake"],
  },
];

const featuredPackage = {
  title: "Kumbh Mela Experience 2025",
  subtitle: "Spiritual Journey at Prayagraj",
  image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&q=80",
  duration: "3 Nights / 4 Days",
  price: "₹15,000",
  description:
    "Experience the world's largest spiritual gathering. Immerse yourself in ancient traditions, sacred rituals, and the divine atmosphere of Kumbh Mela.",
  includes: [
    "Accommodation in premium camps",
    "All meals included",
    "Expert spiritual guides",
    "Sacred bath rituals",
    "Temple visits",
    "Cultural programs",
  ],
};

const Packages = () => {
  return (
    <section className="py-20 lg:py-28 bg-white" id="packages">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <motion.span
            className="inline-block text-vivance-orange font-semibold text-sm uppercase tracking-wider mb-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Curated Experiences
          </motion.span>
          <motion.h2
            className="text-3xl lg:text-5xl font-bold text-vivance-blue"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Holiday <span className="text-vivance-orange">Packages</span>
          </motion.h2>
          <motion.p
            className="mt-4 text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Hand-picked travel packages designed for unforgettable experiences. Everything arranged,
            just pack your bags!
          </motion.p>
        </div>

        {/* Featured Package */}
        <motion.div
          className="mb-12 lg:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="relative rounded-3xl overflow-hidden bg-vivance-blue">
            <div className="grid lg:grid-cols-2">
              {/* Image */}
              <div className="relative h-64 lg:h-auto min-h-[400px]">
                <img
                  src={featuredPackage.image}
                  alt={featuredPackage.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-vivance-blue/80 via-vivance-blue/40 to-transparent lg:bg-gradient-to-l" />

                {/* Featured badge */}
                <div className="absolute top-6 left-6 px-4 py-2 bg-vivance-orange text-white text-sm font-bold rounded-full flex items-center gap-2">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  Featured Experience
                </div>
              </div>

              {/* Content */}
              <div className="relative p-8 lg:p-12">
                <h3 className="text-2xl lg:text-4xl font-bold text-white mb-2">
                  {featuredPackage.title}
                </h3>
                <p className="text-vivance-orange font-medium mb-4">{featuredPackage.subtitle}</p>
                <p className="text-white/70 mb-6">{featuredPackage.description}</p>

                <div className="flex items-center gap-6 mb-6 text-white/80">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-vivance-orange" />
                    {featuredPackage.duration}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-8">
                  {featuredPackage.includes.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 text-white/80 text-sm">
                      <Check className="w-4 h-4 text-vivance-green" />
                      {item}
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-sm">Starting from</p>
                    <p className="text-3xl font-bold text-vivance-orange">{featuredPackage.price}</p>
                    <p className="text-white/60 text-sm">per person</p>
                  </div>
                  <motion.button
                    className="px-8 py-4 bg-vivance-orange text-white font-bold rounded-xl shadow-lg shadow-vivance-orange/30 flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Book Now
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Package Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {packages.map((pkg, index) => (
            <motion.div
              key={pkg.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
            >
              {/* Image */}
              <div className="relative h-52 overflow-hidden">
                <img
                  src={pkg.image}
                  alt={pkg.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                {/* Discount Badge */}
                <div className="absolute top-4 right-4 px-3 py-1 bg-vivance-red text-white text-xs font-bold rounded-full">
                  {pkg.discount}
                </div>

                {/* Highlights */}
                <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
                  {pkg.highlights.map((highlight, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-white/20 backdrop-blur-md text-white text-xs rounded-full"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-vivance-blue mb-1">{pkg.title}</h3>
                <p className="text-gray-500 text-sm mb-4">{pkg.subtitle}</p>

                <div className="flex items-center gap-4 mb-4 text-gray-600 text-sm">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-vivance-orange" />
                    {pkg.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4 text-vivance-orange" />
                    {pkg.groupSize}
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 mb-6">
                  {pkg.includes.map((item, i) => (
                    <div key={i} className="flex items-center gap-1 text-gray-500 text-xs">
                      {item === "Flights" && <Plane className="w-3 h-3" />}
                      {item === "Hotels" && <Hotel className="w-3 h-3" />}
                      {item === "Houseboat" && <Hotel className="w-3 h-3" />}
                      {item === "Camps" && <Hotel className="w-3 h-3" />}
                      {item === "Meals" && <Utensils className="w-3 h-3" />}
                      {item === "Sightseeing" && <Camera className="w-3 h-3" />}
                      {item === "Transfers" && <Plane className="w-3 h-3" />}
                      {item === "Bike Rental" && <Camera className="w-3 h-3" />}
                      {item}
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <p className="text-gray-400 text-sm line-through">{pkg.originalPrice}</p>
                    <p className="text-2xl font-bold text-vivance-orange">{pkg.price}</p>
                    <p className="text-gray-500 text-xs">per person</p>
                  </div>
                  <motion.button
                    className="px-6 py-3 bg-vivance-blue text-white font-semibold rounded-xl hover:bg-vivance-blue-light transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    View Details
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <button className="px-8 py-4 border-2 border-vivance-orange text-vivance-orange font-semibold rounded-xl hover:bg-vivance-orange hover:text-white transition-all inline-flex items-center gap-2">
            View All Packages
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Packages;

