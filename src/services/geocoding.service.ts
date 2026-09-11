// Uses OpenStreetMap's Nominatim public API — matches the tile provider already used by SalonsMap.

export interface GeocodeResult {
  latitude: number;
  longitude: number;
  address: string;
}

export const geocodingService = {
  geocodeAddress: async (query: string): Promise<GeocodeResult | null> => {
    try {
      const params = new URLSearchParams({ q: query, format: 'json', limit: '1' });
      const res = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`);
      const data = await res.json();
      const first = data[0];
      if (!first) return null;

      return {
        latitude: Number(first.lat),
        longitude: Number(first.lon),
        address: first.display_name,
      };
    } catch {
      return null;
    }
  },

  reverseGeocode: async (latitude: number, longitude: number): Promise<string | null> => {
    try {
      const params = new URLSearchParams({
        lat: String(latitude),
        lon: String(longitude),
        format: 'json',
      });
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?${params.toString()}`);
      const data = await res.json();
      return data.display_name ?? null;
    } catch {
      return null;
    }
  },
};
