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

export interface PollSettings {
  multipleSelect: boolean;
  anonymousVote: boolean;
  addOption: boolean;
  hiddenPoll: boolean;
  showResult: string;
  closingDate: string;
  closingTime: string;
}

interface PollSidebarProps {
  settings: PollSettings;
  onSettingsChange: (settings: PollSettings) => void;
}

export default function PollSidebar({
  settings,
  onSettingsChange,
}: PollSidebarProps) {
  const [hasInteracted, setHasInteracted] = useState(false);

  const toggleItems = [
    { key: "multipleSelect", label: "Multiple select", icon: CheckSquare },
    { key: "anonymousVote", label: "Anonymous Vote", icon: UserRoundCheck },
    { key: "addOption", label: "Add Option", icon: PlusCircle },
    { key: "hiddenPoll", label: "Hidden Poll", icon: Lock },
  ];

  const handleToggleChange = (key: string, checked: boolean) => {
    onSettingsChange({ ...settings, [key]: checked });
  };

  const handleSelectChange = (value: string) => {
    setHasInteracted(true);
    onSettingsChange({ ...settings, showResult: value });
  };

  const getDisplayLabel = (val: string) => {
    if (val === "alwaysVisible") return "Always Visible";
    if (val === "afterVote") return "After Voting";
    if (val === "afterExpire") return "After Poll Expire";
    return val;
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
          const isActive = settings[
            item.key as keyof typeof settings
          ] as boolean;
          return (
            <PollSidebarItem
              key={item.key}
              label={item.label}
              icon={item.icon}
              rightElement={
                <Switch
                  checked={isActive}
                  onCheckedChange={(checked) =>
                    handleToggleChange(item.key, checked)
                  }
                  className="data-[state=checked]:bg-action"
                />
              }
            />
          );
        })}
      </div>

      <div className="space-y-3 pt-1 border-t border-slate-100 w-full">
        <label className="text-[12px] font-semibold text-slate-400 tracking-widest block pl-0.5">
          Show Results
        </label>

        <Select value={settings.showResult} onValueChange={handleSelectChange}>
          <SelectTrigger className="w-[250px] bg-white hover:bg-slate-50 text-slate-700 rounded-2xl px-2 py-6 text-[12px] type-desc border-gray-200 outline-none cursor-pointer ">
            <div className="flex items-center gap-4">
              <div className="bg-[#F4F6F9] p-2 rounded-lg flex items-center justify-center shrink-0">
                <Inbox className="w-5 h-5 text-secondary text-4xl" />
              </div>
              <SelectValue>
                {!hasInteracted
                  ? "Select"
                  : getDisplayLabel(settings.showResult)}
              </SelectValue>
            </div>
          </SelectTrigger>

          <SelectContent
            side="bottom"
            position="popper"
            align="end"
            className="bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-50 text-left max-h-50 overflow-y-auto min-w-[160px] max-w-[160px] w-auto mt-1"
          >
            <SelectItem
              value="alwaysVisible"
              className="px-2 py-2 text-sm rounded-md text-gray-500 transition-colors cursor-pointer focus:bg-slate-200 focus:text-blue-800 outline-none"
            >
              Always Visible
            </SelectItem>

            <SelectItem
              value="afterVote"
              className="px-2 py-2 text-sm rounded-md text-gray-500 transition-colors cursor-pointer focus:bg-slate-200 focus:text-blue-800 outline-none"
            >
              After Voting
            </SelectItem>

            <SelectItem
              value="afterExpire"
              className="px-2 py-2 text-sm rounded-md text-gray-500 transition-colors cursor-pointer focus:bg-slate-200 focus:text-blue-800 outline-none"
            >
              After Poll Expire
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
