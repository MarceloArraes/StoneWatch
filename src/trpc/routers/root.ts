import { router } from "../context";
import { areaRouter } from "./area";
import { reportRouter } from "./report";
import { statsRouter } from "./stats";

export const appRouter = router({
  area: areaRouter,
  report: reportRouter,
  stats: statsRouter,
});

export type AppRouter = typeof appRouter;
