interface BadgeProps {
  children: React.ReactNode;
  variant?: "gold" | "rose" | "muted" | "success";
  className?: string;
}

const variantStyles: Record<string, string> = {
  gold: "bg-[#C4A55A]/15 text-[#C4A55A] border-[#C4A55A]/30",
  rose: "bg-[#8B5E5E]/15 text-[#8B5E5E] border-[#8B5E5E]/30",
  muted: "bg-[#2A3A52]/50 text-[#8B9DB5] border-[#2A3A52]",
  success: "bg-[#5A7D6B]/15 text-[#5A7D6B] border-[#5A7D6B]/30",
};

export function Badge({ children, variant = "muted", className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-xs font-medium border rounded ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
