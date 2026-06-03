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
  const embedUrl = latitude && longitude
    ? `http://googleusercontent.com/maps.google.com/maps?q=${latitude},${longitude}&t=&z=15&ie=UTF8&iwloc=&output=embed`
    : "";

  return (
    <section className="flex flex-col items-start justify-between h-full pt-2">
      {embedUrl ? (
        <iframe
          src={embedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="rounded-xl min-h-[220px]"
        />
      ) : (
        <div className="w-full h-full min-h-[220px] rounded-xl bg-grey-100 flex items-center justify-center text-grey-400 text-sm border border-dashed">
          Map placement layout is unavailable
        </div>
      )}

      {googleMapUrl && (
        <a
          href={googleMapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 underline underline-blue-500 offset-1 decoration-1 text-blue-400 break-all text-xs"
        >
          {locationName || googleMapUrl}
        </a>
      )}
    </section>
  );
}