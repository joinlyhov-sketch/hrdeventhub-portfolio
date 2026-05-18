"use client";

import React, { useState } from 'react';
import { 
  ChevronDown, 
  CheckSquare, 
  UserRoundCheck, 
  PlusCircle, 
  Lock, 
  Printer, 
  Inbox
} from 'lucide-react';

export default function PollSidebar() {
  const [settings, setSettings] = useState({
    multipleSelect: false,
    anonymousVote: false,
    addOption: false,
    hiddenPoll: false,
    showResult: 'Select'
  });

  const toggleItems = [
    { key: 'multipleSelect', label: 'Multiple select', icon: CheckSquare },
    { key: 'anonymousVote', label: 'Anonymous Vote', icon: UserRoundCheck },
    { key: 'addOption', label: 'Add Option', icon: PlusCircle },
    { key: 'hiddenPoll', label: 'Hidden Poll', icon: Lock },
  ];

  return (
    <div className="bg-white p-3  ">
      <div>
        <h3 className="text-sm font-semibold text-slate-400 tracking-wider mb-4">Poll Option</h3>
        <span className="text-xs font-bold text-slate-300 tracking-widest uppercase">Basic</span>
      </div>

      <div className="space-y-4">
        {toggleItems.map((item) => {
          const Icon = item.icon;
          const isActive = settings[item.key as keyof typeof settings];
          
          return (
            <div key={item.key} className="flex items-center gap-2 justify-between border border-slate-100 rounded-2xl p-4 hover:bg-slate-50 transition">
              <div className="flex items-center gap-1">
                <div className="bg-gray-100 p-2 rounded-xl">
                  <Icon className="w-5 h-5 text-secondary" />
                </div>
                <span className="font-medium text-slate-600 text-sm">{item.label}</span>
              </div>
              
              <button
                type="button"
                onClick={() => setSettings(p => ({ ...p, [item.key]: !isActive }))}
                className={`w-11 h-6 flex items-center rounded-full p-0.5 transition-colors duration-300 ${isActive ? 'bg-action' : 'bg-gray-200'}`}
              >
                <div className={`bg-white w-5 h-5 rounded-full shadow transform transition-transform duration-300 ${isActive ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
          );
        })}
      </div>

      <div className="space-y-3 pt-4 border-t border-slate-100">
        <label className="text-xs font-bold text-slate-400 tracking-wider uppercase">Show Result</label>
        <div className="relative">
            
          <Inbox
           className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-secondary" />
          <select
            value={settings.showResult}
            className="w-full appearance-none bg-white border border-slate-100 rounded-2xl pl-12 pr-10 py-4 font-medium text-slate-600 text-sm focus:outline-none cursor-pointer"
            onChange={(e) => setSettings(p => ({ ...p, showResult: e.target.value }))}
          >
            <option value="Select">Select</option>
            <option value="Always Visible">Alway Visable</option>
            <option value="After Voting">After Voting</option>
            <option value="After Poll Expire">After Poll Expire</option>
          </select>
          <ChevronDown className="w-5 h-5 text-gray-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}