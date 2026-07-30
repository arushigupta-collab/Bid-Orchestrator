import { useState } from "react";
import type { Assignments, Rfp, RoleId } from "../types";
import { ROLE_ORDER, ROLES, personById } from "../data/seed";
import { Avatar } from "../components/ui";
import { Check, CheckCircle, ChevronDown, ArrowRight } from "../lib/icons";

function RoleCard({
  roleId,
  assignments,
}: {
  roleId: RoleId;
  assignments: Assignments;
}) {
  const [open, setOpen] = useState(false);
  const role = ROLES[roleId];
  const person = personById(assignments[roleId]);

  return (
    <div className="flex flex-col rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
      {/* Role + assignee */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-base font-bold text-ink">{role.name}</h3>
          <p className="mt-0.5 text-xs text-stone-500">{role.mandate}</p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-stone-100 px-2 py-1 text-[11px] font-semibold text-stone-600 ring-1 ring-inset ring-stone-200">
          <Check width={12} height={12} /> Submitted
        </span>
      </div>

      {person ? (
        <div className="mt-4 flex items-center gap-3 border-y border-stone-100 py-3">
          <Avatar
            initials={person.initials}
            classes={role.avatarClasses}
            size="lg"
          />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-ink">{person.name}</p>
            <p className="truncate text-xs text-stone-500">{person.title}</p>
          </div>
        </div>
      ) : null}

      {/* Action items */}
      <ul className="mt-4 space-y-2.5">
        {role.actionItems.map((item, i) => (
          <li key={i} className="flex items-start gap-2.5">
            <CheckCircle
              className="mt-0.5 shrink-0 text-navy"
              width={16}
              height={16}
            />
            <div className="min-w-0 flex-1">
              <p className="text-[13px] leading-snug text-stone-700">
                {item.text}
              </p>
              <span className="text-[10px] text-stone-400">
                Submitted · {role.submittedAt}
              </span>
            </div>
          </li>
        ))}
      </ul>

      {/* View submission */}
      <div className="mt-4">
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-1 text-xs font-semibold text-navy hover:underline"
        >
          <ChevronDown
            className={`transition ${open ? "rotate-180" : ""}`}
            width={14}
            height={14}
          />
          {open ? "Hide submission" : "View submission"}
        </button>
        {open ? (
          <div className="mt-2 rounded-lg border border-stone-200 bg-stone-50 p-3.5 text-[13px] leading-relaxed text-stone-600">
            {role.submission}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function TeamOverviewScreen({
  rfp,
  assignments,
  onContinue,
}: {
  rfp: Rfp;
  assignments: Assignments;
  onContinue: () => void;
}) {
  const totalRoles = ROLE_ORDER.length;
  const totalItems = ROLE_ORDER.reduce(
    (sum, r) => sum + ROLES[r].actionItems.length,
    0,
  );

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-8">
      <div className="mb-5">
        <h1 className="text-2xl font-extrabold tracking-tight text-ink">
          Bid Team Assembled
        </h1>
        <p className="mt-1 text-sm text-stone-500">{rfp.title}</p>
      </div>

      {/* Progress banner */}
      <div className="mb-6 flex items-center gap-3 rounded-xl border border-stone-200 bg-stone-100 px-5 py-3.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-700 text-white">
          <Check width={18} height={18} />
        </span>
        <p className="text-sm font-semibold text-ink">
          {totalRoles} of {totalRoles} roles have submitted. {totalItems} of{" "}
          {totalItems} action items complete.
        </p>
      </div>

      {/* Role cards */}
      <div className="grid gap-5 md:grid-cols-2">
        {ROLE_ORDER.map((roleId) => (
          <RoleCard key={roleId} roleId={roleId} assignments={assignments} />
        ))}
      </div>

      {/* Continue to Bid Manager forms */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={onContinue}
          className="flex items-center gap-2 rounded-lg bg-navy px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-navy-dark"
        >
          Continue to Forms
          <ArrowRight width={16} height={16} />
        </button>
      </div>
    </div>
  );
}
