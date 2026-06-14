"use client";

import React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/libs/utils";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";

interface InputDateProps {
  label: string;
  value?: string;
  onChange: (value: string) => void;
  isError?: boolean;
  placeholder?: string;
  id?: string;
  startMonth?: Date;
  endMonth?: Date;
  minDate?: Date;
  maxDate?: Date;
}

export function InputDate({
  label,
  value,
  onChange,
  isError = false,
  placeholder = "DD/MM/YYYY",
  id,
  startMonth = new Date(2000, 0, 1),
  endMonth = new Date(2100, 11, 31),
  minDate = new Date(2000, 0, 1),
  maxDate = new Date(2100, 11, 31),
}: InputDateProps) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, "-");
  const selectedDate = value ? new Date(value) : undefined;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <Label
        htmlFor={inputId}
        className="text-subtitle font-bold text-sm text-secondary md:text-base lg:text-lg"
      >
        {label}
      </Label>
      <Popover>
        <PopoverTrigger asChild>
          <button
            id={inputId}
            type="button"
            className={cn(
              "flex items-center gap-3 w-full h-11 px-4 bg-background border rounded-xl text-desc md:text-base transition-all shadow-none focus:ring-1 focus:ring-primary cursor-pointer",
              isError ? "border-3 border-red-500" : "border-input",
            )}
          >
            <CalendarIcon
              className="h-4.5 w-4.5 text-gray-400 shrink-0 pointer-events-none"
              strokeWidth={2}
            />
            <span
              className={cn(
                "text-desc md:text-base",
                selectedDate ? "text-foreground" : "text-gray-400" ,
              )}
            >
              {selectedDate ? format(selectedDate, "dd/MM/yyyy") : placeholder}
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
            selected={selectedDate}
            onSelect={(date) => {
              if (date) onChange(format(date, "yyyy-MM-dd"));
            }}
            disabled={(date) => date > maxDate || date < minDate}
            captionLayout="dropdown"
            startMonth={startMonth}
            endMonth={endMonth}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
