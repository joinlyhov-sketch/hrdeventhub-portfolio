import React from 'react'
    
interface SocialInputFieldProps {
  label: string;
  defaultValue: string;
  icon: React.ReactNode;
}
export default function SocialInputField({
  label,
  defaultValue,
  icon,
}: SocialInputFieldProps) {
  return (

    <div className="flex flex-col gap-1 w-full">
      <span className="text-[10px] tracking-wider text-subtle font-bold uppercase">
        {label}
      </span>
      <div className="flex items-center gap-3 w-full">
        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0 border border-border shadow-xs">
          {icon}
        </div>
        <input
          type="text"
          defaultValue={defaultValue}
          className="w-full h-10 px-4 bg-white border border-border rounded-lg type-detail text-grey-900 focus:outline-hidden focus:border-primary transition-colors"
        />
      </div>
    </div>
  );
}
