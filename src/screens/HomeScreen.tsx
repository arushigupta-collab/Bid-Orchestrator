import { useState } from "react";
import { CURRENT_USER_ID, personById } from "../data/seed";
import { Avatar } from "../components/ui";
import { Target, FileText, Route, Lock } from "../lib/icons";

const USER_EMAIL = "arushi.sharma@example.com";

function HawkMark() {
  return (
    <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-navy text-white shadow-sm">
      <svg viewBox="0 0 24 24" width={22} height={22} fill="none" aria-hidden>
        <path
          d="M4 7.5l8 4 8-4-2.8 5.5 2.8 4.5-8-3-8 3 2.8-4.5z"
          stroke="currentColor"
          strokeWidth={1.6}
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

const FEATURES = [
  {
    icon: Target,
    title: "Triage & summarise",
    body: "Reads each incoming RFP into a brief with tender fee, EMD, PBG, timelines and your eligibility position, and flags the clauses that carry risk.",
  },
  {
    icon: Route,
    title: "Assemble the bid team",
    body: "Routes every action item and clause to the right owner across solution, legal, finance and delivery, with load-aware assignment and a live roster tracked to submission.",
  },
  {
    icon: FileText,
    title: "Draft & compile",
    body: "Auto-fills the statutory annexures and compiles a role-attributed proposal with AI, section by section, ready to download and submit before the deadline.",
  },
];

function LoginCard({ onLogin }: { onLogin: () => void }) {
  const me = personById(CURRENT_USER_ID)!;
  const [password, setPassword] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onLogin();
      }}
      className="mx-auto mt-5 w-full max-w-sm rounded-2xl border border-stone-200 bg-white p-4 text-left shadow-sm"
    >
      <h2 className="text-base font-bold text-ink">Sign in to your workspace</h2>

      {/* Signed-in account */}
      <div className="mt-3 flex items-center gap-3 rounded-xl border border-stone-200 bg-stone-50 p-3">
        <Avatar initials={me.initials} classes="bg-navy text-white" />
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-ink">
            {me.name}
          </div>
          <div className="truncate text-xs text-stone-500">{USER_EMAIL}</div>
        </div>
      </div>

      {/* Password */}
      <label className="mt-3 block text-[11px] font-semibold uppercase tracking-wide text-stone-400">
        Password
      </label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••••"
        className="mt-1 w-full rounded-lg border border-stone-200 bg-white px-3 py-2.5 text-sm text-ink placeholder:text-stone-300 focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/15"
      />

      <button
        type="submit"
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-navy py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-navy-dark"
      >
        <Lock width={16} height={16} />
        Sign in
      </button>

      <p className="mt-2.5 text-center text-[11px] text-stone-400">
        {me.title} · Sovereign workspace, IN-North
      </p>
    </form>
  );
}

export function HomeScreen({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="min-h-[calc(100vh-4rem)] border-b border-stone-200 bg-white">
      <div className="mx-auto max-w-[1180px] px-6 py-5 sm:px-10">
        {/* Hero */}
        <div className="mx-auto max-w-2xl text-center">
          <HawkMark />
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.22em] text-stone-400">
            Bid Management Suite
          </p>
          <h1 className="mt-2 text-5xl font-black tracking-tight text-ink">
            Bid Orchestrator
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-stone-500">
            Reads each RFP against your eligibility, routes it to a bid team,
            and compiles the response through to submission.
          </p>

          <LoginCard onLogin={onLogin} />
        </div>

        {/* Feature grid */}
        <div className="mt-6 grid gap-px overflow-hidden rounded-2xl bg-stone-200 md:grid-cols-3">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="bg-stone-50 p-4">
                <Icon className="text-amber-600" width={20} height={20} />
                <h3 className="mt-2 text-sm font-bold text-ink">{f.title}</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-stone-500">
                  {f.body}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
