import type { ReactNode } from "react";
import { ArrowLeft } from "../lib/icons";

export interface WorkspaceTab {
  id: string;
  label: string;
  count: number;
}

function EmbBrand() {
  return (
    <img
      src="/emb-global-logo.png"
      alt="EMB GLOBAL"
      className="h-9 w-auto"
    />
  );
}

function ProductLabel() {
  return (
    <div className="text-right leading-tight">
      <div className="text-[17px] font-extrabold tracking-tight text-ink">
        Bid Orchestrator
      </div>
      <div className="font-mono text-[11px] tracking-tight text-stone-400">
        Sovereign · IN-North
      </div>
    </div>
  );
}

export function TopBar({
  onHome,
  tabs,
  activeTab,
  onTab,
  onBack,
  backLabel,
  right,
}: {
  onHome: () => void;
  tabs?: WorkspaceTab[];
  activeTab?: string;
  onTab?: (id: string) => void;
  onBack?: () => void;
  backLabel?: string;
  right?: ReactNode;
}) {
  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-stretch justify-between gap-4 border-b border-stone-200 bg-white px-6">
      <div className="flex items-stretch gap-7">
        <button onClick={onHome} className="flex items-center">
          <EmbBrand />
        </button>

        {tabs ? (
          <nav className="flex items-stretch gap-6">
            {tabs.map((t) => {
              const active = t.id === activeTab;
              return (
                <button
                  key={t.id}
                  onClick={() => onTab?.(t.id)}
                  className={`flex items-center gap-2 border-b-2 text-sm transition ${
                    active
                      ? "border-ink font-semibold text-ink"
                      : "border-transparent font-medium text-stone-500 hover:text-ink"
                  }`}
                >
                  {t.label}
                  <span
                    className={`rounded-md px-1.5 py-0.5 text-[11px] font-semibold ${
                      active
                        ? "bg-stone-200 text-stone-700"
                        : "bg-stone-100 text-stone-500"
                    }`}
                  >
                    {t.count}
                  </span>
                </button>
              );
            })}
          </nav>
        ) : onBack ? (
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm font-medium text-stone-600 transition hover:text-ink"
          >
            <ArrowLeft width={16} height={16} />
            {backLabel ?? "Back"}
          </button>
        ) : null}
      </div>

      <div className="flex items-center gap-3">
        {right}
        <ProductLabel />
      </div>
    </header>
  );
}
