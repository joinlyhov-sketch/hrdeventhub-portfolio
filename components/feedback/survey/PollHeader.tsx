"use client";

import React, { useState } from "react";
import { Input } from "../../ui/input";
import { Card } from "../../ui/card";
import { Label } from "../../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/libs/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PollHeaderProps {
  title: string;
  setTitle: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
  closingTime?: string;
  setClosingTime?: (val: string) => void;
}

export default function PollHeader({
  title,
  setTitle,
  description,
  setDescription,
  closingTime,
  setClosingTime,
}: PollHeaderProps) {
  const [status, setStatus] = useState<"draft" | "active">(closingTime ? "draft" : "active");
  const [closingDate, setClosingDate] = useState<Date | undefined>(
    closingTime ? new Date(closingTime) : undefined,
  );
  const [closingTimeStr, setClosingTimeStr] = useState("00:00");

  const handleStatusChange = (newStatus: "draft" | "active") => {
    setStatus(newStatus);
    if (newStatus === "active" && setClosingTime) {
      setClosingTime("");
      setClosingDate(undefined);
    }
  };

  return (
    <Card className="bg-background rounded-2xl border-l-[6px] border-l-blue-900 border-y-border border-r-border p-8 shadow-sm mb-6">
      <h1 className="relative mb-4 w-full text-3xl font-bold text-foreground">
        <input
          type="text"
          value={title}
          maxLength={50}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Untitled Poll"
          className="w-full bg-transparent outline-none border-0 p-0 m-0 font-inherit text-inherit placeholder:text-muted-foreground/30 focus:ring-0 focus-visible:ring-0"
        />
      </h1>
      <Input
        type="text"
        value={description}
        maxLength={200}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Add a description for your poll participants..."
        className="w-full text-desc text-muted-foreground placeholder:text-muted-foreground/30 border-0 border-b border-border p-0 pb-2 shadow-none rounded-none bg-transparent transition-colors focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-primary mb-6"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <div>
          <Label className="block mb-2 text-sm font-semibold text-gray-700">Status</Label>
          <Select value={status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-full h-11 px-4 py-5 bg-slate-50 border border-slate-200 rounded-xl text-gray-700 focus:ring-0 focus:border-primary transition-all">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent
              side="bottom"
              position="popper"
              className="bg-white rounded-xl border border-slate-200 shadow-md p-1 -mt-1"
            >
              <SelectItem
                value="draft"
                className="px-3 py-3 text-sm font-semibold rounded-md text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Draft
              </SelectItem>
              <SelectItem
                value="active"
                className="px-3 py-3 text-sm font-semibold rounded-md text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Active
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {status === "draft" && closingTime !== undefined && setClosingTime && (
          <div className="animate-in fade-in slide-in-from-top-1 duration-200">
            <Label
              htmlFor="closing-time"
              className="block mb-2 text-sm font-semibold text-gray-700"
            >
              Poll Closing Time
            </Label>
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className={cn(
                      "flex items-center gap-3 flex-1 h-11 px-4 bg-background border border-input rounded-xl text-desc md:text-base transition-all outline-none focus:ring-1 focus:ring-primary cursor-pointer",
                      closingDate ? "text-foreground" : "text-gray-400",
                    )}
                  >
                    <CalendarIcon
                      className="h-4.5 w-4.5 text-gray-400 shrink-0 pointer-events-none"
                      strokeWidth={2}
                    />
                    <span>
                      {closingDate
                        ? format(closingDate, "dd/MM/yyyy")
                        : "DD/MM/YYYY"}
                    </span>
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto p-0 rounded-xl"
                  align="start"
                  sideOffset={6}
                >
                  <Calendar
                    mode="single"
                    selected={closingDate}
                    onSelect={(date) => {
                      if (date) {
                        setClosingDate(date);
                        const [h, m] = closingTimeStr.split(":");
                        const updated = new Date(date);
                        updated.setHours(Number(h), Number(m));
                        setClosingTime(updated.toISOString());
                      }
                    }}
                    captionLayout="dropdown"
                    startMonth={new Date(2000, 0, 1)}
                    endMonth={new Date(2100, 11, 31)}
                  />
                </PopoverContent>
              </Popover>

              <input
                type="time"
                value={closingTimeStr}
                onChange={(e) => {
                  setClosingTimeStr(e.target.value);
                  if (closingDate) {
                    const [h, m] = e.target.value.split(":");
                    const updated = new Date(closingDate);
                    updated.setHours(Number(h), Number(m));
                    setClosingTime(updated.toISOString());
                  }
                }}
                className="h-11 px-2 bg-background border border-input rounded-xl text-desc md:text-base transition-all outline-none focus:ring-1 focus:ring-primary cursor-pointer w-32 "
              />
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}