import { z } from "zod";
import { router, protectedProcedure } from "../context";

const severityEnum = z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]);

export const reportRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        areaId: z.string(),
        errorTypeId: z.string(),
        severity: severityEnum,
        jobRef: z.string().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const report = await ctx.prisma.report.create({
        data: {
          areaId: input.areaId,
          errorTypeId: input.errorTypeId,
          severity: input.severity,
          jobRef: input.jobRef,
          notes: input.notes,
          reportedBy: ctx.user.email ?? ctx.user.id ?? "unknown",
        },
        include: {
          area: true,
          errorType: true,
        },
      });
      return report;
    }),

  list: protectedProcedure
    .input(
      z.object({
        areaId: z.string().optional(),
        severity: severityEnum.optional(),
        dateFrom: z.string().optional(),
        dateTo: z.string().optional(),
        limit: z.number().min(1).max(100).default(50),
        cursor: z.string().optional(),
      }).optional()
    )
    .query(async ({ ctx, input }) => {
      const where: Record<string, unknown> = {};

      if (input?.areaId) where.areaId = input.areaId;
      if (input?.severity) where.severity = input.severity;
      if (input?.dateFrom || input?.dateTo) {
        where.createdAt = {};
        if (input?.dateFrom) (where.createdAt as Record<string, unknown>).gte = new Date(input.dateFrom);
        if (input?.dateTo) (where.createdAt as Record<string, unknown>).lte = new Date(input.dateTo);
      }

      const reports = await ctx.prisma.report.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: input?.limit ?? 50,
        include: {
          area: true,
          errorType: true,
        },
      });

      return reports;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.report.delete({ where: { id: input.id } });
      return { success: true };
    }),
});
