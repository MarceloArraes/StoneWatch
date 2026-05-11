"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface DashboardData {
  totalReports: number;
  thisWeek: number;
  critical: number;
  byArea: { name: string; count: number }[];
  bySeverity: { severity: string; count: number }[];
  topErrors: { label: string; area: string; count: number }[];
  recentReports: {
    id: string;
    area: string;
    errorType: string;
    severity: string;
    createdAt: string;
  }[];
  trend: { date: string; count: number }[];
}

const SEVERITY_COLORS: Record<string, string> = {
  LOW: "#5A7D6B",
  MEDIUM: "#C4A55A",
  HIGH: "#8B7A4A",
  CRITICAL: "#8B5E5E",
};

const CHART_COLORS = ["#C4A55A", "#2A3A52", "#5A7D6B", "#8B5E5E"];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function DashboardClient({ initialData }: { initialData: DashboardData }) {
  const { totalReports, thisWeek, critical, byArea, bySeverity, topErrors, recentReports, trend } =
    initialData;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
      <div>
        <p
          className="text-4xl tracking-wide mb-1"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Dashboard
        </p>
        <p className="text-sm text-[#8B9DB5]">Production error overview</p>
      </div>

      {/* Stat tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="flex flex-col gap-1">
          <span className="text-xs text-[#8B9DB5] uppercase tracking-wider">Total Reports</span>
          <span
            className="text-3xl tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {totalReports}
          </span>
        </Card>
        <Card className="flex flex-col gap-1">
          <span className="text-xs text-[#8B9DB5] uppercase tracking-wider">This Week</span>
          <span
            className="text-3xl tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {thisWeek}
          </span>
        </Card>
        <Card className="flex flex-col gap-1">
          <span className="text-xs text-[#8B9DB5] uppercase tracking-wider">Critical</span>
          <span
            className="text-3xl tracking-tight text-[#8B5E5E]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {critical}
          </span>
        </Card>
        <Card className="flex flex-col gap-1">
          <span className="text-xs text-[#8B9DB5] uppercase tracking-wider">
            % Critical
          </span>
          <span
            className="text-3xl tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {totalReports > 0 ? `${Math.round((critical / totalReports) * 100)}%` : "0%"}
          </span>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar chart: by area */}
        <Card className="lg:col-span-2">
          <p className="text-sm font-medium text-[#EAE5D9] mb-4">Errors by Production Phase</p>
          {byArea.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={byArea} layout="vertical" margin={{ left: 0, right: 0 }}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#2A3A52"
                  horizontal={false}
                />
                <XAxis
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#8B9DB5", fontSize: 11 }}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#EAE5D9", fontSize: 12 }}
                  width={120}
                />
                <Tooltip
                  contentStyle={{
                    background: "#1A2740",
                    border: "1px solid #2A3A52",
                    borderRadius: "2px",
                    color: "#EAE5D9",
                    fontSize: 12,
                  }}
                  cursor={{ fill: "rgba(196,165,90,0.08)" }}
                />
                <Bar dataKey="count" fill="#C4A55A" radius={[0, 2, 2, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-[#8B9DB5] py-12 text-center">No data yet</p>
          )}
        </Card>

        {/* Donut: by severity */}
        <Card>
          <p className="text-sm font-medium text-[#EAE5D9] mb-4">By Severity</p>
          {bySeverity.length > 0 ? (
            <div className="flex flex-col items-center">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={bySeverity}
                    dataKey="count"
                    nameKey="severity"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    strokeWidth={0}
                  >
                    {bySeverity.map((entry, i) => (
                      <Cell
                        key={entry.severity}
                        fill={SEVERITY_COLORS[entry.severity] ?? CHART_COLORS[i % CHART_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "#1A2740",
                      border: "1px solid #2A3A52",
                      color: "#EAE5D9",
                      fontSize: 12,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-3 mt-2 justify-center">
                {bySeverity.map((s) => (
                  <div key={s.severity} className="flex items-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{
                        background: SEVERITY_COLORS[s.severity] ?? "#2A3A52",
                      }}
                    />
                    <span className="text-xs text-[#8B9DB5]">
                      {s.severity} ({s.count})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-[#8B9DB5] py-16 text-center">No data yet</p>
          )}
        </Card>
      </div>

      {/* Trend line + Top errors */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <p className="text-sm font-medium text-[#EAE5D9] mb-4">30-Day Trend</p>
          {trend.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A3A52" />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#8B9DB5", fontSize: 10 }}
                  tickFormatter={(v: string) => v.slice(5)}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#8B9DB5", fontSize: 11 }}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "#1A2740",
                    border: "1px solid #2A3A52",
                    color: "#EAE5D9",
                    fontSize: 12,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#C4A55A"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: "#C4A55A", stroke: "#0C1520" }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-[#8B9DB5] py-16 text-center">No data yet</p>
          )}
        </Card>

        <Card>
          <p className="text-sm font-medium text-[#EAE5D9] mb-4">Top Error Types</p>
          {topErrors.length > 0 ? (
            <div className="space-y-2">
              {topErrors.map((err, i) => (
                <div key={i} className="flex items-center justify-between py-1.5 border-b border-[#2A3A52] last:border-0">
                  <div className="min-w-0 flex-1 mr-3">
                    <p className="text-xs text-[#EAE5D9] truncate">{err.label}</p>
                    <p className="text-[10px] text-[#8B9DB5]">{err.area}</p>
                  </div>
                  <span className="text-xs font-medium text-[#C4A55A]">{err.count}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#8B9DB5] py-16 text-center">No data yet</p>
          )}
        </Card>
      </div>

      {/* Recent reports */}
      <Card>
        <p className="text-sm font-medium text-[#EAE5D9] mb-4">Recent Reports</p>
        {recentReports.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#2A3A52]">
                  <th className="text-left py-2 px-3 text-xs text-[#8B9DB5] font-medium uppercase tracking-wider">
                    Date
                  </th>
                  <th className="text-left py-2 px-3 text-xs text-[#8B9DB5] font-medium uppercase tracking-wider">
                    Area
                  </th>
                  <th className="text-left py-2 px-3 text-xs text-[#8B9DB5] font-medium uppercase tracking-wider">
                    Error
                  </th>
                  <th className="text-left py-2 px-3 text-xs text-[#8B9DB5] font-medium uppercase tracking-wider">
                    Severity
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentReports.map((r) => (
                  <tr key={r.id} className="border-b border-[#1A2740] hover:bg-[#1A2740]/30 transition-colors">
                    <td className="py-2.5 px-3 text-[#8B9DB5] text-xs">
                      {formatDate(r.createdAt)}
                    </td>
                    <td className="py-2.5 px-3 text-xs">{r.area}</td>
                    <td className="py-2.5 px-3 text-xs max-w-[200px] truncate">
                      {r.errorType}
                    </td>
                    <td className="py-2.5 px-3">
                      <Badge
                        variant={
                          r.severity === "CRITICAL"
                            ? "rose"
                            : r.severity === "HIGH"
                            ? "gold"
                            : r.severity === "MEDIUM"
                            ? "muted"
                            : "success"
                        }
                      >
                        {r.severity}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-[#8B9DB5] py-12 text-center">No reports yet</p>
        )}
      </Card>
    </div>
  );
}
