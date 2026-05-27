import React from "react";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export const FormTextarea = ({ label, id, ...props }: FormTextareaProps) => {
  const textareaId = id || label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="grid w-full gap-2">
      <Label
        htmlFor={textareaId}
        className="text-subtitle font-bold text-sm text-secondary md:text-base lg:text-lg"
      >
        {label}
      </Label>
      <Textarea
        id={textareaId}
        {...props}
        className="w-full min-h-[120px] md:min-h-[160px] p-4 bg-background border-input rounded-xl text-desc font-bold text-[#93A3CA] placeholder:text-detail placeholder:font-bold placeholder:text-[#93A3CA] md:text-base resize-none transition-all shadow-none focus-visible:shadow-none focus:ring-4 focus:ring-blue-primary/10 focus-visible:ring-0 focus-visible:ring-offset-0"
      />
    </div>
  );
};