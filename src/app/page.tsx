import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { DashboardClient } from "@/components/dashboard-client";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const totalReports = await prisma.report.count();
  const critical = await prisma.report.count({
    where: { severity: "CRITICAL" },
  });
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);
  const thisWeek = await prisma.report.count({
    where: { createdAt: { gte: lastWeek } },
  });

  const areasData = await prisma.area.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { reports: true } } },
  });

  const severityData = await prisma.report.groupBy({
    by: ["severity"],
    _count: true,
  });

  const topErrors = await prisma.errorType.findMany({
    include: {
      area: { select: { name: true } },
      _count: { select: { reports: true } },
    },
    orderBy: { reports: { _count: "desc" } },
    take: 8,
  });

  const recentReports = await prisma.report.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
    include: {
      area: { select: { name: true } },
      errorType: { select: { label: true } },
    },
  });

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const dailyReports = await prisma.report.findMany({
    where: { createdAt: { gte: thirtyDaysAgo } },
    orderBy: { createdAt: "asc" },
    select: { createdAt: true },
  });

  const trendMap = new Map<string, number>();
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    trendMap.set(d.toISOString().slice(0, 10), 0);
  }
  for (const r of dailyReports) {
    const key = r.createdAt.toISOString().slice(0, 10);
    trendMap.set(key, (trendMap.get(key) ?? 0) + 1);
  }
  const trend = Array.from(trendMap.entries()).map(([date, count]) => ({
    date,
    count,
  }));

  return (
    <DashboardClient
      initialData={{
        totalReports,
        thisWeek,
        critical,
        byArea: areasData.map((a) => ({
          name: a.name,
          count: a._count.reports,
        })),
        bySeverity: severityData.map((s) => ({
          severity: s.severity,
          count: s._count,
        })),
        topErrors: topErrors.map((e) => ({
          label: e.label,
          area: e.area.name,
          count: e._count.reports,
        })),
        recentReports: recentReports.map((r) => ({
          id: r.id,
          area: r.area.name,
          errorType: r.errorType.label,
          severity: r.severity,
          createdAt: r.createdAt.toISOString(),
        })),
        trend,
      }}
    />
  );
}
