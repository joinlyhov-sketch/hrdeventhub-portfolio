import { Mails, MapPin, Phone, Globe } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-white pt-8 pb-6 px-4 md:px-24 lg:px-48 w-full">
      <div className="w-full grid grid-cols-1 md:grid-cols-3">
        <div>
          <div className="flex items-center mb-3">
            <Image
              src="/images/Logo.webp"
              alt="HRD Event Hub Logo"
              width={120}
              height={120}
            />
          </div>
          <p className="text-slate-400 type-detail max-w-xs leading-relaxed mb-4">
            The official event management platform for HRD students.
            Orchestrating professional excellence.
          </p>

          <div className="flex items-center gap-3">
            <a
              href="https://www.kshrd.com.kh"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 transition-colors type-detail"
            >
              <Globe className="w-4 h-4 text-slate-500" />
              <span>Website</span>
            </a>
            <span className="text-slate-200">|</span>

            <a
              href="https://www.facebook.com/KSHRD"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 transition-colors type-detail"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-slate-500">
                <path d="M14 9.3V12.2H16.6C16.8 12.2 16.9 12.4 16.9 12.6L16.5 14.5C16.5 14.6 16.3 14.7 16.2 14.7H14V22H11V14.8H9.3C9.1 14.8 9 14.7 9 14.5V12.6C9 12.4 9.1 12.3 9.3 12.3H11V9C11 7.3 12.3 6 14 6H16.7C16.9 6 17 6.1 17 6.3V8.7C17 8.9 16.9 9 16.7 9H14.3C14.1 9 14 9.1 14 9.3Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" />
                <path d="M15 22H9C4 22 2 20 2 15V9C2 4 4 2 9 2H15C20 2 22 4 22 9V15C22 20 20 22 15 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>Facebook</span>
            </a>
          </div>
        </div>

        <div>
          <h5 className="type-detail-semibold mb-4 uppercase text-slate-900">
            Contact & Support
          </h5>
          <ul className="space-y-3 type-detail text-slate-500">
            <li className="flex items-start gap-3">
              <MapPin className="w-4 h-4 mt-1 text-slate-500 shrink-0" />
              <span>No. 12, st.323, Boeung Kak 2, <br/> Toul Kork, Phnom Penh, Cambodia</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-slate-500 shrink-0" />
              <span>023 991 314</span>
            </li>
            <li className="flex items-center gap-3">
              <Mails className="w-4 h-4 text-slate-500 shrink-0" />
              <span>info.kshrd@gmail.com</span>
            </li>
          </ul>
        </div>

        <div>
          <h5 className="type-detail-semibold mb-4 uppercase text-slate-900">
            Our Location
          </h5>
          <div className="rounded-xl overflow-hidden border border-slate-100 shadow-sm w-full aspect-video">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3908.6661795499126!2d104.88673487614419!3d11.575771443939164!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3109519cfe734349%3A0x5174d2178ff95112!2sKorean%20HRD%20Center!5e0!3m2!1sen!2skh!4v1780936712434!5m2!1sen!2skh"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-slate-100 flex type-detail text-slate-400 tracking-widest">
        <p>© 2026 HRD EventHub. Orchestrating professional excellence.</p>
      </div>
    </footer>
  );
}