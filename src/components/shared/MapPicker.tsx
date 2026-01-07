import { FC, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

export interface AddressComponents {
  county?: string;
  city?: string;
  street?: string;
  streetNumber?: string;
}

interface MapPickerProps {
  latitude?: number;
  longitude?: number;
  onChange: (lat: number, lng: number, address?: AddressComponents) => void;
  label?: string;
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    H: any;
  }
}

const HERE_API_KEY = import.meta.env.VITE_HERE_MAPS_API_KEY || '';

const reverseGeocode = async (lat: number, lng: number): Promise<AddressComponents | null> => {
  try {
    const res = await fetch(
      `https://revgeocode.search.hereapi.com/v1/revgeocode?at=${lat},${lng}&apiKey=${HERE_API_KEY}&lang=ro`
    );
    const data = await res.json();
    const addr = data.items?.[0]?.address;
    return addr
      ? {
          county: addr.county,
          city: addr.city || addr.district,
          street: addr.street,
          streetNumber: addr.houseNumber,
        }
      : null;
  } catch {
    return null;
  }
};

export const geocodeAddress = async (
  county?: string,
  city?: string,
  street?: string,
  streetNumber?: string,
  postalCode?: string
): Promise<{ lat: number; lon: number; accuracy: 'exact' | 'street' | 'city' } | null> => {
  if (!city) {
    return null;
  }

  const tryGeocode = async (query: string): Promise<{ lat: number; lon: number } | null> => {
    try {
      const res = await fetch(
        `https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(query)}&apiKey=${HERE_API_KEY}&limit=1&lang=ro`
      );
      const data = await res.json();
      if (data?.items?.[0]) {
        return { lat: data.items[0].position.lat, lon: data.items[0].position.lng };
      }
      return null;
    } catch {
      return null;
    }
  };

  if (street && streetNumber && postalCode) {
    const coords = await tryGeocode(`${street} ${streetNumber}, ${city}, ${county || 'Romania'}, ${postalCode}`);
    if (coords) return { ...coords, accuracy: 'exact' };
  }

  if (street && streetNumber) {
    const coords = await tryGeocode(`${street} ${streetNumber}, ${city}, ${county || 'Romania'}`);
    if (coords) return { ...coords, accuracy: 'exact' };
  }

  if (street) {
    const coords = await tryGeocode(`${street}, ${city}, ${county || 'Romania'}`);
    if (coords) return { ...coords, accuracy: 'street' };
  }

  const coords = await tryGeocode(`${city}, ${county || 'Romania'}`);
  if (coords) return { ...coords, accuracy: 'city' };

  return null;
};

export const MapPicker: FC<MapPickerProps> = ({ latitude, longitude, onChange, label }) => {
  const { t } = useTranslation();
  const mapRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstance = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markerRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const behaviorRef = useRef<any>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!ready || !mapRef.current || mapInstance.current || !window.H) return;

    const platform = new window.H.service.Platform({ apikey: HERE_API_KEY });
    const layers = platform.createDefaultLayers();

    const map = new window.H.Map(mapRef.current, layers.vector.normal.map, {
      center: { lat: latitude || 45.9432, lng: longitude || 24.9668 },
      zoom: latitude ? 15 : 7,
      pixelRatio: window.devicePixelRatio || 1,
    });

    const mapEvents = new window.H.mapevents.MapEvents(map);
    const behavior = new window.H.mapevents.Behavior(mapEvents);
    behaviorRef.current = behavior;

    window.H.ui.UI.createDefault(map, layers);
    window.addEventListener('resize', () => map.getViewPort().resize());

    // Drag marker events on MAP (not marker)
    map.addEventListener(
      'dragstart',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (ev: any) => {
        const target = ev.target;
        if (target instanceof window.H.map.Marker) {
          behavior.disable();
        }
      },
      false
    );

    map.addEventListener(
      'drag',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (ev: any) => {
        const target = ev.target;
        const pointer = ev.currentPointer;
        if (target instanceof window.H.map.Marker) {
          target.setGeometry(map.screenToGeo(pointer.viewportX, pointer.viewportY));
        }
      },
      false
    );

    map.addEventListener(
      'dragend',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      async (ev: any) => {
        const target = ev.target;
        if (target instanceof window.H.map.Marker) {
          behavior.enable();
          const pos = target.getGeometry();
          const address = await reverseGeocode(pos.lat, pos.lng);
          onChange(pos.lat, pos.lng, address || undefined);
        }
      },
      false
    );

    // Click to place marker
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    map.addEventListener('tap', async (e: any) => {
      // Ignore if tapping on marker
      if (e.target instanceof window.H.map.Marker) return;

      const coords = map.screenToGeo(e.currentPointer.viewportX, e.currentPointer.viewportY);
      if (coords) {
        setMarker(map, coords.lat, coords.lng);
        const address = await reverseGeocode(coords.lat, coords.lng);
        onChange(coords.lat, coords.lng, address || undefined);
      }
    });

    mapInstance.current = map;
    if (latitude && longitude) setMarker(map, latitude, longitude);

    return () => {
      map.dispose();
      mapInstance.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  useEffect(() => {
    if (mapInstance.current && latitude && longitude) {
      setMarker(mapInstance.current, latitude, longitude);
      mapInstance.current.setCenter({ lat: latitude, lng: longitude });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latitude, longitude]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setMarker = (map: any, lat: number, lng: number) => {
    if (markerRef.current) {
      map.removeObject(markerRef.current);
    }

    const marker = new window.H.map.Marker({ lat, lng }, { volatility: true });
    marker.draggable = true;
    map.addObject(marker);
    markerRef.current = marker;
  };

  return (
    <div className="w-full">
      {label && <label className="block text-text text-sm font-semibold mb-2">{label}</label>}
      <div
        ref={mapRef}
        style={{ width: '100%', height: '400px', background: '#eee' }}
        className="rounded-lg border border-border"
      />
      <p className="text-xs text-text/60 mt-2">{t('mapInstructions')}</p>
    </div>
  );
};
