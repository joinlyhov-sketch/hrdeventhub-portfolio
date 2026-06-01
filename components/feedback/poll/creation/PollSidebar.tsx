"use client";

import React from "react";
import {
  CheckSquare,
  UserRoundCheck,
  PlusCircle,
  Lock,
  Inbox,
} from "lucide-react";
import { Switch } from "../../../ui/switch";
import { Input } from "../../../ui/input";
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
    onSettingsChange({ ...settings, showResult: value });
  };

  const handleDateChange = (date: string) => {
    onSettingsChange({ ...settings, closingDate: date });
  };

  const handleTimeChange = (time: string) => {
    onSettingsChange({ ...settings, closingTime: time });
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

      <div className="space-y-3 pt-5 border-t border-slate-100 w-full">
        <label className="text-[11px] font-extrabold text-slate-400 tracking-widest uppercase block pl-0.5">
          Show Results
        </label>

        <Select value={settings.showResult} onValueChange={handleSelectChange}>
          <SelectTrigger className="w-full bg-white border border-slate-200/80 rounded-2xl px-4 py-2.5 font-medium text-slate-600 text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 shadow-sm transition-all">
            <Inbox className="w-4 h-4 mr-2 text-secondary" />
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent className="rounded-2xl py-3 border border-slate-100 shadow-xl bg-white">
            <SelectItem value="Select" className="rounded-xl">
              Select
            </SelectItem>
            <SelectItem value="Always Visible" className="rounded-xl">
              Always Visible
            </SelectItem>
            <SelectItem value="After Voting" className="rounded-xl">
              After Voting
            </SelectItem>
            <SelectItem value="After Poll Expire" className="rounded-xl">
              After Poll Expire
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3 pt-5 border-t border-slate-100 w-full">
        <label className="text-[11px] font-extrabold text-slate-400 tracking-widest uppercase block pl-0.5">
          Closing Time *
        </label>

        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              type="date"
              value={settings.closingDate}
              onChange={(e) => handleDateChange(e.target.value)}
              className="flex-1 bg-white border border-slate-200/80 rounded-2xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 shadow-sm"
              required
            />
            <Input
              type="time"
              value={settings.closingTime}
              onChange={(e) => handleTimeChange(e.target.value)}
              className="flex-1 bg-white border border-slate-200/80 rounded-2xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 shadow-sm"
              required
            />
          </div>
          {settings.closingDate && settings.closingTime && (
            <p className="text-xs text-gray-500 pl-0.5">
              {new Date(
                `${settings.closingDate}T${settings.closingTime}`,
              ).toLocaleString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
