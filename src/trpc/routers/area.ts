import { z } from "zod";
import { router, publicProcedure } from "../context";

export const areaRouter = router({
  list: publicProcedure.query(async ({ ctx }) => {
    const areas = await ctx.prisma.area.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        _count: { select: { reports: true } },
        errorTypes: {
          orderBy: { label: "asc" },
          include: { _count: { select: { reports: true } } },
        },
      },
    });
    return areas;
  }),

  bySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const area = await ctx.prisma.area.findUnique({
        where: { slug: input.slug },
        include: {
          errorTypes: {
            orderBy: { label: "asc" },
            include: { _count: { select: { reports: true } } },
          },
          _count: { select: { reports: true } },
        },
      });
      return area;
    }),
});
