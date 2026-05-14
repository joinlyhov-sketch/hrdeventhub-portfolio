import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 pt-20 pb-10 px-6">
        <div className="container mx-auto grid grid-cols-2 md:grid-cols-5 gap-12 mb-16">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
                <Image
                src="/images/Logo.png"
                alt="HRD Event Hub Logo"
                width={150}
                height={150}

                />
            </div>
            <p className="text-slate-400 text-sm max-w-xs leading-relaxed">
              The official event management platform for HRD students. Orchestrating professional excellence.
            </p>
          </div>
          <div>
            <h5 className="font-bold text-sm mb-6 uppercase tracking-widest text-slate-900">Explore</h5>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><a href="#" className="hover:text-blue-600">Events</a></li>
              <li><a href="#" className="hover:text-blue-600">Calendar</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-sm mb-6 uppercase tracking-widest text-slate-900">Engagement</h5>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><a href="#" className="hover:text-blue-600">Surveys</a></li>
              <li><a href="#" className="hover:text-blue-600">Careers</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-sm mb-6 uppercase tracking-widest text-slate-900">Support</h5>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><a href="#" className="hover:text-blue-600">Terms</a></li>
              <li><a href="#" className="hover:text-blue-600">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto pt-10 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] font-medium text-slate-400 uppercase tracking-widest">
           <p>© 2026 HRD EventHub. All rights reserved.</p>
           <div className="flex gap-8">
              <a href="#">LinkedIn</a>
              <a href="#">Twitter</a>
              <a href="#">Instagram</a>
           </div>
        </div>
      </footer>
  )
}
