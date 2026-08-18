import { useState } from "react";
import type { EligibilityStatus, Rfp } from "../types";
import { SourceBadge } from "../components/ui";
import { PdfViewerModal } from "../components/PdfViewerModal";
import {
  Sparkle,
  CheckCircle,
  Warning,
  CrossCircle,
  X,
  FileText,
  ArrowRight,
  Check,
} from "../lib/icons";

function EligibilityIcon({ status }: { status: EligibilityStatus }) {
  if (status === "pass")
    return <CheckCircle className="text-emerald-600" width={20} height={20} />;
  if (status === "warn")
    return <Warning className="text-amber-500" width={20} height={20} />;
  return <CrossCircle className="text-red-600" width={20} height={20} />;
}

export function SummaryDrawer({
  rfp,
  onClose,
  onReject,
  onAccept,
  onSendToUnitHead,
  onBuildTeam,
}: {
  rfp: Rfp;
  onClose: () => void;
  onReject: (id: string) => void;
  onAccept: (id: string) => void;
  onSendToUnitHead: (id: string) => void;
  onBuildTeam: (id: string) => void;
}) {
  const detailed = rfp.detailed;
  const approved = detailed && rfp.status === "Accepted";
  const [showDoc, setShowDoc] = useState(false);

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      {/* Backdrop */}
      <button
        aria-label="Close"
        onClick={onClose}
        className="animate-fade absolute inset-0 bg-ink/40"
      />

      {/* Drawer */}
      <div className="animate-drawer relative flex h-full w-full max-w-[640px] flex-col bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-stone-200 px-7 py-5">
          <div className="min-w-0">
            <div className="mb-2 flex items-center gap-2">
              <SourceBadge source={rfp.source} />
              <span className="font-mono text-xs text-stone-400">{rfp.id}</span>
            </div>
            <h2 className="text-lg font-bold leading-snug text-ink">
              {rfp.title}
            </h2>
            {rfp.tenderRef ? (
              <p className="mt-1 font-mono text-xs text-stone-500">
                {rfp.tenderRef}
              </p>
            ) : null}
            {rfp.documentUrl ? (
              <button
                onClick={() => setShowDoc(true)}
                className="mt-3 inline-flex items-center gap-2 rounded-lg border border-stone-200 px-3 py-1.5 text-xs font-semibold text-navy transition hover:bg-navy-soft"
              >
                <FileText width={15} height={15} />
                View RFP document
                <span className="rounded bg-red-100 px-1.5 py-0.5 text-[9px] font-bold text-red-700">
                  PDF
                </span>
              </button>
            ) : null}
          </div>
          <button
            onClick={onClose}
            className="shrink-0 rounded-lg p-2 text-stone-400 transition hover:bg-stone-100 hover:text-ink"
          >
            <X width={20} height={20} />
          </button>
        </div>

        {/* Body */}
        <div className="scroll-slim flex-1 overflow-y-auto px-7 py-6">
          {/* Key facts */}
          {detailed && rfp.keyFacts ? (
            <div className="grid grid-cols-2 gap-x-6 gap-y-5">
              {rfp.keyFacts.map((f) => (
                <div key={f.label}>
                  <dt className="text-[11px] font-semibold uppercase tracking-wide text-stone-400">
                    {f.label}
                  </dt>
                  <dd className="mt-1 text-sm leading-snug text-ink">
                    {f.value}
                  </dd>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-6 gap-y-5">
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-wide text-stone-400">
                  Issuing Authority
                </dt>
                <dd className="mt-1 text-sm leading-snug text-ink">
                  {rfp.authority}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-wide text-stone-400">
                  Source
                </dt>
                <dd className="mt-1 text-sm leading-snug text-ink">
                  {rfp.source}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-wide text-stone-400">
                  Bid Due Date
                </dt>
                <dd className="mt-1 text-sm leading-snug text-ink">{rfp.due}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-wide text-stone-400">
                  Est. Value
                </dt>
                <dd className="mt-1 text-sm leading-snug text-ink">
                  {rfp.value}
                </dd>
              </div>
            </div>
          )}

          {/* AI summary */}
          {detailed && rfp.aiSummary ? (
            <div className="mt-7 rounded-xl border border-cream-line bg-cream-soft p-5">
              <div className="mb-3 flex items-center gap-2">
                <Sparkle className="text-amber-600" width={18} height={18} />
                <h3 className="text-sm font-bold text-ink">AI Summary</h3>
              </div>
              <div className="space-y-3 text-sm leading-relaxed text-stone-700">
                {rfp.aiSummary.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-7 rounded-xl border border-stone-200 bg-stone-50 p-5 text-sm text-stone-500">
              <div className="mb-1 flex items-center gap-2 font-semibold text-stone-600">
                <Sparkle className="text-stone-400" width={18} height={18} />
                AI Summary
              </div>
              Full AI triage, eligibility snapshot and team routing are seeded
              for the primary Aaple Sarkar 2.0 tender in this prototype. You can
              still accept or reject this tender to see its status update.
            </div>
          )}

          {/* Eligibility snapshot */}
          {detailed && rfp.eligibility ? (
            <div className="mt-7">
              <h3 className="mb-3 text-sm font-bold text-ink">
                Eligibility snapshot
              </h3>
              <ul className="space-y-2.5">
                {rfp.eligibility.map((row, i) => (
                  <li
                    key={i}
                    className="flex gap-3 rounded-lg border border-stone-200 bg-white p-3.5"
                  >
                    <div className="mt-0.5">
                      <EligibilityIcon status={row.status} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-ink">
                        {row.criterion}
                      </p>
                      <p className="mt-0.5 text-xs leading-relaxed text-stone-500">
                        {row.note}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        {/* Sticky footer */}
        <div className="flex items-center justify-between gap-3 border-t border-stone-200 bg-white px-7 py-4">
          {approved ? (
            <>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600">
                <Check width={14} height={14} />
                Approved by Unit Head
              </span>
              <button
                onClick={() => onBuildTeam(rfp.id)}
                className="flex items-center gap-2 rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-navy-dark"
              >
                Build Team
                <ArrowRight width={16} height={16} />
              </button>
            </>
          ) : (
            <div className="flex w-full items-center justify-end gap-3">
              <button
                onClick={() => onReject(rfp.id)}
                className="rounded-lg border border-red-300 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
              >
                Reject
              </button>
              <button
                onClick={() =>
                  detailed ? onSendToUnitHead(rfp.id) : onAccept(rfp.id)
                }
                className="rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-navy-dark"
              >
                {detailed ? "Send to Unit Head" : "Accept"}
              </button>
            </div>
          )}
        </div>
      </div>

      {showDoc && rfp.documentUrl ? (
        <PdfViewerModal
          url={rfp.documentUrl}
          title={rfp.documentName ?? "RFP document"}
          subtitle={`${rfp.title} · ${rfp.tenderRef ?? ""}`}
          onClose={() => setShowDoc(false)}
        />
      ) : null}
    </div>
  );
}
