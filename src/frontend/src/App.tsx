import { BookingModal } from "@/components/BookingModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle,
  ChevronRight,
  Clock,
  Facebook,
  Globe,
  Heart,
  Instagram,
  Mail,
  MapPin,
  Menu,
  Phone,
  Plane,
  Search,
  Shield,
  Sparkles,
  Star,
  Twitter,
  X,
  Youtube,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

const TOUR_PACKAGES = [
  {
    id: 1,
    name: "Magical Bali Retreat",
    destination: "Bali, Indonesia",
    duration: 7,
    price: 18999,
    rating: 4.9,
    reviews: 248,
    badge: "Best Seller",
    image: "/assets/generated/tour-bali.dim_600x400.jpg",
    description: "Rice terraces, temples & pristine beaches",
  },
  {
    id: 2,
    name: "Romantic Paris Escape",
    destination: "Paris, France",
    duration: 6,
    price: 24999,
    rating: 4.8,
    reviews: 312,
    badge: "Popular",
    image: "/assets/generated/tour-paris.dim_600x400.jpg",
    description: "Eiffel Tower, Louvre & Parisian cuisine",
  },
  {
    id: 3,
    name: "Maldives Luxury Getaway",
    destination: "Maldives",
    duration: 5,
    price: 32999,
    rating: 5.0,
    reviews: 186,
    badge: "Luxury",
    image: "/assets/generated/tour-maldives.dim_600x400.jpg",
    description: "Overwater villas & crystal lagoons",
  },
  {
    id: 4,
    name: "Swiss Alps Adventure",
    destination: "Switzerland",
    duration: 8,
    price: 28999,
    rating: 4.7,
    reviews: 165,
    badge: "Adventure",
    image: "/assets/generated/tour-switzerland.dim_600x400.jpg",
    description: "Alpine peaks, glaciers & charming villages",
  },
];

const DESTINATIONS = [
  {
    id: 1,
    name: "Tokyo",
    country: "Japan",
    image: "/assets/generated/dest-tokyo.dim_500x500.jpg",
  },
  {
    id: 2,
    name: "Santorini",
    country: "Greece",
    image: "/assets/generated/dest-santorini.dim_500x500.jpg",
  },
  {
    id: 3,
    name: "Rajasthan",
    country: "India",
    image: "/assets/generated/dest-rajasthan.dim_500x500.jpg",
  },
  {
    id: 4,
    name: "New York",
    country: "USA",
    image: "/assets/generated/dest-newyork.dim_500x500.jpg",
  },
];

const TESTIMONIALS = [
  {
    id: 1,
    name: "Priya Sharma",
    location: "Mumbai, India",
    rating: 5,
    review:
      "Meena Tour and Travels made our Bali honeymoon absolutely magical. Every detail was perfectly planned — from the private villa to the sunset temple tour. We'll definitely book again!",
    avatar: "PS",
  },
  {
    id: 2,
    name: "Rahul Mehta",
    location: "Delhi, India",
    rating: 5,
    review:
      "Exceptional service and amazing itinerary! The Switzerland trip exceeded all expectations. The guides were knowledgeable and the accommodations were top-notch. Highly recommended!",
    avatar: "RM",
  },
  {
    id: 3,
    name: "Anjali Patel",
    location: "Ahmedabad, India",
    rating: 5,
    review:
      "From booking to return, the entire Paris experience was seamless. Meena Tour and Travels truly understands what travelers need. Our family vacation was stress-free and memorable.",
    avatar: "AP",
  },
];

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Destinations", href: "#destinations" },
  { label: "Tours", href: "#tours" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={
            star <= Math.round(rating)
              ? "fill-accent text-accent"
              : "fill-muted text-muted"
          }
        />
      ))}
    </div>
  );
}

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [searchDestination, setSearchDestination] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [searchGuests, setSearchGuests] = useState("");
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingDestination, setBookingDestination] = useState("");
  const currentYear = new Date().getFullYear();

  function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormSubmitted(true);
    setFormData({ name: "", email: "", phone: "", message: "" });
    setTimeout(() => setFormSubmitted(false), 4000);
  }

  return (
    <>
      <div className="min-h-screen bg-background">
        {/* HEADER */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border shadow-xs">
          <div className="container mx-auto px-4 flex items-center justify-between h-16">
            {/* Logo */}
            <a
              href="#home"
              className="flex items-center gap-2"
              data-ocid="nav.link"
            >
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <Plane size={16} className="text-white rotate-45" />
              </div>
              <div className="leading-tight">
                <div className="font-display font-bold text-primary text-sm">
                  Meena Tour
                </div>
                <div className="font-display text-xs text-muted-foreground">
                  & Travels
                </div>
              </div>
            </a>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  data-ocid="nav.link"
                  className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* CTA */}
            <div className="hidden md:flex items-center gap-3">
              <Button
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-5"
                data-ocid="nav.primary_button"
                onClick={() => {
                  setBookingDestination("");
                  setBookingOpen(true);
                }}
              >
                Book Now
              </Button>
            </div>

            {/* Mobile hamburger */}
            <button
              type="button"
              className="md:hidden p-2 rounded-md hover:bg-muted transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-ocid="nav.toggle"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:hidden bg-white border-t border-border px-4 py-4 flex flex-col gap-3"
            >
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-medium text-foreground hover:text-primary py-1"
                >
                  {link.label}
                </a>
              ))}
              <Button
                size="sm"
                className="bg-primary text-primary-foreground mt-2"
                data-ocid="nav.primary_button"
                onClick={() => {
                  setBookingDestination("");
                  setBookingOpen(true);
                  setMobileMenuOpen(false);
                }}
              >
                Book Now
              </Button>
            </motion.div>
          )}
        </header>

        {/* HERO */}
        <section
          id="home"
          className="relative min-h-[600px] flex items-center pt-16"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('/assets/generated/hero-travel.dim_1400x600.jpg')",
            }}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

          <div className="container mx-auto px-4 relative z-10 py-24">
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-2xl"
            >
              <Badge className="bg-accent/20 text-accent border-accent/30 mb-4 font-medium">
                ✈ Trusted Travel Partner Since 2005
              </Badge>
              <h1 className="font-display text-4xl md:text-6xl font-bold text-white uppercase tracking-wide leading-tight mb-4">
                Discover Your
                <span className="block text-accent">Dream Destination</span>
              </h1>
              <p className="text-white/85 text-lg md:text-xl mb-8 font-light max-w-lg">
                Crafting unforgettable journeys with Meena Tour and Travels —
                where every trip becomes a treasured memory.
              </p>
              <div className="flex gap-3 flex-wrap">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white font-semibold px-8"
                  data-ocid="hero.primary_button"
                  onClick={() => {
                    setBookingDestination("");
                    setBookingOpen(true);
                  }}
                >
                  Book a Cab
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/15 bg-white/10 backdrop-blur-sm font-semibold"
                  data-ocid="hero.secondary_button"
                >
                  Learn More
                </Button>
              </div>

              {/* Stats */}
              <div className="flex gap-8 mt-12">
                {[
                  { val: "5000+", label: "Happy Travelers" },
                  { val: "50+", label: "Destinations" },
                  { val: "2011", label: "Est. Since" },
                ].map(({ val, label }) => (
                  <div key={label} className="text-white">
                    <div className="text-2xl font-bold font-display">{val}</div>
                    <div className="text-white/70 text-sm">{label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Search Bar */}
          <div className="absolute bottom-0 left-0 right-0 translate-y-1/2 z-20 container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <Card className="shadow-hero border-0">
                <CardContent className="p-4 md:p-6">
                  <div className="flex flex-col md:flex-row gap-3 items-end">
                    <div className="flex-1">
                      <label
                        htmlFor="search-destination"
                        className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block"
                      >
                        <MapPin size={12} className="inline mr-1" />
                        Destination
                      </label>
                      <Input
                        id="search-destination"
                        placeholder="Where do you want to go?"
                        value={searchDestination}
                        onChange={(e) => setSearchDestination(e.target.value)}
                        className="border-input bg-background"
                        data-ocid="search.input"
                      />
                    </div>
                    <div className="flex-1">
                      <label
                        htmlFor="search-date"
                        className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block"
                      >
                        <Clock size={12} className="inline mr-1" />
                        Travel Date
                      </label>
                      <Input
                        id="search-date"
                        type="date"
                        value={searchDate}
                        onChange={(e) => setSearchDate(e.target.value)}
                        className="border-input bg-background"
                        data-ocid="search.input"
                      />
                    </div>
                    <div className="flex-1">
                      <label
                        htmlFor="search-guests"
                        className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block"
                      >
                        <Globe size={12} className="inline mr-1" />
                        Guests
                      </label>
                      <Input
                        id="search-guests"
                        placeholder="How many guests?"
                        value={searchGuests}
                        onChange={(e) => setSearchGuests(e.target.value)}
                        className="border-input bg-background"
                        data-ocid="search.input"
                      />
                    </div>
                    <Button
                      className="bg-primary hover:bg-primary/90 text-white font-semibold px-8 h-10"
                      data-ocid="search.primary_button"
                    >
                      <Search size={16} className="mr-2" />
                      Search
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="pt-40 pb-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: <Shield size={28} />,
                  title: "Safe & Secure",
                  desc: "Your safety is our top priority. All our tours come with full travel insurance and 24/7 support.",
                },
                {
                  icon: <Star size={28} />,
                  title: "Best Price Guarantee",
                  desc: "We match any lower price you find. Exceptional quality travel experiences at unbeatable value.",
                },
                {
                  icon: <Globe size={28} />,
                  title: "Expert Local Guides",
                  desc: "Our certified local guides bring destinations to life with authentic stories and insider knowledge.",
                },
              ].map(({ icon, title, desc }) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="border-0 shadow-card text-center p-6 hover:shadow-hero transition-shadow">
                    <CardContent className="p-0">
                      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
                        {icon}
                      </div>
                      <h3 className="font-display font-semibold text-lg mb-2">
                        {title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {desc}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* TRUST BADGES STRIP */}
        <section className="py-6 bg-primary/5 border-y border-primary/10">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
              <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                <Shield size={20} className="text-primary fill-primary/20" />
                <span>All India Tourist Permit</span>
              </div>
              <div className="hidden md:block w-px h-5 bg-primary/20" />
              <div className="flex items-center gap-2 text-foreground/70 text-sm">
                <Star size={16} className="text-amber-500 fill-amber-500" />
                <span>Est. Since 2011</span>
              </div>
              <div className="hidden md:block w-px h-5 bg-primary/20" />
              <div className="flex items-center gap-2 text-foreground/70 text-sm">
                <Globe size={16} className="text-primary" />
                <span>Pan-India Tours</span>
              </div>
              <div className="hidden md:block w-px h-5 bg-primary/20" />
              <div className="flex items-center gap-2 text-foreground/70 text-sm">
                <Shield size={16} className="text-green-600" />
                <span>Fully Insured Travel</span>
              </div>
              <div className="hidden md:block w-px h-5 bg-primary/20" />
              <div className="flex items-center gap-2 text-foreground/70 text-sm">
                <Heart size={16} className="text-rose-500 fill-rose-500" />
                <span>5000+ Happy Travelers</span>
              </div>
              <div className="hidden md:block w-px h-5 bg-primary/20" />
              <div className="flex items-center gap-2 text-foreground/70 text-sm">
                <CheckCircle size={16} className="text-green-600" />
                <span>GSTIN: 07BQXPG8115J1ZB</span>
              </div>
            </div>
          </div>
        </section>

        {/* TOUR PACKAGES */}
        <section id="tours" className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <Badge className="bg-primary/10 text-primary border-primary/20 mb-3">
                Featured Packages
              </Badge>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
                Popular Tour Packages
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Handpicked itineraries designed for unforgettable experiences.
                All-inclusive packages with expert guidance.
              </p>
            </motion.div>

            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              data-ocid="tours.list"
            >
              {TOUR_PACKAGES.map((pkg, i) => (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  data-ocid={`tours.item.${i + 1}`}
                >
                  <Card className="overflow-hidden border-0 shadow-card hover:shadow-hero transition-all hover:-translate-y-1 group">
                    <div className="relative overflow-hidden h-48">
                      <img
                        src={pkg.image}
                        alt={pkg.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <Badge className="absolute top-3 left-3 bg-primary text-white border-0 text-xs font-semibold">
                        {pkg.badge}
                      </Badge>
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                        <Clock size={11} className="text-muted-foreground" />
                        <span className="text-xs font-medium">
                          {pkg.duration}D
                        </span>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="font-display font-semibold text-sm leading-tight">
                          {pkg.name}
                        </h3>
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
                        <MapPin size={11} />
                        {pkg.destination}
                      </p>
                      <p className="text-xs text-muted-foreground mb-3 line-clamp-1">
                        {pkg.description}
                      </p>
                      <div className="flex items-center gap-1 mb-3">
                        <StarRating rating={pkg.rating} size={12} />
                        <span className="text-xs text-muted-foreground ml-1">
                          ({pkg.reviews})
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs text-muted-foreground">
                            From
                          </span>
                          <div className="font-bold text-primary text-lg font-display">
                            ₹{pkg.price.toLocaleString("en-IN")}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          className="bg-primary hover:bg-primary/90 text-white text-xs"
                          data-ocid={`tours.edit_button.${i + 1}`}
                          onClick={() => {
                            setBookingDestination(pkg.destination);
                            setBookingOpen(true);
                          }}
                        >
                          Book Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Button
                variant="outline"
                size="lg"
                className="border-primary text-primary hover:bg-primary/5 font-semibold px-10"
                data-ocid="tours.secondary_button"
              >
                View All Packages <ChevronRight size={16} className="ml-1" />
              </Button>
            </div>
          </div>
        </section>

        {/* DESTINATIONS */}
        <section id="destinations" className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <Badge className="bg-primary/10 text-primary border-primary/20 mb-3">
                Explore The World
              </Badge>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
                Popular Destinations
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                From ancient temples to modern cities, discover the world's most
                captivating destinations.
              </p>
            </motion.div>

            <div
              className="grid grid-cols-2 lg:grid-cols-4 gap-4"
              data-ocid="destinations.list"
            >
              {DESTINATIONS.map((dest, i) => (
                <motion.div
                  key={dest.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  data-ocid={`destinations.item.${i + 1}`}
                  className="group cursor-pointer"
                >
                  <div className="relative rounded-xl overflow-hidden aspect-square shadow-card hover:shadow-hero transition-all hover:-translate-y-1">
                    <img
                      src={dest.image}
                      alt={dest.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-white font-display font-bold text-lg leading-tight">
                        {dest.name}
                      </h3>
                      <p className="text-white/75 text-sm flex items-center gap-1">
                        <MapPin size={12} />
                        {dest.country}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white font-semibold px-10"
                data-ocid="destinations.primary_button"
              >
                Explore All Destinations
              </Button>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section id="about" className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <Badge className="bg-accent/15 text-foreground border-accent/30 mb-3">
                Traveler Stories
              </Badge>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
                What Our Travelers Say
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Real experiences from real travelers who trusted Meena Tour and
                Travels with their dream vacations.
              </p>
            </motion.div>

            <div
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
              data-ocid="testimonials.list"
            >
              {TESTIMONIALS.map((t, i) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  data-ocid={`testimonials.item.${i + 1}`}
                >
                  <Card className="border-0 shadow-card hover:shadow-hero transition-shadow h-full">
                    <CardContent className="p-6">
                      <StarRating rating={t.rating} size={16} />
                      <p className="text-foreground/80 mt-4 mb-6 text-sm leading-relaxed italic">
                        &ldquo;{t.review}&rdquo;
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">
                          {t.avatar}
                        </div>
                        <div>
                          <div className="font-semibold text-sm">{t.name}</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin size={10} />
                            {t.location}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section
          id="contact"
          className="py-16 bg-gradient-to-br from-secondary/40 via-background to-secondary/20"
        >
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <Badge className="bg-primary/10 text-primary border-primary/20 mb-3">
                <Heart size={12} className="inline mr-1 fill-primary" />
                Get In Touch
              </Badge>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
                Let's Plan Your Perfect Trip ✈️
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Ready to create unforgettable memories? Reach out and let's
                start planning your dream vacation together!
              </p>
            </motion.div>

            {/* Meet the Owner Card — full width */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <div className="relative overflow-hidden rounded-2xl border-0 shadow-hero bg-gradient-to-r from-primary via-primary/90 to-primary/80 p-1">
                <div className="rounded-xl bg-gradient-to-r from-teal-50 to-cyan-50 p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg ring-4 ring-white">
                      <span className="text-white font-bold text-3xl font-display">
                        G
                      </span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-accent rounded-full flex items-center justify-center shadow">
                      <Sparkles size={14} className="text-foreground" />
                    </div>
                  </div>

                  {/* Text */}
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                      <Badge className="bg-accent/30 text-foreground border-accent/40 text-xs font-semibold">
                        Your Travel Expert
                      </Badge>
                    </div>
                    <h3 className="font-display text-2xl font-bold text-primary mt-1 mb-2">
                      Hi, I'm Gaurav! 👋
                    </h3>
                    <p className="text-foreground/75 leading-relaxed max-w-lg">
                      Serving travelers since 2011 with a passion for travel, I
                      personally curate every itinerary to make your journey
                      extraordinary. From hidden gems to iconic landmarks —
                      let's plan your perfect trip together!
                    </p>
                    <div className="flex flex-wrap gap-3 mt-4 justify-center md:justify-start">
                      <a
                        href="tel:+919990104748"
                        className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm"
                        data-ocid="contact.primary_button"
                      >
                        <Phone size={14} />
                        Call Gaurav
                      </a>
                      <a
                        href="mailto:meenagaurav4748@gmail.com"
                        className="inline-flex items-center gap-2 bg-white border border-primary/20 text-primary px-4 py-2 rounded-full text-sm font-semibold hover:bg-primary/5 transition-colors shadow-sm"
                        data-ocid="contact.secondary_button"
                      >
                        <Mail size={14} />
                        Email Gaurav
                      </a>
                    </div>
                  </div>

                  {/* Quote bubble */}
                  <div className="hidden lg:block flex-shrink-0 max-w-xs">
                    <div className="bg-white rounded-2xl shadow-md p-5 relative">
                      <div className="absolute -left-3 top-6 w-0 h-0 border-t-8 border-b-8 border-r-8 border-transparent border-r-white" />
                      <p className="text-foreground/80 text-sm italic leading-relaxed">
                        &ldquo;Every journey begins with a single step. Let me
                        be your guide to the world's most beautiful
                        destinations. Your dream trip is just one call
                        away!&rdquo;
                      </p>
                      <div className="mt-3 flex items-center gap-2">
                        <StarRating rating={5} size={12} />
                        <span className="text-xs text-muted-foreground font-medium">
                          5000+ happy travelers
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Shyam Lal Meena — Head of Managing Team */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <div className="relative overflow-hidden rounded-2xl border border-primary/15 shadow-card bg-gradient-to-r from-teal-50/60 to-cyan-50/60 p-6 md:p-7 flex flex-col md:flex-row items-center gap-5">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-600 to-cyan-500 flex items-center justify-center shadow-lg ring-4 ring-white">
                    <span className="text-white font-bold text-xl font-display">
                      SLM
                    </span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-100 rounded-full flex items-center justify-center shadow">
                    <CheckCircle size={13} className="text-green-600" />
                  </div>
                </div>

                {/* Text */}
                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                    <Badge className="bg-teal-100 text-teal-800 border-teal-200 text-xs font-semibold">
                      Head of Managing Team
                    </Badge>
                  </div>
                  <h3 className="font-display text-xl font-bold text-teal-700 mt-1 mb-2">
                    Shyam Lal Meena
                  </h3>
                  <p className="text-foreground/70 leading-relaxed max-w-lg text-sm">
                    The backbone of our operations. Shyam Lal ji personally
                    handles every client interaction, ensuring each traveler
                    gets the best service and a smooth, hassle-free journey.
                  </p>
                  <div className="flex flex-wrap gap-3 mt-4 justify-center md:justify-start">
                    <a
                      href="tel:+919868901253"
                      className="inline-flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-teal-700 transition-colors shadow-sm"
                      data-ocid="team.primary_button"
                    >
                      <Phone size={14} />
                      Contact Us
                    </a>
                    <a
                      href="tel:+919868901253"
                      className="inline-flex items-center gap-2 border border-teal-600 text-teal-700 px-4 py-2 rounded-full text-sm font-semibold hover:bg-teal-50 transition-colors"
                    >
                      <Phone size={14} />
                      +91 9868901253
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Contact Form */}
              <div className="lg:col-span-1">
                <Card className="border-0 shadow-card overflow-hidden">
                  <div className="h-1.5 bg-gradient-to-r from-primary via-primary/70 to-accent" />
                  <CardContent className="p-6">
                    <h3 className="font-display font-semibold text-lg mb-1">
                      Send Us a Message
                    </h3>
                    <p className="text-xs text-muted-foreground mb-5">
                      We reply within 24 hours 💬
                    </p>
                    {formSubmitted ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-8 text-primary"
                        data-ocid="contact.success_state"
                      >
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-3">
                          <Heart
                            size={28}
                            className="text-primary fill-primary"
                          />
                        </div>
                        <p className="font-display font-bold text-lg">
                          Message Sent! 🎉
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Gaurav will get back to you soon.
                        </p>
                      </motion.div>
                    ) : (
                      <form
                        onSubmit={handleFormSubmit}
                        className="space-y-4"
                        data-ocid="contact.modal"
                      >
                        <div>
                          <label
                            htmlFor="contact-name"
                            className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block"
                          >
                            Full Name
                          </label>
                          <Input
                            id="contact-name"
                            placeholder="Your full name"
                            value={formData.name}
                            onChange={(e) =>
                              setFormData((p) => ({
                                ...p,
                                name: e.target.value,
                              }))
                            }
                            required
                            data-ocid="contact.input"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="contact-email"
                            className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block"
                          >
                            Email
                          </label>
                          <Input
                            id="contact-email"
                            type="email"
                            placeholder="your@email.com"
                            value={formData.email}
                            onChange={(e) =>
                              setFormData((p) => ({
                                ...p,
                                email: e.target.value,
                              }))
                            }
                            required
                            data-ocid="contact.input"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="contact-phone"
                            className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block"
                          >
                            Phone
                          </label>
                          <Input
                            id="contact-phone"
                            type="tel"
                            placeholder="+91 99901 04748"
                            value={formData.phone}
                            onChange={(e) =>
                              setFormData((p) => ({
                                ...p,
                                phone: e.target.value,
                              }))
                            }
                            data-ocid="contact.input"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="contact-message"
                            className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block"
                          >
                            Message
                          </label>
                          <Textarea
                            id="contact-message"
                            placeholder="Tell us about your dream trip..."
                            rows={4}
                            value={formData.message}
                            onChange={(e) =>
                              setFormData((p) => ({
                                ...p,
                                message: e.target.value,
                              }))
                            }
                            required
                            data-ocid="contact.textarea"
                          />
                        </div>
                        <Button
                          type="submit"
                          className="w-full bg-primary hover:bg-primary/90 text-white font-semibold rounded-full"
                          data-ocid="contact.submit_button"
                        >
                          <Plane size={15} className="mr-2 rotate-45" />
                          Send Message
                        </Button>
                      </form>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Contact Info */}
              <div className="space-y-4">
                {/* Phone Card */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                >
                  <Card className="border-0 shadow-card overflow-hidden hover:shadow-hero transition-shadow">
                    <div className="flex items-start gap-4 p-5">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0">
                        <Phone size={20} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                          📞 Call Us Anytime
                        </p>
                        <a
                          href="tel:+919990104748"
                          className="font-bold text-primary text-base hover:text-primary/80 transition-colors block"
                        >
                          +91 9990104748
                        </a>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Mon – Sat, 9 AM – 7 PM
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>

                {/* Email Card */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <Card className="border-0 shadow-card overflow-hidden hover:shadow-hero transition-shadow">
                    <div className="flex items-start gap-4 p-5">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent/30 to-accent/5 flex items-center justify-center flex-shrink-0">
                        <Mail size={20} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                          ✉️ Email Us
                        </p>
                        <a
                          href="mailto:meenagaurav4748@gmail.com"
                          className="font-bold text-primary text-sm hover:text-primary/80 transition-colors block break-all"
                        >
                          meenagaurav4748@gmail.com
                        </a>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          We reply within 24 hours
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>

                {/* Address Card */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <Card className="border-0 shadow-card overflow-hidden hover:shadow-hero transition-shadow">
                    <div className="flex items-start gap-4 p-5">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-secondary to-secondary/50 flex items-center justify-center flex-shrink-0">
                        <MapPin size={20} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                          📍 Visit Our Office
                        </p>
                        <p className="font-bold text-foreground text-sm leading-snug">
                          C-41, UGF, Khirki Ext,
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Panchsheel Vihar, Malviya Nagar,
                        </p>
                        <p className="text-sm text-muted-foreground">
                          New Delhi – 110017, India
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>

                {/* Office Hours Card */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <Card className="border-0 shadow-card overflow-hidden">
                    <CardContent className="p-5">
                      <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                        <Clock size={15} className="text-primary" />
                        Office Hours
                      </h3>
                      <div className="space-y-1.5 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Mon – Fri
                          </span>
                          <span className="font-medium">9:00 AM – 7:00 PM</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Saturday
                          </span>
                          <span className="font-medium">
                            10:00 AM – 5:00 PM
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Sunday</span>
                          <span className="font-medium text-primary">
                            Emergency Only
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Map */}
              <div>
                <Card className="border-0 shadow-card overflow-hidden h-full min-h-[300px]">
                  <CardContent className="p-0 h-full">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3504.5!2d77.20481!3d28.53572!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce1c3e4e4e4e5%3A0xabcdef1234567890!2sMeena+Tour+and+Travels+Panchsheel+Vihar!5e0!3m2!1sen!2sin!4v1700000000000"
                      width="100%"
                      height="100%"
                      style={{ border: 0, minHeight: "300px" }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Meena Tour and Travels — Panchsheel Vihar, New Delhi"
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="bg-primary text-white">
          <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
              {/* Brand */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <Plane size={16} className="text-white rotate-45" />
                  </div>
                  <div>
                    <div className="font-display font-bold text-white">
                      Meena Tour
                    </div>
                    <div className="font-display text-xs text-white/70">
                      & Travels
                    </div>
                  </div>
                </div>
                <p className="text-white/70 text-sm leading-relaxed mb-3">
                  Your trusted travel partner since 2011. Crafting extraordinary
                  journeys and creating lifelong memories worldwide.
                </p>
                <p className="text-white/80 text-sm font-medium mb-5">
                  Owner: <span className="text-white font-bold">Gaurav</span>
                </p>
                <div className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 rounded-full px-3 py-1.5 text-xs font-semibold text-white mb-4">
                  <Shield size={13} className="fill-white/30" />
                  All India Tourist Permit
                </div>
                <div className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 rounded-full px-3 py-1.5 text-xs font-semibold text-white mb-4 ml-2">
                  <CheckCircle size={13} className="text-green-300" />
                  GSTIN: 07BQXPG8115J1ZB
                </div>
                <div className="flex gap-3">
                  {[
                    { Icon: Facebook, label: "Facebook" },
                    { Icon: Instagram, label: "Instagram" },
                    { Icon: Twitter, label: "Twitter" },
                    { Icon: Youtube, label: "Youtube" },
                  ].map(({ Icon, label }) => (
                    <a
                      key={label}
                      href="https://www.google.com"
                      aria-label={label}
                      className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center transition-colors"
                    >
                      <Icon size={15} />
                    </a>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="font-display font-semibold mb-4 text-white">
                  Quick Links
                </h4>
                <ul className="space-y-2">
                  {[
                    "Home",
                    "About Us",
                    "Tour Packages",
                    "Destinations",
                    "Blog",
                    "Contact",
                  ].map((link) => (
                    <li key={link}>
                      <a
                        href="#home"
                        aria-label={link}
                        className="text-white/70 hover:text-white text-sm transition-colors flex items-center gap-1"
                      >
                        <ChevronRight size={12} />
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact Info */}
              <div>
                <h4 className="font-display font-semibold mb-4 text-white">
                  Contact Info
                </h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Phone
                      size={14}
                      className="text-white/60 mt-0.5 flex-shrink-0"
                    />
                    <a
                      href="tel:+919990104748"
                      className="text-white/80 hover:text-white text-sm transition-colors"
                    >
                      +91 9990104748
                    </a>
                  </li>
                  <li className="flex items-start gap-2">
                    <Mail
                      size={14}
                      className="text-white/60 mt-0.5 flex-shrink-0"
                    />
                    <a
                      href="mailto:meenagaurav4748@gmail.com"
                      className="text-white/80 hover:text-white text-sm transition-colors break-all"
                    >
                      meenagaurav4748@gmail.com
                    </a>
                  </li>
                  <li className="flex items-start gap-2">
                    <MapPin
                      size={14}
                      className="text-white/60 mt-0.5 flex-shrink-0"
                    />
                    <p className="text-white/80 text-sm leading-relaxed">
                      C-41, UGF, Khirki Ext,
                      <br />
                      Panchsheel Vihar, Malviya Nagar,
                      <br />
                      New Delhi – 110017, India
                    </p>
                  </li>
                </ul>
              </div>

              {/* Newsletter */}
              <div>
                <h4 className="font-display font-semibold mb-4 text-white">
                  Newsletter
                </h4>
                <p className="text-white/70 text-sm mb-4">
                  Subscribe for exclusive deals, travel tips, and destination
                  inspiration.
                </p>
                <div className="flex gap-2">
                  <Input
                    placeholder="Your email address"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/50"
                    data-ocid="newsletter.input"
                  />
                  <Button
                    size="icon"
                    className="bg-accent hover:bg-accent/90 text-foreground flex-shrink-0"
                    data-ocid="newsletter.primary_button"
                  >
                    <ChevronRight size={16} />
                  </Button>
                </div>
                <div className="mt-6">
                  <p className="text-white/70 text-xs font-medium mb-2">
                    WE ACCEPT
                  </p>
                  <div className="flex gap-2">
                    {["VISA", "MC", "PayPal", "UPI"].map((pay) => (
                      <div
                        key={pay}
                        className="bg-white/10 rounded px-2 py-1 text-xs text-white/80 font-medium"
                      >
                        {pay}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/15 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
              <p className="text-white/60 text-sm">
                © {currentYear} Meena Tour and Travels. All rights reserved.
              </p>
              <p className="text-white/60 text-sm">
                Built with ❤️ using{" "}
                <a
                  href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-white underline underline-offset-2 transition-colors"
                >
                  caffeine.ai
                </a>
              </p>
            </div>
          </div>
        </footer>
      </div>

      <BookingModal
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        prefillDestination={bookingDestination}
      />
    </>
  );
}
