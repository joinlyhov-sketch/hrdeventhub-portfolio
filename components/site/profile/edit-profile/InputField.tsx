  interface InputFieldProps {
      label: string;
      placeholder?: string;
      type?: string;
      defaultValue?: string;
    }
export default function InputField({
      label,
      placeholder,
      type = "text",
      defaultValue = "",
    }: InputFieldProps) {
  return (
        <div className="flex flex-col gap-1.5 w-full">
          <label className="type-detail-semibold text-grey-900">{label}</label>
          <input
            type={type}
            placeholder={placeholder}
            defaultValue={defaultValue}
            className="w-full h-10 px-4 bg-white border border-border rounded-lg type-detail text-grey-900 focus:outline-hidden focus:border-primary transition-colors"
          />
        </div>
      );
     }
