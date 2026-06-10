"use client";

import { useEffect, useRef, useState } from "react";

interface MapContentProps {
  locationId?: string;
  locationName?: string;
  googleMapUrl?: string;
  latitude?: number;
  longitude?: number;
}

export default function MapContentComponent({
  locationName = "",
  googleMapUrl = "",
  latitude,
  longitude,
}: MapContentProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const initializingRef = useRef(false); 
  const [geocodeFailed, setGeocodeFailed] = useState(false);

  const lat = latitude && latitude !== 0 ? latitude : null;
  const lng = longitude && longitude !== 0 ? longitude : null;

  useEffect(() => {
    if (!mapRef.current) return;
    if (mapInstanceRef.current) {
      mapInstanceRef.current.invalidateSize();
      return;
    }
    if (initializingRef.current) return; 
    initializingRef.current = true;

    const initMap = async (resolvedLat: number, resolvedLng: number) => {
      if (!mapRef.current) return;

      const L = (await import("leaflet")).default;

      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });
      if ((mapRef.current as any)._leaflet_id) return;

      const map = L.map(mapRef.current).setView([resolvedLat, resolvedLng], 15);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      L.marker([resolvedLat, resolvedLng])
        .addTo(map)
        .bindPopup(locationName || "Location")
        .openPopup();

      mapInstanceRef.current = map;
      setTimeout(() => map.invalidateSize(), 200);
    };

    const resolve = async () => {
      try {
        if (lat && lng) {
          await initMap(lat, lng);
          return;
        }

        if (locationName) {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(locationName)}&format=json&limit=1`,
            { headers: { "Accept-Language": "en" } }
          );
          const data = await res.json();
          if (data?.length > 0) {
            await initMap(parseFloat(data[0].lat), parseFloat(data[0].lon));
            return;
          }
        }

        setGeocodeFailed(true);
      } catch (e) {
        console.error("Map init failed:", e);
        setGeocodeFailed(true);
      } finally {
        initializingRef.current = false;
      }
    };

    resolve();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      initializingRef.current = false;
    };
  }, [lat, lng, locationName]);

  return (
    <section className="flex flex-col items-start justify-between h-full pt-2">
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />

      {geocodeFailed ? (
        googleMapUrl || locationName ? (
          <iframe
            src={`https://maps.google.com/maps?q=${encodeURIComponent(locationName || googleMapUrl)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
            width="100%"
            style={{ height: "220px", minHeight: "220px", border: 0 }}
            className="rounded-xl"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : (
          <div className="w-full min-h-[220px] rounded-xl bg-grey-100 flex items-center justify-center text-grey-400 text-sm border border-dashed">
            Map placement layout is unavailable
          </div>
        )
      ) : (
        <div
          ref={mapRef}
          className="w-full rounded-xl overflow-hidden"
          style={{ height: "220px", minHeight: "220px" }}
        />
      )}

      {googleMapUrl && (
        <a
          href={googleMapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 underline decoration-1 text-blue-400 break-all text-xs"
        >
          {locationName || googleMapUrl}
        </a>
      )}
    </section>
  );
}