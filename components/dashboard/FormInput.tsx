import React from 'react';
import { LucideIcon } from 'lucide-react';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: LucideIcon;
}

export const FormInput = ({ label, icon: Icon, ...props }: Props) => (
  <div className="flex flex-col gap-1.5 w-full">
    <label className="text-[#1E3A8A] font-bold text-sm">{label}</label>
    <div className="relative flex items-center">
      {Icon && (
        <Icon className="absolute left-4 text-slate-400" size={18} />
      )}
      <input
        {...props}
        className={`w-full ${
          Icon ? 'pl-11 pr-4' : 'px-4'
        } py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-300`}
      />
    </div>
  </div>
);