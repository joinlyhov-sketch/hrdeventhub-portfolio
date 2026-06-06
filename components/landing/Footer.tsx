import { Mails, MapPin, Phone } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-white pt-20 pb-10 px-6 w-full">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        
        <div>
          <div className="flex items-center gap-2 mb-6">
            <Image
              src="/images/Logo.webp"
              alt="HRD Event Hub Logo"
              width={150}
              height={150}
            />
          </div>
          <p className="text-slate-400 type-detail max-w-xs leading-relaxed">
            The official event management platform for HRD students.
            Orchestrating professional excellence.
          </p>
        </div>

        <div>
          <h5 className="type-detail-semibold mb-6 uppercase text-slate-900">
            Contact & Support
          </h5>

          <ul className="space-y-5 type-detail text-slate-500">
            <li className="flex items-start gap-3">
              <MapPin className="w-4 h-4 mt-1 text-slate-500" />
              <span>
                No. 12, st.323, Boeung Kak 2, Toul Kork, Phnom Penh, Cambodia
              </span>
            </li>

            <li className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-slate-500" />
              <span>023 991 314</span>
            </li>

            <li className="flex items-center gap-3">
              <Mails className="w-4 h-4 text-slate-500" />
              <span>info.kshrd@gmail.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-10 border-t border-slate-100 flex justify-center items-center type-detail text-slate-400 tracking-widest">
        <p>© 2026 HRD EventHub. Orchestrating professional excellence.</p>
      </div>
    </footer>
  );
}