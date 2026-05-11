"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  if (!session) return null;

  const links = [
    { href: "/", label: "Dashboard" },
    { href: "/report", label: "Report" },
    { href: "/reports", label: "Reports" },
  ];

  return (
    <nav className="w-full border-b border-[#2A3A52] bg-[#0C1520]/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="font-[family-name:var(--font-heading)] text-lg tracking-wide text-[#EAE5D9]"
          >
            STONEWATCH
          </Link>
          <div className="flex items-center gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`px-3 py-1.5 text-sm rounded transition-colors ${
                  pathname === l.href
                    ? "bg-[#1A2740] text-[#EAE5D9]"
                    : "text-[#8B9DB5] hover:text-[#EAE5D9] hover:bg-[#1A2740]/50"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-[#8B9DB5]">{session.user?.email}</span>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="text-sm text-[#8B9DB5] hover:text-[#EAE5D9] transition-colors cursor-pointer"
          >
            Sign out
          </button>
        </div>
      </div>
    </nav>
  );
}
