import { forwardRef } from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = "", label, error, options, placeholder, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-xs font-medium text-[#8B9DB5] uppercase tracking-wider">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={`h-10 bg-[#0C1520] border border-[#2A3A52] rounded px-3 text-sm text-[#EAE5D9] outline-none transition-colors focus:border-[#C4A55A] focus:ring-1 focus:ring-[#C4A55A]/30 appearance-none cursor-pointer ${
            error ? "border-[#8B5E5E]" : ""
          } ${className}`}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%238B9DB5' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 12px center",
            paddingRight: "2rem",
          }}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        {error && <span className="text-xs text-[#8B5E5E]">{error}</span>}
      </div>
    );
  }
);

Select.displayName = "Select";
