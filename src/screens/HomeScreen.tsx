import { useState } from "react";
import { CURRENT_USER_ID, personById } from "../data/seed";
import { Avatar } from "../components/ui";
import { Target, FileText, Route, Lock } from "../lib/icons";

const USER_EMAIL = "arushi.gupta@emb.global";

function HawkMark() {
  return (
    <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-navy text-white shadow-sm">
      <svg viewBox="0 0 24 24" width={26} height={26} fill="none" aria-hidden>
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
    title: "Source & summarise",
    body: "Crawls GeM, CPPP, MahaTenders and other portals for tenders that match your profile, then reads each RFP into a brief with tender fee, EMD, PBG, timelines and your eligibility position.",
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
      className="mx-auto mt-8 w-full max-w-sm rounded-2xl border border-stone-200 bg-white p-6 text-left shadow-sm"
    >
      <h2 className="text-base font-bold text-ink">Sign in to your workspace</h2>

      {/* Signed-in account */}
      <div className="mt-4 flex items-center gap-3 rounded-xl border border-stone-200 bg-stone-50 p-3">
        <Avatar initials={me.initials} classes="bg-navy text-white" />
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-ink">
            {me.name}
          </div>
          <div className="truncate text-xs text-stone-500">{USER_EMAIL}</div>
        </div>
      </div>

      {/* Password */}
      <label className="mt-4 block text-[11px] font-semibold uppercase tracking-wide text-stone-400">
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
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-navy py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-navy-dark"
      >
        <Lock width={16} height={16} />
        Sign in as {me.name.split(" ")[0]}
      </button>

      <p className="mt-3 text-center text-[11px] text-stone-400">
        {me.title} · Sovereign workspace, IN-North
      </p>
    </form>
  );
}

export function HomeScreen({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="mx-auto max-w-[1180px] px-6 py-6">
      <div className="rounded-2xl border border-stone-200 bg-white px-6 py-14 shadow-sm sm:px-10">
        {/* Hero */}
        <div className="mx-auto max-w-2xl text-center">
          <HawkMark />
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.22em] text-stone-400">
            Bid Management Suite
          </p>
          <h1 className="mt-3 text-6xl font-black tracking-tight text-ink sm:text-7xl">
            Bid Orchestrator
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-stone-500">
            Bid Orchestrator runs the government tender lifecycle end to end. It
            crawls the e-procurement portals for qualifying RFPs, reads each one
            against your eligibility, routes the work to a bid team, and
            compiles the response through to submission.
          </p>

          <div className="mx-auto mt-8 h-px w-16 bg-stone-200" />

          <LoginCard onLogin={onLogin} />
        </div>

        {/* Feature grid */}
        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl bg-stone-200 md:grid-cols-3">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="bg-stone-50 p-7">
                <Icon className="text-amber-600" width={22} height={22} />
                <h3 className="mt-3 text-base font-bold text-ink">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-500">
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
