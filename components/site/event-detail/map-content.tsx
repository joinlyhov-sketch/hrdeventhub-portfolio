"use client";

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
  const lat = latitude && latitude !== 0 ? latitude : null;
  const lng = longitude && longitude !== 0 ? longitude : null;

  const searchQuery =
    lat && lng
      ? `${lat},${lng}`
      : encodeURIComponent(locationName || googleMapUrl);

  return (
    <section className="flex flex-col items-start justify-between h-full pt-1 w-full">
      {searchQuery ? (
        <iframe
          src={`https://maps.google.com/maps?q=${searchQuery}&t=&z=15&ie=UTF8&iwloc=A&output=embed`}
          width="100%"
          style={{ height: "236px", minHeight: "220px", border: 0 }}
          className="rounded-xl"
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : (
        <div className="w-full min-h-55 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 text-sm border border-dashed">
          Map placement layout is unavailable
        </div>
      )}
    </section>
  );
}
