"use client";

import React, { useState } from "react";
import {
  CheckSquare,
  UserRoundCheck,
  PlusCircle,
  Lock,
  Inbox,
} from "lucide-react";
import { Switch } from "../../../ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../ui/select";
import PollSidebarItem from "./PollSidebarItem";

export default function PollSidebar() {
  const [settings, setSettings] = useState({
    multipleSelect: false,
    anonymousVote: false,
    addOption: false,
    hiddenPoll: false,
    showResult: "Select",
  });

  const toggleItems = [
    { key: "multipleSelect", label: "Multiple select", icon: CheckSquare },
    { key: "anonymousVote", label: "Anonymous Vote", icon: UserRoundCheck },
    { key: "addOption", label: "Add Option", icon: PlusCircle },
    { key: "hiddenPoll", label: "Hidden Poll", icon: Lock },
  ];

  const handleToggleChange = (key: string, checked: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: checked }));
  };

  const handleSelectChange = (value: string) => {
    setSettings((prev) => ({ ...prev, showResult: value }));
  };

  return (
    <div className="bg-white space-y-5 w-full mx-auto shrink-0 flex flex-col justify-start">
      <div className="space-y-1 w-full pl-0.5">
        <h3 className="text-base font-bold text-slate-700 tracking-tight">
          Poll Option
        </h3>
        <span className="text-[11px] font-extrabold text-slate-400 tracking-widest uppercase block">
          Basic
        </span>
      </div>

      <div className="space-y-3 w-full">
        {toggleItems.map((item) => {
          const isActive = settings[item.key as keyof typeof settings] as boolean;
          return (
            <PollSidebarItem
              key={item.key}
              label={item.label}
              icon={item.icon}
              rightElement={
                <Switch
                  checked={isActive}
                  onCheckedChange={(checked) => handleToggleChange(item.key, checked)}
                  className="data-[state=checked]:bg-action"
                />
              }
            />
          );
        })}
      </div>

      <div className="space-y-3 pt-5 border-t border-slate-100 w-full pl-0.5">
        <label className="text-[11px] font-extrabold text-slate-400 tracking-widest uppercase block">
          Show Result
        </label>

        <Select value={settings.showResult} onValueChange={handleSelectChange} >
          <SelectTrigger className="w-[250px] h-12 bg-white border border-slate-200/80 rounded-2xl pl-11 py-5 font-medium text-slate-600 text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 relative shadow-sm transition-all">
            <Inbox className="w-5 h-5 absolute left-4  text-secondary" />
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent className="rounded-2xl py-5 border border-slate-100 shadow-xl bg-white p-1">
            <SelectItem value="Select" className="rounded-xl">Select</SelectItem>
            <SelectItem value="Always Visible" className="rounded-xl">Always Visible</SelectItem>
            <SelectItem value="After Voting" className="rounded-xl">After Voting</SelectItem>
            <SelectItem value="After Poll Expire" className="rounded-xl">After Poll Expire</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}