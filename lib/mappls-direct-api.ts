// Mappls Direct API Service - Using REST APIs without SDK
"use server";

const MAPPLS_API_BASE = 'https://apis.mappls.com';

interface MapplsConfig {
  apiKey: string;
  clientId: string;
  clientSecret: string;
  baseUrl: string;
}

// Mappls configuration from environment
const mapplsConfig: MapplsConfig = {
  apiKey: process.env.NEXT_PUBLIC_MAPPLS_API_KEY || 'YOUR_API_KEY',
  clientId: process.env.MAPPLS_CLIENT_ID || 'YOUR_CLIENT_ID',
  clientSecret: process.env.MAPPLS_CLIENT_SECRET || 'YOUR_CLIENT_SECRET',
  baseUrl: MAPPLS_API_BASE
};

// Access token cache
let accessToken: string | null = null;
let tokenExpiryTime: number = 0;

// Get OAuth access token for Mappls APIs
async function getAccessToken(): Promise<string> {
  // Return cached token if still valid
  if (accessToken && Date.now() < tokenExpiryTime) {
    return accessToken;
  }

  try {
    console.log('🔑 Getting Mappls OAuth token...');
    
    const response = await fetch(`${MAPPLS_API_BASE}/advancedmaps/v1/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: mapplsConfig.clientId,
        client_secret: mapplsConfig.clientSecret,
      }),
    });

    if (!response.ok) {
      throw new Error(`OAuth failed: ${response.status}`);
    }

    const data = await response.json();
    accessToken = data.access_token;
    tokenExpiryTime = Date.now() + (data.expires_in * 1000) - 60000; // 1 minute buffer

    console.log('✅ Got Mappls access token');
    return accessToken;
    
  } catch (error) {
    console.error('❌ Failed to get Mappls token:', error);
    throw error;
  }
}

// Mappls Place Categories for Indore search
const PLACE_CATEGORIES = {
  RESTAURANTS: 'RESTRNT',
  CAFES: 'COFFEE',
  BARS: 'BAR',
  HOTELS: 'HOTEL',
  GYMS: 'SPORTS',
  PARLOURS: 'BEAUTY',
  SHOPPING: 'SHOP',
  HOSPITALS: 'HEALTH',
  ATM: 'ATM',
  PETROL: 'PETROL'
};

interface MapplsPlace {
  placeName: string;
  placeAddress: string;
  latitude: number;
  longitude: number;
  categoryCode: string;
  distance: number;
  rating?: number;
  phone?: string;
  website?: string;
  mapplsPin?: string;
}

interface PlaceSearchOptions {
  location: string; // Indore coordinates or city name
  radius?: number; // Search radius in meters
  category?: string;
  page?: number;
  pageSize?: number;
}

// Search places around Indore using Mappls Nearby API
export async function searchIndorePlaces(options: PlaceSearchOptions): Promise<MapplsPlace[]> {
  try {
    console.log('🔍 Searching Indore places with Mappls API...');
    
    const token = await getAccessToken();
    
    // Default to Indore coordinates if not provided
    const location = options.location || '22.7196,75.8577'; // Indore center
    
    const params = new URLSearchParams({
      location: location,
      radius: (options.radius || 5000).toString(),
      page: (options.page || 1).toString(),
      region: 'IND',
      ...(options.category && { categoryCode: options.category })
    });

    const response = await fetch(`${MAPPLS_API_BASE}/advancedmaps/v1/nearby?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Mappls API failed: ${response.status}`);
    }

    const data = await response.json();
    console.log(`✅ Found ${data.results?.length || 0} places from Mappls`);
    
    return data.results || [];
    
  } catch (error) {
    console.error('❌ Mappls places search failed:', error);
    
    // Return mock data for demo
    return getMockIndorePlaces();
  }
}

// Get all types of places around Indore
export async function getAllIndorePlaces(): Promise<{
  restaurants: MapplsPlace[];
  cafes: MapplsPlace[];
  bars: MapplsPlace[];
  hotels: MapplsPlace[];
  gyms: MapplsPlace[];
  parlours: MapplsPlace[];
  total: number;
}> {
  console.log('🏙️ Getting all Indore places from Mappls...');
  
  try {
    // Search for different categories in parallel
    const [restaurants, cafes, bars, hotels, gyms, parlours] = await Promise.all([
      searchIndorePlaces({ location: '22.7196,75.8577', category: PLACE_CATEGORIES.RESTAURANTS, radius: 10000 }),
      searchIndorePlaces({ location: '22.7196,75.8577', category: PLACE_CATEGORIES.CAFES, radius: 10000 }),
      searchIndorePlaces({ location: '22.7196,75.8577', category: PLACE_CATEGORIES.BARS, radius: 10000 }),
      searchIndorePlaces({ location: '22.7196,75.8577', category: PLACE_CATEGORIES.HOTELS, radius: 10000 }),
      searchIndorePlaces({ location: '22.7196,75.8577', category: PLACE_CATEGORIES.GYMS, radius: 10000 }),
      searchIndorePlaces({ location: '22.7196,75.8577', category: PLACE_CATEGORIES.PARLOURS, radius: 10000 }),
    ]);

    const result = {
      restaurants,
      cafes,
      bars,
      hotels,
      gyms,
      parlours,
      total: restaurants.length + cafes.length + bars.length + hotels.length + gyms.length + parlours.length
    };

    console.log(`🎯 Total places found: ${result.total}`);
    return result;
    
  } catch (error) {
    console.error('❌ Failed to get all Indore places:', error);
    return {
      restaurants: [],
      cafes: [],
      bars: [],
      hotels: [],
      gyms: [],
      parlours: [],
      total: 0
    };
  }
}

// Get route between two points using Mappls Route API
export async function getMapplsRoute(
  origin: string, 
  destination: string, 
  profile: 'driving' | 'walking' | 'biking' = 'driving'
): Promise<any> {
  try {
    console.log('🗺️ Getting route from Mappls...');
    
    const token = await getAccessToken();
    
    const response = await fetch(`${MAPPLS_API_BASE}/advancedmaps/v1/route`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        locations: `${origin};${destination}`,
        radiuses: '1000;1000',
        profile: profile,
        steps: true,
        geometries: 'geojson',
        overview: 'full'
      }),
    });

    if (!response.ok) {
      throw new Error(`Route API failed: ${response.status}`);
    }

    const routeData = await response.json();
    console.log('✅ Got route from Mappls');
    
    return routeData;
    
  } catch (error) {
    console.error('❌ Route calculation failed:', error);
    return null;
  }
}

// Get place details by Mappls PIN
export async function getPlaceDetails(mapplsPin: string): Promise<any> {
  try {
    console.log(`🔍 Getting place details for PIN: ${mapplsPin}`);
    
    const token = await getAccessToken();
    
    const response = await fetch(`${MAPPLS_API_BASE}/advancedmaps/v1/place_detail?place_id=${mapplsPin}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Place details failed: ${response.status}`);
    }

    const placeData = await response.json();
    console.log('✅ Got place details from Mappls');
    
    return placeData;
    
  } catch (error) {
    console.error('❌ Place details failed:', error);
    return null;
  }
}

// Search places by text query
export async function searchPlacesByText(query: string, location?: string): Promise<MapplsPlace[]> {
  try {
    console.log(`🔍 Searching places by text: "${query}"`);
    
    const token = await getAccessToken();
    
    const params = new URLSearchParams({
      query: query,
      region: 'IND',
      ...(location && { location: location })
    });

    const response = await fetch(`${MAPPLS_API_BASE}/advancedmaps/v1/textsearch?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Text search failed: ${response.status}`);
    }

    const data = await response.json();
    console.log(`✅ Found ${data.results?.length || 0} places by text search`);
    
    return data.results || [];
    
  } catch (error) {
    console.error('❌ Text search failed:', error);
    return [];
  }
}

// Mock data for demo purposes when API is not available
function getMockIndorePlaces(): MapplsPlace[] {
  return [
    {
      placeName: "Sarafa Bazaar",
      placeAddress: "Sarafa Bazaar, Old Palasia, Indore, MP",
      latitude: 22.7178,
      longitude: 75.8431,
      categoryCode: "RESTRNT",
      distance: 500,
      rating: 4.5,
      mapplsPin: "INDORE001"
    },
    {
      placeName: "Chappan Dukan",
      placeAddress: "New Palasia, Indore, MP",
      latitude: 22.7244,
      longitude: 75.8715,
      categoryCode: "RESTRNT",
      distance: 800,
      rating: 4.3,
      mapplsPin: "INDORE002"
    },
    {
      placeName: "Nafees Restaurant",
      placeAddress: "Chhoti Khajrani, Indore, MP",
      latitude: 22.7013,
      longitude: 75.8567,
      categoryCode: "RESTRNT",
      distance: 1200,
      rating: 4.4,
      mapplsPin: "INDORE003"
    },
    {
      placeName: "IIT Indore",
      placeAddress: "IIT Indore, Simrol, Indore, MP",
      latitude: 22.5200,
      longitude: 75.9200,
      categoryCode: "EDUCATION",
      distance: 15000,
      rating: 4.8,
      mapplsPin: "INDORE004"
    },
    {
      placeName: "Phoenix Citywalk Mall",
      placeAddress: "MG Road, Indore, MP",
      latitude: 22.7542,
      longitude: 75.8926,
      categoryCode: "SHOP",
      distance: 2500,
      rating: 4.6,
      mapplsPin: "INDORE005"
    }
  ];
}

export { PLACE_CATEGORIES, type MapplsPlace, type PlaceSearchOptions };
