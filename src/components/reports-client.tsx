"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";

interface ReportItem {
  id: string;
  area: string;
  areaId: string;
  errorType: string;
  errorTypeId: string;
  severity: string;
  jobRef: string | null;
  notes: string | null;
  reportedBy: string;
  createdAt: string;
}

interface Area {
  id: string;
  name: string;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ReportsClient({
  initialReports,
  areas,
}: {
  initialReports: ReportItem[];
  areas: Area[];
}) {
  const [areaFilter, setAreaFilter] = useState("");
  const [severityFilter, setSeverityFilter] = useState("");

  let filtered = initialReports;
  if (areaFilter) {
    filtered = filtered.filter((r) => r.areaId === areaFilter);
  }
  if (severityFilter) {
    filtered = filtered.filter((r) => r.severity === severityFilter);
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <p
            className="text-4xl tracking-wide mb-1"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Reports
          </p>
          <p className="text-sm text-[#8B9DB5]">
            {filtered.length} report{filtered.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex gap-3">
          <Select
            value={areaFilter}
            onChange={(e) => setAreaFilter(e.target.value)}
            options={areas.map((a) => ({ value: a.id, label: a.name }))}
            placeholder="All areas"
            className="w-44"
          />
          <Select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            options={[
              { value: "LOW", label: "Low" },
              { value: "MEDIUM", label: "Medium" },
              { value: "HIGH", label: "High" },
              { value: "CRITICAL", label: "Critical" },
            ]}
            placeholder="All severities"
            className="w-44"
          />
        </div>
      </div>

      <Card className="p-0 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#2A3A52]">
              <th className="text-left py-3 px-4 text-xs text-[#8B9DB5] font-medium uppercase tracking-wider">
                Date
              </th>
              <th className="text-left py-3 px-4 text-xs text-[#8B9DB5] font-medium uppercase tracking-wider">
                Area
              </th>
              <th className="text-left py-3 px-4 text-xs text-[#8B9DB5] font-medium uppercase tracking-wider">
                Error
              </th>
              <th className="text-left py-3 px-4 text-xs text-[#8B9DB5] font-medium uppercase tracking-wider">
                Severity
              </th>
              <th className="text-left py-3 px-4 text-xs text-[#8B9DB5] font-medium uppercase tracking-wider">
                Job
              </th>
              <th className="text-left py-3 px-4 text-xs text-[#8B9DB5] font-medium uppercase tracking-wider">
                Reported by
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-16 text-center text-[#8B9DB5]">
                  No reports found
                </td>
              </tr>
            ) : (
              filtered.map((r) => (
                <tr
                  key={r.id}
                  className="border-b border-[#1A2740] hover:bg-[#1A2740]/30 transition-colors"
                >
                  <td className="py-3 px-4 text-[#8B9DB5] text-xs whitespace-nowrap">
                    {formatDate(r.createdAt)}
                  </td>
                  <td className="py-3 px-4 text-xs">{r.area}</td>
                  <td className="py-3 px-4 text-xs max-w-[240px]">
                    <span className="truncate block">{r.errorType}</span>
                    {r.notes && (
                      <span className="text-[#8B9DB5] text-[11px] truncate block mt-0.5">
                        {r.notes}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
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
                  <td className="py-3 px-4 text-xs text-[#8B9DB5] whitespace-nowrap">
                    {r.jobRef || "—"}
                  </td>
                  <td className="py-3 px-4 text-xs text-[#8B9DB5] whitespace-nowrap">
                    {r.reportedBy}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
