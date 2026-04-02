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
};

let bookingStep: BookingStep = "idle";
let bookingData: BookingData = {};
let sessionCtx: SessionCtx = { angryCount: 0 };
let phoneRetryCount = 0; // retry counter for phone step

const FLEET: FleetCard[] = [
  {
    name: "Standard Sedan",
    models: "Swift Dzire, Hyundai Aura, Honda Amaze",
    rate: "\u20b918\u201322/km",
    img: "/assets/generated/sedan-fleet.dim_600x400.jpg",
  },
  {
    name: "Ertiga 7-Seater",
    models: "Maruti Ertiga",
    rate: "\u20b922\u201328/km",
    img: "/assets/generated/ertiga-fleet.dim_600x400.jpg",
  },
  {
    name: "Innova Crysta",
    models: "Toyota Innova Crysta",
    rate: "\u20b928\u201335/km",
    img: "/assets/generated/innova-crysta-fleet.dim_600x400.jpg",
  },
  {
    name: "Premium SUV",
    models: "Force Gurkha, Tata Harrier, Mahindra XUV700",
    rate: "\u20b940\u201345/km",
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

function getGreeting(): string {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return "Suprabhat! \uD83C\uDF05 Good Morning!";
  if (h >= 12 && h < 17) return "Namaskar! \u2600\uFE0F Good Afternoon!";
  if (h >= 17 && h < 21) return "Shubh Sandhya! \uD83C\uDF06 Good Evening!";
  return "Namaskar! \uD83C\uDF19";
}

function calcFare(km: number): {
  sedan: string;
  ertiga: string;
  innova: string;
  suv: string;
} {
  return {
    sedan: `\u20b9${(km * 18).toLocaleString("en-IN")}\u2013\u20b9${(km * 22).toLocaleString("en-IN")}`,
    ertiga: `\u20b9${(km * 22).toLocaleString("en-IN")}\u2013\u20b9${(km * 28).toLocaleString("en-IN")}`,
    innova: `\u20b9${(km * 28).toLocaleString("en-IN")}\u2013\u20b9${(km * 35).toLocaleString("en-IN")}`,
    suv: `\u20b9${(km * 40).toLocaleString("en-IN")}\u2013\u20b9${(km * 45).toLocaleString("en-IN")}`,
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
 * Smart extraction: pulls out a 10-digit Indian mobile number from any text.
 * Handles inputs like "mera number 9876543210 hai", "+91 9876543210", "91-9876543210"
 */
function extractPhoneNumber(input: string): string | null {
  // Remove common separators to normalise
  const cleaned = input.replace(/[\s\-().]/g, "");

  // Match optional +91 or 91 prefix followed by exactly 10 digits
  const withPrefix = cleaned.match(/(?:\+91|91)([6-9]\d{9})(?!\d)/);
  if (withPrefix) return withPrefix[1];

  // Match a standalone 10-digit number starting with 6-9 (Indian mobile)
  const standalone = cleaned.match(/(?<!\d)([6-9]\d{9})(?!\d)/);
  if (standalone) return standalone[1];

  return null;
}

function detectLanguage(input: string): "hindi" | "english" {
  const hindiPatterns =
    /kya|kitna|kaise|kab|kahan|chahiye|batao|hain|hai|mujhe|mera|aapka|aap|bhai|ji|nahi|haan|tha|thi|the|kar|gaya|jaana|book|pehle|baad|sath|liye|wala|wali|dena|lena|zyada|thoda|aur|ya|par|pe|se|ko|ka|ki|ke/;
  return hindiPatterns.test(input.toLowerCase()) ? "hindi" : "english";
}

function isAngry(input: string): boolean {
  return /bakwaas|bekar|bura|ganda|fraud|cheat|thug|ghatiya|problem|complaint|issue|late|delay|garmi|kharab|worst|bad service|angry|frustrated|terrible|horrible|useless|stupid/.test(
    input.toLowerCase(),
  );
}

function isAskingDiscount(input: string): boolean {
  return /discount|kam karo|kam kar do|thoda kam|reduce|negotiat|bargain|cheap|sasta|price cut|offer|deal|less rate|less price|zyada lag raha|mehnga|mahnga|afford|budget|concess/.test(
    input.toLowerCase(),
  );
}

function handleBookingStep(input: string): Message {
  const id = Date.now();

  if (bookingStep === "name") {
    const trimmed = input.trim();
    if (trimmed.length < 2) {
      return {
        id,
        role: "bot",
        text: "Kripya apna **poora naam** batayein ji (kam se kam 2 akshar). \uD83D\uDE4F",
      };
    }
    bookingData.name = trimmed;
    sessionCtx.userName = trimmed.split(" ")[0];
    phoneRetryCount = 0; // reset before phone step
    bookingStep = "phone";
    return {
      id,
      role: "bot",
      text: `Shukriya **${trimmed} ji**! \uD83D\uDE4F\n\nAb aapka **10 ankon (digits) ka mobile number** batayein taaki Gaurav ji ya Shyam Lal ji aapse trip confirm kar sakein:`,
    };
  }

  if (bookingStep === "phone") {
    // --- Smart extraction: pull 10-digit number from any sentence ---
    const extracted = extractPhoneNumber(input);

    if (extracted) {
      // Valid number found — proceed
      bookingData.phone = extracted;
      phoneRetryCount = 0;
      bookingStep = "from";
      return {
        id,
        role: "bot",
        text: `Perfect! \uD83D\uDCDE Number note kar liya: **${extracted}**\n\nAapko **kahan se** pickup chahiye? (Jaise: Delhi, Noida, Gurgaon, Faridabad...)`,
      };
    }

    // --- Invalid input ---
    phoneRetryCount += 1;

    // After 2 failures — break the loop, give direct contact
    if (phoneRetryCount >= 2) {
      phoneRetryCount = 0;
      bookingStep = "idle";
      bookingData = {};
      return {
        id,
        role: "bot",
        text: "Koi baat nahi ji, hum samajhte hain. \uD83D\uDE4F\n\nAapki booking ke liye seedha hamare team se baat karein \u2014 woh personally sab handle karenge:\n\n\uD83D\uDCDE **Gaurav ji (MD):** 9990104748\n\uD83D\uDCDE **Shyam Lal ji (Corporate):** 9868901253\n\nShubh Yatra! \uD83D\uDE97\u2728",
        options: ["WhatsApp Gaurav ji", "WhatsApp Shyam Lal ji"],
      };
    }

    // First failure — polite Hindi/Hinglish error with the exact requested message
    return {
      id,
      role: "bot",
      text: "Maaf karein, lagta hai aapne number ki jagah kuch aur type kiya hai. Kripya gaadi ki booking details aage badhane ke liye sirf **10 anko (digits)** ka mobile number type karein.\n\nJaise: **9876543210**",
    };
  }

  if (bookingStep === "from") {
    bookingData.from = input;
    bookingStep = "to";
    return {
      id,
      role: "bot",
      text: `Achha! **${input}** se. \u2705\n\nAur **kahan jaana hai**? Destination batayein \uD83D\uDCCD`,
    };
  }

  if (bookingStep === "to") {
    bookingData.to = input;
    sessionCtx.lastDestination = input;
    bookingStep = "date";
    const routeKey = `delhi-${input.toLowerCase().trim()}`;
    const route = ROUTES[routeKey];
    let extra = "";
    if (route) {
      const fare = calcFare(route.km);
      extra = `\n\n\uD83D\uDCCA **Route Info:**\n\uD83D\uDCCD ~${route.km} km | \u23F1 ${route.time} | \uD83D\uDEE3 ${route.highway}\n\uD83D\uDE97 Sedan: ${fare.sedan} | \uD83D\uDE90 Ertiga: ${fare.ertiga} | \uD83D\uDE99 Innova: ${fare.innova}`;
    }
    return {
      id,
      role: "bot",
      text: `${input} \u2014 bahut achha destination hai! \uD83D\uDE04${extra}\n\n**Kab jaana chahte hain?** Travel date batayein (DD/MM/YYYY ya jaise \u201825 April\u2019):`,
    };
  }

  if (bookingStep === "date") {
    bookingData.date = input;
    bookingStep = "vehicle";
    return {
      id,
      role: "bot",
      text: `${input} \u2014 note kar liya! \uD83D\uDCC5\n\nAb **gaadi ka type** chunein:`,
      options: [
        "\uD83D\uDE97 Sedan \u20b918\u201322/km",
        "\uD83D\uDE90 Ertiga 7-seater \u20b922\u201328/km",
        "\uD83D\uDE99 Innova Crysta \u20b928\u201335/km",
        "\uD83D\uDE9B Premium SUV \u20b940\u201345/km",
      ],
    };
  }

  if (bookingStep === "vehicle") {
    bookingData.vehicle = input.replace(
      /^[\uD83D\uDE97\uD83D\uDE90\uD83D\uDE99\uD83D\uDE9B]\s*/u,
      "",
    );
    sessionCtx.lastVehicle = bookingData.vehicle;
    bookingStep = "confirm";
    return {
      id,
      role: "bot",
      text: `Bahut badhiya! \uD83D\uDC4C\n\n\uD83D\uDCCB **Booking Summary:**\n\uD83D\uDC64 Name: ${bookingData.name}\n\uD83D\uDCDE Phone: ${bookingData.phone}\n\uD83D\uDCCD From: ${bookingData.from}\n\uD83D\uDCCD To: ${bookingData.to}\n\uD83D\uDCC5 Date: ${bookingData.date}\n\uD83D\uDE97 Vehicle: ${bookingData.vehicle}\n\n*Toll, state taxes & night charges (\u20b9300/night) extra as per actuals.*\n\nKya yeh sab sahi hai? Confirm karein! \u2705`,
      options: [
        "\u2705 Haan, Confirm Karein",
        "\u270F\uFE0F Badlaav Karna Hai",
      ],
    };
  }

  if (bookingStep === "confirm") {
    if (/haan|confirm|yes|\u2705/.test(input.toLowerCase())) {
      const msg = `Namaskar ji \uD83D\uDE4F%0A%0AMain ek taxi book karna chahta\/chahti hun:%0A%0A\uD83D\uDC64 Name: ${encodeURIComponent(bookingData.name || "")}%0A\uD83D\uDCDE Phone: ${encodeURIComponent(bookingData.phone || "")}%0A\uD83D\uDCCD From: ${encodeURIComponent(bookingData.from || "")}%0A\uD83D\uDCCD To: ${encodeURIComponent(bookingData.to || "")}%0A\uD83D\uDCC5 Date: ${encodeURIComponent(bookingData.date || "")}%0A\uD83D\uDE97 Vehicle: ${encodeURIComponent(bookingData.vehicle || "")}%0A%0AKripya confirm karein. Shukriya!`;
      window.open(`https://wa.me/919990104748?text=${msg}`, "_blank");
      bookingStep = "idle";
      bookingData = {};
      return {
        id,
        role: "bot",
        text: `Shukriya${sessionCtx.userName ? ` ${sessionCtx.userName} ji` : ""}! \uD83C\uDF89 WhatsApp khul raha hai \u2014 aapki booking details Gaurav ji ke paas pahunch jaayengi.\n\nWoh jald hi call ya WhatsApp karenge trip confirm karne ke liye. **Shubh Yatra!** \uD83D\uDE97\u2728`,
        options: ["Kuch aur poochhna hai", "Rates jaannein"],
      };
    }
    bookingStep = "name";
    bookingData = {};
    phoneRetryCount = 0;
    return {
      id,
      role: "bot",
      text: "Koi baat nahi! Chaliye dobara shuru karte hain. \uD83D\uDE0A\n\nPehle aapka **naam** batayein:",
    };
  }

  bookingStep = "idle";
  return getBotReply(input);
}

function getBotReply(input: string): Message {
  const msg = input.toLowerCase().trim();
  const id = Date.now();
  const lang = detectLanguage(input);

  if (bookingStep !== "idle") {
    return handleBookingStep(input);
  }

  if (isAskingDiscount(msg)) {
    return {
      id,
      role: "bot",
      text:
        lang === "hindi"
          ? `Sir/Ma'am, hamare rates already market mein best hain. Hum top-notch service provide karte hain \u2014 experienced drivers, brand new gaadiyan, aur 24/7 support. Isliye rates mein aur discount dena hamare liye possible nahi hai.\n\nFir bhi, agar aap booking karein toh hamare saath ek perfect trip guaranteed hai. \uD83D\uDE4F`
          : "Our rates are already competitive and reflect the premium quality we deliver \u2014 experienced drivers, company-owned vehicles, and 24/7 support. We\u2019re unable to offer further discounts, but we assure you won\u2019t be disappointed! \uD83D\uDE4F",
      options: [
        "\uD83D\uDCC5 Booking Karna Hai",
        "\uD83D\uDCB0 Rates Dekhein",
        "\uD83D\uDE97 Fleet Dekhein",
      ],
    };
  }

  if (isAngry(msg)) {
    sessionCtx.angryCount += 1;
    if (sessionCtx.angryCount >= 2) {
      return {
        id,
        role: "bot",
        text: "Main samajh sakta hun aap pareshan hain. Gaurav ji se seedha baat karein \u2014 woh personally iska hal karenge.\n\n\uD83D\uDCDE **Gaurav ji:** 9990104748\n\uD83D\uDCDE **Shyam Lal ji:** 9868901253",
        options: ["WhatsApp Gaurav ji", "WhatsApp Shyam Lal ji"],
      };
    }
    return {
      id,
      role: "bot",
      text: "Maafi chahta hun agar aapko koi takleef hui. Hamare liye har customer bahut khaas hai. \uD83D\uDE4F\n\nKya aap apni problem share karenge? Main poori koshish karunga iska solution dhundhne mein.",
      options: [
        "Problem batayein",
        "\uD83D\uDCDE Directly Call Karein",
        "WhatsApp Karein",
      ],
    };
  }

  if (
    /^(hi|hello|helo|namaste|namaskar|hey|hii|good morning|good evening|good afternoon|suprabhat|shubh|jai|ram ram)/.test(
      msg,
    )
  ) {
    const greeting = getGreeting();
    return {
      id,
      role: "bot",
      text: `${greeting}\n\nMain **Sevak** hun \u2014 Meena Tour & Travels ka 24/7 assistant. \uD83D\uDE4F\n\nKya aap koi trip plan kar rahe hain? Booking, rates, destinations \u2014 sab mein madad karunga!`,
      options: [
        "\uD83D\uDE97 Vehicles Dekhein",
        "\uD83D\uDCB0 Rates Jaannein",
        "\uD83D\uDDFA Destinations/Tours",
        "\uD83D\uDCC5 Booking Karna Hai",
        "\u2753 FAQ",
        "\uD83D\uDCDE Contact Karein",
      ],
    };
  }

  if (
    /rate|price|cost|kitna|fare|km|charges|estimate|kitne ka/.test(msg) &&
    /toll/.test(msg)
  ) {
    const routeResult = findRoute(msg);
    const baseText = routeResult
      ? `**${routeResult.from} \u2192 ${routeResult.to}:**\n\uD83D\uDE97 Sedan: ${routeResult.sedan}\n\uD83D\uDE90 Ertiga: ${routeResult.ertiga}\n\uD83D\uDE99 Innova: ${routeResult.innova}\n\uD83D\uDE9B SUV: ${routeResult.suv}\n\n\uD83D\uDCCD ~${routeResult.km} km | \u23F1 ${routeResult.time} | \uD83D\uDEE3 ${routeResult.highway}`
      : "**Per km rates:**\n\uD83D\uDE97 Sedan: \u20b918\u201322/km\n\uD83D\uDE90 Ertiga: \u20b922\u201328/km\n\uD83D\uDE99 Innova: \u20b928\u201335/km\n\uD83D\uDE9B SUV: \u20b940\u201345/km";
    return {
      id,
      role: "bot",
      text: `${baseText}\n\n**Toll ke baare mein:** Toll tax alag se charge hota hai \u2014 actual amount trip ke hisaab se hogi. Driver toll receipts rakhte hain aur final bill mein add ki jaati hai.`,
      options: ["\uD83D\uDCC5 Book Karna Hai", "\uD83D\uDE97 Fleet Dekhein"],
    };
  }

  const routeResult = findRoute(msg);
  if (
    routeResult &&
    /rate|price|cost|kitna|fare|km|charges|estimate|kitne ka/.test(msg)
  ) {
    sessionCtx.lastRoute = routeResult;
    sessionCtx.lastDestination = routeResult.to;
    return {
      id,
      role: "bot",
      text: `**${routeResult.from} \u2192 ${routeResult.to}** ka estimated fare:`,
      routeResult,
      options: [
        "\uD83D\uDCC5 Book This Trip",
        "\uD83D\uDE97 Other Vehicles",
        "\uD83D\uDDFA More Routes",
      ],
    };
  }

  if (routeResult) {
    sessionCtx.lastRoute = routeResult;
    sessionCtx.lastDestination = routeResult.to;
    return {
      id,
      role: "bot",
      text: `${routeResult.to} ek amazing destination hai! Yahan route aur fare details hain:`,
      routeResult,
      options: [
        "\uD83D\uDCC5 Book Karna Hai",
        "\uD83D\uDCB0 Rates Jaannein",
        "\uD83D\uDDFA Aur Destinations",
      ],
    };
  }

  if (
    /wahan|us route|is route|same route|uska|unka|iske|uske|ye route/.test(
      msg,
    ) &&
    sessionCtx.lastDestination
  ) {
    if (/toll/.test(msg)) {
      return {
        id,
        role: "bot",
        text: `${sessionCtx.lastDestination} route pe toll actual charges ke hisaab se extra lagta hai ji. Driver receipt rakhte hain \u2014 final bill mein clearly add hoti hai. Koi surprise charge nahi hoga.`,
        options: ["\uD83D\uDCC5 Book Karna Hai", "\uD83D\uDCB0 Per-km Rates"],
      };
    }
    if (/driver|gaadi|cab/.test(msg)) {
      return {
        id,
        role: "bot",
        text: `${sessionCtx.lastDestination} ke liye trip se **ek din pehle** aapko driver ka naam, number aur gaadi number WhatsApp pe bhej diya jaayega. Saare drivers **10\u201315+ saal** ke experienced professionals hain. \uD83D\uDC4D`,
        options: ["\uD83D\uDCC5 Booking Karna Hai"],
      };
    }
  }

  if (
    /book|booking|reserve|trip confirm|book karna|trip karna|cab chahiye|gaadi chahiye/.test(
      msg,
    )
  ) {
    bookingStep = "name";
    bookingData = {};
    phoneRetryCount = 0;
    return {
      id,
      role: "bot",
      text: "Bilkul! Aapki booking personally manage karunga. \uD83D\uDE0A\n\nPehle aapka **naam** batayein ji:",
    };
  }

  if (
    /fleet|gaadi|vehicle|car|cab|taxi|sedan|innova|ertiga|suv|crysta|gadi|kitni gaadi/.test(
      msg,
    )
  ) {
    return {
      id,
      role: "bot",
      text: "Meena Tour & Travels ki available fleet \u2014 sab company-owned, brand new gaadiyan: \uD83D\uDE97",
      cards: FLEET,
      options: [
        "\uD83D\uDCC5 Book Karna Hai",
        "\uD83D\uDCB0 Rates Poochhna Hai",
      ],
    };
  }

  if (/rate|price|cost|kitna|charges|fare|per km|km rate|kitne ka/.test(msg)) {
    return {
      id,
      role: "bot",
      text: "Hamare standard per-km rates ji:\n\n\uD83D\uDE97 **Sedan** (Dzire, Aura, Amaze): \u20b918\u201322/km\n\uD83D\uDE90 **Ertiga** (7-seater): \u20b922\u201328/km\n\uD83D\uDE99 **Innova Crysta**: \u20b928\u201335/km\n\uD83D\uDE9B **Premium SUV**: \u20b940\u201345/km\n\n\u26A0\uFE0F State taxes, tolls, aur driver night charges (\u20b9300/night) actual ke hisaab se extra hain.\n\nKisi specific route ka estimate chahiye? Bas origin \u2192 destination batayein!",
      options: [
        "Delhi to Jaipur rate?",
        "Delhi to Manali rate?",
        "Delhi to Agra rate?",
        "Delhi to Shimla rate?",
        "\uD83D\uDCC5 Book Karna Hai",
      ],
    };
  }

  if (/whatsapp gaurav/.test(msg)) {
    window.open(
      "https://wa.me/919990104748?text=Hello%2C%20I%20want%20to%20book%20a%20taxi%20with%20Meena%20Tour%20and%20Travels.",
      "_blank",
    );
    return {
      id,
      role: "bot",
      text: "WhatsApp khul raha hai \u2014 Gaurav ji (9990104748) se seedha baat karein. \uD83D\uDC4D",
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
      text: "WhatsApp khul raha hai \u2014 Shyam Lal ji (9868901253) se seedha baat karein. \uD83D\uDC4D",
      options: ["Kuch aur poochhna hai"],
    };
  }

  if (
    /destination|tour|package|trips|popular place|india tour|ghumna|yatra|places/.test(
      msg,
    )
  ) {
    return {
      id,
      role: "bot",
      text: "Hamare popular destinations \u2014 click karein booking shuru karne ke liye: \uD83D\uDDFA",
      destinations: DESTINATIONS,
      options: [
        "\uD83D\uDCC5 Booking Karna Hai",
        "\uD83D\uDCB0 Rates Jaannein",
      ],
    };
  }

  if (
    /contact|number|phone|call|helpline|reach|address|office|location|milna/.test(
      msg,
    )
  ) {
    return {
      id,
      role: "bot",
      text: "**Meena Tour & Travels \u2014 Contact:**\n\n\uD83D\uDCDE Gaurav ji (MD): **9990104748**\n\uD83D\uDCDE Shyam Lal ji (Corporate): **9868901253**\n\uD83D\uDCE7 meenagaurav4748@gmail.com\n\n\uD83D\uDCCD C-41, UGF, Khirki Ext, Panchsheel Vihar, Malviya Nagar, New Delhi \u2013 110017\n\n\uD83D\uDD50 Mon\u2013Sat: 9AM\u20137PM | Sunday: 10AM\u20135PM",
      options: ["WhatsApp Gaurav ji", "WhatsApp Shyam Lal ji"],
    };
  }

  if (/pay|payment|upi|bank|transfer|advance|deposit|paise|rupee/.test(msg)) {
    return {
      id,
      role: "bot",
      text: "**Payment Options ji:**\n\n\uD83D\uDCF2 **UPI:** shyamlalmeena4151@ibl (GPay, PhonePe, Paytm)\n\uD83C\uDFE6 **Bank Transfer:** A/C: 51112853125 | SBI | IFSC: SBIN0031580 | Branch: Mandir Marg, Saket (Name: GAURAV)\n\uD83D\uDCB5 **Cash:** Pickup pe de sakte hain\n\nBooking confirm karne ke liye advance zaruri hai.",
      options: ["\uD83D\uDCC5 Book Karna Hai", "\uD83D\uDCDE Contact Karein"],
    };
  }

  if (/toll/.test(msg)) {
    return {
      id,
      role: "bot",
      text: "Toll tax alag se charge hota hai ji \u2014 actual charges ke hisaab se. Hamare per-km rates mein toll included nahi hai. Trip ke baad actual toll ka receipt provide kiya jaata hai. Koi hidden charge nahi hoga.",
      options: ["Kuch aur poochhna hai", "\uD83D\uDCC5 Booking Karna Hai"],
    };
  }

  if (/night|raat/.test(msg)) {
    return {
      id,
      role: "bot",
      text: "Driver ke liye night charges **\u20b9300 per night** hain ji. Yeh actual ke hisaab se final bill mein add hote hain \u2014 agar trip mein raat ka ruk-na ho tabhi lagta hai.",
      options: ["Kuch aur poochhna hai", "\uD83D\uDCC5 Booking Karna Hai"],
    };
  }

  if (/km limit|kms limit|minimum km|limit|zyada km/.test(msg)) {
    return {
      id,
      role: "bot",
      text: "Outstation trips mein minimum **250\u2013300 km per day** ka charge hota hai ji. Agar aap isse zyada chalate hain, toh per-km rate hi lagega \u2014 bilkul transparent billing.",
      options: ["Kuch aur poochhna hai", "\uD83D\uDCC5 Booking Karna Hai"],
    };
  }

  if (
    /driver|driver detail|cab detail|gaadi number|driving experience/.test(msg)
  ) {
    return {
      id,
      role: "bot",
      text: "Trip se **ek din pehle** aapko WhatsApp pe driver ka naam, phone number, aur gaadi ka number bhej diya jaata hai. \uD83D\uDCF1\n\nHamare saare drivers **10\u201315+ saal** ke experienced professionals hain \u2014 safe aur reliable travel guaranteed!",
      options: ["\uD83D\uDCC5 Booking Karna Hai", "Kuch aur poochhna hai"],
    };
  }

  if (/cancel/.test(msg)) {
    return {
      id,
      role: "bot",
      text: "Cancellation ke liye seedha Gaurav ji ya Shyam Lal ji se baat karein ji:\n\uD83D\uDCDE 9990104748 (Gaurav) | 9868901253 (Shyam Lal ji)\n\nWoh personally aapka maamla handle karenge.",
      options: ["WhatsApp Gaurav ji", "WhatsApp Shyam Lal ji"],
    };
  }

  if (/faq|common question|kya hai|help|sawaal|poochhna/.test(msg)) {
    return {
      id,
      role: "bot",
      text: "Yeh hain common sawaal \u2014 koi bhi chunein:",
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

  if (
    /meena tour|company|about|kaun|who|business|since|founded|history|gstin|trust/.test(
      msg,
    )
  ) {
    return {
      id,
      role: "bot",
      text: "**Meena Tour & Travels** \u2014 Delhi ki trusted travel agency, 2011 se service de rahi hai. \uD83D\uDE4F\n\n\u2705 GSTIN Registered: 07BQXPG8115J1ZB\n\u2705 All India Tourist Permit\n\u2705 15,000+ satisfied passengers\n\u2705 1000+ destinations covered\n\u2705 Reliance Industries \u2014 8 saal se client\n\u2705 Mangal Singh Lodha ji \u2014 7 saal se client\n\nCo-founders: **GAURAV** (MD) & **Shyam Lal Meena** (Director, Corporate Relations)",
      options: [
        "\uD83D\uDE97 Fleet Dekhein",
        "\uD83D\uDCB0 Rates Jaannein",
        "\uD83D\uDCDE Contact Karein",
      ],
    };
  }

  if (
    /itinerary|plan|planning|day by day|schedule|agenda|kaise jaayein|route plan/.test(
      msg,
    )
  ) {
    const dest = sessionCtx.lastDestination;
    return {
      id,
      role: "bot",
      text: dest
        ? `${dest} ke liye trip planning mein madad kar sakta hun! Kitne din ka trip plan kar rahe hain?\n\n**Ek quick suggestion:**\n\uD83D\uDCC5 Day 1: Delhi se ${dest} drive (early morning best)\n\uD83C\uDFE8 Reach hotel, settle in\n\uD83D\uDDFA Day 2+ onwards: Local sightseeing with our driver\n\nExact itinerary ke liye Gaurav ji ya Shyam Lal ji se personally baat karein \u2014 woh best advice denge.`
        : "Trip planning mein zaroor madad kar sakta hun! Pehle destination batayein \u2014 phir I can give you a quick overview of the journey.",
      options: [
        "\uD83D\uDCC5 Trip Book Karna Hai",
        "\uD83D\uDDFA Destinations Dekhein",
        "\uD83D\uDCDE Expert se Baat Karein",
      ],
    };
  }

  return {
    id,
    role: "bot",
    text:
      lang === "hindi"
        ? "Samajh gaya ji! Neeche se koi option chunein ya apna sawaal seedha likhein \u2014 main haazir hun. \uD83D\uDE0A\n\nYa direct baat karein:\n\uD83D\uDCDE Gaurav ji: 9990104748 | Shyam Lal ji: 9868901253"
        : "I\u2019m here to help! Please choose from the options below or type your question directly. \uD83D\uDE0A\n\nOr call directly:\n\uD83D\uDCDE Gaurav: 9990104748 | Shyam Lal: 9868901253",
    options: [
      "\uD83D\uDE97 Vehicles Dekhein",
      "\uD83D\uDCB0 Rates Jaannein",
      "\uD83D\uDDFA Destinations",
      "\uD83D\uDCC5 Booking Karna Hai",
      "\u2753 FAQ",
      "\uD83D\uDCDE Contact Karein",
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
      text: `${greeting}\n\nMain **Sevak** hun \u2014 Meena Tour & Travels ka 24/7 assistant. \uD83D\uDE4F\n\nTrip planning, rates, destinations, booking \u2014 sab mein madad karunga. Bas batayein!`,
      options: [
        "\uD83D\uDE97 Vehicles Dekhein",
        "\uD83D\uDCB0 Rates Jaannein",
        "\uD83D\uDDFA Destinations/Tours",
        "\uD83D\uDCC5 Booking Karna Hai",
        "\u2753 FAQ",
        "\uD83D\uDCDE Contact Karein",
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
          style={{ maxHeight: "560px" }}
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
                        {msg.routeResult.from} \u2192 {msg.routeResult.to}
                      </div>
                      <div className="text-[11px] text-gray-600 space-y-0.5">
                        <div>
                          \uD83D\uDCCD Distance: ~{msg.routeResult.km} km
                        </div>
                        <div>\u23F1 Travel Time: ~{msg.routeResult.time}</div>
                        <div>
                          \uD83D\uDEE3 Highway: {msg.routeResult.highway}
                        </div>
                      </div>
                      <div className="mt-2 pt-2 border-t border-orange-100 space-y-0.5">
                        <div className="text-[11px]">
                          \uD83D\uDE97 <strong>Sedan:</strong>{" "}
                          {msg.routeResult.sedan}
                        </div>
                        <div className="text-[11px]">
                          \uD83D\uDE90 <strong>Ertiga:</strong>{" "}
                          {msg.routeResult.ertiga}
                        </div>
                        <div className="text-[11px]">
                          \uD83D\uDE99 <strong>Innova:</strong>{" "}
                          {msg.routeResult.innova}
                        </div>
                        <div className="text-[11px]">
                          \uD83D\uDE9B <strong>Premium SUV:</strong>{" "}
                          {msg.routeResult.suv}
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
