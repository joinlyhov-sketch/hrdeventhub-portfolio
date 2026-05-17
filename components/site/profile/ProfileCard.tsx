import React from 'react'
import { Mail, Calendar, Users, Code, Phone, GraduationCap } from 'lucide-react';

const InfoRow = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <div className="flex items-center gap-3 w-full">
    <span className="text-primary shrink-0">{icon}</span>
    <span className="type-detail text-grey-900 truncate">{text}</span>
  </div>
);

interface ProfileCardProps {
  viewMode: 'ADMIN' | 'STUDENT_SELF' | 'ALUMNI_VIEWING_STUDENT';
}

const FemaleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.6875 16.125C10.8977 16.125 13.5 13.5227 13.5 10.3125C13.5 7.10234 10.8977 4.5 7.6875 4.5C4.47734 4.5 1.875 7.10234 1.875 10.3125C1.875 13.5227 4.47734 16.125 7.6875 16.125Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16.125 1.875L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M11.25 1.875H16.125V6.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function ProfileCard({ viewMode }: ProfileCardProps) {
  const socials = [
    {
      name: 'Facebook',
      svg: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
        </svg>
      )
    },
    {
      name: 'Telegram',
      svg: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="22" y1="2" x2="11" y2="13"></line>
          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>
      )
    },
    {
      name: 'GitHub',
      svg: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
          <path d="M9 18c-4.51 2-5-2-7-2"></path>
        </svg>
      )
    },
    {
      name: 'LinkedIn',
      svg: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
          <rect x="2" y="9" width="4" height="12"></rect>
          <circle cx="4" cy="4" r="2"></circle>
        </svg>
      )
    }
  ];

  return (
    <div className='bg-card border border-border rounded-xl shadow-sm flex flex-col h-full w-full overflow-hidden'>
      <div className='h-32 bg-primary w-full rounded-xl shrink-0' />
      <div className='px-6 pb-6 flex flex-col items-center -mt-16 w-full grow justify-between'>
        <div className='w-full flex flex-col items-center'>
          <div className='w-32 h-32 rounded-full border-4 border-card overflow-hidden bg-grey-100 shadow-sm mb-4 shrink-0 relative z-10'>
            <img src="/images/profile.png" alt="Profile" className='w-full h-full object-cover'/>
          </div>
          <div className='text-center w-full px-2'>
            <h2 className='type-subtitle text-secondary font-bold text-xl'>Chham Kaknika</h2>
            <p className='type-detail text-muted-foreground mb-4'>@kaknika</p>
            <p className='type-detail text-grey-500 mb-6 leading-relaxed'>
              "Dedicated Fullstack web Development student with a passion for building scalable HR solutions and strategic talent acquisition platforms"
            </p>
          </div>
          <div className='w-full space-y-3 pt-6 border-t border-border text-left'>
            <h3 className='type-subtitle text-secondary font-semibold mb-2'>Personal Information</h3>
            <InfoRow icon={<Mail size={16}/>} text="kaknika@gmail.com"  />
            <InfoRow icon={<Calendar size={16}/>} text="12 July 2007" />
            <InfoRow icon={<Users size={16}/>} text="14th Generation" />
            <InfoRow icon={<Code size={16}/>} text="Fullstack web development" />
            <InfoRow icon={<Phone size={16}/>} text="015849376" />
            <InfoRow icon={<GraduationCap size={16}/>} text="Studying" />
            <InfoRow icon={<FemaleIcon />} text="Female" />
          </div>
        </div>
        <div className='w-full'>
          <div className='mt-6 flex justify-center gap-3 w-full'>
            {socials.map((social, i) => (
              <button 
                key={i} 
                aria-label={social.name}
                className="p-2 bg-primary text-primary-foreground rounded-full hover:bg-secondary transition-colors duration-150 shrink-0"
              >
                {social.svg}
              </button>
            ))}
          </div>
          <button className='w-full mt-6 bg-primary text-primary-foreground py-3 rounded-md type-desc-semibold hover:opacity-90 transition-opacity font-medium'>
            {viewMode === 'ALUMNI_VIEWING_STUDENT' ? 'Endorse' : 'Edit Profile'}
          </button>
        </div>

      </div>
    </div>
  )
}