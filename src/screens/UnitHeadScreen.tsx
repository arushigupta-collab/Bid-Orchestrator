import type { EligibilityStatus, Rfp } from "../types";
import { Avatar } from "../components/ui";
import { Sparkle, CheckCircle, Warning, CrossCircle, Check } from "../lib/icons";

const UNIT_HEAD = {
  name: "Deepak Rane",
  title: "Business Unit Head",
  initials: "DR",
};

function EligibilityIcon({ status }: { status: EligibilityStatus }) {
  if (status === "pass")
    return <CheckCircle className="text-emerald-600" width={20} height={20} />;
  if (status === "warn")
    return <Warning className="text-amber-500" width={20} height={20} />;
  return <CrossCircle className="text-red-600" width={20} height={20} />;
}

export function UnitHeadScreen({
  rfp,
  onReject,
  onAccept,
}: {
  rfp: Rfp;
  onReject: () => void;
  onAccept: () => void;
}) {
  return (
    <div className="mx-auto max-w-[900px] px-6 py-8">
      {/* Heading */}
      <div className="mb-5">
        <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-stone-400">
          Unit Head Review
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink">
          {rfp.title}
        </h1>
        <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-stone-500">
          <span className="font-mono text-xs">{rfp.tenderRef}</span>
          <span>·</span>
          <span className="inline-flex items-center gap-1.5">
            <Avatar
              initials={UNIT_HEAD.initials}
              classes="bg-navy text-white"
              size="sm"
            />
            Decision by {UNIT_HEAD.name}, {UNIT_HEAD.title}
          </span>
        </p>
      </div>

      {/* Key facts */}
      {rfp.keyFacts ? (
        <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-bold text-ink">Bid at a glance</h2>
          <div className="grid grid-cols-2 gap-x-6 gap-y-5">
            {rfp.keyFacts.map((f) => (
              <div key={f.label}>
                <dt className="text-[11px] font-semibold uppercase tracking-wide text-stone-400">
                  {f.label}
                </dt>
                <dd className="mt-1 text-sm leading-snug text-ink">{f.value}</dd>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* AI summary */}
      {rfp.aiSummary ? (
        <div className="mt-5 rounded-xl border border-cream-line bg-cream-soft p-5">
          <div className="mb-3 flex items-center gap-2">
            <Sparkle className="text-amber-600" width={18} height={18} />
            <h2 className="text-sm font-bold text-ink">AI Summary</h2>
          </div>
          <div className="space-y-3 text-sm leading-relaxed text-stone-700">
            {rfp.aiSummary.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      ) : null}

      {/* Eligibility snapshot */}
      {rfp.eligibility ? (
        <div className="mt-5">
          <h2 className="mb-3 text-sm font-bold text-ink">
            Eligibility snapshot
          </h2>
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
                  <p className="text-sm font-medium text-ink">{row.criterion}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-stone-500">
                    {row.note}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {/* Decision */}
      <div className="mt-8 flex items-center justify-end gap-3">
        <button
          onClick={onReject}
          className="rounded-lg border border-red-300 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
        >
          Reject bid
        </button>
        <button
          onClick={onAccept}
          className="flex items-center gap-2 rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-navy-dark"
        >
          <Check width={16} height={16} />
          Accept bid
        </button>
      </div>
    </div>
  );
}
