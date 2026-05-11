import { forwardRef } from "react";

const variantStyles = {
  primary:
    "bg-[#C4A55A] text-[#0C1520] hover:bg-[#D4B86A] border-[#C4A55A]",
  secondary:
    "bg-transparent text-[#EAE5D9] border-[#2A3A52] hover:bg-[#1A2740]",
  ghost:
    "bg-transparent text-[#8B9DB5] border-transparent hover:text-[#EAE5D9] hover:bg-[#1A2740]/50",
  danger:
    "bg-transparent text-[#8B5E5E] border-[#8B5E5E]/30 hover:bg-[#8B5E5E]/10",
};

const sizeStyles = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variantStyles;
  size?: keyof typeof sizeStyles;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center gap-2 rounded border font-medium transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
