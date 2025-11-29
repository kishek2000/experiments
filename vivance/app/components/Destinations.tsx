import { motion } from "framer-motion";
import { MapPin, Star, ArrowRight } from "lucide-react";

const destinations = [
  {
    id: 1,
    name: "Goa",
    country: "India",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80",
    rating: 4.8,
    price: "₹8,999",
    tag: "Beach Paradise",
  },
  {
    id: 2,
    name: "Dubai",
    country: "UAE",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80",
    rating: 4.9,
    price: "₹32,499",
    tag: "Luxury",
  },
  {
    id: 3,
    name: "Bali",
    country: "Indonesia",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
    rating: 4.7,
    price: "₹45,999",
    tag: "Adventure",
  },
  {
    id: 4,
    name: "Maldives",
    country: "Maldives",
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80",
    rating: 4.9,
    price: "₹89,999",
    tag: "Honeymoon",
  },
  {
    id: 5,
    name: "Singapore",
    country: "Singapore",
    image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&q=80",
    rating: 4.8,
    price: "₹54,999",
    tag: "City Life",
  },
  {
    id: 6,
    name: "Thailand",
    country: "Thailand",
    image: "https://images.unsplash.com/photo-1528181304800-259b08848526?w=800&q=80",
    rating: 4.6,
    price: "₹28,999",
    tag: "Culture",
  },
];

const Destinations = () => {
  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-gray-50 to-white" id="destinations">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-12">
          <div>
            <motion.span
              className="inline-block text-vivance-orange font-semibold text-sm uppercase tracking-wider mb-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Explore Destinations
            </motion.span>
            <motion.h2
              className="text-3xl lg:text-5xl font-bold text-vivance-blue"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Popular <span className="text-vivance-orange">Destinations</span>
            </motion.h2>
            <motion.p
              className="mt-4 text-gray-600 max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Discover breathtaking locations around the world. From tropical beaches to vibrant cities.
            </motion.p>
          </div>

          <motion.button
            className="hidden lg:flex items-center gap-2 mt-6 lg:mt-0 text-vivance-orange font-semibold hover:gap-4 transition-all"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            View All Destinations
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {destinations.map((destination, index) => (
            <motion.div
              key={destination.id}
              className="group relative rounded-2xl overflow-hidden cursor-pointer shadow-lg"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
            >
              {/* Image */}
              <div className="relative h-80 lg:h-96 overflow-hidden">
                <img
                  src={destination.image}
                  alt={destination.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Tag */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1.5 bg-vivance-orange text-white text-xs font-bold rounded-full">
                    {destination.tag}
                  </span>
                </div>

                {/* Rating */}
                <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-sm">
                  <Star className="w-4 h-4 fill-vivance-yellow text-vivance-yellow" />
                  {destination.rating}
                </div>
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-end justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-white/70 text-sm mb-2">
                      <MapPin className="w-4 h-4" />
                      {destination.country}
                    </div>
                    <h3 className="text-2xl font-bold text-white">{destination.name}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-white/70 text-xs">Starting from</p>
                    <p className="text-xl font-bold text-vivance-orange">{destination.price}</p>
                  </div>
                </div>

                {/* Hover reveal button */}
                <motion.button className="w-full mt-4 py-3 bg-vivance-orange text-white font-semibold rounded-xl opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  Explore Now
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile View All Button */}
        <motion.button
          className="lg:hidden w-full mt-8 py-4 border-2 border-vivance-orange text-vivance-orange font-semibold rounded-xl flex items-center justify-center gap-2"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          View All Destinations
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </div>
    </section>
  );
};

export default Destinations;

