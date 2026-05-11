interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`bg-[#141E2D] border border-[#2A3A52] p-6 ${className}`}
      style={{ borderRadius: "0" }}
    >
      {children}
    </div>
  );
}
