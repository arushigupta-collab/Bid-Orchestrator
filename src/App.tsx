import { useEffect, useState } from "react";
import type { Assignments, RfpStatus, RoleId } from "./types";
import { RFPS, ROLE_ORDER, CURRENT_USER_ID } from "./data/seed";
import { TopBar } from "./components/TopBar";
import type { WorkspaceTab } from "./components/TopBar";
import { MoreHorizontal, Share, Download } from "./lib/icons";
import { downloadResponseDoc } from "./lib/exportDoc";
import { HomeScreen } from "./screens/HomeScreen";
import { InboxScreen } from "./screens/InboxScreen";
import { SummaryDrawer } from "./screens/SummaryDrawer";
import { BuildTeamScreen } from "./screens/BuildTeamScreen";
import { TeamOverviewScreen } from "./screens/TeamOverviewScreen";
import { FormsScreen } from "./screens/FormsScreen";
import { CompilerScreen } from "./screens/CompilerScreen";

type Screen =
  | "home"
  | "rfp-feed"
  | "buildTeam"
  | "teamOverview"
  | "forms"
  | "compiler";

const WORKSPACE: Screen[] = ["home", "rfp-feed"];

const emptyAssignments = (): Assignments => ({
  "bid-manager": CURRENT_USER_ID,
  "solution-architect": null,
  "legal-1": null,
  "legal-2": null,
  finance: null,
  delivery: null,
});

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [rfps, setRfps] = useState(RFPS);
  const [openRfpId, setOpenRfpId] = useState<string | null>(null);
  const [activeRfpId, setActiveRfpId] = useState<string | null>(null);
  const [assignments, setAssignments] = useState<Assignments>(emptyAssignments);
  const [wizardIndex, setWizardIndex] = useState(0);
  const [toast, setToast] = useState<string | null>(null);

  const openRfp = rfps.find((r) => r.id === openRfpId) ?? null;
  const activeRfp = rfps.find((r) => r.id === activeRfpId) ?? null;
  const isWorkspace = WORKSPACE.includes(screen);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(t);
  }, [toast]);

  function setStatus(id: string, status: RfpStatus) {
    setRfps((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  }

  function handleReject(id: string) {
    setStatus(id, "Rejected");
    setOpenRfpId(null);
  }

  function handleAccept(id: string) {
    setStatus(id, "Accepted");
    const rfp = rfps.find((r) => r.id === id);
    if (rfp?.detailed) {
      setActiveRfpId(id);
      setAssignments(emptyAssignments());
      setWizardIndex(0);
      setOpenRfpId(null);
      setScreen("buildTeam");
    } else {
      setOpenRfpId(null);
    }
  }

  function assign(roleId: RoleId, personId: string) {
    setAssignments((prev) => ({ ...prev, [roleId]: personId }));
  }

  function goTab(id: string) {
    setOpenRfpId(null);
    setScreen(id as Screen);
  }

  const tabs: WorkspaceTab[] = [
    { id: "rfp-feed", label: "Bid Orchestrator", count: rfps.length },
  ];

  const compilerActions = (
    <>
      <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-stone-200 text-stone-500 transition hover:bg-stone-100 hover:text-ink">
        <MoreHorizontal width={18} height={18} />
      </button>
      <button className="flex items-center gap-1.5 rounded-lg border border-stone-200 px-3.5 py-2 text-sm font-semibold text-stone-700 transition hover:bg-stone-50">
        <Share width={16} height={16} />
        Share
      </button>
      <button
        onClick={() => {
          if (activeRfp) {
            downloadResponseDoc(activeRfp, assignments);
            setToast("Compiled response downloaded");
          }
        }}
        className="flex items-center gap-1.5 rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-navy-dark"
      >
        <Download width={16} height={16} />
        Download Draft
      </button>
    </>
  );

  const backConfig =
    screen === "buildTeam"
      ? { onBack: () => setScreen("rfp-feed"), backLabel: "Bid Orchestrator" }
      : screen === "teamOverview"
        ? { onBack: () => setScreen("buildTeam"), backLabel: "Build Team" }
        : screen === "forms"
          ? {
              onBack: () => setScreen("teamOverview"),
              backLabel: "Bid Team Assembled",
            }
          : screen === "compiler"
            ? {
                onBack: () => setScreen("forms"),
                backLabel: "Bid Manager Forms",
              }
            : {};

  return (
    <div className="flex min-h-full flex-col">
      {isWorkspace ? (
        <TopBar tabs={tabs} activeTab={screen} onTab={goTab} />
      ) : (
        <TopBar
          {...backConfig}
          right={screen === "compiler" ? compilerActions : undefined}
        />
      )}

      {screen === "home" && (
        <HomeScreen onLogin={() => setScreen("rfp-feed")} />
      )}

      {screen === "rfp-feed" && (
        <InboxScreen rfps={rfps} onOpen={(id) => setOpenRfpId(id)} />
      )}

      {screen === "buildTeam" && activeRfp && (
        <BuildTeamScreen
          rfp={activeRfp}
          assignments={assignments}
          currentIndex={wizardIndex}
          currentUserId={CURRENT_USER_ID}
          onAssign={assign}
          onGoTo={setWizardIndex}
          onNext={() =>
            setWizardIndex((i) => Math.min(i + 1, ROLE_ORDER.length - 1))
          }
          onFinish={() => setScreen("teamOverview")}
        />
      )}

      {screen === "teamOverview" && activeRfp && (
        <TeamOverviewScreen
          rfp={activeRfp}
          assignments={assignments}
          onContinue={() => setScreen("forms")}
        />
      )}

      {screen === "forms" && activeRfp && (
        <FormsScreen
          rfp={activeRfp}
          assignments={assignments}
          onCompile={() => setScreen("compiler")}
        />
      )}

      {screen === "compiler" && <CompilerScreen assignments={assignments} />}

      {/* Triage drawer overlays the RFP feed */}
      {openRfp && screen === "rfp-feed" && (
        <SummaryDrawer
          rfp={openRfp}
          onClose={() => setOpenRfpId(null)}
          onReject={handleReject}
          onAccept={handleAccept}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className="animate-fade fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-ink px-4 py-2.5 text-sm font-medium text-white shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}
