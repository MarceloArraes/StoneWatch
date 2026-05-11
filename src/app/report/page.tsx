import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { ReportForm } from "@/components/report-form";
import { prisma } from "@/lib/prisma";

export default async function ReportPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const areas = await prisma.area.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      errorTypes: {
        orderBy: { label: "asc" },
        select: { id: true, label: true },
      },
    },
  });

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <div className="mb-8">
        <p className="text-xs text-[#8B9DB5] uppercase tracking-[0.15em] mb-2">
          New Entry
        </p>
        <h2
          className="text-3xl"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Report a Problem
        </h2>
        <p className="text-sm text-[#8B9DB5] mt-2 leading-relaxed">
          Select the production phase, identify the error, and record the
          details.
        </p>
      </div>
      <ReportForm areas={areas} />
    </div>
  );
}
