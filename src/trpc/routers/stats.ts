import { router, publicProcedure } from "../context";

export const statsRouter = router({
  overview: publicProcedure.query(async ({ ctx }) => {
    const totalReports = await ctx.prisma.report.count();

    const byArea = await ctx.prisma.area.findMany({
      orderBy: { sortOrder: "asc" },
      include: { _count: { select: { reports: true } } },
    });

    const byAreaFormatted = byArea.map((a) => ({
      name: a.name,
      count: a._count.reports,
    }));

    const bySeverity = await ctx.prisma.report.groupBy({
      by: ["severity"],
      _count: true,
    });

    const bySeverityFormatted = bySeverity.map((s) => ({
      severity: s.severity,
      count: s._count,
    }));

    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    const reportsThisWeek = await ctx.prisma.report.count({
      where: { createdAt: { gte: lastWeek } },
    });

    const critical = await ctx.prisma.report.count({
      where: { severity: "CRITICAL" },
    });

    return {
      totalReports,
      reportsThisWeek,
      critical,
      byArea: byAreaFormatted,
      bySeverity: bySeverityFormatted,
    };
  }),

  trend: publicProcedure.query(async ({ ctx }) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const reports = await ctx.prisma.report.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      orderBy: { createdAt: "asc" },
      select: { createdAt: true, areaId: true },
    });

    const dailyMap = new Map<string, { date: string; count: number }>();
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      dailyMap.set(key, { date: key, count: 0 });
    }

    for (const r of reports) {
      const key = r.createdAt.toISOString().slice(0, 10);
      const entry = dailyMap.get(key);
      if (entry) entry.count++;
    }

    return Array.from(dailyMap.values());
  }),

  topErrors: publicProcedure.query(async ({ ctx }) => {
    const errors = await ctx.prisma.errorType.findMany({
      include: {
        _count: { select: { reports: true } },
        area: { select: { name: true } },
      },
      orderBy: { reports: { _count: "desc" } },
      take: 10,
    });

    return errors.map((e) => ({
      label: e.label,
      area: e.area.name,
      count: e._count.reports,
    }));
  }),
});
