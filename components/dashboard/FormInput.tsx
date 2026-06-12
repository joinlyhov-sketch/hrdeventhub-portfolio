import React, { forwardRef } from "react";
import { LucideIcon } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: LucideIcon;
  isError?: boolean;
}

export const FormInput = forwardRef<HTMLInputElement, Props>(
  ({ label, icon: Icon, id, isError = false, ...props }, ref) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5 w-full">
        <Label
          htmlFor={inputId}
          className="text-subtitle font-bold text-sm text-secondary md:text-base lg:text-lg"
        >
          {label}
        </Label>
        <div className="relative flex items-center w-full">
          {Icon && (
            <Icon className="absolute left-4 h-4.5 text-gray-400 w-4.5 pointer-events-none" />
          )}
          <Input
            id={inputId}
            ref={ref}
            {...props}
            className={`w-full h-11 p-4 bg-background border-input rounded-xl text-desc placeholder:text-detail md:text-base resize-none transition-all shadow-none focus-visible:shadow-none focus:ring-4 focus:ring-blue-primary/10 focus-visible:ring-0 focus-visible:ring-offset-0 ${isError == true ? "border-2 border-red-500" : ""}  ${
              Icon ? "pl-11 pr-4" : "px-4"
            }`}
          />
        </div>
      </div>
    );
  },
);

FormInput.displayName = "FormInput";
