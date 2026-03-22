// MapMyIndia API credentials
const CLIENT_ID =
  "96dHZVzsAuvxRSSYplZvIWDvGQIR_WWPqgKlV1pNTl1KHSvZsez2SN6PHQ21hW7phx3-rdPr3vcqiter0iM3rg==";
const CLIENT_SECRET =
  "lrFxI-iSEg_TmqA0nCQhMtyWC8k0cQOAKVrpkWtkwPIfhoQPNWa_xhQ3-NuANE2DVr54LQheU7RzdDqu5-wlLjE7IkfxZZqe";

interface TokenCache {
  token: string;
  expiresAt: number;
}

let tokenCache: TokenCache | null = null;

export async function getAccessToken(): Promise<string> {
  if (tokenCache && Date.now() < tokenCache.expiresAt) {
    return tokenCache.token;
  }

  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
  });

  const res = await fetch(
    "https://outpost.mapmyindia.com/api/security/oauth/token",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    },
  );

  if (!res.ok) {
    throw new Error(`Token fetch failed: ${res.status}`);
  }

  const data = await res.json();
  const expiresIn = data.expires_in ? Number(data.expires_in) * 1000 : 3600000;
  tokenCache = {
    token: data.access_token,
    expiresAt: Date.now() + expiresIn - 60000,
  };

  return tokenCache.token;
}

// City coordinates map [lat, lng]
export const CITY_COORDS: Record<string, [number, number]> = {
  Delhi: [28.6139, 77.209],
  Agra: [27.1767, 78.0081],
  Jaipur: [26.9124, 75.7873],
  Haridwar: [29.9457, 78.1642],
  Rishikesh: [30.0869, 78.2676],
  Manali: [32.2396, 77.1887],
  Shimla: [31.1048, 77.1734],
  Chandigarh: [30.7333, 76.7794],
  Mathura: [27.4924, 77.6737],
  Vrindavan: [27.5794, 77.7013],
  Varanasi: [25.3176, 82.9739],
  Ayodhya: [26.7922, 82.1998],
  Amritsar: [31.634, 74.8723],
  Dehradun: [30.3165, 78.0322],
  Nainital: [29.3919, 79.4542],
  Mussoorie: [30.4598, 78.0664],
  Pushkar: [26.4899, 74.5513],
  Bikaner: [28.0229, 73.3119],
  Ajmer: [26.4499, 74.6399],
  Kota: [25.2138, 75.8648],
  Jodhpur: [26.2389, 73.0243],
  Udaipur: [24.5854, 73.7125],
  Jaisalmer: [26.9157, 70.9083],
  Ranthambore: [26.0173, 76.5026],
  "Sawai Madhopur": [25.9995, 76.3512],
  Chittorgarh: [24.8887, 74.6269],
  Bharatpur: [27.2152, 77.4938],
  Alwar: [27.5529, 76.6346],
  Lucknow: [26.8467, 80.9462],
  Kanpur: [26.4499, 80.3319],
  "Allahabad (Prayagraj)": [25.4358, 81.8463],
  Prayagraj: [25.4358, 81.8463],
  Gwalior: [26.2183, 78.1828],
  Bhopal: [23.2599, 77.4126],
  Indore: [22.7196, 75.8577],
  Nashik: [20.0059, 73.7897],
  Pune: [18.5204, 73.8567],
  Mumbai: [19.076, 72.8777],
  Kolkata: [22.5726, 88.3639],
  Hyderabad: [17.385, 78.4867],
  Bangalore: [12.9716, 77.5946],
  Goa: [15.2993, 74.124],
  "Salasar Balaji": [27.8987, 74.9286],
  "Khatu Shyam": [27.7045, 75.0836],
  Sikar: [27.6094, 75.1399],
  Barmer: [25.7462, 71.3921],
  Pali: [25.7711, 73.3234],
  Nagaur: [27.2032, 73.7323],
  Bundi: [25.4392, 75.6464],
  Tonk: [26.1681, 75.7893],
  Udhampur: [32.9169, 75.1417],
  Pathankot: [32.2747, 75.6522],
  Dharamshala: [32.219, 76.3234],
  Kasol: [32.0142, 77.3138],
  Spiti: [32.2461, 78.0353],
  Leh: [34.1526, 77.5771],
  Jammu: [32.7266, 74.857],
  Srinagar: [34.0837, 74.7973],
  Aligarh: [27.8974, 78.088],
  Harigarh: [27.8837, 78.107],
  Faridabad: [28.4089, 77.3178],
  Gurugram: [28.4595, 77.0266],
  Noida: [28.5355, 77.391],
  Meerut: [28.9845, 77.7064],
  Bareilly: [28.367, 79.4304],
  Pondicherry: [11.9416, 79.8083],
};

export interface RouteInfo {
  distanceKm: number;
  durationHrs: number;
  tollCount?: number;
  source: "live" | "static";
}

export async function getRouteInfo(
  origin: string,
  dest: string,
): Promise<RouteInfo | null> {
  const originCoords = CITY_COORDS[origin];
  const destCoords = CITY_COORDS[dest];

  if (!originCoords || !destCoords) {
    return null;
  }

  try {
    const token = await getAccessToken();

    // MapMyIndia route API uses lng,lat order (NOT lat,lng)
    const [oLat, oLng] = originCoords;
    const [dLat, dLng] = destCoords;

    // Correct coordinate order: longitude,latitude
    const url = `https://apis.mapmyindia.com/advancedmaps/v1/${token}/route_adv/driving/${oLng},${oLat};${dLng},${dLat}?geometries=polyline&steps=false`;

    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Route API failed: ${res.status}`);
    }

    const data = await res.json();

    const routeLegs = data?.routes?.[0]?.legs;
    if (!routeLegs || routeLegs.length === 0) {
      throw new Error("No route data in response");
    }

    let totalDistanceM = 0;
    let totalDurationS = 0;

    for (const leg of routeLegs) {
      totalDistanceM += leg.distance || 0;
      totalDurationS += leg.duration || 0;
    }

    const distanceKm = Math.round(totalDistanceM / 1000);
    const durationHrs = Math.round((totalDurationS / 3600) * 10) / 10;

    const tollCost = data?.routes?.[0]?.toll_cost;
    const tollCount = tollCost !== undefined ? tollCost : undefined;

    return {
      distanceKm,
      durationHrs,
      tollCount,
      source: "live",
    };
  } catch (err) {
    console.warn("MapMyIndia API error:", err);
    return null;
  }
}
