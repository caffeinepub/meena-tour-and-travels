import { BookingModal } from "@/components/BookingModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { AdminBookings } from "@/pages/AdminBookings";
import {
  Award,
  BatteryCharging,
  Briefcase,
  Calendar,
  Car,
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
  Navigation2,
  Phone,
  Plane,
  Search,
  Shield,
  Sparkles,
  Star,
  Twitter,
  UserCheck,
  Users,
  Wind,
  X,
  Youtube,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

const TRIPS = [
  {
    id: 1,
    name: "Mathura & Vrindavan",
    state: "Uttar Pradesh",
    type: "Pilgrimage",
    emoji: "🛕",
    description:
      "The birthplace of Lord Krishna. Visit Banke Bihari temple, ISKCON, Prem Mandir and the sacred ghats of Vrindavan.",
    highlights: [
      "Banke Bihari Temple",
      "ISKCON Temple",
      "Prem Mandir",
      "Yamuna Ghat",
    ],
    bestTime: "October – March",
    approxKm: "180 km from Delhi",
    image:
      "https://images.unsplash.com/photo-1609694989823-53f7ef0e0b23?w=600&q=80",
  },
  {
    id: 2,
    name: "Kashi / Varanasi",
    state: "Uttar Pradesh",
    type: "Pilgrimage",
    emoji: "🪔",
    description:
      "One of India's oldest and holiest cities. Witness the Ganga Aarti, ancient ghats, and the sacred Kashi Vishwanath temple.",
    highlights: [
      "Ganga Aarti",
      "Kashi Vishwanath Temple",
      "Dashashwamedh Ghat",
      "Sarnath",
    ],
    bestTime: "October – March",
    approxKm: "800 km from Delhi",
    image:
      "https://images.unsplash.com/photo-1561361058-c24e31f34f4a?w=600&q=80",
  },
  {
    id: 3,
    name: "Haridwar & Rishikesh",
    state: "Uttarakhand",
    type: "Pilgrimage & Adventure",
    emoji: "🏔️",
    description:
      "Gateway to the Himalayas. Har Ki Pauri aarti, Laxman Jhula, yoga retreats and the holy Ganges.",
    highlights: [
      "Har Ki Pauri",
      "Laxman Jhula",
      "Triveni Ghat Aarti",
      "Neelkanth Mahadev",
    ],
    bestTime: "September – June",
    approxKm: "220 km from Delhi",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80",
  },
  {
    id: 4,
    name: "Ayodhya",
    state: "Uttar Pradesh",
    type: "Pilgrimage",
    emoji: "🕌",
    description:
      "The sacred birthplace of Lord Ram. Visit the grand Ram Mandir, Hanuman Garhi, and ancient temples along the Saryu river.",
    highlights: ["Ram Mandir", "Hanuman Garhi", "Kanak Bhawan", "Saryu Ghat"],
    bestTime: "October – March",
    approxKm: "630 km from Delhi",
    image:
      "https://images.unsplash.com/photo-1627894005813-d5f7dc6b7fbb?w=600&q=80",
  },
  {
    id: 5,
    name: "Salasar Balaji",
    state: "Rajasthan",
    type: "Pilgrimage",
    emoji: "🙏",
    description:
      "Famous Hanuman temple in Rajasthan attracting millions of devotees. A deeply spiritual journey through the heart of Rajasthan.",
    highlights: [
      "Salasar Balaji Temple",
      "Shaktipeeth Darshan",
      "Rajasthani Culture",
    ],
    bestTime: "Year Round",
    approxKm: "470 km from Delhi",
    image:
      "https://images.unsplash.com/photo-1566831695454-c3b386df1de6?w=600&q=80",
  },
  {
    id: 6,
    name: "Khatu Shyam",
    state: "Rajasthan",
    type: "Pilgrimage",
    emoji: "🔱",
    description:
      "Home to the famous Khatu Shyamji temple, one of the most visited temples in Rajasthan. Special fairs during Phalgun Mela.",
    highlights: [
      "Khatu Shyam Temple",
      "Shyam Kund",
      "Gopinath Temple",
      "Phalgun Mela",
    ],
    bestTime: "October – March",
    approxKm: "310 km from Delhi",
    image:
      "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=600&q=80",
  },
  {
    id: 7,
    name: "Jaipur – Rajasthan",
    state: "Rajasthan",
    type: "Heritage & Culture",
    emoji: "🏯",
    description:
      "The Pink City of India. Amber Fort, Hawa Mahal, City Palace and vibrant bazaars make it a must-visit heritage destination.",
    highlights: ["Amber Fort", "Hawa Mahal", "City Palace", "Jantar Mantar"],
    bestTime: "October – March",
    approxKm: "270 km from Delhi",
    image:
      "https://images.unsplash.com/photo-1477587458883-47145ed31f1b?w=600&q=80",
  },
  {
    id: 8,
    name: "Manali",
    state: "Himachal Pradesh",
    type: "Hill Station",
    emoji: "❄️",
    description:
      "A Himalayan retreat with snow-capped mountains, adventure sports, Rohtang Pass, and the serene Solang Valley.",
    highlights: [
      "Rohtang Pass",
      "Solang Valley",
      "Hadimba Temple",
      "Old Manali",
    ],
    bestTime: "October – June",
    approxKm: "550 km from Delhi",
    image:
      "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600&q=80",
  },
  {
    id: 9,
    name: "Dehradun & Mussoorie",
    state: "Uttarakhand",
    type: "Hill Station",
    emoji: "🌿",
    description:
      "Queen of the Hills. Kempty Falls, Gun Hill, Lal Tibba viewpoint and the pleasant hill air of Mussoorie.",
    highlights: ["Kempty Falls", "Gun Hill", "Lal Tibba", "Mall Road"],
    bestTime: "March – June, Sep – Nov",
    approxKm: "290 km from Delhi",
    image:
      "https://images.unsplash.com/photo-1593181629936-11c609b8db9b?w=600&q=80",
  },
  {
    id: 10,
    name: "Agra – Taj Mahal",
    state: "Uttar Pradesh",
    type: "Heritage",
    emoji: "🕌",
    description:
      "One of the Seven Wonders of the World. The Taj Mahal, Agra Fort, and Fatehpur Sikri are unmissable landmarks.",
    highlights: ["Taj Mahal", "Agra Fort", "Fatehpur Sikri", "Mehtab Bagh"],
    bestTime: "October – March",
    approxKm: "230 km from Delhi",
    image:
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&q=80",
  },
  {
    id: 11,
    name: "Nainital",
    state: "Uttarakhand",
    type: "Hill Station",
    emoji: "🏞️",
    description:
      "The Lake District of India. Naini Lake, Snow View Point, and pleasant weather make it a perfect getaway.",
    highlights: [
      "Naini Lake",
      "Snow View Point",
      "Naina Devi Temple",
      "Mall Road",
    ],
    bestTime: "March – June, Sep – Nov",
    approxKm: "310 km from Delhi",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80",
  },
  {
    id: 12,
    name: "Shimla",
    state: "Himachal Pradesh",
    type: "Hill Station",
    emoji: "🏔️",
    description:
      "The former summer capital of British India. Ridge, Christ Church, Jakhu Temple and scenic toy train ride.",
    highlights: [
      "The Ridge",
      "Jakhu Temple",
      "Christ Church",
      "Toy Train Ride",
    ],
    bestTime: "March – June, Dec – Jan (snow)",
    approxKm: "340 km from Delhi",
    image:
      "https://images.unsplash.com/photo-1548013146-72479768bada?w=600&q=80",
  },
];

const TESTIMONIALS = [
  {
    id: 1,
    name: "Rajesh Agarwal",
    role: "Managing Director, Kolkata",
    rating: 5,
    review:
      "We have been using Meena Tour and Travels for our executive travel requirements for the past 9 years. Whether it is airport transfers or outstation trips, Gaurav's team has never let us down. Highly recommended for any corporate requirement.",
    initials: "RA",
  },
  {
    id: 2,
    name: "Sunita Verma",
    role: "Senior Manager, Bangalore",
    rating: 5,
    review:
      "I was referred by a colleague and I am glad I made that call. Their drivers are experienced, the cars are always clean and well-maintained, and the per-km pricing is completely transparent. No hidden charges, ever.",
    initials: "SV",
  },
  {
    id: 3,
    name: "Amit Bhardwaj",
    role: "Business Owner, Delhi",
    rating: 5,
    review:
      "Trusted them for a Haridwar pilgrimage trip with my family of 6. The car had everything — water bottles, charger, first aid. Driver was respectful and knowledgeable about the route. Will book again for Ayodhya next.",
    initials: "AB",
  },
  {
    id: 4,
    name: "Priya Mehta",
    role: "Director, Mumbai",
    rating: 5,
    review:
      "Our company switched to Meena Tour and Travels for all employee travel after one of our MDs recommended them. They handle last-minute bookings professionally and the monthly billing is always accurate.",
    initials: "PM",
  },
  {
    id: 5,
    name: "Suresh Gupta",
    role: "Entrepreneur, UP",
    rating: 5,
    review:
      "I have referred Meena Tour and Travels to at least 20 of my friends and business associates. In 8 years, there has not been a single bad experience. That says everything about their commitment.",
    initials: "SG",
  },
  {
    id: 6,
    name: "Kavita Sharma",
    role: "HR Head, Noida",
    rating: 5,
    review:
      "We manage travel for over 50 employees monthly through Meena Tour and Travels. The coordination is smooth, drivers are always on time, and Gaurav is always reachable. A truly reliable partner.",
    initials: "KS",
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
  const [selectedTrip, setSelectedTrip] = useState<(typeof TRIPS)[0] | null>(
    null,
  );
  const currentYear = new Date().getFullYear();

  function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormSubmitted(true);
    setFormData({ name: "", email: "", phone: "", message: "" });
    setTimeout(() => setFormSubmitted(false), 4000);
  }

  if (window.location.pathname === "/admin") {
    return <AdminBookings />;
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
              <img
                src="/assets/generated/meena-logo.dim_400x120.png"
                alt="Meena Tour and Travels"
                style={{
                  height: "56px",
                  width: "auto",
                  objectFit: "contain",
                  objectPosition: "left center",
                }}
                className="md:h-14 h-11"
              />
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
                "url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1600&q=85')",
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
                ✈ Trusted Travellers Since 2011 · 15,000+ Happy Passengers
              </Badge>
              <h1 className="font-display text-4xl md:text-6xl font-bold text-white uppercase tracking-wide leading-tight mb-4">
                Your Trusted Cab Partner
                <span className="block text-accent">Across India</span>
              </h1>
              <p className="text-white/85 text-lg md:text-xl mb-8 font-light max-w-lg">
                Premium cab services for individuals, families &amp; corporates.
                Serving since 2011 with 15,000+ happy passengers across India.
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
                  onClick={() =>
                    document
                      .querySelector("#about")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  Learn More
                </Button>
              </div>

              {/* Stats */}
              <div className="flex gap-8 mt-12">
                {[
                  { val: "15,000+", label: "Happy Passengers" },
                  { val: "1000+", label: "Destinations" },
                  { val: "Since 2011", label: "Trusted Travellers" },
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
                <span>15,000+ Happy Passengers</span>
              </div>
              <div className="hidden md:block w-px h-5 bg-primary/20" />
              <div className="flex items-center gap-2 text-foreground/70 text-sm">
                <CheckCircle size={16} className="text-green-600" />
                <span>GSTIN: 07BQXPG8115J1ZB</span>
              </div>
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section id="tours" className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <Badge className="bg-primary/10 text-primary border-primary/20 mb-3">
                Pricing
              </Badge>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
                Simple, Transparent Pricing
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                No fixed packages. You pay only for the kilometers you travel.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-10">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                data-ocid="pricing.item.1"
              >
                <Card className="border-2 border-primary/20 shadow-card hover:shadow-hero transition-all h-full">
                  <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-1">
                      <Car className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="font-display font-bold text-xl text-foreground">
                      Standard Sedan
                    </h3>
                    <div className="text-3xl font-display font-bold text-primary">
                      ₹18–22
                      <span className="text-base font-normal text-muted-foreground">
                        {" "}
                        / km
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Swift Dzire, Honda Amaze & similar comfortable sedans for
                      everyday travel.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                data-ocid="pricing.item.2"
              >
                <Card className="border-2 border-primary shadow-hero h-full relative overflow-hidden">
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-primary text-white border-0 text-xs font-semibold">
                      Popular
                    </Badge>
                  </div>
                  <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-1">
                      <Sparkles className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="font-display font-bold text-xl text-foreground">
                      Premium SUV
                    </h3>
                    <div className="text-3xl font-display font-bold text-primary">
                      ₹25–32
                      <span className="text-base font-normal text-muted-foreground">
                        {" "}
                        / km
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Innova Crysta, Ertiga & premium SUVs with extra space and
                      5-star comfort.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <div className="max-w-2xl mx-auto bg-amber-50 border border-primary/20 rounded-xl p-4 text-center text-sm text-muted-foreground mb-8">
              <span className="font-semibold text-foreground">
                Final fare = Kilometers × Rate.
              </span>{" "}
              State taxes &amp; toll charges applied as per actuals.
            </div>

            <div className="text-center">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white font-semibold px-10 shadow-hero"
                data-ocid="pricing.primary_button"
                onClick={() => {
                  setBookingDestination("");
                  setBookingOpen(true);
                }}
              >
                Get a Custom Quote
              </Button>
            </div>
          </div>
        </section>

        {/* PREMIUM FLEET */}
        <section className="py-16 bg-amber-950/5 border-y border-primary/10">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <Badge className="bg-primary/10 text-primary border-primary/20 mb-3">
                Our Fleet
              </Badge>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
                Premium Vehicles &amp; Expert Drivers
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Every journey with Meena Tour and Travels is in a
                top-of-the-line vehicle, driven by a seasoned professional.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {[
                {
                  icon: <Award className="w-8 h-8 text-primary" />,
                  title: "Premium Vehicles Only",
                  desc: "All our taxis are latest-model premium cars — fully serviced, sanitized, and travel-ready for every trip.",
                },
                {
                  icon: <Users className="w-8 h-8 text-primary" />,
                  title: "10–15+ Years Experience",
                  desc: "Our drivers are handpicked veterans with over a decade behind the wheel, trained in safe driving and hospitality.",
                },
                {
                  icon: <Shield className="w-8 h-8 text-primary" />,
                  title: "All India Tourist Permit",
                  desc: "Fully licensed and permitted to operate across all Indian states — no hassle, no boundaries.",
                },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  data-ocid={`fleet.item.${i + 1}`}
                >
                  <Card className="border-0 shadow-card hover:shadow-hero transition-all text-center p-6 h-full">
                    <CardContent className="p-0 flex flex-col items-center gap-3">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                        {item.icon}
                      </div>
                      <h3 className="font-display font-bold text-lg text-foreground">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {item.desc}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* TRAVEL COMFORTS */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <Badge className="bg-accent/15 text-foreground border-accent/30 mb-3">
                In-Car Facilities
              </Badge>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
                Travel in Comfort &amp; Style
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Our vehicles come equipped with thoughtful amenities so you can
                sit back, relax, and enjoy the journey.
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              {[
                {
                  icon: <BatteryCharging className="w-8 h-8 text-primary" />,
                  title: "Laptop Charger",
                  desc: "High-watt capacity charger to keep all your devices powered throughout the journey.",
                },
                {
                  icon: <Zap className="w-8 h-8 text-primary" />,
                  title: "Medicines & First Aid",
                  desc: "Emergency medicines and a fully-stocked first aid kit always within reach.",
                },
                {
                  icon: <Wind className="w-8 h-8 text-primary" />,
                  title: "Air Purifier",
                  desc: "In-car air purifier ensures fresh, clean air throughout your trip — even on dusty roads.",
                },
                {
                  icon: <Sparkles className="w-8 h-8 text-primary" />,
                  title: "Water Bottles",
                  desc: "Complimentary chilled water bottles provided for every passenger on board.",
                },
                {
                  icon: <Car className="w-8 h-8 text-primary" />,
                  title: "Premium Taxis",
                  desc: "All our vehicles are top-of-the-line premium cars ensuring a luxurious, comfortable ride.",
                },
                {
                  icon: <UserCheck className="w-8 h-8 text-primary" />,
                  title: "Expert Drivers",
                  desc: "Our drivers bring 10–15+ years of road experience, ensuring safe and smooth journeys.",
                },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  data-ocid={`comforts.item.${i + 1}`}
                >
                  <Card className="border border-primary/10 shadow-card hover:shadow-hero hover:-translate-y-1 transition-all text-center p-6 h-full bg-gradient-to-b from-primary/5 to-transparent">
                    <CardContent className="p-0 flex flex-col items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-1">
                        {item.icon}
                      </div>
                      <h3 className="font-display font-semibold text-base text-foreground">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground text-xs leading-relaxed">
                        {item.desc}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CORPORATE SERVICES */}
        <section
          id="corporate"
          className="py-16"
          style={{ backgroundColor: "oklch(0.97 0.015 75)" }}
        >
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <Badge className="bg-primary/10 text-primary border-primary/20 mb-3">
                Corporate Services
              </Badge>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
                Trusted by India&apos;s Business Elite
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                From Fortune 500 executives to entrepreneurs — we&apos;ve been
                the preferred cab partner for India&apos;s top professionals for
                over a decade.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {[
                {
                  icon: <Briefcase className="w-8 h-8 text-primary" />,
                  title: "Corporate Monthly Packages",
                  desc: "Dedicated cab services for companies on a monthly retainer. Perfect for employee commutes, client pickups, and executive travel.",
                },
                {
                  icon: <MapPin className="w-8 h-8 text-primary" />,
                  title: "Pan-India Executive Travel",
                  desc: "We serve MDs, CEOs and business leaders travelling between Delhi, Mumbai, Kolkata, Bangalore, Haridwar and across India.",
                },
                {
                  icon: <Shield className="w-8 h-8 text-primary" />,
                  title: "Discreet & Professional",
                  desc: "Experienced drivers with 10–15+ years on the road. Punctual, professional, and trusted even by celebrities.",
                },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  data-ocid={`corporate.item.${i + 1}`}
                >
                  <Card className="border-0 shadow-card hover:shadow-hero transition-all text-center p-6 h-full bg-white">
                    <CardContent className="p-0 flex flex-col items-center gap-3">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                        {item.icon}
                      </div>
                      <h3 className="font-display font-bold text-lg text-foreground">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {item.desc}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-primary/8 border border-primary/20 rounded-xl p-5 mb-8 text-center"
            >
              <p className="text-foreground/80 text-sm md:text-base italic">
                &ldquo;Our corporate clients include managing directors and
                senior executives from leading companies across India. We also
                handle VIP and celebrity travel with complete discretion.&rdquo;
              </p>
            </motion.div>

            <div className="text-center">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white font-semibold px-10 shadow-hero"
                data-ocid="corporate.primary_button"
                onClick={() => {
                  setBookingDestination("");
                  setBookingOpen(true);
                }}
              >
                Enquire for Corporate Rates
              </Button>
            </div>
          </div>
        </section>

        {/* POPULAR TRIPS */}
        <section id="destinations" className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <Badge className="bg-primary/10 text-primary border-primary/20 mb-3">
                Popular Trips
              </Badge>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
                Where Would You Like to Go?
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                From sacred pilgrimage sites to Himalayan hill stations — tap
                any destination to explore and book your ride.
              </p>
            </motion.div>

            <div
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
              data-ocid="destinations.list"
            >
              {TRIPS.map((trip, i) => (
                <motion.div
                  key={trip.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (i % 4) * 0.08, duration: 0.5 }}
                  data-ocid={`destinations.item.${i + 1}`}
                  className="group cursor-pointer"
                  onClick={() => setSelectedTrip(trip)}
                >
                  <div className="relative rounded-xl overflow-hidden shadow-card hover:shadow-hero transition-all hover:-translate-y-1 hover:scale-[1.02]">
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={trip.image}
                        alt={trip.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-primary/90 text-white border-0 text-xs font-semibold backdrop-blur-sm">
                        {trip.type}
                      </Badge>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="text-white/70 text-xs mb-0.5">
                        {trip.emoji} {trip.state}
                      </p>
                      <h3 className="text-white font-display font-bold text-sm leading-tight mb-1">
                        {trip.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <p className="text-white/60 text-xs flex items-center gap-1">
                          <Navigation2 size={10} />
                          {trip.approxKm}
                        </p>
                        <span className="text-primary text-xs font-semibold bg-white/10 backdrop-blur-sm rounded-full px-2 py-0.5">
                          Explore →
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* TRIP DETAIL SHEET */}
        <Sheet
          open={!!selectedTrip}
          onOpenChange={(open) => !open && setSelectedTrip(null)}
        >
          <SheetContent
            side="right"
            className="w-full sm:max-w-lg p-0 overflow-y-auto"
            data-ocid="destinations.sheet"
          >
            {selectedTrip && (
              <>
                <div className="relative h-60 overflow-hidden">
                  <img
                    src={selectedTrip.image}
                    alt={selectedTrip.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <Badge className="bg-primary text-white border-0 text-xs">
                        {selectedTrip.type}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="bg-white/20 text-white border-white/30 text-xs backdrop-blur-sm"
                      >
                        {selectedTrip.state}
                      </Badge>
                    </div>
                    <h2 className="text-white font-display font-bold text-2xl leading-tight">
                      {selectedTrip.emoji} {selectedTrip.name}
                    </h2>
                  </div>
                </div>
                <SheetHeader className="px-5 pt-5 pb-2">
                  <SheetTitle className="sr-only">
                    {selectedTrip.name}
                  </SheetTitle>
                </SheetHeader>
                <div className="px-5 pb-24 space-y-5">
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {selectedTrip.description}
                  </p>

                  <div>
                    <h3 className="font-display font-semibold text-foreground mb-2 flex items-center gap-2">
                      <Sparkles size={15} className="text-primary" /> Key
                      Highlights
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedTrip.highlights.map((h) => (
                        <span
                          key={h}
                          className="bg-primary/10 text-primary text-xs font-medium px-3 py-1 rounded-full border border-primary/20"
                        >
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-secondary/50 rounded-xl p-3">
                      <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                        <Calendar size={13} className="text-primary" />
                        Best Time to Visit
                      </div>
                      <p className="text-foreground font-medium text-sm">
                        {selectedTrip.bestTime}
                      </p>
                    </div>
                    <div className="bg-secondary/50 rounded-xl p-3">
                      <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                        <MapPin size={13} className="text-primary" />
                        Distance
                      </div>
                      <p className="text-foreground font-medium text-sm">
                        {selectedTrip.approxKm}
                      </p>
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-primary/20 rounded-xl p-3 text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground">
                      Per-km pricing:
                    </span>{" "}
                    ₹18–22/km (Sedan) · ₹25–32/km (SUV). State taxes &amp; tolls
                    extra.
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-border p-4">
                  <Button
                    className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-5 text-base shadow-hero"
                    data-ocid="destinations.primary_button"
                    onClick={() => {
                      setSelectedTrip(null);
                      setBookingDestination(selectedTrip.name);
                      setBookingOpen(true);
                    }}
                  >
                    Book a Cab to {selectedTrip.name} →
                  </Button>
                </div>
              </>
            )}
          </SheetContent>
        </Sheet>

        {/* TESTIMONIALS */}
        <section
          id="about"
          className="py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5"
        >
          {/* Trust Banner */}
          <div className="bg-primary text-white py-3 mb-12">
            <div className="container mx-auto px-4 flex flex-wrap justify-center gap-8 text-sm font-semibold text-center">
              <span>✅ GSTIN Registered</span>
              <span>🚗 All India Tourist Permit</span>
              <span>⭐ Trusted Since 2011</span>
              <span>👥 15,000+ Happy Passengers</span>
            </div>
          </div>
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-14"
            >
              <Badge className="bg-primary/10 text-primary border-primary/20 mb-3">
                Why Choose Us
              </Badge>
              <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
                Why 15,000+ Passengers{" "}
                <span className="text-primary">Trust Us</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                From corporate executives to family pilgrims — Meena Tour and
                Travels has been the preferred choice for premium road travel
                across India since 2011.
              </p>
            </motion.div>

            {/* Trust Points */}
            <div
              className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14"
              data-ocid="about.list"
            >
              {[
                {
                  icon: "🏛️",
                  title: "Government Registered & Verified",
                  desc: "GSTIN: 07BQXPG8115J1ZB — officially registered travel agency with All India Tourist Permit. Your safety and trust is our priority.",
                  color: "bg-blue-50 border-blue-200",
                },
                {
                  icon: "📅",
                  title: "Serving Since 2011 — 14+ Years of Trust",
                  desc: "Over a decade of experience delivering premium travel experiences across India. We've grown through word-of-mouth — our passengers recommend us to everyone.",
                  color: "bg-amber-50 border-amber-200",
                },
                {
                  icon: "🏢",
                  title: "Trusted by Corporates & Elites",
                  desc: "Serving Managing Directors, entrepreneurs, and corporate teams from companies like EY, MNCs in Bangalore, Mumbai & Kolkata. We offer monthly corporate packages too.",
                  color: "bg-green-50 border-green-200",
                },
                {
                  icon: "🚗",
                  title: "Premium Fleet, Expert Drivers",
                  desc: "All vehicles are premium SUVs & sedans. Our drivers carry 10–15+ years of experience on Indian roads. Facilities include laptop charger, air purifier & first aid.",
                  color: "bg-purple-50 border-purple-200",
                },
              ].map((point, i) => (
                <motion.div
                  key={point.title}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -24 : 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  data-ocid={`about.item.${i + 1}`}
                >
                  <Card className={`border ${point.color} shadow-card h-full`}>
                    <CardContent className="p-6 flex gap-4">
                      <div className="text-4xl flex-shrink-0">{point.icon}</div>
                      <div>
                        <h3 className="font-display font-bold text-lg text-foreground mb-2">
                          {point.title}
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {point.desc}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-10 text-center text-white shadow-hero"
              data-ocid="about.panel"
            >
              <h3 className="font-display text-2xl md:text-3xl font-bold mb-3">
                Ready to Plan Your Perfect Trip?
              </h3>
              <p className="text-white/80 max-w-lg mx-auto mb-6 text-base">
                Get a free quote tailored to your destination, group size, and
                preferences. No obligations — just a conversation.
              </p>
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90 font-bold px-10 py-6 text-base shadow-lg rounded-xl"
                data-ocid="about.primary_button"
                onClick={() => setBookingOpen(true)}
              >
                Request a Free Quote 🚀
              </Button>
            </motion.div>

            {/* Testimonials */}
            <div className="mt-16">
              <h3 className="font-display text-2xl font-bold text-center text-foreground mb-8">
                What Our Travelers Say
              </h3>
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
                            {t.initials}
                          </div>
                          <div>
                            <div className="font-semibold text-sm">
                              {t.name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {t.role}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
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
                          15,000+ happy passengers
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
                      src="https://maps.google.com/maps?q=Meena+Tour+and+Travels,+C-41+UGF+Khirki+Ext,+Panchsheel+Vihar,+Malviya+Nagar,+New+Delhi+110017&output=embed"
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
