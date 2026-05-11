import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { ReportsClient } from "@/components/reports-client";
import { prisma } from "@/lib/prisma";

export default async function ReportsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const reports = await prisma.report.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      area: { select: { id: true, name: true } },
      errorType: { select: { id: true, label: true } },
    },
  });

  const areas = await prisma.area.findMany({
    orderBy: { sortOrder: "asc" },
  });

  const serialized = reports.map((r) => ({
    id: r.id,
    area: r.area.name,
    areaId: r.area.id,
    errorType: r.errorType.label,
    errorTypeId: r.errorType.id,
    severity: r.severity,
    jobRef: r.jobRef,
    notes: r.notes,
    reportedBy: r.reportedBy,
    createdAt: r.createdAt.toISOString(),
  }));

  return <ReportsClient initialReports={serialized} areas={areas} />;
}
