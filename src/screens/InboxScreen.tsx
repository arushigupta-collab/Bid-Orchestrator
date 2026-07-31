import { useMemo, useState } from "react";
import type { Rfp, RfpStatus, Source } from "../types";
import {
  StatusPill,
  SourceBadge,
  SortHeader,
  OverflowButton,
} from "../components/ui";
import { Search, Layers } from "../lib/icons";

const SOURCES: (Source | "All")[] = [
  "All",
  "GeM",
  "CPPP",
  "MahaTenders",
  "Direct",
];
const STATUSES: (RfpStatus | "All")[] = [
  "All",
  "Pending Review",
  "Accepted",
  "Rejected",
];

export function InboxScreen({
  rfps,
  onOpen,
}: {
  rfps: Rfp[];
  onOpen: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [source, setSource] = useState<Source | "All">("All");
  const [status, setStatus] = useState<RfpStatus | "All">("All");

  const pending = rfps.filter((r) => r.status === "Pending Review").length;
  const connectedSources = new Set(rfps.map((r) => r.source)).size;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rfps.filter((r) => {
      if (source !== "All" && r.source !== source) return false;
      if (status !== "All" && r.status !== status) return false;
      if (
        q &&
        !r.title.toLowerCase().includes(q) &&
        !r.authority.toLowerCase().includes(q) &&
        !r.id.toLowerCase().includes(q)
      )
        return false;
      return true;
    });
  }, [rfps, query, source, status]);

  return (
    <div className="min-h-[calc(100vh-4rem)] border-b border-stone-200 bg-white">
      <div className="mx-auto max-w-[1180px] px-6 py-8 sm:px-8">
        {/* Stats banner */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-stone-100/70 px-5 py-4">
          <div className="flex items-center gap-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-navy ring-1 ring-stone-200">
              <Layers width={20} height={20} />
            </span>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                Open listings
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-ink">
                  {rfps.length}
                </span>
                <span className="text-sm text-stone-500">
                  {pending} pending review
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
              Sources
            </div>
            <div className="font-mono text-lg font-bold text-ink">
              {connectedSources} connected
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search
              width={16}
              height={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tenders by title or authority"
              className="w-full rounded-lg border border-stone-200 bg-white py-2.5 pl-9 pr-3 text-sm text-ink placeholder:text-stone-400 focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/15"
            />
          </div>
          <select
            value={source}
            onChange={(e) => setSource(e.target.value as Source | "All")}
            className="rounded-lg border border-stone-200 bg-white py-2.5 pl-3 pr-8 text-sm font-medium text-ink focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/15"
          >
            {SOURCES.map((s) => (
              <option key={s} value={s}>
                {s === "All" ? "All sources" : s}
              </option>
            ))}
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as RfpStatus | "All")}
            className="rounded-lg border border-stone-200 bg-white py-2.5 pl-3 pr-8 text-sm font-medium text-ink focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/15"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s === "All" ? "All statuses" : s}
              </option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto scroll-slim">
          <table className="w-full min-w-[920px] border-collapse text-left">
            <thead>
              <tr className="border-b border-stone-200">
                <SortHeader label="RFP" />
                <SortHeader label="Source" />
                <SortHeader label="Issuing Authority" />
                <SortHeader label="Due Date" />
                <SortHeader label="Est. Value" />
                <SortHeader label="Status" />
                <th className="w-10 px-2" />
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.map((r) => (
                <tr key={r.id} className="group transition hover:bg-stone-50/70">
                  <td className="max-w-[360px] px-5 py-4 align-top">
                    <button
                      onClick={() => onOpen(r.id)}
                      className="text-left text-sm font-semibold text-navy hover:underline"
                    >
                      {r.title}
                    </button>
                    <div className="mt-1 flex items-center gap-2 text-[11px] text-stone-400">
                      <span className="font-mono">{r.id}</span>
                      {r.tenderRef ? (
                        <>
                          <span>·</span>
                          <span className="font-mono">{r.tenderRef}</span>
                        </>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-5 py-4 align-top">
                    <SourceBadge source={r.source} />
                  </td>
                  <td className="max-w-[240px] px-5 py-4 align-top text-sm text-stone-600">
                    {r.authority}
                  </td>
                  <td className="px-5 py-4 align-top text-sm whitespace-nowrap text-stone-700">
                    {r.due}
                  </td>
                  <td className="px-5 py-4 align-top text-sm whitespace-nowrap font-medium text-ink">
                    {r.value}
                  </td>
                  <td className="px-5 py-4 align-top">
                    <StatusPill status={r.status} />
                  </td>
                  <td className="px-2 py-4 align-top">
                    <OverflowButton />
                  </td>
                </tr>
              ))}
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-16 text-center text-sm text-stone-400"
                  >
                    No tenders match the current filters.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
