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
  ertiga: string;
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

type SessionCtx = {
  lastDestination?: string;
  lastVehicle?: string;
  lastRoute?: RouteResult;
  userName?: string;
  angryCount: number;
  pendingRoute?: string; // incomplete route query - origin given but no dest
};

type Intent =
  | "GREETING"
  | "PRICE_QUERY"
  | "ROUTE_QUERY"
  | "BOOKING_INTENT"
  | "FLEET_QUERY"
  | "DESTINATION_QUERY"
  | "FAQ_TOLL"
  | "FAQ_NIGHT"
  | "FAQ_KM_LIMIT"
  | "FAQ_DRIVER"
  | "FAQ_CANCEL"
  | "PAYMENT"
  | "CONTACT"
  | "ABOUT_COMPANY"
  | "ANGRY"
  | "DISCOUNT_REQUEST"
  | "ITINERARY"
  | "WEATHER"
  | "WHATSAPP_GAURAV"
  | "WHATSAPP_SHYAM"
  | "FAQ_GENERAL"
  | "GENERIC_HELP";

let bookingStep: BookingStep = "idle";
let bookingData: BookingData = {};
let sessionCtx: SessionCtx = { angryCount: 0 };
let phoneRetryCount = 0;

// ─── Data Constants ───────────────────────────────────────────────────────────

const FLEET: FleetCard[] = [
  {
    name: "Standard Sedan",
    models: "Swift Dzire, Hyundai Aura, Honda Amaze",
    rate: "₹18–22/km",
    img: "/assets/generated/sedan-fleet.dim_600x400.jpg",
  },
  {
    name: "Ertiga 7-Seater",
    models: "Maruti Ertiga",
    rate: "₹22–28/km",
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
  {
    name: "Udaipur",
    highlights: "City Palace, Lake Pichola",
    img: "https://images.unsplash.com/photo-1586612438957-c08efca71cf1?w=400&q=80",
  },
  {
    name: "Jodhpur",
    highlights: "Mehrangarh Fort, Blue City",
    img: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=400&q=80",
  },
  {
    name: "Varanasi",
    highlights: "Ghats, Kashi Vishwanath",
    img: "https://images.unsplash.com/photo-1561361058-c24cecae35ca?w=400&q=80",
  },
  {
    name: "Rishikesh",
    highlights: "Yoga Capital, Rafting",
    img: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&q=80",
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
  "delhi-nainital": { km: 320, time: "6 hrs", highway: "NH9" },
  "delhi-mussoorie": { km: 300, time: "6 hrs", highway: "NH334" },
  "delhi-vrindavan": { km: 160, time: "3 hrs", highway: "NH19" },
  "delhi-mathura": { km: 160, time: "3 hrs", highway: "NH19" },
  "delhi-ayodhya": { km: 700, time: "12 hrs", highway: "NH27" },
  "delhi-goa": { km: 1920, time: "32 hrs", highway: "NH48/NH66" },
  "delhi-bikaner": { km: 480, time: "8 hrs", highway: "NH11" },
  "delhi-jaisalmer": { km: 770, time: "13 hrs", highway: "NH11/NH62" },
  "delhi-ranthambore": { km: 400, time: "7 hrs", highway: "NH48/NH52" },
  "delhi-kota": { km: 480, time: "8 hrs", highway: "NH52" },
  "delhi-ajmer": { km: 390, time: "7 hrs", highway: "NH48" },
};

// ─── Utility helpers ──────────────────────────────────────────────────────────

/** Pick a random element from an array — makes responses feel non-robotic */
function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Address user warmly if name is known */
function nameJi(): string {
  return sessionCtx.userName ? ` ${sessionCtx.userName} ji` : " ji";
}

function getGreeting(): string {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return "Suprabhat! 🌅 Good Morning!";
  if (h >= 12 && h < 17) return "Namaskar! ☀️ Good Afternoon!";
  if (h >= 17 && h < 21) return "Shubh Sandhya! 🌆 Good Evening!";
  return "Namaskar! 🌙";
}

function calcFare(km: number): {
  sedan: string;
  ertiga: string;
  innova: string;
  suv: string;
} {
  return {
    sedan: `₹${(km * 18).toLocaleString("en-IN")}–₹${(km * 22).toLocaleString("en-IN")}`,
    ertiga: `₹${(km * 22).toLocaleString("en-IN")}–₹${(km * 28).toLocaleString("en-IN")}`,
    innova: `₹${(km * 28).toLocaleString("en-IN")}–₹${(km * 35).toLocaleString("en-IN")}`,
    suv: `₹${(km * 40).toLocaleString("en-IN")}–₹${(km * 45).toLocaleString("en-IN")}`,
  };
}

function findRoute(input: string): RouteResult | null {
  const lower = input.toLowerCase();
  for (const [key, val] of Object.entries(ROUTES)) {
    const dest = key.split("-").slice(1).join(" ");
    if (lower.includes(dest) || lower.includes(key)) {
      const fare = calcFare(val.km);
      return {
        from: "Delhi",
        to: dest
          .split(" ")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" "),
        km: val.km,
        time: val.time,
        highway: val.highway,
        sedan: fare.sedan,
        ertiga: fare.ertiga,
        innova: fare.innova,
        suv: fare.suv,
      };
    }
  }
  return null;
}

/**
 * Extract any known destination name mentioned in input.
 * Used to update session context.
 */
function extractDestination(input: string): string | null {
  const lower = input.toLowerCase();
  const knownDests = [
    "manali",
    "jaipur",
    "agra",
    "haridwar",
    "shimla",
    "kashmir",
    "vaishno devi",
    "amritsar",
    "udaipur",
    "jodhpur",
    "varanasi",
    "rishikesh",
    "pushkar",
    "dehradun",
    "nainital",
    "mussoorie",
    "vrindavan",
    "mathura",
    "ayodhya",
    "goa",
    "bikaner",
    "jaisalmer",
    "ranthambore",
    "kota",
    "ajmer",
    "chandigarh",
  ];
  for (const dest of knownDests) {
    if (lower.includes(dest)) {
      return dest
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
    }
  }
  return null;
}

/**
 * Smart extraction: pulls out a 10-digit Indian mobile number from any text.
 */
function extractPhoneNumber(input: string): string | null {
  const cleaned = input.replace(/[\s\-().]/g, "");
  const withPrefix = cleaned.match(/(?:\+91|91)([6-9]\d{9})(?!\d)/);
  if (withPrefix) return withPrefix[1];
  const standalone = cleaned.match(/(?<!\d)([6-9]\d{9})(?!\d)/);
  if (standalone) return standalone[1];
  return null;
}

// ─── Intent Classification ────────────────────────────────────────────────────

/**
 * Classify one or more intents from raw user input.
 * Returns a prioritised list — first intent is primary.
 */
function classifyIntents(input: string): Intent[] {
  const msg = input.toLowerCase().trim();
  const intents: Intent[] = [];

  // Angry / complaint — check first as it overrides tone
  if (
    /bakwaas|bekar|bura|ganda|fraud|cheat|thug|ghatiya|complaint|issue|late|delay|kharab|worst|bad service|angry|frustrated|terrible|horrible|useless|stupid|bewakoof|cheated/.test(
      msg,
    )
  ) {
    intents.push("ANGRY");
  }

  // Discount bargaining
  if (
    /discount|kam karo|kam kar do|thoda kam|reduce|negotiat|bargain|cheap|sasta|price cut|offer|deal|less rate|less price|zyada lag raha|mehnga|mahnga|afford|budget|concession|concess/.test(
      msg,
    )
  ) {
    intents.push("DISCOUNT_REQUEST");
  }

  // Greeting
  if (
    /^(hi|hello|helo|namaste|namaskar|hey|hii|good morning|good evening|good afternoon|good night|suprabhat|shubh|jai shri krishna|ram ram|salaam|assalam|pranam|namaskar|vandana)/.test(
      msg,
    ) &&
    intents.length === 0
  ) {
    intents.push("GREETING");
  }

  // WhatsApp quick actions
  if (/whatsapp gaurav/.test(msg)) intents.push("WHATSAPP_GAURAV");
  if (/whatsapp shyam/.test(msg)) intents.push("WHATSAPP_SHYAM");

  // FAQ intents
  if (
    /\btoll\b|toll tax|toll included|toll extra|toll charge|dhaba toll/.test(
      msg,
    )
  )
    intents.push("FAQ_TOLL");
  if (
    /night charge|raat charge|night allowance|raat ko|driver night|overnight/.test(
      msg,
    )
  )
    intents.push("FAQ_NIGHT");
  if (/km limit|kms limit|minimum km|km minimum|zyada km|km cap/.test(msg))
    intents.push("FAQ_KM_LIMIT");
  if (
    /driver detail|driver name|driver number|cab detail|gaadi number|kaun driver|driver kaun|driver experience|driver ka/.test(
      msg,
    )
  )
    intents.push("FAQ_DRIVER");
  if (/cancel|cancellation|booking cancel|trip cancel|refund/.test(msg))
    intents.push("FAQ_CANCEL");
  if (/faq|common question|help|kya poochhna|sawaal/.test(msg))
    intents.push("FAQ_GENERAL");

  // Payment
  if (
    /pay|payment|upi|bank|transfer|advance|deposit|paise|rupee|phonepay|paytm|gpay|google pay/.test(
      msg,
    )
  )
    intents.push("PAYMENT");

  // Contact
  if (
    /contact|phone number|call|helpline|reach|address|office|location|milna|kahan hai|number do/.test(
      msg,
    )
  )
    intents.push("CONTACT");

  // About company
  if (
    /meena tour|company|about us|kaun hai|who are you|business|since|founded|history|gstin|trust|kitne saal/.test(
      msg,
    )
  )
    intents.push("ABOUT_COMPANY");

  // Fleet
  if (
    /fleet|gaadi|vehicle|car|cab|taxi|sedan|innova|ertiga|suv|crysta|gadi|kitni gaadi|cars available|which car|konsi gaadi/.test(
      msg,
    )
  )
    intents.push("FLEET_QUERY");

  // Booking
  if (
    /book|booking|reserve|trip confirm|book karna|trip karna|cab chahiye|gaadi chahiye|taxi chahiye|cab book|trip book|mujhe jaana|jaana chahta|jaana chahti/.test(
      msg,
    )
  )
    intents.push("BOOKING_INTENT");

  // Destinations
  if (
    /destination|tour|package|trips|popular place|india tour|ghumna|yatra|places|kahan jaun|tourist|sightseeing/.test(
      msg,
    )
  )
    intents.push("DESTINATION_QUERY");

  // Itinerary
  if (
    /itinerary|plan|planning|day by day|day plan|schedule|agenda|kaise jaayein|route plan|trip plan|days mein/.test(
      msg,
    )
  )
    intents.push("ITINERARY");

  // Weather
  if (/weather|mausam|barish|rain|temperature|garmi|sardi|snow|baraf/.test(msg))
    intents.push("WEATHER");

  // Price / rate query — check for route first
  const routeResult = findRoute(msg);
  if (routeResult) {
    if (
      /rate|price|cost|kitna|fare|charges|estimate|kitne ka|kharcha|paisa|rupaye/.test(
        msg,
      )
    ) {
      intents.push("PRICE_QUERY");
    } else {
      intents.push("ROUTE_QUERY");
    }
  } else if (
    /rate|price|cost|kitna|fare|charges|estimate|kitne ka|kharcha|paisa|rupaye|per km|km rate/.test(
      msg,
    )
  ) {
    intents.push("PRICE_QUERY");
  }

  if (intents.length === 0) intents.push("GENERIC_HELP");
  return intents;
}

/**
 * Validates that input looks like a real Indian city/place name.
 * Returns true if it looks valid, false if it looks like random chars/numbers.
 */
function isValidLocation(input: string): boolean {
  const trimmed = input.trim();
  if (trimmed.length < 3) return false;
  // Must contain at least one letter
  if (!/[a-zA-Zऀ-ॿ]/.test(trimmed)) return false;
  // Must NOT be purely numeric
  if (/^[\d\s\-+().]+$/.test(trimmed)) return false;
  // Must NOT be purely symbols/punctuation
  if (/^[^a-zA-Zऀ-ॿ]+$/.test(trimmed)) return false;
  return true;
}

const KNOWN_CITIES = new Set([
  "delhi",
  "new delhi",
  "noida",
  "gurgaon",
  "gurugram",
  "faridabad",
  "ghaziabad",
  "jaipur",
  "agra",
  "manali",
  "shimla",
  "haridwar",
  "rishikesh",
  "chandigarh",
  "amritsar",
  "kashmir",
  "srinagar",
  "vaishno devi",
  "katra",
  "udaipur",
  "jodhpur",
  "jaisalmer",
  "bikaner",
  "pushkar",
  "ajmer",
  "kota",
  "ranthambore",
  "sawai madhopur",
  "varanasi",
  "kashi",
  "ayodhya",
  "vrindavan",
  "mathura",
  "dehradun",
  "mussoorie",
  "nainital",
  "goa",
  "panaji",
  "lucknow",
  "kanpur",
  "allahabad",
  "prayagraj",
  "patna",
  "bodh gaya",
  "kolkata",
  "mumbai",
  "pune",
  "nagpur",
  "hyderabad",
  "bangalore",
  "bengaluru",
  "chennai",
  "ahmedabad",
  "surat",
  "indore",
  "bhopal",
]);

/**
 * Checks if input is a known city — for soft confirmation.
 */
function isKnownCity(input: string): boolean {
  return KNOWN_CITIES.has(input.toLowerCase().trim());
}

// ─── Booking Step Handler ────────────────────────────────────────────────────

function handleBookingStep(input: string): Message {
  const id = Date.now();

  if (bookingStep === "name") {
    const trimmed = input.trim();
    if (trimmed.length < 2) {
      return {
        id,
        role: "bot",
        text: pick([
          "Kripya apna **poora naam** batayein ji (kam se kam 2 akshar). 🙏",
          "Zaroor ji, lekin ek baar apna poora naam theek se likhein — tabhi booking aage badh payegi! 😊",
        ]),
      };
    }
    bookingData.name = trimmed;
    sessionCtx.userName = trimmed.split(" ")[0];
    phoneRetryCount = 0;
    bookingStep = "phone";
    return {
      id,
      role: "bot",
      text: pick([
        `Shukriya **${trimmed} ji**! 🙏\n\nAb aapka **10 ankon ka mobile number** batayein taaki Gaurav ji aapse trip confirm kar sakein:`,
        `Waah! **${trimmed} ji**, achha naam hai. 😊\n\nAbhi mujhe aapka **mobile number** chahiye — 10 digits ka — taaki team aapse baat kar sake:`,
        `**${trimmed} ji** — perfect! 👍\n\nAb apna **10-digit phone number** type karein:`,
      ]),
    };
  }

  if (bookingStep === "phone") {
    const extracted = extractPhoneNumber(input);

    if (extracted) {
      bookingData.phone = extracted;
      phoneRetryCount = 0;
      bookingStep = "from";
      return {
        id,
        role: "bot",
        text: pick([
          `Perfect! 📞 Number note kar liya: **${extracted}**\n\nAb batayein — **kahan se** pickup chahiye? (Jaise: Delhi, Noida, Gurgaon...)`,
          `Shukriya! **${extracted}** — saved. 📱\n\nPickup location kya hogi? Matlab **kahan se** chalenge?`,
          `Got it! Number ${extracted} note kar liya. 👌\n\nAb **pickup point** batayein — kahan se nikalna hai?`,
        ]),
      };
    }

    phoneRetryCount += 1;

    if (phoneRetryCount >= 2) {
      phoneRetryCount = 0;
      bookingStep = "idle";
      bookingData = {};
      return {
        id,
        role: "bot",
        text: `Koi baat nahi${nameJi()}, hum samajhte hain. 🙏\n\nAapki booking ke liye seedha hamare team se baat karein — woh personally sab handle karenge:\n\n📞 **Gaurav ji (MD):** 9990104748\n📞 **Shyam Lal ji (Corporate):** 9868901253\n\nShubh Yatra! 🚗✨`,
        options: ["WhatsApp Gaurav ji", "WhatsApp Shyam Lal ji"],
      };
    }

    return {
      id,
      role: "bot",
      text: pick([
        "Ek chota sa issue hai ji — phone number mein sirf **numbers (digits)** hone chahiye, koi letters ya special characters nahi. Jaise: **9876543210** (10 digits). Dobara try karein! 😊",
        "Maaf karna ji! 🙏 Aapne jo type kiya woh 10-digit phone number nahi hai. Kripya **sirf numbers** likhein — jaise **9876543210**. No spaces, no dashes.",
      ]),
    };
  }

  if (bookingStep === "from") {
    if (!isValidLocation(input)) {
      return {
        id,
        role: "bot",
        text: "Yeh valid location nahi lagti ji. 🙏 Kripya apna **pickup shahar** batayein — jaise Delhi, Noida, Gurgaon, Faridabad, etc.",
      };
    }
    const fromCity = input.trim();
    bookingData.from = fromCity;
    const fromConfirm = isKnownCity(fromCity)
      ? `**${fromCity}** — theek hai! Note kar liya. ✅`
      : `**${fromCity}** — note kar liya! ✅`;
    bookingStep = "to";
    return {
      id,
      role: "bot",
      text: pick([
        `${fromConfirm}\n\nAur **destination kahan** hai? Kahan jaana hai? 📍`,
        `${fromConfirm}\n\nAb batayein, **kahan tak jaana hai**?`,
        `${fromConfirm} **${fromCity}** se pickup pakka.\n\nDestination batayein ji — kahan pahunchna hai?`,
      ]),
    };
  }

  if (bookingStep === "to") {
    if (!isValidLocation(input)) {
      return {
        id,
        role: "bot",
        text: "Yeh valid destination nahi lagti ji. 🙏 Kripya apna **jaane ka shahar** batayein — jaise Jaipur, Manali, Agra, Shimla, etc.",
      };
    }
    const toCity = input.trim();
    const toConfirm = isKnownCity(toCity)
      ? `**${toCity}** — theek hai! Note kar liya.`
      : `**${toCity}** — theek hai! Note kar liya.`;
    bookingData.to = toCity;
    sessionCtx.lastDestination = toCity;
    bookingStep = "date";
    const routeKey = `delhi-${toCity.toLowerCase()}`;
    const route = ROUTES[routeKey];
    let extra = "";
    if (route) {
      const fare = calcFare(route.km);
      extra = `\n\n\uD83D\uDCCA **Route Info:**\n📍 ~${route.km} km | ⏱ ${route.time} | 🛣 ${route.highway}\n🚗 Sedan: ${fare.sedan} | 🚐 Ertiga: ${fare.ertiga} | 🚙 Innova: ${fare.innova}`;
    }
    const destPraise = pick([
      `${toConfirm} **${toCity}** — bahut sundar jagah hai! 😄`,
      `${toConfirm} Waah! **${toCity}** ka plan — zabardast choice hai! 🌟`,
      `${toConfirm} **${toCity}** — ek behtareen destination! Aap maza karenge. 😄`,
    ]);
    return {
      id,
      role: "bot",
      text: `${destPraise}${extra}\n\n**Kab jaana chahte hain?** Travel date batayein (Jaise: 25 April ya 25/04):`,
    };
  }

  if (bookingStep === "date") {
    bookingData.date = input;
    bookingStep = "vehicle";
    return {
      id,
      role: "bot",
      text: pick([
        `**${input}** — date note kar li! 📅\n\nAb **konsi gaadi** pasand karenge?`,
        `${input} — perfect! 😊\n\nAb apni **gaadi choose** karein:`,
        `Date: **${input}** — done! 👌\n\nAb last step — **vehicle select** karein:`,
      ]),
      options: [
        "🚗 Sedan ₹18–22/km",
        "🚐 Ertiga 7-seater ₹22–28/km",
        "🚙 Innova Crysta ₹28–35/km",
        "🚛 Premium SUV ₹40–45/km",
      ],
    };
  }

  if (bookingStep === "vehicle") {
    bookingData.vehicle = input.replace(/^[🚗🚐🚙🚛]\s*/u, "");
    sessionCtx.lastVehicle = bookingData.vehicle;
    bookingStep = "confirm";
    return {
      id,
      role: "bot",
      text: `Bahut badhiya${nameJi()}! 👌\n\n📋 **Booking Summary:**\n👤 Name: ${bookingData.name}\n📞 Phone: ${bookingData.phone}\n📍 From: ${bookingData.from}\n📍 To: ${bookingData.to}\n📅 Date: ${bookingData.date}\n🚗 Vehicle: ${bookingData.vehicle}\n\n*Toll, state taxes & night charges (₹300/night) extra as per actuals.*\n\nKya yeh sab sahi hai? Confirm karein! ✅`,
      options: ["✅ Haan, Confirm Karein", "✏️ Badlaav Karna Hai"],
    };
  }

  if (bookingStep === "confirm") {
    if (/haan|confirm|yes|✅/.test(input.toLowerCase())) {
      const msg = `Namaskar ji 🙏%0A%0AMain ek taxi book karna chahta\/chahti hun:%0A%0A👤 Name: ${encodeURIComponent(bookingData.name || "")}%0A📞 Phone: ${encodeURIComponent(bookingData.phone || "")}%0A📍 From: ${encodeURIComponent(bookingData.from || "")}%0A📍 To: ${encodeURIComponent(bookingData.to || "")}%0A📅 Date: ${encodeURIComponent(bookingData.date || "")}%0A🚗 Vehicle: ${encodeURIComponent(bookingData.vehicle || "")}%0A%0AKripya confirm karein. Shukriya!`;
      window.open(`https://wa.me/919990104748?text=${msg}`, "_blank");
      bookingStep = "idle";
      bookingData = {};
      return {
        id,
        role: "bot",
        text: pick([
          `Shukriya${nameJi()}! 🎉 WhatsApp khul raha hai — aapki details Gaurav ji ke paas pahunch jaayengi. Woh jald confirm karenge. **Shubh Yatra!** 🚗✨`,
          `Done${nameJi()}! 🎉 Details WhatsApp pe bhej dee hain — Gaurav ji thodi der mein call ya message karenge. **Safe journey!** 🙏`,
        ]),
        options: ["Kuch aur poochhna hai", "Rates jaannein"],
      };
    }
    bookingStep = "name";
    bookingData = {};
    phoneRetryCount = 0;
    return {
      id,
      role: "bot",
      text: pick([
        "Koi baat nahi! Chaliye dobara shuru karte hain. 😊\n\nPehle aapka **naam** batayein:",
        "Sure ji! Koi baat nahi — chaliye phir se start karte hain. **Aapka naam** kya hai?",
      ]),
    };
  }

  bookingStep = "idle";
  return getBotReply(input);
}

// ─── Main Bot Reply Engine ────────────────────────────────────────────────────

function getBotReply(input: string): Message {
  const id = Date.now();

  // If mid-booking, route to booking handler
  if (bookingStep !== "idle") {
    return handleBookingStep(input);
  }

  const msg = input.toLowerCase().trim();
  const intents = classifyIntents(input);

  const hasIntent = (i: Intent) => intents.includes(i);

  // Update session context with any destination mentioned
  const mentionedDest = extractDestination(input);
  if (mentionedDest) sessionCtx.lastDestination = mentionedDest;

  // ── WhatsApp quick actions ────────────────────────────────────────────────
  if (hasIntent("WHATSAPP_GAURAV") || /whatsapp gaurav/.test(msg)) {
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
  if (hasIntent("WHATSAPP_SHYAM") || /whatsapp shyam/.test(msg)) {
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

  // ── Discount requests ─────────────────────────────────────────────────────
  if (hasIntent("DISCOUNT_REQUEST")) {
    return {
      id,
      role: "bot",
      text: pick([
        `${nameJi()} ji, samajh sakta hun ki har koi best deal chahta hai. 🙏\n\nLekin honestly bolunga — hamare rates already market mein best hain. Brand new gaadiyan, experienced drivers, 24/7 support — in sab ki value hai. Aur hamare clients Reliance jaisi company hain jo 8 saal se hamare saath hain — quality mein koi compromise nahi karte woh bhi.\n\nFix rates hain, discount possible nahi — par trip mein aapko koi kami zaroor nahi milegi. 🚗`,
        `Dekho${nameJi()}, honestly kahun toh hamare rates pehle se hi bohot competitive hain — aur service top-class. 15,000+ khush passengers iska proof hain.\n\nHum rates further reduce nahi kar sakte, but guarantee hai ki aapko best experience milega. 🙏`,
      ]),
      options: ["📅 Booking Karna Hai", "💰 Rates Dekhein", "🚗 Fleet Dekhein"],
    };
  }

  // ── Angry customers ───────────────────────────────────────────────────────
  if (hasIntent("ANGRY")) {
    sessionCtx.angryCount += 1;
    if (sessionCtx.angryCount >= 2) {
      return {
        id,
        role: "bot",
        text: `Bilkul samajh sakta hun${nameJi()}, aur main dil se maafi chahta hun agar kuch theek nahi laga. 🙏\n\nAb seedha Gaurav ji se baat karein — woh personally aapka issue resolve karenge:\n\n📞 **Gaurav ji:** 9990104748\n📞 **Shyam Lal ji:** 9868901253`,
        options: ["WhatsApp Gaurav ji", "WhatsApp Shyam Lal ji"],
      };
    }
    return {
      id,
      role: "bot",
      text: pick([
        `Maafi chahta hun${nameJi()} agar aapko koi takleef hui. 🙏 Hamare liye har customer ki satisfaction sabse important hai.\n\nKya aap apni problem thodi detail mein share karenge? Main poori koshish karunga sahi solution dhundhne mein.`,
        `Aapki pareshani sun ke dukh hua${nameJi()}. Yeh bilkul nahi hona chahiye tha. 🙏\n\nKya hua exactly? Bataiye — main genuinely help karna chahta hun.`,
      ]),
      options: [
        "Problem batayein",
        "📞 Directly Call Karein",
        "WhatsApp Karein",
      ],
    };
  }

  // ── Greeting ─────────────────────────────────────────────────────────────
  if (hasIntent("GREETING")) {
    const greeting = getGreeting();
    return {
      id,
      role: "bot",
      text: pick([
        `${greeting}\n\nArey! Swagat hai Meena Tour & Travels mein! 😊 Main **Trip Pilot** hun — aapka travel assistant. Kahan jaana hai aaj? 🚗`,
        `${greeting}\n\nNamaskar${nameJi()}! Meena Tour & Travels mein aapka swagat hai. Main **Trip Pilot** — trip planning se lekar booking tak, sab handle karta hun. Batayein, kya madad chahiye? 🙏`,
        `${greeting}\n\nHello${nameJi()}! Aap bilkul sahi jagah aaye hain. Main **Trip Pilot** hun — aapka 24/7 travel dost! 😄 Rates, destinations, booking — sab mein haazir hun.`,
      ]),
      options: [
        "🚗 Vehicles Dekhein",
        "💰 Rates Jaannein",
        "🗺 Destinations/Tours",
        "📅 Booking Karna Hai",
        "❓ FAQ",
        "📞 Contact Karein",
      ],
    };
  }

  // ── Multi-intent: Price + Toll ─────────────────────────────────────────────
  if (hasIntent("PRICE_QUERY") && hasIntent("FAQ_TOLL")) {
    const routeResult = findRoute(msg);
    const baseText = routeResult
      ? `Haan${nameJi()}, bilkul batata hun — **${routeResult.from} → ${routeResult.to}** ka rate aur toll dono:\n\n🚗 Sedan: ${routeResult.sedan}\n🚐 Ertiga: ${routeResult.ertiga}\n🚙 Innova: ${routeResult.innova}\n🚛 SUV: ${routeResult.suv}\n\n📍 ~${routeResult.km} km | ⏱ ${routeResult.time} | 🛣 ${routeResult.highway}`
      : `Zaroor${nameJi()}! Per km rates:\n\n🚗 Sedan: ₹18–22/km\n🚐 Ertiga: ₹22–28/km\n🚙 Innova: ₹28–35/km\n🚛 SUV: ₹40–45/km`;
    return {
      id,
      role: "bot",
      text: `${baseText}\n\n**Toll ke baare mein:** Toll actual amount ke hisaab se alag se charge hota hai — receipts di jaati hain, koi hidden charge nahi. Driver personally sab handle karta hai. 🙏`,
      options: ["📅 Book Karna Hai", "🚗 Fleet Dekhein"],
    };
  }

  // ── Route with price query ────────────────────────────────────────────────
  if (hasIntent("PRICE_QUERY") || hasIntent("ROUTE_QUERY")) {
    const routeResult = findRoute(msg);
    if (routeResult) {
      sessionCtx.lastRoute = routeResult;
      sessionCtx.lastDestination = routeResult.to;
      const ack = pick([
        `Haan${nameJi()}, **${routeResult.from} → ${routeResult.to}** ka rate sun lijiye:`,
        `Bilkul${nameJi()}! **${routeResult.to}** ke liye estimated fare yeh raha:`,
        `${routeResult.to} jaana hai? 😊 Bahut achha choice hai! Yeh raha fare breakdown:`,
      ]);
      return {
        id,
        role: "bot",
        text: ack,
        routeResult,
        options: ["📅 Book This Trip", "🚗 Other Vehicles", "🗺 More Routes"],
      };
    }

    // Price query without a specific route — check if origin-only
    if (/delhi|noida|gurgaon|faridabad|gurugram/.test(msg) && !mentionedDest) {
      return {
        id,
        role: "bot",
        text: pick([
          `${nameJi()} ji, rate jaanna chahte hain — bilkul bataunga! Bas **destination** bhi batayein — kahan jaana hai? 😊`,
          `Zaroor${nameJi()}! Lekin ek cheez missing hai — **kahan tak jaana hai**? Destination bata dein, turant estimate nikal deta hun!`,
        ]),
        options: [
          "Delhi to Jaipur",
          "Delhi to Manali",
          "Delhi to Agra",
          "Delhi to Shimla",
          "🗺 All Destinations",
        ],
      };
    }

    // Generic price query
    return {
      id,
      role: "bot",
      text: pick([
        `Hamare standard per-km rates${nameJi()}:\n\n🚗 **Sedan** (Dzire, Aura, Amaze): ₹18–22/km\n🚐 **Ertiga** (7-seater): ₹22–28/km\n🚙 **Innova Crysta**: ₹28–35/km\n🚛 **Premium SUV**: ₹40–45/km\n\n⚠️ State taxes, tolls, aur night charges (₹300/night) actual ke hisaab se extra hain.\n\nKisi specific route ka estimate chahiye? Bas origin → destination batayein!`,
        `Yeh hain hamare rates${nameJi()}:\n\n🚗 Sedan: ₹18–22/km | 🚐 Ertiga: ₹22–28/km\n🚙 Innova: ₹28–35/km | 🚛 SUV: ₹40–45/km\n\nKisi route ke liye exact estimate chahiye? Destination batayein — bilkul detail mein bata deta hun!`,
      ]),
      options: [
        "Delhi to Jaipur rate?",
        "Delhi to Manali rate?",
        "Delhi to Agra rate?",
        "Delhi to Shimla rate?",
        "📅 Book Karna Hai",
      ],
    };
  }

  // ── Fleet query ───────────────────────────────────────────────────────────
  if (hasIntent("FLEET_QUERY")) {
    // Specific vehicle mentioned?
    const isInnova = /innova|crysta/.test(msg);
    const isErtiga = /ertiga/.test(msg);
    const isSuv = /suv|harrier|xuv|gurkha/.test(msg);
    const isSedan = /sedan|dzire|aura|amaze/.test(msg);

    if (isInnova || isErtiga || isSuv || isSedan) {
      const vehicleName = isInnova
        ? "Innova Crysta"
        : isErtiga
          ? "Ertiga 7-Seater"
          : isSuv
            ? "Premium SUV"
            : "Standard Sedan";
      const vehicleRate = isInnova
        ? "₹28–35/km"
        : isErtiga
          ? "₹22–28/km"
          : isSuv
            ? "₹40–45/km"
            : "₹18–22/km";
      return {
        id,
        role: "bot",
        text: pick([
          `Haan${nameJi()}, **${vehicleName}** available hai! 🙍\n\nRate: **${vehicleRate}** — bilkul brand new, company-owned gaadi hai. 10-15+ saal ka experienced driver saath hoga.\n\nBook karna chahenge?`,
          `Bilkul${nameJi()}! **${vehicleName}** hamare fleet mein hai — **${vehicleRate}**. Gaadi company-owned hai, kisi se lete nahi.\n\nKab chahiye? Booking shuru karein?`,
        ]),
        options: [
          "📅 Haan, Book Karna Hai",
          "🚗 Saari Fleet Dekhein",
          "💰 Rates Compare Karein",
        ],
      };
    }

    return {
      id,
      role: "bot",
      text: pick([
        "Meena Tour & Travels ki available fleet — sab company-owned, brand new gaadiyan! 🚗",
        `Yeh hain hamare vehicles${nameJi()} — sab apni company ki hain, rent pe nahi: 🚗`,
      ]),
      cards: FLEET,
      options: ["📅 Book Karna Hai", "💰 Rates Poochhna Hai"],
    };
  }

  // ── Booking intent ────────────────────────────────────────────────────────
  if (hasIntent("BOOKING_INTENT")) {
    bookingStep = "name";
    bookingData = {};
    phoneRetryCount = 0;
    return {
      id,
      role: "bot",
      text: pick([
        `Bilkul${nameJi()}! Aapki booking main personally handle karunga. 😊\n\nPehle aapka **naam** batayein:`,
        `Great! Trip book karte hain${nameJi()}. 🚗\n\nSabse pehle — aapka **poora naam** kya hai?`,
        `Ab chalte hain booking ki taraf${nameJi()}! 👌\n\nFirst step — aapka **naam** batayein:`,
      ]),
    };
  }

  // ── Destinations ─────────────────────────────────────────────────────────
  if (hasIntent("DESTINATION_QUERY")) {
    return {
      id,
      role: "bot",
      text: pick([
        "Hamare popular destinations — click karein booking shuru karne ke liye! 🗺",
        `${nameJi()} ji, yeh hain hamare top destinations — North India ke best jagah: 🏔`,
      ]),
      destinations: DESTINATIONS,
      options: ["📅 Booking Karna Hai", "💰 Rates Jaannein"],
    };
  }

  // ── Contact ───────────────────────────────────────────────────────────────
  if (hasIntent("CONTACT")) {
    return {
      id,
      role: "bot",
      text: pick([
        "**Meena Tour & Travels — Humse Milein:**\n\n📞 Gaurav ji (MD): **9990104748**\n📞 Shyam Lal ji (Corporate): **9868901253**\n📧 meenagaurav4748@gmail.com\n\n📍 C-41, UGF, Khirki Ext, Panchsheel Vihar, Malviya Nagar, New Delhi – 110017\n\n🕐 Mon–Sat: 9AM–7PM | Sunday: 10AM–5PM",
        `${nameJi()} ji, yeh hain hamare contacts:\n\n📞 **Gaurav ji:** 9990104748 (MD, booking & inquiries)\n📞 **Shyam Lal ji:** 9868901253 (Corporate clients)\n📧 meenagaurav4748@gmail.com\n\n📍 New Delhi — Malviya Nagar, Panchsheel Vihar`,
      ]),
      options: ["WhatsApp Gaurav ji", "WhatsApp Shyam Lal ji"],
    };
  }

  // ── Payment ───────────────────────────────────────────────────────────────
  if (hasIntent("PAYMENT")) {
    return {
      id,
      role: "bot",
      text: `**Payment Options${nameJi()}:**\n\n\uD83D\uDCF2 **UPI:** shyamlalmeena4151@ibl (GPay, PhonePe, Paytm)\n🏦 **Bank Transfer:** A/C: 51112853125 | SBI | IFSC: SBIN0031580 | Branch: Mandir Marg, Saket (Name: GAURAV)\n💵 **Cash:** Pickup pe de sakte hain\n\nBooking confirm karne ke liye advance zaruri hai. 🙏`,
      options: ["📅 Book Karna Hai", "📞 Contact Karein"],
    };
  }

  // ── About company ─────────────────────────────────────────────────────────
  if (hasIntent("ABOUT_COMPANY")) {
    return {
      id,
      role: "bot",
      text: pick([
        "**Meena Tour & Travels** — Delhi ki trusted agency, 2011 se service mein. 🙏\n\n✅ GSTIN Registered: 07BQXPG8115J1ZB\n✅ All India Tourist Permit\n✅ 15,000+ satisfied passengers\n✅ 1000+ destinations covered\n✅ **Reliance Industries** — 8 saal se hamare client\n✅ **Mangal Singh Lodha ji** — 7 saal se hamare client\n\nCo-founders: **GAURAV** (MD) & **Shyam Lal Meena** (Director, Corporate)",
        `Hum **Meena Tour & Travels** hain${nameJi()} — 2011 se Delhi ki trusted taxi service. GSTIN registered, All India Tourist Permit holder.\n\n15,000+ passengers ki trust kamai hai humne — aur Reliance jaise corporate client 8 saal se hamare saath hain. Yahi hamari pehchaan hai. 🚗`,
      ]),
      options: ["🚗 Fleet Dekhein", "💰 Rates Jaannein", "📞 Contact Karein"],
    };
  }

  // ── FAQs ─────────────────────────────────────────────────────────────────
  if (hasIntent("FAQ_TOLL")) {
    const dest = sessionCtx.lastDestination;
    return {
      id,
      role: "bot",
      text: pick([
        `${dest ? `**${dest}** route pe ` : ""}Toll tax alag se charge hota hai${nameJi()} — actual amount trip ke hisaab se hoti hai. Driver toll receipts rakhte hain aur final bill mein clearly add ki jaati hai. Koi hidden charge nahi hoga, guarantee!`,
        `Achha sawaal hai${nameJi()}! Toll per-km rate mein included nahi hai — actual toll booths pe jo charge hota hai woh alag se final bill mein add hota hai. Driver har receipt save karta hai, aap dekh sakte hain.`,
      ]),
      options: ["📅 Booking Karna Hai", "💰 Per-km Rates"],
    };
  }

  if (hasIntent("FAQ_NIGHT")) {
    return {
      id,
      role: "bot",
      text: pick([
        `Driver ke liye night charges **₹300 per night** hain${nameJi()}. Sirf tabhi lagta hai jab trip mein driver ko bahar rukna pade — agar same din return hai toh nahi lagta.`,
        "Night allowance ki baat karein toh — **₹300 per night** driver ke liye. Yeh reasonable hai aur clearly bill mein dikhta hai — koi surprise nahi.",
      ]),
      options: ["Kuch aur poochhna hai", "📅 Booking Karna Hai"],
    };
  }

  if (hasIntent("FAQ_KM_LIMIT")) {
    return {
      id,
      role: "bot",
      text: pick([
        `Outstation trips mein minimum **250–300 km per day** ka charge hota hai${nameJi()}. Agar aap isse zyada chalate hain, toh per-km rate hi lagega — bilkul transparent billing, koi confusion nahi.`,
        `Km limit ke baare mein${nameJi()} — per day minimum **250-300 km** count hota hai. Zyada km mile toh per-km rate extra lagega. Sab clearly bill mein dikhega.`,
      ]),
      options: ["Kuch aur poochhna hai", "📅 Booking Karna Hai"],
    };
  }

  if (hasIntent("FAQ_DRIVER")) {
    return {
      id,
      role: "bot",
      text: pick([
        `Trip se **ek din pehle** aapko WhatsApp pe driver ka naam, phone number, aur gaadi ka number bhej diya jaata hai${nameJi()}. 📱\n\nSaare drivers **10–15+ saal** ke experienced professionals hain — safe aur reliable travel guaranteed!`,
        `${nameJi()} ji, driver details ki tension mat karein — trip se 1 din pehle WhatsApp pe automatically aa jaayega driver ka naam, number, aur gaadi ka number. Hamare drivers 10-15+ saal ke veterans hain.`,
      ]),
      options: ["📅 Booking Karna Hai", "Kuch aur poochhna hai"],
    };
  }

  if (hasIntent("FAQ_CANCEL")) {
    return {
      id,
      role: "bot",
      text: `Cancellation ke liye seedha Gaurav ji ya Shyam Lal ji se baat karein${nameJi()}:\n📞 **9990104748** (Gaurav) | **9868901253** (Shyam Lal ji)\n\nWoh personally aapka maamla handle karenge. 🙏`,
      options: ["WhatsApp Gaurav ji", "WhatsApp Shyam Lal ji"],
    };
  }

  if (hasIntent("FAQ_GENERAL")) {
    return {
      id,
      role: "bot",
      text: `Yeh hain common sawaal — koi bhi chunein${nameJi()}:`,
      options: [
        "KMs limit kya hai?",
        "Toll tax included hai ya extra?",
        "Night charges kya hain?",
        "Driver details kab milegi?",
        "Payment kaise karein?",
        "Cancellation policy?",
        "Company ke baare mein batao",
      ],
    };
  }

  // ── Itinerary planning ────────────────────────────────────────────────────
  if (hasIntent("ITINERARY")) {
    const dest = sessionCtx.lastDestination;
    return {
      id,
      role: "bot",
      text: dest
        ? pick([
            `**${dest}** ke liye quick trip overview${nameJi()}:\n\n📅 Day 1: Delhi se ${dest} drive (early morning best rehta hai)\n\uD83C\uDFE8 Pahunche, hotel check-in\n🗺 Day 2+: Local sightseeing with our driver\n\nExact itinerary ke liye Gaurav ji se baat karein — woh personally best plan banayenge aapke liye.`,
            `${dest} trip planning kar rahe hain — 😊\n\nEk rough idea: Delhi se ${dest} ka drive pehle din, fir 2-3 din sightseeing. Kitne din ka plan hai?\n\nMore details ke liye Shyam Lal ji se baat karein (9868901253) — woh ek perfect plan banayenge aapke budget aur days ke hisaab se.`,
          ])
        : `Trip planning mein zaroor madad kar sakta hun${nameJi()}! Pehle destination batayein — phir quick itinerary overview de sakta hun. 😊`,
      options: [
        "📅 Trip Book Karna Hai",
        "🗺 Destinations Dekhein",
        "📞 Expert se Baat Karein",
      ],
    };
  }

  // ── Weather ───────────────────────────────────────────────────────────────
  if (hasIntent("WEATHER")) {
    const dest = sessionCtx.lastDestination || "destination";
    return {
      id,
      role: "bot",
      text: pick([
        `${dest} ka mausam jaanna chahte hain${nameJi()}? 🌤\n\nMain weather data provide karne mein capable nahi hun — par aap **Google par "${dest} weather"** type karein, turant real-time info milegi!\n\nHaan, agar trip book karni ho toh woh main zaroor help kar sakta hun. 🙏`,
        `Weather information mere paas nahi hoti${nameJi()} — par Google ya AccuWeather pe "${dest} weather" search karein, best result milega. ☀️\n\nTrip plan karna ho toh ek word bolein — main poora process handle kar leta hun!`,
      ]),
      options: ["📅 Trip Book Karna Hai", "💰 Rates Jaannein"],
    };
  }

  // ── Context-aware follow-ups ──────────────────────────────────────────────
  if (
    /wahan|us route|is route|same route|uska|unka|iske|uske|ye route|us jagah|wahan ka/.test(
      msg,
    ) &&
    sessionCtx.lastDestination
  ) {
    if (/toll/.test(msg)) {
      return {
        id,
        role: "bot",
        text: `**${sessionCtx.lastDestination}** route pe toll actual charges ke hisaab se extra lagta hai${nameJi()}. Driver receipt rakhte hain — final bill mein clearly add hoti hai. Koi surprise nahi hoga.`,
        options: ["📅 Book Karna Hai", "💰 Per-km Rates"],
      };
    }
    if (/driver|gaadi|cab/.test(msg)) {
      return {
        id,
        role: "bot",
        text: `**${sessionCtx.lastDestination}** ke liye trip se **ek din pehle** aapko driver ka naam, number aur gaadi number WhatsApp pe bhej diya jaayega${nameJi()}. Drivers 10–15+ saal ke experienced professionals hain. 👍`,
        options: ["📅 Booking Karna Hai"],
      };
    }
    if (/rate|kitna|price|cost/.test(msg)) {
      const routeKey = `delhi-${sessionCtx.lastDestination.toLowerCase()}`;
      const route = ROUTES[routeKey];
      if (route) {
        const fare = calcFare(route.km);
        return {
          id,
          role: "bot",
          text: `Haan${nameJi()}, **${sessionCtx.lastDestination}** ka rate:\n\n🚗 Sedan: ${fare.sedan}\n🚐 Ertiga: ${fare.ertiga}\n🚙 Innova: ${fare.innova}\n🚛 SUV: ${fare.suv}\n\n📍 ~${route.km} km | ⏱ ${route.time} | 🛣 ${route.highway}`,
          options: ["📅 Book Karna Hai"],
        };
      }
    }
  }

  // ── Generic fallback ──────────────────────────────────────────────────────
  return {
    id,
    role: "bot",
    text: pick([
      `Hmm, ye cheez thodi specific lagti hai${nameJi()}. 🤔 Kya aap seedha Gaurav ji se baat karna chahenge? Woh personally best solution nikalenge.\n\n📞 **Gaurav ji:** 9990104748 | **Shyam Lal ji:** 9868901253`,
      `Samjha nahi poori baat${nameJi()} — maafi! 🙏 Kya aap thoda aur detail mein bata sakte hain? Ya neeche se koi option chunein:`,
      `Ye topic meri knowledge se thoda bahar hai${nameJi()}. Iske liye Gaurav ji ya Shyam Lal ji se WhatsApp pe baat karein — woh experts hain! 😊`,
    ]),
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

// ─── React Component (UI unchanged) ─────────────────────────────────────────

export function SevakChatbot() {
  const greeting = getGreeting();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: "bot",
      text: pick([
        `${greeting}\n\nMain **Trip Pilot** hun — Meena Tour & Travels ka 24/7 assistant. 🙏\n\nTrip planning, rates, destinations, booking — sab mein madad karunga. Bas batayein!`,
        `${greeting}\n\nArey! Swagat hai! Main **Trip Pilot** hun — aapka travel dost. 😊 Kahan jaana hai? Rates, booking, routes — sab ready hun!`,
        `${greeting}\n\nNamaskar ji! Main **Trip Pilot** — Meena Tour & Travels ka assistant. Trip ka plan ban raha hai kya? Batayein, sab handle ho jaayega! 🚗`,
      ]),
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

  // biome-ignore lint/correctness/useExhaustiveDependencies: open intentionally excluded
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
      {/* Sevak toggle button — bottom LEFT */}
      <button
        type="button"
        data-ocid="sevak.open_modal_button"
        onClick={() => {
          setOpen((v) => !v);
          setUnread(0);
        }}
        className="fixed bottom-6 left-5 z-[60] w-14 h-14 rounded-full shadow-2xl flex items-center justify-center bg-gradient-to-br from-orange-500 to-amber-600 hover:scale-110 active:scale-95 transition-transform border-2 border-white"
        aria-label="Trip Pilot Chatbot"
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
          Trip Pilot 🤖
        </span>
      )}

      {/* Chat window */}
      {open && (
        <div
          data-ocid="sevak.dialog"
          className="fixed bottom-24 left-5 z-[60] w-[340px] max-w-[calc(100vw-24px)] bg-white rounded-2xl shadow-2xl border border-orange-200 flex flex-col"
          style={{ maxHeight: "560px" }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-t-2xl px-4 py-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 text-xl">
              🤖
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white font-bold text-sm leading-tight">
                Trip Pilot
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
            style={{ minHeight: 0, maxHeight: "380px" }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[88%] ${
                    msg.role === "user"
                      ? "bg-orange-500 text-white rounded-2xl rounded-br-sm px-3 py-2 text-sm"
                      : "bg-gray-100 text-gray-800 rounded-2xl rounded-bl-sm px-3 py-2 text-sm"
                  }`}
                >
                  {renderText(msg.text)}

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
                          🚗 <strong>Sedan:</strong> {msg.routeResult.sedan}
                        </div>
                        <div className="text-[11px]">
                          🚐 <strong>Ertiga:</strong> {msg.routeResult.ertiga}
                        </div>
                        <div className="text-[11px]">
                          🚙 <strong>Innova:</strong> {msg.routeResult.innova}
                        </div>
                        <div className="text-[11px]">
                          🚛 <strong>Premium SUV:</strong> {msg.routeResult.suv}
                        </div>
                      </div>
                      <div className="text-[9px] text-gray-400 mt-1">
                        *Toll & night charges extra as per actuals
                      </div>
                    </div>
                  )}

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
