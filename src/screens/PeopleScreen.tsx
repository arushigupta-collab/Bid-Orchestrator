import type { RoleId } from "../types";
import { PEOPLE, ROLES } from "../data/seed";
import {
  Avatar,
  SortHeader,
  LoadIndicator,
  OverflowButton,
} from "../components/ui";
import { Users } from "../lib/icons";

const CAP_LABEL: Record<RoleId, string> = {
  "bid-manager": "Bid Manager",
  "solution-architect": "Solution Architect",
  "legal-1": "Legal Counsel 1",
  "legal-2": "Legal Counsel 2",
  finance: "Finance Owner",
  delivery: "Delivery Lead",
};

function StatusPill({ atCapacity }: { atCapacity: boolean }) {
  const cls = atCapacity
    ? "bg-amber-50 text-amber-800 ring-amber-200"
    : "bg-emerald-50 text-emerald-700 ring-emerald-200";
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${cls}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {atCapacity ? "At capacity" : "Available"}
    </span>
  );
}

export function PeopleScreen() {
  const atCapacity = PEOPLE.filter((p) => p.activeBids >= 3).length;
  const rolesCovered = new Set(PEOPLE.flatMap((p) => p.capabilities)).size;

  return (
    <div className="mx-auto max-w-[1180px] px-6 py-6">
      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-7">
        {/* Heading */}
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink">
            People
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            Everyone who can be assigned to a bid in this workspace.
          </p>
        </div>

        {/* Stats banner */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-stone-100/70 px-5 py-4">
          <div className="flex items-center gap-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-navy ring-1 ring-stone-200">
              <Users width={20} height={20} />
            </span>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                Team members
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-ink">
                  {PEOPLE.length}
                </span>
                <span className="text-sm text-stone-500">
                  {atCapacity} at capacity
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
              Roles covered
            </div>
            <div className="font-mono text-lg font-bold text-ink">
              {rolesCovered} roles
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="mt-5 overflow-x-auto scroll-slim">
          <table className="w-full min-w-[900px] border-collapse text-left">
            <thead>
              <tr className="border-b border-stone-200">
                <SortHeader label="Name" />
                <SortHeader label="Title" />
                <SortHeader label="Capabilities" />
                <SortHeader label="Load" />
                <SortHeader label="Status" />
                <th className="w-10 px-2" />
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {PEOPLE.map((p) => (
                <tr key={p.id} className="group transition hover:bg-stone-50/70">
                  <td className="px-5 py-4 align-middle">
                    <div className="flex items-center gap-3">
                      <Avatar
                        initials={p.initials}
                        classes={ROLES[p.capabilities[0]].avatarClasses}
                      />
                      <span className="text-sm font-semibold text-ink">
                        {p.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4 align-middle text-sm text-stone-600">
                    {p.title}
                  </td>
                  <td className="px-5 py-4 align-middle">
                    <div className="flex flex-wrap gap-1.5">
                      {p.capabilities.map((c) => (
                        <span
                          key={c}
                          className="rounded-md bg-stone-100 px-2 py-0.5 text-[11px] font-medium text-stone-600 ring-1 ring-inset ring-stone-200"
                        >
                          {CAP_LABEL[c]}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-4 align-middle">
                    <LoadIndicator count={p.activeBids} />
                  </td>
                  <td className="px-5 py-4 align-middle">
                    <StatusPill atCapacity={p.activeBids >= 3} />
                  </td>
                  <td className="px-2 py-4 align-middle">
                    <OverflowButton />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
