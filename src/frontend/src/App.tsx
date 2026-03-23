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
import { useActor } from "@/hooks/useActor";
import { AdminBookings } from "@/pages/AdminBookings";
import { type RouteInfo, getRouteInfo } from "@/services/mapmyindia";
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
  Landmark,
  Loader2,
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
import { useEffect, useState } from "react";

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
    image: "/assets/generated/trip-mathura-vrindavan.dim_800x500.jpg",
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
    image: "/assets/generated/trip-varanasi-kashi.dim_800x500.jpg",
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
    image: "/assets/generated/trip-haridwar-rishikesh.dim_800x500.jpg",
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
    image: "/assets/generated/trip-ayodhya.dim_800x500.jpg",
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
    image: "/assets/generated/trip-salasar-balaji.dim_800x500.jpg",
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
    image: "/assets/generated/trip-khatu-shyam.dim_800x500.jpg",
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
    image: "/assets/generated/trip-jaipur.dim_800x500.jpg",
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
    image: "/assets/generated/trip-manali.dim_800x500.jpg",
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
    image: "/assets/generated/trip-dehradun-mussoorie.dim_800x500.jpg",
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
    image: "/assets/generated/trip-agra-tajmahal.dim_800x500.jpg",
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
    image: "/assets/generated/trip-nainital.dim_800x500.jpg",
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
    image: "/assets/generated/trip-shimla.dim_800x500.jpg",
  },
  {
    id: 13,
    name: "Ranthambore",
    state: "Rajasthan",
    type: "Wildlife & Nature",
    emoji: "🐯",
    description:
      "Home to the majestic Royal Bengal Tiger. Ranthambore National Park offers thrilling jungle safaris, the ancient Ranthambore Fort, and rich wildlife surrounded by scenic Aravalli hills.",
    highlights: [
      "Tiger Safari",
      "Ranthambore Fort",
      "Padam Lake",
      "Jogi Mahal",
    ],
    bestTime: "October – June",
    approxKm: "380 km from Delhi",
    image: "/assets/generated/trip-ranthambore.dim_800x500.jpg",
  },
  {
    id: 14,
    name: "Jaisalmer",
    state: "Rajasthan",
    type: "Heritage & Desert",
    emoji: "🏰",
    description:
      "The Golden City of Rajasthan. A UNESCO-listed living fort, endless Thar Desert dunes, camel safaris, and vibrant folk culture make Jaisalmer an unforgettable experience.",
    highlights: [
      "Jaisalmer Fort",
      "Sam Sand Dunes",
      "Camel Safari",
      "Patwon Ki Haveli",
    ],
    bestTime: "October – March",
    approxKm: "770 km from Delhi",
    image: "/assets/generated/trip-jaisalmer.dim_800x500.jpg",
  },
  {
    id: 15,
    name: "Kashmir",
    state: "Jammu & Kashmir",
    type: "Nature & Adventure",
    emoji: "🏔️",
    description:
      "Jannat on Earth. Dal Lake houseboats, Gulmarg snow slopes, Pahalgam meadows, and Mughal gardens make Kashmir the crown jewel of Indian tourism.",
    highlights: [
      "Dal Lake & Shikara Ride",
      "Gulmarg Gondola",
      "Pahalgam Valley",
      "Mughal Gardens",
    ],
    bestTime: "April – October",
    approxKm: "800 km from Delhi",
    image: "/assets/generated/trip-kashmir.dim_800x500.jpg",
  },
  {
    id: 16,
    name: "Vaishno Devi",
    state: "Jammu & Kashmir",
    type: "Pilgrimage",
    emoji: "🙏",
    description:
      "One of the holiest Hindu shrines in India, nestled in the Trikuta Mountains. Millions of devotees make the sacred trek each year to seek the blessings of Mata Vaishno Devi.",
    highlights: [
      "Mata Vaishno Devi Shrine",
      "Trikuta Mountain Trek",
      "Bhairon Temple",
      "Katra Base Camp",
    ],
    bestTime: "March – October",
    approxKm: "700 km from Delhi",
    image: "/assets/generated/trip-vaishno-devi.dim_800x500.jpg",
  },
  {
    id: 17,
    name: "Amritsar",
    state: "Punjab",
    type: "Spiritual & Heritage",
    emoji: "✨",
    description:
      "Home to the magnificent Golden Temple, Amritsar is the spiritual heart of Sikhism. Experience the Wagah Border ceremony, langar at the Gurudwara, and vibrant Punjabi culture.",
    highlights: [
      "Golden Temple (Harmandir Sahib)",
      "Wagah Border Ceremony",
      "Jallianwala Bagh",
      "Amritsari Food Trail",
    ],
    bestTime: "October – March",
    approxKm: "450 km from Delhi",
    image: "/assets/generated/trip-amritsar.dim_800x500.jpg",
  },
  {
    id: 18,
    name: "Udaipur",
    state: "Rajasthan",
    type: "Heritage & Royalty",
    emoji: "🏯",
    description:
      "The City of Lakes. Udaipur enchants visitors with its majestic City Palace, shimmering Lake Pichola, royal havelis, and breathtaking Aravalli sunsets.",
    highlights: [
      "City Palace",
      "Lake Pichola & Boat Ride",
      "Jag Mandir",
      "Sajjangarh Monsoon Palace",
    ],
    bestTime: "September – March",
    approxKm: "665 km from Delhi",
    image: "/assets/generated/trip-udaipur.dim_800x500.jpg",
  },
  {
    id: 19,
    name: "Jodhpur",
    state: "Rajasthan",
    type: "Heritage & Culture",
    emoji: "🔵",
    description:
      "The Blue City of Rajasthan. The towering Mehrangarh Fort, vibrant blue-washed old city, and authentic Rajasthani bazaars make Jodhpur a photographer's paradise.",
    highlights: [
      "Mehrangarh Fort",
      "Jaswant Thada",
      "Blue City Old Town",
      "Umaid Bhawan Palace",
    ],
    bestTime: "October – March",
    approxKm: "600 km from Delhi",
    image: "/assets/generated/trip-jodhpur.dim_800x500.jpg",
  },
  {
    id: 20,
    name: "Pushkar",
    state: "Rajasthan",
    type: "Spiritual & Cultural",
    emoji: "🌸",
    description:
      "One of India's holiest towns, famous for the only Brahma Temple in the world. Pushkar Lake, the annual Camel Fair, and its spiritual aura make it a truly unique destination.",
    highlights: [
      "Brahma Temple",
      "Pushkar Lake & Ghats",
      "Pushkar Camel Fair",
      "Rose Garden",
    ],
    bestTime: "October – March",
    approxKm: "400 km from Delhi",
    image: "/assets/generated/trip-pushkar.dim_800x500.jpg",
  },
];

const TESTIMONIALS: {
  id: number;
  name: string;
  role: string;
  rating: number;
  review: string;
  initials: string;
  photo?: string;
}[] = [
  {
    id: 0,
    name: "Mangal Singh Lodha",
    role: "Businessman & Politician, Ministry of Skill Development and Entrepreneurship, Maharashtra",
    rating: 5,
    review:
      "As someone who travels extensively across India for business and ministerial responsibilities, reliability and comfort are non-negotiable. Meena Tour and Travels has been my trusted travel partner for over seven years now. Whether it is a last-minute corporate trip or a planned journey across states, Gaurav and his team have never let me down. Their fleet is impeccable, drivers are professional and experienced, and the service is always on time. For anyone who values punctuality, privacy, and premium travel — Meena Tour and Travels is the only name I recommend.",
    initials: "ML",
    photo: "/assets/generated/mangal-singh-lodha-portrait.dim_200x200.jpg",
  },
  {
    id: 5,
    name: "Reliance Industries",
    role: "Corporate Client, Mumbai",
    rating: 5,
    review:
      "Meena Tour and Travels has been our trusted travel partner for over 8 years. Their professionalism, punctuality, and premium fleet have made them our go-to choice for all executive travel needs across India. Gaurav and his team consistently deliver excellence.",
    initials: "RI",
    photo:
      "/assets/generated/reliance-industries-logo-transparent.dim_200x200.png",
  },
  {
    id: 7,
    name: "Manoj Daggar",
    role: "Owner, Thar Arts — Peetal Murti Factory, Harigarh (Aligarh), Uttar Pradesh",
    rating: 5,
    review:
      "I have been using Meena Tour and Travels for the past 5 years for all my business travel. I run Thar Arts, a brass idol manufacturing factory in Harigarh, Aligarh, UP. Whenever I need to travel to Delhi or other cities for work, Gaurav's team is always ready and on time. The cars are clean, drivers are polite and experienced, and there are no hidden charges. Very honest and reliable service. Highly recommend to anyone looking for trustworthy travel.",
    initials: "MD",
    photo: "/assets/generated/manoj-daggar-portrait.dim_200x200.jpg",
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
  const { actor } = useActor();
  const HERO_SLIDES = [
    {
      image: "/assets/generated/hero-tajmahal.dim_1920x1080.jpg",
      location: "Taj Mahal, Agra",
    },
    {
      image: "/assets/generated/hero-haridwar.dim_1920x1080.jpg",
      location: "Haridwar, Uttarakhand",
    },
    {
      image: "/assets/generated/hero-manali.dim_1920x1080.jpg",
      location: "Manali, Himachal Pradesh",
    },
    {
      image: "/assets/generated/hero-jaipur.dim_1920x1080.jpg",
      location: "Amber Fort, Jaipur",
    },
    {
      image: "/assets/generated/india-gate-delhi.dim_1200x700.jpg",
      location: "India Gate, New Delhi",
    },
    {
      image: "/assets/generated/red-fort-delhi.dim_1200x700.jpg",
      location: "Red Fort, Old Delhi",
    },
    {
      image: "/assets/generated/lotus-temple-delhi.dim_1200x700.jpg",
      location: "Lotus Temple, New Delhi",
    },
    {
      image: "/assets/generated/mehrangarh-fort-jodhpur.dim_1200x700.jpg",
      location: "Mehrangarh Fort, Jodhpur",
    },
    {
      image: "/assets/generated/hawa-mahal-jaipur.dim_1200x700.jpg",
      location: "Hawa Mahal, Jaipur",
    },
    {
      image: "/assets/generated/jaisalmer-fort-rajasthan.dim_1200x700.jpg",
      location: "Jaisalmer Fort, Rajasthan",
    },
    {
      image: "/assets/generated/raigad-fort-maharashtra.dim_1200x700.jpg",
      location: "Raigad Fort, Maharashtra",
    },
    {
      image: "/assets/generated/ajanta-caves-maharashtra.dim_1200x700.jpg",
      location: "Ajanta Caves, Maharashtra",
    },
    {
      image: "/assets/generated/hero-varanasi-ghats.dim_1920x1080.jpg",
      location: "Varanasi Ghats, Uttar Pradesh",
    },
    {
      image: "/assets/generated/hero-rishikesh.dim_1920x1080.jpg",
      location: "Rishikesh, Uttarakhand",
    },
    {
      image: "/assets/generated/hero-golden-temple-amritsar.dim_1920x1080.jpg",
      location: "Golden Temple, Amritsar",
    },
    {
      image: "/assets/generated/hero-shimla.dim_1920x1080.jpg",
      location: "Shimla, Himachal Pradesh",
    },
    {
      image: "/assets/generated/hero-pushkar.dim_1920x1080.jpg",
      location: "Pushkar, Rajasthan",
    },
    {
      image: "/assets/generated/hero-ranthambore.dim_1920x1080.jpg",
      location: "Ranthambore, Rajasthan",
    },
  ];
  const [heroIndex, setHeroIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [contactWhatsAppData, setContactWhatsAppData] = useState<{
    name: string;
    email: string;
    phone: string;
    message: string;
  } | null>(null);
  const [whatsAppSubMenuOpen, setWhatsAppSubMenuOpen] = useState(false);
  const [callMenuOpen, setCallMenuOpen] = useState(false);
  const [searchDestination, setSearchDestination] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [searchGuests, setSearchGuests] = useState("");
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingDestination, setBookingDestination] = useState("");
  const [mergedNights, setMergedNights] = useState<string>("");
  const [manualKm, setManualKm] = useState<string>("");
  const [selectedTrip, setSelectedTrip] = useState<(typeof TRIPS)[0] | null>(
    null,
  );
  const [destSearch, setDestSearch] = useState<string>("");
  const [routeOrigin, setRouteOrigin] = useState<string>("");
  const [routeDest, setRouteDest] = useState<string>("");
  const [routeTaxi, setRouteTaxi] = useState<string>("");
  const [liveRouteData, setLiveRouteData] = useState<RouteInfo | null>(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeError, setRouteError] = useState<string | null>(null);
  const currentYear = new Date().getFullYear();

  function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    setContactWhatsAppData({ ...formData });
    setFormSubmitted(true);
    setFormData({ name: "", email: "", phone: "", message: "" });
    // Also send via formsubmit.co
    fetch("https://formsubmit.co/ajax/meenagaurav4748@gmail.com", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        _subject: "New Query - Meena Tour and Travels",
        Name: formData.name,
        Email: formData.email,
        Phone: formData.phone,
        Message: formData.message,
      }),
    }).catch(() => {});
    setTimeout(() => setFormSubmitted(false), 30000);
  }

  function openWhatsApp(
    phone: string,
    data: { name: string; email: string; phone: string; message: string },
  ) {
    const msg = `*Query - Meena Tour and Travels*

Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone}
Message: ${data.message}`;
    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`,
      "_blank",
    );
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
              className="flex flex-col items-start gap-0"
              data-ocid="nav.link"
            >
              <img
                src="/assets/generated/MTT-logo-cropped.dim_500x150.png"
                alt="Meena Tour and Travels"
                style={{
                  height: "52px",
                  width: "195px",
                  objectFit: "contain",
                  objectPosition: "left center",
                  borderRadius: 0,
                }}
                className="md:h-14 h-10"
              />
              <span
                className="text-xs font-semibold tracking-wide text-orange-600 hidden md:block"
                style={{ marginTop: "-2px", letterSpacing: "0.04em" }}
              >
                Every Destination, One Trusted Name
              </span>
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
          {/* Slideshow */}
          {HERO_SLIDES.map((slide, i) => (
            <div
              key={slide.image}
              className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
              style={{
                backgroundImage: `url('${slide.image}')`,
                opacity: i === heroIndex ? 1 : 0,
              }}
            />
          ))}
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
          {/* Location badge */}
          <div className="absolute bottom-24 right-6 z-10">
            <span className="bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full border border-white/20 font-medium">
              📍 {HERO_SLIDES[heroIndex].location}
            </span>
          </div>
          {/* Slide dots */}
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-10 flex gap-2">
            {HERO_SLIDES.map((slide, i) => (
              <button
                type="button"
                key={slide.location}
                onClick={() => setHeroIndex(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${i === heroIndex ? "bg-white w-6" : "bg-white/50"}`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

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
                      onClick={() => {
                        setBookingDestination(searchDestination);
                        setBookingOpen(true);
                      }}
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-10">
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
                      SUV &amp; Innova Crysta
                    </h3>
                    <div className="text-3xl font-display font-bold text-primary">
                      ₹28–35
                      <span className="text-base font-normal text-muted-foreground">
                        {" "}
                        / km
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Innova Crysta, Ertiga &amp; Premium SUVs. Our own vehicles
                      — spacious, comfortable, and reliable for long journeys.
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
          </div>
        </section>

        {/* PREMIUM FLEET */}
        <section className="py-16 bg-amber-950/5 border-y border-primary/10">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <Badge className="bg-primary/10 text-primary border-primary/20 mb-3">
                Our Fleet
              </Badge>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
                Our Vehicles
              </h2>
            </div>

            {/* Car Models */}
            <div className="mt-8 space-y-10">
              {/* Standard Fleet */}
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <h3 className="font-display text-xl font-bold text-foreground">
                    Standard Fleet
                  </h3>
                  <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                    Our Own Vehicles
                  </Badge>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {[
                    {
                      model: "Swift Dzire / Honda Amaze / Hyundai Aura",
                      tag: "Comfortable Sedan",
                      desc: "Smooth, fuel-efficient sedans ideal for city trips and short journeys. Our own vehicles — ₹18–22/km",
                      badge: "Own Car",
                      badgeColor:
                        "bg-green-100 text-green-800 border-green-200",
                      emoji: "🚗",
                    },
                    {
                      model: "Ertiga",
                      tag: "Smart Choice",
                      desc: "Perfect for small groups and family trips. Our own car with competitive rates.",
                      badge: "Own Car",
                      badgeColor:
                        "bg-green-100 text-green-800 border-green-200",
                      emoji: "🚙",
                    },
                    {
                      model: "Innova Crysta",
                      tag: "Premium MPV",
                      desc: "Spacious and comfortable for long journeys. Our own car — top comfort at ₹35/km",
                      badge: "Own Car",
                      badgeColor:
                        "bg-primary/10 text-primary border-primary/20",
                      emoji: "🚐",
                    },
                    {
                      model: "Premium SUVs",
                      tag: "Multiple Options",
                      desc: "Range of premium SUVs for all group sizes. All India Tourist Permit, fully owned.",
                      badge: "Available",
                      badgeColor: "bg-teal-100 text-teal-800 border-teal-200",
                      emoji: "🛻",
                    },
                  ].map((car, i) => (
                    <motion.div
                      key={car.model}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      data-ocid={`fleet.item.${i + 4}`}
                    >
                      <Card className="border border-primary/10 shadow-card hover:shadow-hero transition-all h-full">
                        <CardContent className="p-5 flex flex-col gap-2">
                          <div className="text-3xl mb-1">{car.emoji}</div>
                          <Badge className={`${car.badgeColor} text-xs w-fit`}>
                            {car.badge}
                          </Badge>
                          <h4 className="font-display font-bold text-foreground text-base">
                            {car.model}
                          </h4>
                          <p className="text-xs text-primary font-medium">
                            {car.tag}
                          </p>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {car.desc}
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
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
                  desc: "We serve MDs, CEOs and business leaders travelling between Delhi, Mumbai, Kolkata, Bangalore and across India.",
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

            <input
              type="text"
              placeholder="Search destinations... (e.g. Manali, Jaipur, Varanasi)"
              value={destSearch}
              onChange={(e) => setDestSearch(e.target.value)}
              className="w-full border border-input rounded-xl px-4 py-3 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring mb-6 shadow-sm"
              data-ocid="destinations.search_input"
            />
            {(() => {
              const filteredTrips = TRIPS.filter(
                (t) =>
                  t.name.toLowerCase().includes(destSearch.toLowerCase()) ||
                  (t.description?.toLowerCase() ?? "").includes(
                    destSearch.toLowerCase(),
                  ),
              );
              if (filteredTrips.length === 0) {
                return (
                  <p
                    className="text-center text-muted-foreground py-10"
                    data-ocid="destinations.empty_state"
                  >
                    No destinations found for "{destSearch}". Try a different
                    name.
                  </p>
                );
              }
              return (
                <div
                  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                  data-ocid="destinations.list"
                >
                  {filteredTrips.map((trip, i) => (
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
              );
            })()}
          </div>
        </section>
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
                    ₹18–22/km (Sedan) · ₹28–35/km (SUV). State taxes &amp; tolls
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
                          {t.photo ? (
                            <img
                              src={t.photo}
                              alt={t.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">
                              {t.initials}
                            </div>
                          )}
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
        <section className="py-16 bg-amber-950/5 border-y border-primary/10">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <Badge className="bg-primary/10 text-primary border-primary/20 mb-3">
                Route &amp; Fare Estimator
              </Badge>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
                Plan Your Trip &amp; Estimate Fare
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto text-sm">
                Enter your route to get highway details, distance, and an
                instant fare estimate.
              </p>
            </motion.div>

            {(() => {
              const routeData: Record<
                string,
                {
                  distance: number;
                  highway: string;
                  time: number;
                  note?: string;
                }
              > = {
                "Delhi-Agra": {
                  distance: 233,
                  highway: "NH 19 (Yamuna Expressway)",
                  time: 3,
                },
                "Delhi-Jaipur": {
                  distance: 282,
                  highway: "NH 48 (Delhi–Jaipur Expressway)",
                  time: 4.5,
                },
                "Delhi-Haridwar": {
                  distance: 220,
                  highway: "NH 334 via Meerut–Muzaffarnagar",
                  time: 4,
                },
                "Delhi-Rishikesh": {
                  distance: 245,
                  highway: "NH 334 & NH 7",
                  time: 4.5,
                },
                "Delhi-Manali": {
                  distance: 540,
                  highway: "NH 44 via Chandigarh & Kullu",
                  time: 13,
                  note: "Multi-day trip",
                },
                "Delhi-Shimla": {
                  distance: 370,
                  highway: "NH 44 & NH 5 via Chandigarh",
                  time: 8,
                },
                "Delhi-Chandigarh": {
                  distance: 260,
                  highway: "NH 44 (Delhi–Chandigarh Expressway)",
                  time: 4.5,
                },
                "Delhi-Mathura": {
                  distance: 183,
                  highway: "NH 19 (Yamuna Expressway)",
                  time: 2.5,
                },
                "Delhi-Vrindavan": {
                  distance: 187,
                  highway: "NH 19 (Yamuna Expressway)",
                  time: 2.5,
                },
                "Delhi-Varanasi": {
                  distance: 820,
                  highway: "NH 19 via Agra & Allahabad",
                  time: 14,
                  note: "Overnight trip",
                },
                "Delhi-Ayodhya": {
                  distance: 690,
                  highway: "NH 27 via Lucknow",
                  time: 11,
                },
                "Delhi-Amritsar": {
                  distance: 452,
                  highway: "NH 44 via Ludhiana",
                  time: 7,
                },
                "Delhi-Dehradun": {
                  distance: 300,
                  highway: "NH 334 & NH 72A",
                  time: 6,
                },
                "Delhi-Nainital": {
                  distance: 310,
                  highway: "NH 9 via Moradabad",
                  time: 6.5,
                },
                "Delhi-Mussoorie": {
                  distance: 295,
                  highway: "NH 334 via Dehradun",
                  time: 6,
                },
                "Delhi-Salasar Balaji": {
                  distance: 395,
                  highway: "NH 48 & SH 8 (Rajasthan)",
                  time: 7,
                },
                "Delhi-Khatu Shyam": {
                  distance: 375,
                  highway: "NH 48 via Sikar",
                  time: 6.5,
                },
                "Delhi-Pushkar": {
                  distance: 410,
                  highway: "NH 48 via Ajmer",
                  time: 7,
                },
                "Delhi-Bikaner": {
                  distance: 490,
                  highway: "NH 62 via Hanumangarh",
                  time: 8,
                },
                "Delhi-Ajmer": { distance: 390, highway: "NH 48", time: 6.5 },
                "Delhi-Kota": {
                  distance: 490,
                  highway: "NH 52 via Dausa",
                  time: 8,
                },
                "Delhi-Mumbai": {
                  distance: 1450,
                  highway: "NH 48 (Delhi–Mumbai Expressway)",
                  time: 24,
                  note: "Multi-day trip",
                },
                "Delhi-Kolkata": {
                  distance: 1530,
                  highway: "NH 19 via Varanasi",
                  time: 26,
                  note: "Multi-day trip",
                },
                "Delhi-Bangalore": {
                  distance: 2150,
                  highway: "NH 44 via Nagpur",
                  time: 36,
                  note: "Multi-day trip",
                },
                "Delhi-Goa": {
                  distance: 1900,
                  highway: "NH 48 via Mumbai",
                  time: 32,
                  note: "Multi-day trip",
                },
                "Delhi-Pune": {
                  distance: 1490,
                  highway: "NH 48 via Jaipur & Mumbai",
                  time: 25,
                  note: "Multi-day trip",
                },
                "Delhi-Hyderabad": {
                  distance: 1650,
                  highway: "NH 44 via Nagpur",
                  time: 28,
                  note: "Multi-day trip",
                },
                "Delhi-Jodhpur": {
                  distance: 605,
                  highway: "NH 48 via Jaipur",
                  time: 10,
                  note: "Long trip",
                },
                "Delhi-Udaipur": {
                  distance: 660,
                  highway: "NH 48 via Jaipur & Ajmer",
                  time: 11,
                  note: "Long trip",
                },
                "Delhi-Jaisalmer": {
                  distance: 870,
                  highway: "NH 48 via Jaipur & Jodhpur",
                  time: 14,
                  note: "Multi-day trip",
                },
                "Delhi-Sawai Madhopur": {
                  distance: 385,
                  highway: "NH 48 & NH 52 via Dausa",
                  time: 7,
                },
                "Delhi-Ranthambore": {
                  distance: 390,
                  highway: "NH 48 & NH 52",
                  time: 7,
                },
                "Delhi-Chittorgarh": {
                  distance: 595,
                  highway: "NH 48 via Jaipur",
                  time: 10,
                },
                "Delhi-Bundi": {
                  distance: 490,
                  highway: "NH 48 & NH 52 via Kota",
                  time: 8,
                },
                "Delhi-Tonk": {
                  distance: 350,
                  highway: "NH 48 via Jaipur",
                  time: 6.5,
                },
                "Delhi-Sikar": {
                  distance: 330,
                  highway: "NH 48 via Jaipur",
                  time: 6,
                },
                "Delhi-Barmer": {
                  distance: 820,
                  highway: "NH 62 via Bikaner",
                  time: 14,
                  note: "Multi-day trip",
                },
                "Delhi-Pali": {
                  distance: 530,
                  highway: "NH 62 via Jodhpur",
                  time: 9,
                },
                "Delhi-Nagaur": {
                  distance: 460,
                  highway: "NH 62 via Bikaner bypass",
                  time: 8,
                },
                "Delhi-Bharatpur": {
                  distance: 200,
                  highway: "NH 21 via Agra road",
                  time: 3.5,
                },
                "Delhi-Alwar": {
                  distance: 165,
                  highway: "NH 248 via Rewari",
                  time: 3,
                },
                "Delhi-Lucknow": {
                  distance: 555,
                  highway: "NH 27 (Agra–Lucknow Expressway)",
                  time: 8,
                },
                "Delhi-Allahabad (Prayagraj)": {
                  distance: 645,
                  highway: "NH 19 via Agra",
                  time: 10,
                },
                "Delhi-Kanpur": {
                  distance: 480,
                  highway: "NH 19 via Agra–Lucknow Expressway",
                  time: 7,
                },
                "Delhi-Meerut": {
                  distance: 70,
                  highway: "NH 58 (Delhi–Meerut Expressway)",
                  time: 1.5,
                },
                "Delhi-Moradabad": { distance: 165, highway: "NH 9", time: 3 },
                "Delhi-Karnal": { distance: 130, highway: "NH 44", time: 2.5 },
                "Delhi-Panipat": { distance: 90, highway: "NH 44", time: 2 },
                "Delhi-Sonipat": { distance: 45, highway: "NH 44", time: 1 },
                "Delhi-Rohtak": { distance: 75, highway: "NH 9", time: 1.5 },
                "Delhi-Gurgaon": {
                  distance: 32,
                  highway: "NH 48 (Delhi–Gurugram Expressway)",
                  time: 1,
                },
                "Delhi-Faridabad": { distance: 30, highway: "NH 19", time: 1 },
                "Delhi-Noida": {
                  distance: 20,
                  highway: "DND Flyway / NH 24",
                  time: 0.5,
                },
                "Delhi-Ludhiana": {
                  distance: 320,
                  highway: "NH 44",
                  time: 5.5,
                },
                "Delhi-Jalandhar": { distance: 375, highway: "NH 44", time: 6 },
                "Delhi-Pathankot": {
                  distance: 440,
                  highway: "NH 44 via Jalandhar",
                  time: 7.5,
                },
                "Delhi-Dharamshala": {
                  distance: 475,
                  highway: "NH 44 via Pathankot",
                  time: 8.5,
                },
                "Delhi-Dalhousie": {
                  distance: 560,
                  highway: "NH 44 via Pathankot",
                  time: 10,
                },
                "Delhi-Kullu": {
                  distance: 505,
                  highway: "NH 44 via Chandigarh",
                  time: 11,
                },
                "Delhi-Kasauli": {
                  distance: 300,
                  highway: "NH 44 via Chandigarh",
                  time: 5.5,
                },
                "Delhi-Solan": {
                  distance: 340,
                  highway: "NH 44 via Chandigarh",
                  time: 6,
                },
                "Delhi-Spiti": {
                  distance: 740,
                  highway: "NH 5 via Shimla–Kinnaur",
                  time: 16,
                  note: "Multi-day trip",
                },
                "Delhi-Jammu": {
                  distance: 595,
                  highway: "NH 44 via Pathankot",
                  time: 10,
                },
                "Delhi-Vaishno Devi": {
                  distance: 650,
                  highway: "NH 44 via Jammu",
                  time: 11,
                },
                "Delhi-Hanumangarh": {
                  distance: 450,
                  highway: "NH 9 via Sirsa",
                  time: 8,
                },
                "Delhi-Sirsa": {
                  distance: 290,
                  highway: "NH 9 via Hisar",
                  time: 5,
                },
                "Delhi-Hisar": { distance: 165, highway: "NH 9", time: 3 },
                "Delhi-Bhiwani": {
                  distance: 130,
                  highway: "NH 9 via Rohtak",
                  time: 2.5,
                },
                "Delhi-Sambhal": {
                  distance: 160,
                  highway: "NH 9 via Moradabad",
                  time: 3,
                },
                "Delhi-Shamli": {
                  distance: 115,
                  highway: "NH 58 via Muzaffarnagar",
                  time: 2,
                },
                "Delhi-Bulandshahr": {
                  distance: 80,
                  highway: "NH 9 via Noida",
                  time: 1.5,
                },
                "Delhi-Etah": {
                  distance: 200,
                  highway: "NH 19 via Aligarh",
                  time: 3.5,
                },
                "Jaipur-Agra": {
                  distance: 238,
                  highway: "NH 21 (Agra–Jaipur Expressway)",
                  time: 4,
                },
                "Jaipur-Udaipur": {
                  distance: 397,
                  highway: "NH 48 via Ajmer",
                  time: 7,
                },
                "Jaipur-Jodhpur": { distance: 340, highway: "NH 62", time: 6 },
                "Jaipur-Ajmer": { distance: 135, highway: "NH 48", time: 2.5 },
                "Jaipur-Pushkar": {
                  distance: 150,
                  highway: "NH 48 via Ajmer",
                  time: 2.5,
                },
                "Jaipur-Bikaner": {
                  distance: 330,
                  highway: "NH 62 via Sikar–Fatehpur",
                  time: 5.5,
                },
                "Jaipur-Kota": { distance: 250, highway: "NH 52", time: 4.5 },
                "Jaipur-Bundi": {
                  distance: 210,
                  highway: "NH 52 via Kota",
                  time: 3.5,
                },
                "Jaipur-Chittorgarh": {
                  distance: 320,
                  highway: "NH 48 via Ajmer",
                  time: 5.5,
                },
                "Jaipur-Sawai Madhopur": {
                  distance: 165,
                  highway: "NH 52",
                  time: 3,
                },
                "Jaipur-Ranthambore": {
                  distance: 165,
                  highway: "NH 52",
                  time: 3,
                },
                "Jaipur-Sikar": {
                  distance: 110,
                  highway: "NH 52 via Chomu",
                  time: 2,
                },
                "Jaipur-Khatu Shyam": {
                  distance: 130,
                  highway: "NH 52 via Sikar",
                  time: 2.5,
                },
                "Jaipur-Salasar Balaji": {
                  distance: 175,
                  highway: "NH 52 via Sikar",
                  time: 3,
                },
                "Jaipur-Bharatpur": {
                  distance: 185,
                  highway: "NH 21",
                  time: 3.5,
                },
                "Jaipur-Alwar": {
                  distance: 148,
                  highway: "NH 248 via Kotputli",
                  time: 3,
                },
                "Jaipur-Tonk": { distance: 100, highway: "NH 48", time: 2 },
                "Jaipur-Nagaur": {
                  distance: 200,
                  highway: "NH 62 via Degana",
                  time: 3.5,
                },
                "Jaipur-Barmer": {
                  distance: 580,
                  highway: "NH 62 via Jodhpur",
                  time: 10,
                },
                "Jaipur-Pali": {
                  distance: 260,
                  highway: "NH 62 via Jodhpur bypass",
                  time: 4.5,
                },
                "Jaipur-Jaisalmer": {
                  distance: 570,
                  highway: "NH 62 via Jodhpur",
                  time: 10,
                },
                "Jaipur-Varanasi": {
                  distance: 760,
                  highway: "NH 19 via Agra",
                  time: 13,
                },
                "Jaipur-Lucknow": {
                  distance: 550,
                  highway: "NH 19 via Agra–Lucknow",
                  time: 9,
                },
                "Agra-Mathura": {
                  distance: 58,
                  highway: "NH 19 (Yamuna Expressway)",
                  time: 1,
                },
                "Lucknow-Gorakhpur": {
                  distance: 265,
                  highway: "NH 28",
                  time: 5,
                },
                "Chandigarh-Amritsar": {
                  distance: 230,
                  highway: "NH 44",
                  time: 4,
                },
                "Chandigarh-Ludhiana": {
                  distance: 100,
                  highway: "NH 44",
                  time: 2,
                },
                "Chandigarh-Shimla": {
                  distance: 115,
                  highway: "NH 5",
                  time: 3,
                },
                "Chandigarh-Manali": {
                  distance: 310,
                  highway: "NH 3 via Kullu",
                  time: 8,
                },
                "Chandigarh-Dharamshala": {
                  distance: 245,
                  highway: "NH 44 via Pathankot",
                  time: 5,
                },
                "Chandigarh-Pathankot": {
                  distance: 180,
                  highway: "NH 44",
                  time: 3.5,
                },
                "Chandigarh-Jalandhar": {
                  distance: 145,
                  highway: "NH 44",
                  time: 2.5,
                },
                "Amritsar-Pathankot": {
                  distance: 100,
                  highway: "NH 44",
                  time: 2,
                },
                "Amritsar-Dharamshala": {
                  distance: 185,
                  highway: "NH 44 via Pathankot",
                  time: 4,
                },
                "Amritsar-Jalandhar": {
                  distance: 80,
                  highway: "NH 44",
                  time: 1.5,
                },
                "Amritsar-Ludhiana": {
                  distance: 155,
                  highway: "NH 44",
                  time: 3,
                },
                "Jodhpur-Udaipur": {
                  distance: 270,
                  highway: "NH 62 via Pali",
                  time: 5,
                },
                "Jodhpur-Bikaner": {
                  distance: 245,
                  highway: "NH 65",
                  time: 4.5,
                },
                "Jodhpur-Jaisalmer": {
                  distance: 290,
                  highway: "NH 125",
                  time: 5,
                },
                "Jodhpur-Ajmer": {
                  distance: 200,
                  highway: "NH 62 via Pali",
                  time: 4,
                },
                "Jodhpur-Pushkar": {
                  distance: 190,
                  highway: "NH 62 via Pali & Ajmer",
                  time: 4,
                },
                "Jodhpur-Barmer": { distance: 220, highway: "NH 125", time: 4 },
                "Jodhpur-Pali": { distance: 72, highway: "NH 62", time: 1.5 },
                "Jodhpur-Nagaur": {
                  distance: 140,
                  highway: "NH 65",
                  time: 2.5,
                },
                "Udaipur-Chittorgarh": {
                  distance: 115,
                  highway: "NH 48",
                  time: 2,
                },
                "Udaipur-Kota": {
                  distance: 255,
                  highway: "NH 52 via Chittorgarh",
                  time: 4.5,
                },
                "Udaipur-Ajmer": { distance: 275, highway: "NH 48", time: 5 },
                "Udaipur-Bikaner": {
                  distance: 510,
                  highway: "NH 62 via Jodhpur",
                  time: 9,
                },
                "Udaipur-Pushkar": {
                  distance: 260,
                  highway: "NH 48 via Ajmer",
                  time: 4.5,
                },
                "Udaipur-Nathdwara": {
                  distance: 48,
                  highway: "NH 48",
                  time: 1,
                },
                "Udaipur-Abu Road": {
                  distance: 160,
                  highway: "NH 27",
                  time: 3,
                },
                "Udaipur-Ahmedabad": {
                  distance: 260,
                  highway: "NH 48",
                  time: 4.5,
                },
                "Shimla-Manali": {
                  distance: 270,
                  highway: "NH 3 via Kullu",
                  time: 8,
                },
                "Shimla-Dharamshala": {
                  distance: 250,
                  highway: "NH 154A via Bilaspur",
                  time: 7,
                },
                "Shimla-Kullu": { distance: 235, highway: "NH 3", time: 6 },
                "Shimla-Kasauli": { distance: 70, highway: "NH 22", time: 2 },
                "Shimla-Solan": { distance: 45, highway: "NH 5", time: 1 },
                "Varanasi-Allahabad (Prayagraj)": {
                  distance: 125,
                  highway: "NH 19",
                  time: 2.5,
                },
                "Varanasi-Ayodhya": {
                  distance: 200,
                  highway: "NH 27 via Sultanpur",
                  time: 4,
                },
                "Varanasi-Gorakhpur": {
                  distance: 230,
                  highway: "NH 29",
                  time: 4.5,
                },
                "Mathura-Vrindavan": {
                  distance: 12,
                  highway: "Local Road (Mathura–Vrindavan Road)",
                  time: 0.3,
                },
                "Mathura-Agra": {
                  distance: 58,
                  highway: "NH 19 (Yamuna Expressway)",
                  time: 1,
                },
                "Nainital-Corbett": {
                  distance: 65,
                  highway: "SH 18 via Ramnagar",
                  time: 2,
                },
                "Meerut-Haridwar": {
                  distance: 165,
                  highway: "NH 58 via Muzaffarnagar",
                  time: 3,
                },
                "Meerut-Mathura": {
                  distance: 155,
                  highway: "NH 58 via Palwal",
                  time: 3,
                },
                "Meerut-Moradabad": {
                  distance: 130,
                  highway: "NH 9",
                  time: 2.5,
                },
              };

              const cities = [
                "Agra",
                "Ajmer",
                "Aligarh",
                "Allahabad (Prayagraj)",
                "Alwar",
                "Ambala",
                "Amritsar",
                "Ayodhya",
                "Bareilly",
                "Barmer",
                "Bharatpur",
                "Bhiwani",
                "Bikaner",
                "Bijnor",
                "Bilaspur (HP)",
                "Bulandshahr",
                "Bundi",
                "Chandigarh",
                "Chittorgarh",
                "Churu",
                "Dalhousie",
                "Dausa",
                "Dehradun",
                "Delhi",
                "Dharamshala",
                "Dholpur",
                "Dungarpur",
                "Etawah",
                "Firozabad",
                "Ganganagar",
                "Goa",
                "Gorakhpur",
                "Hanumangarh",
                "Hapur",
                "Haridwar",
                "Hisar",
                "Jalandhar",
                "Jaipur",
                "Jaisalmer",
                "Jammu",
                "Jhalawar",
                "Jhunjhunu",
                "Jhansi",
                "Jodhpur",
                "Karauli",
                "Karnal",
                "Kasauli",
                "Khatu Shyam",
                "Kolkata",
                "Kota",
                "Kullu",
                "Lucknow",
                "Ludhiana",
                "Manali",
                "Mathura",
                "Meerut",
                "Moradabad",
                "Mount Abu",
                "Mumbai",
                "Mussoorie",
                "Muzaffarnagar",
                "Nagaur",
                "Nainital",
                "Palampur",
                "Pali",
                "Panipat",
                "Pathankot",
                "Pushkar",
                "Rajsamand",
                "Rampur",
                "Ranthambore",
                "Rishikesh",
                "Rohtak",
                "Saharanpur",
                "Salasar Balaji",
                "Sambhal",
                "Sawai Madhopur",
                "Shamli",
                "Shimla",
                "Sikar",
                "Sirsa",
                "Solan",
                "Sonipat",
                "Spiti",
                "Tonk",
                "Udaipur",
                "Varanasi",
                "Vrindavan",
                "Bangalore",
                "Hyderabad",
                "Pune",
              ];

              const taxiRates: Record<
                string,
                { label: string; min: number; max: number; isLuxury?: boolean }
              > = {
                sedan: { label: "Sedan", min: 18, max: 22 },
                ertiga: { label: "Ertiga", min: 22, max: 28 },
                crysta: { label: "Innova Crysta", min: 28, max: 35 },
                suv: { label: "Premium SUV", min: 28, max: 35 },
                luxury: {
                  label: "BMW / Mercedes / LR Defender",
                  min: 0,
                  max: 0,
                  isLuxury: true,
                },
              };

              const key1 =
                routeOrigin && routeDest ? `${routeOrigin}-${routeDest}` : "";
              const key2 =
                routeOrigin && routeDest ? `${routeDest}-${routeOrigin}` : "";
              const route = routeData[key1] || routeData[key2] || null;
              const noRoute =
                routeOrigin && routeDest && routeOrigin !== routeDest && !route;
              const sameCity =
                routeOrigin && routeDest && routeOrigin === routeDest;

              // Determine km to use for fare calc (live data takes priority)
              const kmForFare = liveRouteData
                ? liveRouteData.distanceKm
                : route
                  ? route.distance
                  : manualKm && Number(manualKm) > 0
                    ? Number(manualKm)
                    : 0;

              const selectedTaxi = routeTaxi ? taxiRates[routeTaxi] : null;
              const nightCharges =
                mergedNights && Number(mergedNights) > 0
                  ? Number(mergedNights) * 300
                  : 0;
              const fareMin =
                selectedTaxi && !selectedTaxi.isLuxury && kmForFare > 0
                  ? kmForFare * selectedTaxi.min
                  : 0;
              const fareMax =
                selectedTaxi && !selectedTaxi.isLuxury && kmForFare > 0
                  ? kmForFare * selectedTaxi.max
                  : 0;

              return (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="max-w-4xl mx-auto"
                >
                  <Card className="border-0 shadow-hero overflow-hidden">
                    <div className="h-1.5 bg-gradient-to-r from-primary via-amber-400 to-accent" />
                    <CardContent className="p-6 md:p-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {/* From */}
                        <div>
                          <label
                            htmlFor="route-origin"
                            className="text-sm font-semibold text-foreground mb-1.5 block"
                          >
                            📍 From (Origin)
                          </label>
                          <select
                            id="route-origin"
                            value={routeOrigin}
                            onChange={(e) => {
                              setRouteOrigin(e.target.value);
                              setLiveRouteData(null);
                              setRouteError(null);
                            }}
                            className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            data-ocid="route.select"
                          >
                            <option value="">Select city...</option>
                            {cities.map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                        </div>
                        {/* To */}
                        <div>
                          <label
                            htmlFor="route-dest"
                            className="text-sm font-semibold text-foreground mb-1.5 block"
                          >
                            🏁 To (Destination)
                          </label>
                          <select
                            id="route-dest"
                            value={routeDest}
                            onChange={(e) => {
                              setRouteDest(e.target.value);
                              setLiveRouteData(null);
                              setRouteError(null);
                            }}
                            className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            data-ocid="route.select"
                          >
                            <option value="">Select city...</option>
                            {cities.map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                        </div>
                        {/* Taxi type */}
                        <div>
                          <label
                            htmlFor="route-taxi"
                            className="text-sm font-semibold text-foreground mb-1.5 block"
                          >
                            🚗 Select Taxi Type
                          </label>
                          <select
                            id="route-taxi"
                            value={routeTaxi}
                            onChange={(e) => setRouteTaxi(e.target.value)}
                            className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            data-ocid="route.select"
                          >
                            <option value="">Select vehicle type...</option>
                            <option value="sedan">
                              Sedan (Swift Dzire / Aura / Amaze) — ₹18–22/km
                            </option>
                            <option value="ertiga">Ertiga — ₹22–28/km</option>
                            <option value="crysta">
                              Innova Crysta — ₹28–35/km
                            </option>
                            <option value="suv">Premium SUV — ₹28–35/km</option>
                            <option value="luxury">
                              BMW / Mercedes / LR Defender (VIP)
                            </option>
                          </select>
                        </div>
                        {/* Night stays */}
                        <div>
                          <label
                            htmlFor="merged-nights"
                            className="text-sm font-semibold text-foreground mb-1.5 block"
                          >
                            🌙 Driver Night Stays{" "}
                            <span className="text-muted-foreground font-normal">
                              (optional)
                            </span>
                          </label>
                          <Input
                            id="merged-nights"
                            type="number"
                            placeholder="e.g. 2"
                            value={mergedNights}
                            onChange={(e) => setMergedNights(e.target.value)}
                            className="text-base"
                            data-ocid="calculator.input"
                            min="0"
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            ₹300 per night for driver stay
                          </p>
                        </div>
                      </div>

                      {/* Search Route button */}
                      {routeOrigin &&
                        routeDest &&
                        routeOrigin !== routeDest && (
                          <div className="flex gap-3 items-center mb-2">
                            <Button
                              onClick={async () => {
                                setRouteLoading(true);
                                setRouteError(null);
                                setLiveRouteData(null);
                                const result = await getRouteInfo(
                                  routeOrigin,
                                  routeDest,
                                  actor,
                                );
                                if (result) {
                                  setLiveRouteData(result);
                                } else {
                                  setRouteError(
                                    "Live data unavailable. Showing estimated data.",
                                  );
                                }
                                setRouteLoading(false);
                              }}
                              disabled={routeLoading}
                              className="bg-primary text-white"
                              data-ocid="route.primary_button"
                            >
                              {routeLoading ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                                  Fetching Live Data...
                                </>
                              ) : (
                                <>
                                  <Navigation2 className="mr-2 h-4 w-4" />{" "}
                                  Search Live Route
                                </>
                              )}
                            </Button>
                            {routeError && (
                              <p className="text-xs text-amber-600">
                                {routeError}
                              </p>
                            )}
                          </div>
                        )}

                      {/* Results area */}
                      {sameCity && (
                        <div
                          className="bg-secondary/50 border border-border rounded-xl p-4 text-sm text-muted-foreground"
                          data-ocid="route.error_state"
                        >
                          Origin and destination are the same. Please select
                          different cities.
                        </div>
                      )}

                      {route && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-4"
                          data-ocid="route.success_state"
                        >
                          {/* Route info pills */}
                          <div className="bg-gradient-to-br from-primary/5 to-teal-50 border border-primary/15 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-3">
                              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                                Route Information
                              </p>
                              {liveRouteData && (
                                <span className="flex items-center gap-1 bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full border border-green-200">
                                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                                  Live Data · Powered by MapMyIndia
                                </span>
                              )}
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              <div className="bg-white/70 border border-primary/10 rounded-lg px-3 py-2.5 text-center">
                                <p className="text-xs text-muted-foreground mb-0.5">
                                  🛣️ Highway
                                </p>
                                <p className="font-semibold text-foreground text-sm leading-tight">
                                  {route.highway}
                                </p>
                              </div>
                              <div className="bg-white/70 border border-primary/10 rounded-lg px-3 py-2.5 text-center">
                                <p className="text-xs text-muted-foreground mb-0.5">
                                  📏 Distance
                                </p>
                                <p className="font-bold text-foreground text-lg">
                                  {liveRouteData
                                    ? liveRouteData.distanceKm
                                    : route.distance}{" "}
                                  <span className="text-sm font-normal">
                                    km
                                  </span>
                                </p>
                              </div>
                              <div className="bg-white/70 border border-primary/10 rounded-lg px-3 py-2.5 text-center">
                                <p className="text-xs text-muted-foreground mb-0.5">
                                  ⏱️ Travel Time
                                </p>
                                <p className="font-bold text-foreground text-lg">
                                  {(() => {
                                    const t = liveRouteData
                                      ? liveRouteData.durationHrs
                                      : route.time;
                                    return t >= 24
                                      ? `${Math.floor(t / 24)}d ${t % 24 > 0 ? `${t % 24}h` : ""}`
                                      : t < 1
                                        ? `${Math.round(t * 60)} min`
                                        : `${t} hrs`;
                                  })()}
                                </p>
                              </div>
                            </div>
                            {liveRouteData?.tollCount !== undefined && (
                              <div className="mt-2 bg-orange-50 border border-orange-200 rounded-lg px-3 py-1.5 text-xs text-orange-800">
                                🛂 Estimated toll cost on this route: ₹
                                {liveRouteData.tollCount}
                              </div>
                            )}
                            {route.note && (
                              <div className="mt-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-1.5 text-xs text-blue-800">
                                📌 {route.note}
                              </div>
                            )}
                          </div>

                          {/* Fare breakdown */}
                          {selectedTaxi && (
                            <motion.div
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-4 space-y-2"
                              data-ocid="calculator.success_state"
                            >
                              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-2">
                                Fare Estimate — {selectedTaxi.label}
                              </p>
                              {selectedTaxi.isLuxury ? (
                                <div className="text-center py-2">
                                  <p className="font-semibold text-yellow-900">
                                    ✨ VIP Service — Contact for Personalised
                                    Quote
                                  </p>
                                  <p className="font-bold text-primary text-lg mt-1">
                                    📞 9990104748
                                  </p>
                                </div>
                              ) : (
                                <>
                                  <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">
                                      Base Fare ({route.distance} km × ₹
                                      {selectedTaxi.min}–{selectedTaxi.max}/km)
                                    </span>
                                    <span className="font-semibold text-foreground">
                                      ₹{fareMin.toLocaleString("en-IN")} – ₹
                                      {fareMax.toLocaleString("en-IN")}
                                    </span>
                                  </div>
                                  {nightCharges > 0 && (
                                    <div className="flex justify-between items-center text-sm">
                                      <span className="text-muted-foreground">
                                        Driver Night Charges ({mergedNights}{" "}
                                        night
                                        {Number(mergedNights) > 1 ? "s" : ""} ×
                                        ₹300)
                                      </span>
                                      <span className="font-semibold text-foreground">
                                        ₹{nightCharges.toLocaleString("en-IN")}
                                      </span>
                                    </div>
                                  )}
                                  <div className="border-t border-amber-200 pt-2 flex justify-between items-center">
                                    <span className="font-bold text-foreground">
                                      Total Estimated Range
                                    </span>
                                    <span className="font-bold text-primary text-lg">
                                      ₹
                                      {(fareMin + nightCharges).toLocaleString(
                                        "en-IN",
                                      )}{" "}
                                      – ₹
                                      {(fareMax + nightCharges).toLocaleString(
                                        "en-IN",
                                      )}
                                    </span>
                                  </div>
                                  <p className="text-xs text-muted-foreground bg-amber-100 border border-amber-200 rounded-lg px-3 py-2 mt-1">
                                    ⚠️ State taxes, toll charges, and driver
                                    night charges are extra as per actuals.
                                    Final rate may vary.
                                  </p>
                                </>
                              )}
                            </motion.div>
                          )}
                          {!routeTaxi && (
                            <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-xs text-amber-800 text-center">
                              ☝️ Select a taxi type above to see fare estimate
                            </div>
                          )}
                        </motion.div>
                      )}

                      {noRoute &&
                        (() => {
                          const fromDelhi =
                            routeData[`Delhi-${routeOrigin}`] ||
                            routeData[`${routeOrigin}-Delhi`];
                          const toDelhi =
                            routeData[`Delhi-${routeDest}`] ||
                            routeData[`${routeDest}-Delhi`];
                          const estKm =
                            fromDelhi && toDelhi
                              ? Math.round(
                                  (fromDelhi.distance + toDelhi.distance) *
                                    0.85,
                                )
                              : null;

                          return (
                            <motion.div
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="space-y-4"
                              data-ocid="route.error_state"
                            >
                              {estKm ? (
                                <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-4">
                                  <p className="text-xs font-semibold text-amber-800 mb-3">
                                    📍 Approximate Route Info ({routeOrigin} →{" "}
                                    {routeDest})
                                  </p>
                                  <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-white/70 border border-amber-100 rounded-lg px-3 py-2.5 text-center">
                                      <p className="text-xs text-muted-foreground mb-0.5">
                                        📏 Est. Distance
                                      </p>
                                      <p className="font-bold text-foreground text-lg">
                                        ~{estKm}{" "}
                                        <span className="text-sm font-normal">
                                          km
                                        </span>
                                      </p>
                                    </div>
                                    <div className="bg-white/70 border border-amber-100 rounded-lg px-3 py-2.5 text-center">
                                      <p className="text-xs text-muted-foreground mb-0.5">
                                        ⏱️ Est. Time
                                      </p>
                                      <p className="font-bold text-foreground text-lg">
                                        ~
                                        {Math.round(
                                          (fromDelhi!.time + toDelhi!.time) *
                                            0.85,
                                        )}{" "}
                                        <span className="text-sm font-normal">
                                          hrs
                                        </span>
                                      </p>
                                    </div>
                                  </div>
                                  <p className="text-xs text-amber-700 mt-3">
                                    Route via major highways. For exact toll
                                    &amp; route info, call us:{" "}
                                    <strong>9990104748</strong>
                                  </p>
                                </div>
                              ) : (
                                <div className="bg-secondary/50 border border-border rounded-xl p-4 text-sm text-muted-foreground">
                                  Route info not available for this combination.
                                  Please call us:{" "}
                                  <strong className="text-foreground">
                                    9990104748
                                  </strong>
                                </div>
                              )}

                              {/* Manual km input + fare for no-route case */}
                              <div>
                                <label
                                  htmlFor="manual-km"
                                  className="text-sm font-semibold text-foreground mb-1.5 block"
                                >
                                  Enter Distance Manually (km)
                                </label>
                                <Input
                                  id="manual-km"
                                  type="number"
                                  placeholder={
                                    estKm
                                      ? `~${estKm} km estimated`
                                      : "e.g. 300"
                                  }
                                  value={manualKm}
                                  onChange={(e) => setManualKm(e.target.value)}
                                  className="text-base"
                                  data-ocid="calculator.input"
                                  min="0"
                                />
                              </div>

                              {selectedTaxi &&
                                kmForFare > 0 &&
                                !selectedTaxi.isLuxury && (
                                  <motion.div
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-4 space-y-2"
                                    data-ocid="calculator.success_state"
                                  >
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-2">
                                      Fare Estimate — {selectedTaxi.label}
                                    </p>
                                    <div className="flex justify-between items-center text-sm">
                                      <span className="text-muted-foreground">
                                        Base Fare ({kmForFare} km × ₹
                                        {selectedTaxi.min}–{selectedTaxi.max}
                                        /km)
                                      </span>
                                      <span className="font-semibold text-foreground">
                                        ₹{fareMin.toLocaleString("en-IN")} – ₹
                                        {fareMax.toLocaleString("en-IN")}
                                      </span>
                                    </div>
                                    {nightCharges > 0 && (
                                      <div className="flex justify-between items-center text-sm">
                                        <span className="text-muted-foreground">
                                          Driver Night Charges ({mergedNights}{" "}
                                          night
                                          {Number(mergedNights) > 1 ? "s" : ""}{" "}
                                          × ₹300)
                                        </span>
                                        <span className="font-semibold text-foreground">
                                          ₹
                                          {nightCharges.toLocaleString("en-IN")}
                                        </span>
                                      </div>
                                    )}
                                    <div className="border-t border-amber-200 pt-2 flex justify-between items-center">
                                      <span className="font-bold text-foreground">
                                        Total Estimated Range
                                      </span>
                                      <span className="font-bold text-primary text-lg">
                                        ₹
                                        {(
                                          fareMin + nightCharges
                                        ).toLocaleString("en-IN")}{" "}
                                        – ₹
                                        {(
                                          fareMax + nightCharges
                                        ).toLocaleString("en-IN")}
                                      </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground bg-amber-100 border border-amber-200 rounded-lg px-3 py-2 mt-1">
                                      ⚠️ State taxes, toll charges, and driver
                                      night charges are extra as per actuals.
                                    </p>
                                  </motion.div>
                                )}
                            </motion.div>
                          );
                        })()}

                      {!routeOrigin && !routeDest && (
                        <div className="bg-secondary/30 border border-border/50 rounded-xl p-6 text-sm text-muted-foreground text-center flex items-center justify-center gap-2">
                          <span>🗺️</span>
                          <span>
                            Select origin &amp; destination above to see route
                            info and fare estimate
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })()}
          </div>
        </section>
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
                    <img
                      src="/assets/uploads/gaurav-photo-1-1.jpeg"
                      alt="Gaurav"
                      className="w-24 h-24 rounded-full object-cover shadow-lg ring-4 ring-white"
                    />
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-accent rounded-full flex items-center justify-center shadow">
                      <Sparkles size={14} className="text-foreground" />
                    </div>
                  </div>

                  {/* Text */}
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                      <Badge className="bg-accent/30 text-foreground border-accent/40 text-xs font-semibold">
                        Co-Founder & Managing Director
                      </Badge>
                    </div>
                    <h3 className="font-display text-2xl font-bold text-primary mt-1 mb-2">
                      Hi, I'm Gaurav! 👋
                    </h3>
                    <p className="text-foreground/75 leading-relaxed max-w-lg">
                      The Driving Force. As Co-Founder and Managing Director,
                      Gaurav leads every aspect of Meena Tour and Travels — from
                      fleet management to on-ground operations and client
                      satisfaction. His hands-on approach, deep industry
                      knowledge, and unwavering commitment to excellence are the
                      reason clients return, refer, and trust Meena Tour and
                      Travels completely.
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

            {/* Shyam Lal Meena — Co-Founder & Director — Corporate Deals & Rate Negotiations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <div className="relative overflow-hidden rounded-2xl border border-primary/15 shadow-card bg-gradient-to-r from-teal-50/60 to-cyan-50/60 p-6 md:p-7 flex flex-col md:flex-row items-center gap-5">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <img
                    src="/assets/uploads/pita-ji-1-1.jpeg"
                    alt="Shyam Lal Meena"
                    className="w-20 h-20 rounded-full object-cover shadow-lg ring-4 ring-white"
                  />
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-100 rounded-full flex items-center justify-center shadow">
                    <CheckCircle size={13} className="text-green-600" />
                  </div>
                </div>

                {/* Text */}
                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                    <Badge className="bg-teal-100 text-teal-800 border-teal-200 text-xs font-semibold">
                      Co-Founder & Director — Corporate Deals & Rate
                      Negotiations
                    </Badge>
                  </div>
                  <h3 className="font-display text-xl font-bold text-teal-700 mt-1 mb-2">
                    Shyam Lal Meena
                  </h3>
                  <p className="text-foreground/70 leading-relaxed max-w-lg text-sm">
                    The Corporate Deal Maker. Shyam Lal Meena is the driving
                    force behind all our corporate relationships. He directly
                    connects with companies, Managing Directors, and key
                    decision-makers across India — negotiating and fixing travel
                    rates on behalf of Meena Tour and Travels. From signing
                    corporate contracts to finalising per-kilometre rates for
                    long-term clients, he ensures every company gets the best
                    value while the business grows stronger. His network spans
                    Delhi, Mumbai, Kolkata, Bangalore, and beyond.
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

            {/* Founding Story */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-8 text-center"
            >
              <div className="inline-block bg-gradient-to-r from-primary/10 via-teal-50 to-primary/10 border border-primary/15 rounded-2xl px-8 py-4 max-w-2xl">
                <span className="text-primary text-lg mr-2">🤝</span>
                <span className="text-foreground/80 italic text-sm leading-relaxed">
                  Together, uncle and nephew built Meena Tour and Travels from a
                  shared vision — and today it stands as Delhi&apos;s most
                  trusted travel partner since 2011.
                </span>
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
                          Send your details directly on WhatsApp too:
                        </p>
                        {contactWhatsAppData && (
                          <div className="flex flex-col gap-2 mt-3 w-full">
                            <button
                              type="button"
                              onClick={() =>
                                openWhatsApp(
                                  "919990104748",
                                  contactWhatsAppData,
                                )
                              }
                              className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5e] text-white font-semibold rounded-lg px-4 py-2 text-sm transition-colors w-full"
                              data-ocid="contact.whatsapp_gaurav_button"
                            >
                              <svg
                                viewBox="0 0 24 24"
                                className="w-4 h-4 fill-white shrink-0"
                                aria-label="WhatsApp"
                                role="img"
                              >
                                <title>WhatsApp</title>
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                              </svg>
                              Gaurav (MD) on WhatsApp
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                openWhatsApp(
                                  "919868901253",
                                  contactWhatsAppData,
                                )
                              }
                              className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5e] text-white font-semibold rounded-lg px-4 py-2 text-sm transition-colors w-full"
                              data-ocid="contact.whatsapp_shyam_button"
                            >
                              <svg
                                viewBox="0 0 24 24"
                                className="w-4 h-4 fill-white shrink-0"
                                aria-label="WhatsApp"
                                role="img"
                              >
                                <title>WhatsApp</title>
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                              </svg>
                              Shyam Lal Ji (Corporate) on WhatsApp
                            </button>
                          </div>
                        )}
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
                        <p className="text-xs text-muted-foreground">
                          GAURAV (Managing Director)
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
                        <a
                          href="tel:+919868901253"
                          className="font-bold text-teal-700 text-base hover:text-teal-600 transition-colors block mt-2"
                        >
                          +91 9868901253
                        </a>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Shyam Lal Meena (Corporate)
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
                            Mon – Sat
                          </span>
                          <span className="font-medium">9:00 AM – 7:00 PM</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Sunday</span>
                          <span className="font-medium">
                            10:00 AM – 5:00 PM
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
                {/* Bank Transfer Details Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                >
                  <Card className="border-0 shadow-card overflow-hidden">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Landmark size={18} className="text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">
                            Bank Transfer Details
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            For bank transfer payments
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between gap-2">
                          <span className="text-muted-foreground font-medium">
                            Account Name
                          </span>
                          <span className="font-semibold text-foreground">
                            GAURAV
                          </span>
                        </div>
                        <div className="flex justify-between gap-2">
                          <span className="text-muted-foreground font-medium">
                            Account No
                          </span>
                          <span className="font-semibold text-foreground tracking-wide">
                            51112853125
                          </span>
                        </div>
                        <div className="flex justify-between gap-2">
                          <span className="text-muted-foreground font-medium">
                            Bank
                          </span>
                          <span className="font-semibold text-foreground">
                            State Bank of India
                          </span>
                        </div>
                        <div className="flex justify-between gap-2">
                          <span className="text-muted-foreground font-medium">
                            IFSC Code
                          </span>
                          <span className="font-semibold text-foreground tracking-wider">
                            SBIN0031580
                          </span>
                        </div>
                        <div className="flex justify-between gap-2">
                          <span className="text-muted-foreground font-medium">
                            Branch
                          </span>
                          <span className="font-semibold text-foreground text-right">
                            Mandir Marg, Saket
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* UPI Pay Now */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                >
                  <Card className="border-0 shadow-card overflow-hidden">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                          <svg
                            viewBox="0 0 40 40"
                            className="w-6 h-6"
                            aria-label="UPI"
                            role="img"
                          >
                            <title>UPI</title>
                            <circle cx="20" cy="20" r="20" fill="#097939" />
                            <text
                              x="20"
                              y="26"
                              textAnchor="middle"
                              fontSize="12"
                              fill="white"
                              fontFamily="Arial"
                              fontWeight="bold"
                            >
                              UPI
                            </text>
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">
                            Pay via UPI
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            GPay, PhonePe, Paytm — any UPI app
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-3">
                        <div className="bg-purple-50 rounded-lg px-4 py-3 text-center">
                          <p className="text-xs text-muted-foreground mb-0.5">
                            UPI ID
                          </p>
                          <p className="font-mono font-semibold text-sm text-foreground">
                            shyamlalmeena4151@ibl
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            SHYAM LAL MEENA
                          </p>
                        </div>
                        <a
                          href="upi://pay?pa=shyamlalmeena4151@ibl&pn=Shyam%20Lal%20Meena&cu=INR"
                          className="w-full flex items-center justify-center gap-2 bg-[#097939] hover:bg-[#076830] text-white font-semibold py-3 px-4 rounded-xl transition-colors shadow-sm"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            className="w-5 h-5 fill-white"
                            aria-hidden="true"
                          >
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
                          </svg>
                          Pay Now — Open UPI App
                        </a>
                        <p className="text-xs text-muted-foreground text-center">
                          Works with GPay, PhonePe, Paytm &amp; all UPI apps
                        </p>
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
                  Co-Founder & Managing Director:{" "}
                  <span className="text-white font-bold">GAURAV</span>
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
                      className="text-yellow-300 mt-0.5 flex-shrink-0"
                    />
                    <div>
                      <p className="text-white/50 text-xs mb-0.5">
                        Shyam Lal Meena (Corporate)
                      </p>
                      <a
                        href="tel:+919868901253"
                        className="text-white font-semibold hover:text-yellow-300 text-sm transition-colors"
                      >
                        +91 9868901253
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <Phone
                      size={14}
                      className="text-white/60 mt-0.5 flex-shrink-0"
                    />
                    <div>
                      <p className="text-white/50 text-xs mb-0.5">
                        GAURAV (Operations)
                      </p>
                      <a
                        href="tel:+919990104748"
                        className="text-white/80 hover:text-white text-sm transition-colors"
                      >
                        +91 9990104748
                      </a>
                    </div>
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
                    {["UPI", "Bank Transfer", "Cash"].map((pay) => (
                      <div
                        key={pay}
                        className="bg-white/10 rounded px-2 py-1 text-xs text-white/80 font-medium"
                      >
                        {pay}
                      </div>
                    ))}
                    <p className="text-white/50 text-xs mt-2">
                      Visa, MasterCard &amp; PayPal not accepted.
                    </p>
                  </div>
                  <div className="mt-5 pt-4 border-t border-white/15">
                    <p className="text-white/70 text-xs font-semibold mb-3 flex items-center gap-1.5">
                      <span>🏦</span> BANK TRANSFER DETAILS
                    </p>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                      <span className="text-white/50">Account Name</span>
                      <span className="text-white/80 font-medium">GAURAV</span>
                      <span className="text-white/50">Account No</span>
                      <span className="text-white/80 font-medium tracking-wide">
                        51112853125
                      </span>
                      <span className="text-white/50">Bank</span>
                      <span className="text-white/80 font-medium">
                        State Bank of India
                      </span>
                      <span className="text-white/50">IFSC Code</span>
                      <span className="text-white/80 font-medium tracking-wider">
                        SBIN0031580
                      </span>
                      <span className="text-white/50">Branch</span>
                      <span className="text-white/80 font-medium">
                        Mandir Marg, Saket
                      </span>
                    </div>
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

      {/* Floating Contact Widget */}
      <div className="fixed bottom-6 right-5 z-50 flex flex-col items-end gap-3">
        {/* WhatsApp sub-menu */}
        {whatsAppSubMenuOpen && (
          <div className="flex flex-col gap-2 items-end">
            <a
              href="https://wa.me/919990104748"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-white shadow-lg border border-[#25D366]/30 rounded-full px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-[#25D366]/10 transition-colors whitespace-nowrap"
              data-ocid="whatsapp.gaurav_link"
            >
              <svg
                viewBox="0 0 24 24"
                className="w-4 h-4 shrink-0"
                style={{ fill: "#25D366" }}
                aria-label="WhatsApp"
                role="img"
              >
                <title>WhatsApp</title>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Gaurav (MD)
            </a>
            <a
              href="https://wa.me/919868901253"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-white shadow-lg border border-[#25D366]/30 rounded-full px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-[#25D366]/10 transition-colors whitespace-nowrap"
              data-ocid="whatsapp.shyam_link"
            >
              <svg
                viewBox="0 0 24 24"
                className="w-4 h-4 shrink-0"
                style={{ fill: "#25D366" }}
                aria-label="WhatsApp"
                role="img"
              >
                <title>WhatsApp</title>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Shyam Lal Ji (Corporate)
            </a>
          </div>
        )}

        {/* Call sub-menu */}
        {callMenuOpen && (
          <div className="flex flex-col gap-2 items-end">
            <a
              href="tel:+919990104748"
              className="flex items-center gap-2 bg-white shadow-lg border border-amber-300/50 rounded-full px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-amber-50 transition-colors whitespace-nowrap"
              data-ocid="call.gaurav_link"
            >
              <svg
                viewBox="0 0 24 24"
                className="w-4 h-4 shrink-0 fill-none stroke-amber-500"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-label="Call"
                role="img"
              >
                <title>Call</title>
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.49 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.4 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16l.92.92z" />
              </svg>
              Gaurav — 9990104748
            </a>
            <a
              href="tel:+919868901253"
              className="flex items-center gap-2 bg-white shadow-lg border border-amber-300/50 rounded-full px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-amber-50 transition-colors whitespace-nowrap"
              data-ocid="call.shyam_link"
            >
              <svg
                viewBox="0 0 24 24"
                className="w-4 h-4 shrink-0 fill-none stroke-amber-500"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-label="Call"
                role="img"
              >
                <title>Call</title>
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.49 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.4 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16l.92.92z" />
              </svg>
              Shyam Lal Ji — 9868901253
            </a>
          </div>
        )}

        {/* Always-visible vertical icon bar: WhatsApp | Email | Call */}
        <div className="flex flex-col items-center gap-3">
          {/* WhatsApp */}
          <button
            type="button"
            onClick={() => {
              setWhatsAppSubMenuOpen((v) => !v);
              setCallMenuOpen(false);
            }}
            className="flex flex-col items-center gap-1 group cursor-pointer bg-transparent border-0 p-0"
            data-ocid="contact.whatsapp.button"
            aria-label="WhatsApp"
          >
            <div
              className="w-13 h-13 w-[52px] h-[52px] rounded-full shadow-xl flex items-center justify-center group-hover:scale-110 group-active:scale-95 transition-transform"
              style={{ background: "#25D366" }}
            >
              <svg
                viewBox="0 0 24 24"
                className="w-6 h-6 fill-white"
                aria-label="WhatsApp"
                role="img"
              >
                <title>WhatsApp</title>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </div>
            <span className="text-[10px] font-semibold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] leading-tight">
              WhatsApp
            </span>
          </button>

          {/* Email */}
          <a
            href="https://mail.google.com/mail/?view=cm&to=meenagaurav4748@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1 group"
            data-ocid="contact.email.button"
            aria-label="Send Email via Gmail"
          >
            <div className="w-[52px] h-[52px] rounded-full shadow-xl flex items-center justify-center bg-blue-600 group-hover:scale-110 group-active:scale-95 transition-transform">
              <svg
                viewBox="0 0 24 24"
                className="w-6 h-6 fill-none stroke-white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-label="Email"
                role="img"
              >
                <title>Email</title>
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </div>
            <span className="text-[10px] font-semibold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] leading-tight">
              Email
            </span>
          </a>

          {/* Call */}
          <button
            type="button"
            onClick={() => {
              setCallMenuOpen((v) => !v);
              setWhatsAppSubMenuOpen(false);
            }}
            className="flex flex-col items-center gap-1 group cursor-pointer bg-transparent border-0 p-0"
            data-ocid="contact.call.button"
            aria-label="Call Us"
          >
            <div className="w-[52px] h-[52px] rounded-full shadow-xl flex items-center justify-center bg-amber-500 group-hover:scale-110 group-active:scale-95 transition-transform">
              <svg
                viewBox="0 0 24 24"
                className="w-6 h-6 fill-none stroke-white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-label="Call"
                role="img"
              >
                <title>Call</title>
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.49 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.4 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16l.92.92z" />
              </svg>
            </div>
            <span className="text-[10px] font-semibold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] leading-tight">
              Call
            </span>
          </button>
        </div>
      </div>
    </>
  );
}
