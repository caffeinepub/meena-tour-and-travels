import { useEffect, useRef, useState } from "react";

type Message = {
  id: number;
  role: "bot" | "user";
  text: string;
  options?: string[];
  cards?: FleetCard[];
  destinations?: DestCard[];
  routeResult?: RouteResult;
};

type FleetCard = {
  name: string;
  models: string;
  rate: string;
  img: string;
};

type DestCard = {
  name: string;
  highlights: string;
  img: string;
};

type RouteResult = {
  from: string;
  to: string;
  km: number;
  time: string;
  highway: string;
  sedan: string;
  innova: string;
  suv: string;
};

type BookingStep =
  | "idle"
  | "name"
  | "phone"
  | "from"
  | "to"
  | "date"
  | "vehicle"
  | "confirm";

type BookingData = {
  name?: string;
  phone?: string;
  from?: string;
  to?: string;
  date?: string;
  vehicle?: string;
};

// Module-level booking state so it persists across renders
let bookingStep: BookingStep = "idle";
let bookingData: BookingData = {};

const FLEET: FleetCard[] = [
  {
    name: "Standard Sedan",
    models: "Swift Dzire, Hyundai Aura, Honda Amaze",
    rate: "₹18–22/km",
    img: "/assets/generated/sedan-fleet.dim_600x400.jpg",
  },
  {
    name: "Ertiga",
    models: "Maruti Ertiga 7-seater",
    rate: "₹18–22/km",
    img: "/assets/generated/ertiga-fleet.dim_600x400.jpg",
  },
  {
    name: "Innova Crysta",
    models: "Toyota Innova Crysta",
    rate: "₹28–35/km",
    img: "/assets/generated/innova-crysta-fleet.dim_600x400.jpg",
  },
  {
    name: "Premium SUV",
    models: "Force Gurkha, Tata Harrier, Mahindra XUV700",
    rate: "₹40–45/km",
    img: "/assets/generated/suv-fleet.dim_600x400.jpg",
  },
];

const DESTINATIONS: DestCard[] = [
  {
    name: "Manali",
    highlights: "Rohtang Pass, Solang Valley",
    img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80",
  },
  {
    name: "Jaipur",
    highlights: "Amber Fort, Hawa Mahal",
    img: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=400&q=80",
  },
  {
    name: "Agra",
    highlights: "Taj Mahal, Agra Fort",
    img: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400&q=80",
  },
  {
    name: "Haridwar",
    highlights: "Har Ki Pauri, Ganga Aarti",
    img: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&q=80",
  },
  {
    name: "Shimla",
    highlights: "Mall Road, Kufri",
    img: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=400&q=80",
  },
  {
    name: "Kashmir",
    highlights: "Dal Lake, Gulmarg",
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
  },
  {
    name: "Vaishno Devi",
    highlights: "Holy Shrine, Trikuta Mts",
    img: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&q=80",
  },
  {
    name: "Amritsar",
    highlights: "Golden Temple, Wagah Border",
    img: "https://images.unsplash.com/photo-1588416936097-41850ab3d86d?w=400&q=80",
  },
];

const ROUTES: Record<string, { km: number; time: string; highway: string }> = {
  "delhi-jaipur": { km: 280, time: "5 hrs", highway: "NH48" },
  "delhi-agra": { km: 230, time: "3.5 hrs", highway: "Yamuna Expressway" },
  "delhi-manali": { km: 570, time: "12 hrs", highway: "NH3/NH21" },
  "delhi-shimla": { km: 370, time: "7 hrs", highway: "NH44/NH5" },
  "delhi-haridwar": { km: 230, time: "4.5 hrs", highway: "NH58" },
  "delhi-rishikesh": { km: 250, time: "5 hrs", highway: "NH58" },
  "delhi-chandigarh": { km: 250, time: "4 hrs", highway: "NH44" },
  "delhi-amritsar": { km: 455, time: "8 hrs", highway: "NH44" },
  "delhi-kashmir": { km: 820, time: "14 hrs", highway: "NH44" },
  "delhi-vaishno devi": { km: 700, time: "12 hrs", highway: "NH44" },
  "delhi-udaipur": { km: 660, time: "11 hrs", highway: "NH48" },
  "delhi-jodhpur": { km: 610, time: "10 hrs", highway: "NH48/NH65" },
  "delhi-pushkar": { km: 400, time: "7 hrs", highway: "NH48" },
  "delhi-varanasi": { km: 820, time: "13 hrs", highway: "NH19" },
  "delhi-dehradun": { km: 290, time: "5.5 hrs", highway: "NH334" },
};

function getGreeting(): string {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return "Suprabhat! 🌅 Good Morning!";
  if (h >= 12 && h < 17) return "Namaskar! ☀️ Good Afternoon!";
  if (h >= 17 && h < 21) return "Shubh Sandhya! 🌆 Good Evening!";
  return "Namaskar! 🌙";
}

function calcFare(km: number): { sedan: string; innova: string; suv: string } {
  return {
    sedan: `₹${(km * 18).toLocaleString("en-IN")}–₹${(km * 22).toLocaleString("en-IN")}`,
    innova: `₹${(km * 28).toLocaleString("en-IN")}–₹${(km * 35).toLocaleString("en-IN")}`,
    suv: `₹${(km * 40).toLocaleString("en-IN")}–₹${(km * 45).toLocaleString("en-IN")}`,
  };
}

function findRoute(input: string): RouteResult | null {
  const lower = input.toLowerCase();
  for (const [key, val] of Object.entries(ROUTES)) {
    const parts = key.split("-");
    const dest = parts.slice(1).join(" ");
    if (lower.includes(dest) || lower.includes(key)) {
      const fare = calcFare(val.km);
      return {
        from: "Delhi",
        to: dest.charAt(0).toUpperCase() + dest.slice(1),
        km: val.km,
        time: val.time,
        highway: val.highway,
        sedan: fare.sedan,
        innova: fare.innova,
        suv: fare.suv,
      };
    }
  }
  return null;
}

function handleBookingStep(input: string): Message {
  const id = Date.now();

  if (bookingStep === "name") {
    bookingData.name = input;
    bookingStep = "phone";
    return {
      id,
      role: "bot",
      text: `Shukriya ${input} ji! 🙏\n\nAb aapka **phone number** batayein taaki Gaurav ji ya Shyam Lal ji trip se pehle confirm kar sakein:`,
    };
  }

  if (bookingStep === "phone") {
    bookingData.phone = input;
    bookingStep = "from";
    return {
      id,
      role: "bot",
      text: "Perfect! 📞\n\nAapko **kahan se** pickup chahiye? (Jaise: Delhi, Noida, Gurgaon...)",
    };
  }

  if (bookingStep === "from") {
    bookingData.from = input;
    bookingStep = "to";
    return {
      id,
      role: "bot",
      text: "Aur **kahan jaana hai**? (Destination city batayein 📍)",
    };
  }

  if (bookingStep === "to") {
    bookingData.to = input;
    bookingStep = "date";

    // Check if route known
    const routeKey = `delhi-${input.toLowerCase().trim()}`;
    const route = ROUTES[routeKey];
    let extra = "";
    if (route) {
      const fare = calcFare(route.km);
      extra = `\n\n📊 **Route Info:**\n📍 ~${route.km} km | ⏱ ${route.time} | 🛣 ${route.highway}\n🚗 Sedan: ${fare.sedan} | 🚙 Innova: ${fare.innova}`;
    }

    return {
      id,
      role: "bot",
      text: `Bahut achha! ${input} — ek popular destination hai hamare customers mein. 😊${extra}\n\n**Kab jaana chahte hain?** Travel date batayein (DD/MM/YYYY ya jaise "25 April"):`,
    };
  }

  if (bookingStep === "date") {
    bookingData.date = input;
    bookingStep = "vehicle";
    return {
      id,
      role: "bot",
      text: `${input} — note kar liya! 📅\n\nAb **gaadi ka type** chunein:`,
      options: [
        "🚗 Sedan (₹18–22/km)",
        "🚐 Ertiga 7-seater (₹22–28/km)",
        "🚙 Innova Crysta (₹28–35/km)",
        "🛻 Premium SUV (₹40–45/km)",
      ],
    };
  }

  if (bookingStep === "vehicle") {
    bookingData.vehicle = input.replace(/^[🚗🚐🚙🛻]\s*/u, "");
    bookingStep = "confirm";
    return {
      id,
      role: "bot",
      text: `Bahut badhiya choice! 👌\n\n📋 **Booking Summary:**\n👤 Name: ${bookingData.name}\n📞 Phone: ${bookingData.phone}\n📍 From: ${bookingData.from}\n📍 To: ${bookingData.to}\n📅 Date: ${bookingData.date}\n🚗 Vehicle: ${bookingData.vehicle}\n\nKya yeh sab sahi hai? Confirm karein toh hum Gaurav ji ko WhatsApp bhej denge! ✅`,
      options: ["✅ Haan, Confirm Karein", "✏️ Nahi, Badlaav Karna Hai"],
    };
  }

  if (bookingStep === "confirm") {
    if (/haan|confirm|yes|✅/.test(input.toLowerCase())) {
      const msg = `Namaskar ji 🙏%0A%0AMain ek taxi book karna chahta/chahti hun:%0A%0A👤 Name: ${encodeURIComponent(bookingData.name || "")}%0A📞 Phone: ${encodeURIComponent(bookingData.phone || "")}%0A📍 From: ${encodeURIComponent(bookingData.from || "")}%0A📍 To: ${encodeURIComponent(bookingData.to || "")}%0A📅 Date: ${encodeURIComponent(bookingData.date || "")}%0A🚗 Vehicle: ${encodeURIComponent(bookingData.vehicle || "")}%0A%0AKripya confirm karein. Shukriya!`;
      window.open(`https://wa.me/919990104748?text=${msg}`, "_blank");
      bookingStep = "idle";
      bookingData = {};
      return {
        id,
        role: "bot",
        text: "Shukriya! 🎉 WhatsApp khul raha hai — aapki booking details Gaurav ji ke paas pahunch jaayengi.\n\nWoh jald hi aapko call ya WhatsApp karenge trip confirm karne ke liye. Shubh Yatra! 🚗✨",
        options: ["Kuch aur poochhna hai", "Rates jaannein"],
      };
    }
    bookingStep = "name";
    bookingData = {};
    return {
      id,
      role: "bot",
      text: "Koi baat nahi! Chaliye dobara shuru karte hain. 😊\n\nPehle aapka **naam** batayein:",
    };
  }

  // Fallback
  bookingStep = "idle";
  return getBotReply(input);
}

function getBotReply(input: string): Message {
  const msg = input.toLowerCase().trim();
  const id = Date.now();

  // If in booking flow, handle it
  if (bookingStep !== "idle" && bookingStep !== "confirm") {
    return handleBookingStep(input);
  }
  if (bookingStep === "confirm") {
    return handleBookingStep(input);
  }

  // Greetings
  if (
    /^(hi|hello|helo|namaste|namaskar|hey|hii|hiii|good morning|good evening|good afternoon|suprabhat|shubh)/.test(
      msg,
    )
  ) {
    const greeting = getGreeting();
    return {
      id,
      role: "bot",
      text: `${greeting}\n\nMain **Sevak** hun — Meena Tour & Travels ka 24/7 assistant. 🙏\n\nKya aap koi trip plan kar rahe hain? Booking, rates, destinations — sab mein madad karunga. Bas batayein! 😊`,
      options: [
        "🚗 Vehicles dekhne hain",
        "💰 Rates jaanne hain",
        "🗺 Destinations/Tours",
        "📅 Booking karna hai",
        "❓ FAQ",
        "📞 Contact karein",
      ],
    };
  }

  // Booking start
  if (
    /book|booking|reserve|trip confirm|confirm karna|book karna|trip karna/.test(
      msg,
    )
  ) {
    bookingStep = "name";
    bookingData = {};
    return {
      id,
      role: "bot",
      text: "Bilkul! Aapki booking main khud manage karunga. 😊\n\nPehle aapka **naam** batayein ji:",
    };
  }

  // Route-specific fare query
  const routeResult = findRoute(msg);
  if (
    routeResult &&
    /rate|price|cost|kitna|fare|km|charges|estimate|kitne ka/.test(msg)
  ) {
    return {
      id,
      role: "bot",
      text: `Delhi → ${routeResult.to} ka estimated fare:`,
      routeResult,
      options: [
        "📅 Book This Trip",
        "🚗 Other Vehicles Dekhein",
        "🗺 More Routes",
      ],
    };
  }

  // General destination mention — show route if known
  if (routeResult) {
    return {
      id,
      role: "bot",
      text: `${routeResult.to} ek amazing destination hai! Yahan hai route info:`,
      routeResult,
      options: ["📅 Book Karna Hai", "💰 Rates Jaannein", "🗺 Aur Destinations"],
    };
  }

  // Fleet/vehicles
  if (
    /fleet|gaadi|vehicle|car|cab|taxi|sedan|innova|ertiga|suv|crysta|gadi/.test(
      msg,
    )
  ) {
    return {
      id,
      role: "bot",
      text: "Meena Tour & Travels ki available fleet — sab company-owned, brand new gaadiyaan: 🚗",
      cards: FLEET,
      options: ["📅 Book Karna Hai", "💰 Rates Poochhna Hai"],
    };
  }

  // Rates
  if (/rate|price|cost|kitna|charges|fare|per km|km rate|kitne ka/.test(msg)) {
    return {
      id,
      role: "bot",
      text: "Hamare standard per-km rates ji:\n\n🚗 **Sedan** (Dzire, Aura, Amaze): ₹18–22/km\n🚐 **Ertiga** (7-seater): ₹22–28/km\n🚙 **Innova Crysta**: ₹28–35/km\n🛻 **Premium SUV**: ₹40–45/km\n\n⚠️ State taxes, tolls, aur driver night charges (₹300/night) actuals ke hisaab se extra hain.\n\nKisi specific route ka estimate chahiye? Origin → Destination batayein.",
      options: [
        "Delhi to Jaipur rate?",
        "Delhi to Manali rate?",
        "Delhi to Agra rate?",
        "📅 Book Karna Hai",
      ],
    };
  }

  // WhatsApp actions
  if (/whatsapp gaurav/.test(msg)) {
    window.open(
      "https://wa.me/919990104748?text=Hello%2C%20I%20want%20to%20book%20a%20taxi%20with%20Meena%20Tour%20and%20Travels.",
      "_blank",
    );
    return {
      id,
      role: "bot",
      text: "WhatsApp khul raha hai — Gaurav ji (9990104748) se seedha baat karein. 👍",
      options: ["Kuch aur poochhna hai"],
    };
  }
  if (/whatsapp shyam/.test(msg)) {
    window.open(
      "https://wa.me/919868901253?text=Hello%2C%20I%20want%20to%20book%20a%20taxi%20with%20Meena%20Tour%20and%20Travels.",
      "_blank",
    );
    return {
      id,
      role: "bot",
      text: "WhatsApp khul raha hai — Shyam Lal ji (9868901253) se seedha baat karein. 👍",
      options: ["Kuch aur poochhna hai"],
    };
  }

  // Destinations
  if (
    /destination|tour|package|trips|popular place|india tour|ghumna|yatra/.test(
      msg,
    )
  ) {
    return {
      id,
      role: "bot",
      text: "Yeh hain hamare popular destinations! Kisi pe click karein aur booking shuru karte hain: 🗺",
      destinations: DESTINATIONS,
      options: ["📅 Booking Karna Hai", "💰 Rates Jaannein"],
    };
  }

  // Contact
  if (
    /contact|number|phone|call|helpline|reach|address|office|location/.test(msg)
  ) {
    return {
      id,
      role: "bot",
      text: "**Meena Tour & Travels — Contact:**\n\n📞 Gaurav ji (MD): **9990104748**\n📞 Shyam Lal ji (Corporate): **9868901253**\n📧 meenagaurav4748@gmail.com\n\n📍 C-41, UGF, Khirki Ext, Panchsheel Vihar, Malviya Nagar, New Delhi – 110017\n\n🕐 Mon–Sat: 9AM–7PM | Sunday: 10AM–5PM",
      options: ["WhatsApp Gaurav ji", "WhatsApp Shyam Lal ji"],
    };
  }

  // Payment
  if (/pay|payment|upi|bank|transfer|advance|deposit|paise/.test(msg)) {
    return {
      id,
      role: "bot",
      text: "**Payment Options ji:**\n\n📲 **UPI:** shyamlalmeena4151@ibl (GPay, PhonePe, Paytm)\n🏦 **Bank Transfer:** A/C: 51112853125 | SBI | IFSC: SBIN0031580 | Branch: Mandir Marg, Saket (Name: GAURAV)\n💵 **Cash:** Pickup pe de sakte hain\n\nBooking confirm karne ke liye advance zaruri hai.",
      options: ["📅 Book Karna Hai", "📞 Contact Karein"],
    };
  }

  // Toll
  if (/toll/.test(msg)) {
    return {
      id,
      role: "bot",
      text: "Toll tax alag se charge hota hai ji — actual charges ke hisaab se. Hamare per-km rates mein toll included nahi hai. Trip ke baad actual toll ka bill provide kiya jaata hai.",
      options: ["Kuch aur poochhna hai", "📅 Booking Karna Hai"],
    };
  }

  // Night charges
  if (/night/.test(msg)) {
    return {
      id,
      role: "bot",
      text: "Driver ke liye night charges **₹300 per night** hain ji. Yeh actual ke hisaab se final bill mein add hote hain.",
      options: ["Kuch aur poochhna hai", "📅 Booking Karna Hai"],
    };
  }

  // KM limit
  if (/km limit|kms limit|minimum km/.test(msg)) {
    return {
      id,
      role: "bot",
      text: "Outstation trips mein minimum **250–300 km per day** hota hai ji. Isse zyada km pe per-km rate lagta hai — bilkul transparent billing.",
      options: ["Kuch aur poochhna hai", "📅 Booking Karna Hai"],
    };
  }

  // Driver details
  if (/driver|driver detail|cab detail/.test(msg)) {
    return {
      id,
      role: "bot",
      text: "Trip se **ek din pehle** aapko WhatsApp pe driver ka naam, phone number, aur gaadi ka number automatically bhej diya jaata hai. 📱\n\nHamare saare drivers **10–15+ saal** ke experienced professionals hain.",
      options: ["📅 Booking Karna Hai", "Kuch aur poochhna hai"],
    };
  }

  // Cancellation
  if (/cancel/.test(msg)) {
    return {
      id,
      role: "bot",
      text: "Cancellation ke liye seedha Gaurav ji ya Shyam Lal ji se baat karein ji:\n📞 9990104748 (Gaurav) | 9868901253 (Shyam Lal ji)",
      options: ["WhatsApp Gaurav ji", "WhatsApp Shyam Lal ji"],
    };
  }

  // FAQ menu
  if (/faq|common question|kya hai/.test(msg)) {
    return {
      id,
      role: "bot",
      text: "Yeh hain common sawaal ji — koi bhi chunein:",
      options: [
        "KMs limit kya hai?",
        "Toll tax included hai ya extra?",
        "Night charges kya hain?",
        "Driver details kab milegi?",
        "Payment kaise karein?",
        "Cancellation policy?",
      ],
    };
  }

  // About company
  if (
    /meena tour|company|about|kaun|who|business|since|founded|history|gstin/.test(
      msg,
    )
  ) {
    return {
      id,
      role: "bot",
      text: "**Meena Tour & Travels** — Delhi ki trusted travel agency, 2011 se service de rahi hai. 🙏\n\n✅ GSTIN Registered: 07BQXPG8115J1ZB\n✅ All India Tourist Permit\n✅ 15,000+ satisfied passengers\n✅ 1000+ destinations covered\n✅ Reliance Industries — 8 saal se client\n✅ Mangal Singh Lodha ji — 7 saal se client\n\nCo-founders: **GAURAV** (MD) & **Shyam Lal Meena** (Director, Corporate Relations)",
      options: ["🚗 Fleet Dekhein", "💰 Rates Jaannein", "📞 Contact Karein"],
    };
  }

  // Default
  return {
    id,
    role: "bot",
    text: "Samajh gaya ji! Neeche se koi option chunein ya apna sawaal seedha likhein — main haazir hun. 😊\n\nYa direct baat karein:\n📞 Gaurav ji: 9990104748 | 📞 Shyam Lal ji: 9868901253",
    options: [
      "🚗 Vehicles Dekhein",
      "💰 Rates Jaannein",
      "🗺 Destinations",
      "📅 Booking Karna Hai",
      "❓ FAQ",
      "📞 Contact Karein",
    ],
  };
}

export function SevakChatbot() {
  const greeting = getGreeting();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: "bot",
      text: `${greeting}\n\nMain **Sevak** hun — Meena Tour & Travels ka 24/7 assistant. 🙏\n\nKya aap koi trip plan kar rahe hain? Booking, rates, destinations — sab mein madad karunga. Bas batayein! 😊`,
      options: [
        "🚗 Vehicles Dekhein",
        "💰 Rates Jaannein",
        "🗺 Destinations/Tours",
        "📅 Booking Karna Hai",
        "❓ FAQ",
        "📞 Contact Karein",
      ],
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [unread, setUnread] = useState(1);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setUnread(0);
      setTimeout(
        () => bottomRef.current?.scrollIntoView({ behavior: "smooth" }),
        100,
      );
    }
  }, [open]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: open intentionally excluded to only fire on message count change
  useEffect(() => {
    if (!open && messages.length > 1) {
      setUnread((prev) => prev + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages.length]);

  function sendMessage(text: string) {
    const userMsg: Message = { id: Date.now(), role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);
    setTimeout(
      () => {
        const reply = getBotReply(text);
        setMessages((prev) => [...prev, reply]);
        setTyping(false);
        setTimeout(
          () => bottomRef.current?.scrollIntoView({ behavior: "smooth" }),
          100,
        );
      },
      600 + Math.random() * 400,
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (input.trim()) sendMessage(input.trim());
  }

  function renderText(text: string) {
    return text.split("\n").map((line, i, arr) => {
      const parts = line.split(/(\*\*[^*]+\*\*)/);
      return (
        // biome-ignore lint/suspicious/noArrayIndexKey: static text rendering
        <span key={i}>
          {parts.map((part, j) =>
            part.startsWith("**") && part.endsWith("**") ? (
              // biome-ignore lint/suspicious/noArrayIndexKey: static text rendering
              <strong key={j}>{part.slice(2, -2)}</strong>
            ) : (
              // biome-ignore lint/suspicious/noArrayIndexKey: static text rendering
              <span key={j}>{part}</span>
            ),
          )}
          {i < arr.length - 1 && <br />}
        </span>
      );
    });
  }

  return (
    <>
      {/* Sevak toggle button — bottom LEFT so it doesn't overlap floating right bar */}
      <button
        type="button"
        data-ocid="sevak.open_modal_button"
        onClick={() => {
          setOpen((v) => !v);
          setUnread(0);
        }}
        className="fixed bottom-6 left-5 z-[60] w-14 h-14 rounded-full shadow-2xl flex items-center justify-center bg-gradient-to-br from-orange-500 to-amber-600 hover:scale-110 active:scale-95 transition-transform border-2 border-white"
        aria-label="Sevak Chatbot"
      >
        {!open ? (
          <span
            className="text-2xl leading-none select-none"
            role="img"
            aria-label="robot"
          >
            🤖
          </span>
        ) : (
          <svg
            viewBox="0 0 24 24"
            className="w-6 h-6 fill-white"
            aria-hidden="true"
          >
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        )}
        {!open && unread > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {/* Sevak label */}
      {!open && (
        <span className="fixed bottom-8 left-[72px] z-[60] bg-gray-900/85 text-white text-xs px-2.5 py-1 rounded-lg pointer-events-none select-none backdrop-blur-sm">
          Sevak 🤖
        </span>
      )}

      {/* Chat window */}
      {open && (
        <div
          data-ocid="sevak.dialog"
          className="fixed bottom-24 left-5 z-[60] w-[340px] max-w-[calc(100vw-24px)] bg-white rounded-2xl shadow-2xl border border-orange-200 flex flex-col"
          style={{ maxHeight: "540px" }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-t-2xl px-4 py-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 text-xl">
              🤖
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white font-bold text-sm leading-tight">
                Sevak
              </div>
              <div className="text-white/80 text-[11px]">
                Meena Tour & Travels Assistant
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-300 animate-pulse" />
              <span className="text-white/90 text-[11px]">Online 24/7</span>
            </div>
          </div>

          {/* Messages */}
          <div
            className="flex-1 overflow-y-auto p-3 space-y-3"
            style={{ minHeight: 0, maxHeight: "360px" }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[88%] ${
                    msg.role === "user"
                      ? "bg-orange-500 text-white rounded-2xl rounded-br-sm px-3 py-2 text-sm"
                      : "bg-gray-100 text-gray-800 rounded-2xl rounded-bl-sm px-3 py-2 text-sm"
                  }`}
                >
                  {renderText(msg.text)}

                  {/* Route result card */}
                  {msg.routeResult && (
                    <div className="mt-2 bg-white rounded-xl border border-orange-200 p-3 shadow-sm text-gray-800">
                      <div className="font-bold text-sm text-orange-600 mb-1">
                        {msg.routeResult.from} → {msg.routeResult.to}
                      </div>
                      <div className="text-[11px] text-gray-600 space-y-0.5">
                        <div>📍 Distance: ~{msg.routeResult.km} km</div>
                        <div>⏱ Travel Time: ~{msg.routeResult.time}</div>
                        <div>🛣 Highway: {msg.routeResult.highway}</div>
                      </div>
                      <div className="mt-2 pt-2 border-t border-orange-100 space-y-0.5">
                        <div className="text-[11px]">
                          🚗 <strong>Sedan/Ertiga:</strong>{" "}
                          {msg.routeResult.sedan}
                        </div>
                        <div className="text-[11px]">
                          🚙 <strong>Innova:</strong> {msg.routeResult.innova}
                        </div>
                        <div className="text-[11px]">
                          🛻 <strong>Premium SUV:</strong> {msg.routeResult.suv}
                        </div>
                      </div>
                      <div className="text-[9px] text-gray-400 mt-1">
                        *Toll & night charges extra as per actuals
                      </div>
                    </div>
                  )}

                  {/* Fleet cards */}
                  {msg.cards && (
                    <div className="mt-2 space-y-2">
                      {msg.cards.map((c) => (
                        <div
                          key={c.name}
                          className="bg-white rounded-xl border border-orange-100 overflow-hidden flex gap-2 shadow-sm"
                        >
                          <img
                            src={c.img}
                            alt={c.name}
                            className="w-16 h-14 object-cover flex-shrink-0"
                            onError={(e) => {
                              (
                                e.currentTarget as HTMLImageElement
                              ).style.display = "none";
                            }}
                          />
                          <div className="p-2 min-w-0">
                            <div className="font-semibold text-gray-800 text-xs">
                              {c.name}
                            </div>
                            <div className="text-[10px] text-gray-500 truncate">
                              {c.models}
                            </div>
                            <div className="text-orange-600 font-bold text-xs mt-0.5">
                              {c.rate}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Destination cards */}
                  {msg.destinations && (
                    <div className="mt-2 grid grid-cols-2 gap-1.5">
                      {msg.destinations.map((d) => (
                        <button
                          key={d.name}
                          type="button"
                          onClick={() =>
                            sendMessage(`${d.name} trip book karna hai`)
                          }
                          className="bg-white rounded-lg border border-orange-100 overflow-hidden shadow-sm text-left hover:border-orange-300 transition-colors"
                        >
                          <img
                            src={d.img}
                            alt={d.name}
                            className="w-full h-16 object-cover"
                            onError={(e) => {
                              (
                                e.currentTarget as HTMLImageElement
                              ).style.display = "none";
                            }}
                          />
                          <div className="p-1.5">
                            <div className="font-semibold text-gray-800 text-[10px]">
                              {d.name}
                            </div>
                            <div className="text-[9px] text-gray-500 leading-tight">
                              {d.highlights}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Quick options */}
                  {msg.options && msg.role === "bot" && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {msg.options.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => sendMessage(opt)}
                          className="text-[11px] bg-orange-50 border border-orange-200 text-orange-700 rounded-full px-2.5 py-0.5 hover:bg-orange-100 active:scale-95 transition-all"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-3 py-2">
                  <span className="flex gap-1 items-center">
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="border-t border-gray-100 p-2 flex gap-2"
          >
            <input
              data-ocid="sevak.input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Apna sawaal likhein..."
              className="flex-1 text-sm border border-gray-200 rounded-full px-3 py-1.5 outline-none focus:border-orange-400 bg-gray-50"
            />
            <button
              data-ocid="sevak.submit_button"
              type="submit"
              disabled={!input.trim()}
              className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0 disabled:opacity-40 hover:bg-orange-600 transition-colors"
            >
              <svg
                viewBox="0 0 24 24"
                className="w-4 h-4 fill-white"
                aria-hidden="true"
              >
                <path d="M2 21l21-9L2 3v7l15 2-15 2z" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
