"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

interface ErrorType {
  id: string;
  label: string;
}

interface Area {
  id: string;
  name: string;
  errorTypes: ErrorType[];
}

export function ReportForm({ areas }: { areas: Area[] }) {
  const router = useRouter();
  const [areaId, setAreaId] = useState("");
  const [errorTypeId, setErrorTypeId] = useState("");
  const [severity, setSeverity] = useState("MEDIUM");
  const [jobRef, setJobRef] = useState("");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const create = trpc.report.create.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      setTimeout(() => router.push("/"), 2000);
    },
  });

  const selectedArea = areas.find((a) => a.id === areaId);
  const errorTypes = selectedArea?.errorTypes ?? [];
  const isValid = areaId && errorTypeId && severity;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid || create.isPending) return;
    create.mutate({
      areaId,
      errorTypeId,
      severity: severity as "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
      jobRef: jobRef || undefined,
      notes: notes || undefined,
    });
  }

  if (submitted) {
    return (
      <Card className="text-center py-12">
        <p className="text-lg text-[#C4A55A] mb-2">Report submitted</p>
        <p className="text-sm text-[#8B9DB5]">Redirecting to dashboard…</p>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Card className="space-y-6">
        <div>
          <p className="text-sm font-medium text-[#EAE5D9] mb-4">
            1. Production Phase
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {areas.map((area) => (
              <button
                key={area.id}
                type="button"
                onClick={() => {
                  setAreaId(area.id);
                  setErrorTypeId("");
                }}
                className={`px-4 py-3 text-sm border rounded text-center transition-all cursor-pointer ${
                  areaId === area.id
                    ? "border-[#C4A55A] bg-[#C4A55A]/10 text-[#EAE5D9]"
                    : "border-[#2A3A52] text-[#8B9DB5] hover:border-[#3A4A62] hover:text-[#EAE5D9]"
                }`}
              >
                {area.name}
              </button>
            ))}
          </div>
        </div>

        {selectedArea && (
          <div>
            <p className="text-sm font-medium text-[#EAE5D9] mb-4">
              2. Error Type
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
              {errorTypes.map((et) => (
                <button
                  key={et.id}
                  type="button"
                  onClick={() => setErrorTypeId(et.id)}
                  className={`px-3 py-2 text-sm border rounded text-left transition-all cursor-pointer ${
                    errorTypeId === et.id
                      ? "border-[#C4A55A] bg-[#C4A55A]/10 text-[#EAE5D9]"
                      : "border-[#2A3A52] text-[#8B9DB5] hover:border-[#3A4A62] hover:text-[#EAE5D9]"
                  }`}
                >
                  {et.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </Card>

      {selectedArea && errorTypeId && (
        <Card className="space-y-5">
          <p className="text-sm font-medium text-[#EAE5D9]">3. Details</p>

          <Select
            label="Severity"
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
            options={[
              { value: "LOW", label: "Low" },
              { value: "MEDIUM", label: "Medium" },
              { value: "HIGH", label: "High" },
              { value: "CRITICAL", label: "Critical" },
            ]}
          />

          <Input
            label="Job Reference (optional)"
            value={jobRef}
            onChange={(e) => setJobRef(e.target.value)}
            placeholder="e.g. Project #1423"
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[#8B9DB5] uppercase tracking-wider">
              Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="bg-[#0C1520] border border-[#2A3A52] rounded px-3 py-2 text-sm text-[#EAE5D9] placeholder:text-[#2A3A52] outline-none transition-colors focus:border-[#C4A55A] focus:ring-1 focus:ring-[#C4A55A]/30 resize-none"
              placeholder="Any additional context…"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={!isValid || create.isPending}>
              {create.isPending ? "Submitting…" : "Submit Report"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.push("/")}
            >
              Cancel
            </Button>
          </div>
        </Card>
      )}
    </form>
  );
}
