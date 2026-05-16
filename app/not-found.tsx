import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MoveLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden ">
      
      <div className="absolute top-0 right-0 w-[20%] h-auto pointer-events-none">
        <Image 
          src="/images/Ellipse1.png" 
          alt="" 
          width={600} 
          height={600} 
          className="w-full h-auto object-contain translate-x-5 -translate-y-1/3 opacity-50 -rotate-35"
       />
      </div>
      
      <div className="absolute top-0 right-0 w-[13%] h-auto pointer-events-none">
        <Image 
          src="/images/Ellipse.png" 
          alt="" 
          width={600} 
          height={600} 
          className="w-full h-auto object-contain -translate-x-0 translate-y-0 "
       />
      </div>      

      <div className="absolute bottom-0 left-0 w-[17%] h-auto pointer-events-none">
        <Image 
          src="/images/Ellipse2.png" 
          alt="" 
          width={600} 
          height={600} 
           className="w-full h-auto object-contain translate-x-0 -translate-y-0 opacity-90"
          />
      </div>
      <div className="absolute bottom-0 left-0 w-[13%] h-auto pointer-events-none">
        <Image 
          src="/images/Ellipse.png" 
          alt="" 
          width={600} 
          height={600} 
           className="w-full h-auto object-contain rotate-180 translate-x-0 -translate-y-0 opacity-90"
          />
      </div>

      <div className="absolute top-[20%] right-[40%] w-12 h-12 opacity-40">
        <Image src="/images/rectangle.png" alt="" width={48} height={48} />
      </div>
      <div className="absolute bottom-[15%] left-[30%] w-16 h-16 opacity-30">
        <Image src="/images/rectangle.png" alt="" width={64} height={64} />
      </div>
      <div className="absolute bottom-[10%] right-[10%] w-20 h-20 opacity-20">
        <Image src="/images/rectangle.png" alt="" width={80} height={80} />
      </div>

      <header className="relative z-10 p-8 md:p-12">
        <div className="flex items-center gap-2">
          {/* <div className="flex items-center">
             <span className="text-[#1D4ED8] font-bold text-2xl italic">HRD</span>
             <span className="ml-1 text-[#F59E0B] font-bold text-2xl uppercase tracking-tighter">Event Hub</span>
          </div> */}
          <Image
                        src="/images/Logo.webp"
                        alt="HRD Event Hub Logo"
                        width={160}
                        height={40}
                        className="w-auto h-8 md:h-10 transition-all duration-500"
                      />
        </div>
      </header>

      <main className="relative z-10 flex-grow flex items-center px-6 md:px-20 lg:px-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full max-w-7xl mx-auto">
          
          <div className="order-2 lg:order-1 text-center lg:text-left space-y-6">
            <h2 className="text-xl align-middle md:text-2xl font-bold text-gray-800">
              Ooops...
            </h2>
            <h1 className="text-4xl md:text-6xl font-extrabold text-[#1E3A8A]">
              Page not found
            </h1>
            <p className="text-gray-500 text-lg max-w-md mx-auto lg:mx-0">
              We can't seem to find the page you're looking for. It might have been moved or deleted.
            </p>
            
            <div className="pt-4">
              <Link 
                href="/"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-[#1E3A8A] hover:bg-[#b8c3e2] text-white font-semibold rounded-full transition-all shadow-lg hover:shadow-xl active:scale-95"
              >
                <MoveLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                Go Back
              </Link>
            </div>
          </div>

          <div className="order-1 lg:order-2 flex justify-center lg:justify-end items-center">
            <div className="relative w-full max-w-[500px] md:max-w-[600px]">
              <Image 
                src="/images/not-found.png" 
                alt="404 Illustration" 
                width={800} 
                height={600} 
                priority
                className="w-full h-auto drop-shadow-2xl"
              />
            </div>
          </div>
          
        </div>
      </main>

      <div className="h-20 lg:h-32" />
    </div>
  );
}