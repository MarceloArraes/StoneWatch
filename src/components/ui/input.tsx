import { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", label, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-xs font-medium text-[#8B9DB5] uppercase tracking-wider">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`h-10 bg-[#0C1520] border border-[#2A3A52] rounded px-3 text-sm text-[#EAE5D9] placeholder:text-[#2A3A52] outline-none transition-colors focus:border-[#C4A55A] focus:ring-1 focus:ring-[#C4A55A]/30 ${error ? "border-[#8B5E5E]" : ""} ${className}`}
          {...props}
        />
        {error && (
          <span className="text-xs text-[#8B5E5E]">{error}</span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
