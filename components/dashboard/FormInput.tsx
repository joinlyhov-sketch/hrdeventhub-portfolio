// import React from "react";
// import { LucideIcon } from "lucide-react";
// import { Input } from "../ui/input";
// import { Label } from "../ui/label";

// interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
//   label: string;
//   icon?: LucideIcon;
// }

// export const FormInput = ({ label, icon: Icon, id, ...props }: Props) => {
//   const inputId = id || label.toLowerCase().replace(/\s+/g, "-");

//   return (
//     <div className="flex flex-col gap-1.5 w-full">
//       <Label
//         htmlFor={inputId}
//         className="text-subtitle font-bold text-sm text-secondary md:text-base lg:text-lg"
//       >
//         {label}
//       </Label>
//       <div className="relative flex items-center w-full">
//         {Icon && (
//           <Icon className="absolute left-4  text-[#93A3CA] h-[18px] w-[18px] pointer-events-none " />
//         )}
//         <Input
//           id={inputId}
//           {...props}
//           className={`w-full h-11 p-4 bg-background border-input rounded-xl text-desc font-bold text-[#93A3CA] placeholder:text-detail placeholder:font-bold placeholder:text-[#93A3CA] md:text-base resize-none transition-all shadow-none focus-visible:shadow-none focus:ring-4 focus:ring-blue-primary/10 focus-visible:ring-0 focus-visible:ring-offset-0 ${
//             Icon ? "pl-11 pr-4" : "px-4"
//           }`}
//         />
//       </div>
//     </div>
//   );
// };

import React, { forwardRef } from "react";
import { LucideIcon } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: LucideIcon;
}

export const FormInput = forwardRef<HTMLInputElement, Props>(
  ({ label, icon: Icon, id, ...props }, ref) => {
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
            <Icon className="absolute left-4 text-[#93A3CA] h-4.5 w-4.5 pointer-events-none" />
          )}
          <Input
            id={inputId}
            ref={ref}
            {...props}
            className={`w-full h-11 p-4 bg-background border-input rounded-xl text-desc font-bold text-[#93A3CA] placeholder:text-detail placeholder:font-bold placeholder:text-[#93A3CA] md:text-base resize-none transition-all shadow-none focus-visible:shadow-none focus:ring-4 focus:ring-blue-primary/10 focus-visible:ring-0 focus-visible:ring-offset-0 ${
              Icon ? "pl-11 pr-4" : "px-4"
            }`}
          />
        </div>
      </div>
    );
  },
);

FormInput.displayName = "FormInput";
