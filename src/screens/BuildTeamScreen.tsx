import { useEffect, useRef, useState } from "react";
import type { Assignments, Rfp, RoleId } from "../types";
import {
  ROLE_ORDER,
  ROLES,
  peopleForRole,
  personById,
} from "../data/seed";
import { Avatar, LoadIndicator, SourceBadge } from "../components/ui";
import { PdfViewerModal } from "../components/PdfViewerModal";
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ArrowRight,
  Sparkle,
  FileText,
} from "../lib/icons";

// ---- Rich assignee dropdown ------------------------------------------------

function AssignDropdown({
  roleId,
  value,
  onChange,
  currentUserId,
}: {
  roleId: RoleId;
  value: string | null;
  onChange: (personId: string) => void;
  currentUserId: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const people = peopleForRole(roleId);
  const selected = personById(value);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex w-full items-center justify-between gap-3 rounded-lg border bg-white px-4 py-3 text-left transition ${
          open
            ? "border-navy ring-2 ring-navy/15"
            : "border-stone-300 hover:border-stone-400"
        }`}
      >
        {selected ? (
          <span className="flex min-w-0 items-center gap-3">
            <Avatar
              initials={selected.initials}
              classes={ROLES[roleId].avatarClasses}
            />
            <span className="min-w-0">
              <span className="flex items-center gap-2">
                <span className="text-sm font-semibold text-ink">
                  {selected.name}
                </span>
                {selected.id === currentUserId && roleId === "bid-manager" ? (
                  <span className="rounded bg-navy-soft px-1.5 py-0.5 text-[10px] font-semibold text-navy">
                    You (default)
                  </span>
                ) : null}
              </span>
              <span className="block truncate text-xs text-stone-500">
                {selected.title}
              </span>
            </span>
          </span>
        ) : (
          <span className="text-sm text-stone-400">Select a person…</span>
        )}
        <ChevronDown
          className={`shrink-0 text-stone-400 transition ${open ? "rotate-180" : ""}`}
          width={18}
          height={18}
        />
      </button>

      {open ? (
        <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-lg border border-stone-200 bg-white shadow-xl">
          {people.map((p) => {
            const isSel = p.id === value;
            return (
              <button
                key={p.id}
                onClick={() => {
                  onChange(p.id);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-stone-50 ${
                  isSel ? "bg-navy-soft/60" : ""
                }`}
              >
                <Avatar
                  initials={p.initials}
                  classes={ROLES[roleId].avatarClasses}
                />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-ink">
                    {p.name}
                    {p.id === currentUserId && roleId === "bid-manager" ? (
                      <span className="ml-2 rounded bg-navy-soft px-1.5 py-0.5 text-[10px] font-semibold text-navy">
                        You
                      </span>
                    ) : null}
                  </span>
                  <span className="block truncate text-xs text-stone-500">
                    {p.title}
                  </span>
                </span>
                <span className="shrink-0">
                  <LoadIndicator count={p.activeBids} />
                </span>
                {isSel ? (
                  <Check className="shrink-0 text-navy" width={16} height={16} />
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

// ---- Left rail stepper -----------------------------------------------------

function Stepper({
  currentIndex,
  assignments,
  onGoTo,
}: {
  currentIndex: number;
  assignments: Assignments;
  onGoTo: (i: number) => void;
}) {
  return (
    <ol className="space-y-1">
      {ROLE_ORDER.map((roleId, i) => {
        const role = ROLES[roleId];
        const assigned = !!assignments[roleId];
        const active = i === currentIndex;
        const reachable = i <= currentIndex || assigned;
        return (
          <li key={roleId}>
            <button
              disabled={!reachable}
              onClick={() => reachable && onGoTo(i)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition ${
                active
                  ? "bg-stone-100"
                  : reachable
                    ? "hover:bg-stone-50"
                    : "cursor-not-allowed opacity-60"
              }`}
            >
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                  assigned
                    ? "bg-navy text-white"
                    : active
                      ? "border-2 border-navy text-navy"
                      : "border-2 border-stone-300 text-stone-400"
                }`}
              >
                {assigned ? <Check width={13} height={13} /> : i + 1}
              </span>
              <span
                className={`text-sm leading-tight ${
                  active
                    ? "font-semibold text-ink"
                    : assigned
                      ? "font-medium text-stone-700"
                      : "text-stone-500"
                }`}
              >
                {role.name}
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}

// ---- Right rail roster -----------------------------------------------------

function Roster({
  assignments,
  currentUserId,
}: {
  assignments: Assignments;
  currentUserId: string;
}) {
  return (
    <div className="space-y-3">
      {ROLE_ORDER.map((roleId) => {
        const role = ROLES[roleId];
        const person = personById(assignments[roleId]);
        const itemCount = role.actionItems.length;
        if (!person) {
          return (
            <div
              key={roleId}
              className="rounded-xl border-2 border-dashed border-stone-200 px-4 py-3.5"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-stone-300">
                {role.name}
              </p>
              <p className="mt-1 text-xs text-stone-300">Unassigned</p>
            </div>
          );
        }
        return (
          <div
            key={roleId}
            className="rounded-xl border border-stone-200 bg-white px-4 py-3.5 shadow-sm"
          >
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-stone-400">
              {role.name}
            </p>
            <div className="flex items-center gap-3">
              <Avatar initials={person.initials} classes={role.avatarClasses} />
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 text-sm font-semibold text-ink">
                  {person.name}
                  {person.id === currentUserId && roleId === "bid-manager" ? (
                    <span className="rounded bg-navy-soft px-1.5 py-0.5 text-[10px] font-semibold text-navy">
                      You
                    </span>
                  ) : null}
                </p>
                <p className="truncate text-xs text-stone-500">
                  {itemCount} action items
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ---- Screen ----------------------------------------------------------------

export function BuildTeamScreen({
  rfp,
  assignments,
  currentIndex,
  currentUserId,
  onAssign,
  onGoTo,
  onNext,
  onFinish,
}: {
  rfp: Rfp;
  assignments: Assignments;
  currentIndex: number;
  currentUserId: string;
  onAssign: (roleId: RoleId, personId: string) => void;
  onGoTo: (i: number) => void;
  onNext: () => void;
  onFinish: () => void;
}) {
  const roleId = ROLE_ORDER[currentIndex];
  const role = ROLES[roleId];
  const isLast = currentIndex === ROLE_ORDER.length - 1;
  const nextRole = isLast ? null : ROLES[ROLE_ORDER[currentIndex + 1]];
  const assignedHere = !!assignments[roleId];
  const [showDoc, setShowDoc] = useState(false);

  return (
    <div className="mx-auto flex max-w-[1400px] gap-6 px-6 py-6">
      {/* Left rail */}
      <aside className="hidden w-[280px] shrink-0 lg:block">
        <div className="sticky top-[88px] space-y-5">
          <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
            <div className="mb-2 flex items-center gap-2">
              <SourceBadge source={rfp.source} />
              <span className="font-mono text-[11px] text-stone-400">
                {rfp.id}
              </span>
            </div>
            <h3 className="text-sm font-bold leading-snug text-ink">
              {rfp.title}
            </h3>
            {rfp.tenderRef ? (
              <p className="mt-1 font-mono text-[11px] text-stone-500">
                {rfp.tenderRef}
              </p>
            ) : null}
            {rfp.documentUrl ? (
              <button
                onClick={() => setShowDoc(true)}
                className="mt-3 flex w-full items-center gap-2 rounded-lg border border-stone-200 px-3 py-2 text-left text-xs font-semibold text-navy transition hover:bg-navy-soft"
              >
                <FileText width={15} height={15} />
                <span className="flex-1">View RFP document</span>
                <span className="rounded bg-red-100 px-1.5 py-0.5 text-[9px] font-bold text-red-700">
                  PDF
                </span>
              </button>
            ) : null}
            <p className="mt-3 text-xs text-stone-500">
              Bid due <span className="font-medium text-ink">{rfp.due}</span>
            </p>
          </div>

          <div className="rounded-xl border border-stone-200 bg-white p-3 shadow-sm">
            <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wide text-stone-400">
              Roles
            </p>
            <Stepper
              currentIndex={currentIndex}
              assignments={assignments}
              onGoTo={onGoTo}
            />
          </div>
        </div>
      </aside>

      {/* Centre column */}
      <main className="min-w-0 flex-1">
        <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-stone-400">
          Role {currentIndex + 1} of {ROLE_ORDER.length}
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink">
          {role.name}
        </h1>
        <p className="mt-1 text-sm text-stone-500">{role.mandate}</p>

        {/* Department brief */}
        <p className="mt-5 text-[15px] leading-7 text-stone-700">{role.brief}</p>

        {/* Relevant RFP sections */}
        <div className="mt-4 flex flex-wrap gap-2">
          {role.sourceSections.map((s) => (
            <span
              key={s}
              className="rounded-md bg-stone-100 px-3 py-1.5 text-sm font-medium text-stone-600"
            >
              {s}
            </span>
          ))}
        </div>

        {/* Bid summary (condensed, always visible for context) */}
        <div className="mt-6 rounded-xl border border-cream-line bg-cream-soft p-4">
          <div className="mb-2 flex items-center gap-2">
            <Sparkle className="text-amber-600" width={15} height={15} />
            <h2 className="text-[11px] font-bold uppercase tracking-wide text-ink">
              Bid Summary
            </h2>
          </div>
          <ul className="space-y-1.5 text-sm leading-relaxed text-stone-700">
            {(rfp.aiSummaryCondensed ?? []).map((line, i) => (
              <li key={i} className="flex gap-2">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-500" />
                {line}
              </li>
            ))}
          </ul>
        </div>

        {/* Action items */}
        <div className="mt-7">
          <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-stone-500">
            Action Items
          </h2>
          <ul className="mt-3 space-y-3">
            {role.actionItems.map((item, i) => (
              <li key={i} className="flex gap-3">
                <span className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-stone-300" />
                <div className="min-w-0">
                  <span className="text-[15px] leading-7 text-stone-700">
                    {item.text}
                  </span>
                  {item.ref ? (
                    <span className="ml-2 whitespace-nowrap font-mono text-[11px] text-stone-400">
                      {item.ref}
                    </span>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Forms to complete */}
        <div className="mt-7">
          <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-stone-500">
            Forms to complete
          </h2>
          <p className="mt-1 text-xs text-stone-400">
            Annexure formats this department must fill and submit.
          </p>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {role.forms.map((f) => (
              <li
                key={f}
                className="flex items-center gap-2.5 rounded-lg border border-stone-200 bg-white px-3 py-2.5"
              >
                <FileText className="shrink-0 text-navy" width={16} height={16} />
                <span className="text-[13px] leading-snug text-stone-700">
                  {f}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Assign */}
        <div className="mt-6">
          <label className="mb-2 block text-sm font-bold text-ink">
            Assign to
          </label>
          <AssignDropdown
            roleId={roleId}
            value={assignments[roleId]}
            onChange={(pid) => onAssign(roleId, pid)}
            currentUserId={currentUserId}
          />
        </div>

        {/* Nav */}
        <div className="mt-8 flex items-center justify-between">
          {currentIndex > 0 ? (
            <button
              onClick={() => onGoTo(currentIndex - 1)}
              className="flex items-center gap-1.5 text-sm font-medium text-stone-500 transition hover:text-ink"
            >
              <ChevronLeft width={16} height={16} />
              Back to {ROLES[ROLE_ORDER[currentIndex - 1]].name}
            </button>
          ) : (
            <span />
          )}
          <button
            disabled={!assignedHere}
            onClick={isLast ? onFinish : onNext}
            className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold shadow-sm transition ${
              assignedHere
                ? "bg-navy text-white hover:bg-navy-dark"
                : "cursor-not-allowed bg-stone-200 text-stone-400"
            }`}
          >
            {isLast ? "Review Team" : `Next: ${nextRole!.name}`}
            <ArrowRight width={16} height={16} />
          </button>
        </div>
      </main>

      {/* Right rail */}
      <aside className="hidden w-[300px] shrink-0 xl:block">
        <div className="sticky top-[88px]">
          <h2 className="mb-3 text-sm font-bold text-ink">Team so far</h2>
          <Roster assignments={assignments} currentUserId={currentUserId} />
        </div>
      </aside>

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
