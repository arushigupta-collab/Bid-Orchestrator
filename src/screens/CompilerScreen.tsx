import { useEffect, useMemo, useRef, useState } from "react";
import type {
  Assignments,
  BidForm,
  ContextFile,
  ContextFolder,
  Paragraph,
  Section,
  SectionStatus,
} from "../types";
import {
  SECTIONS,
  AUTHOR_CONTENT,
  CONTEXT_TREE,
  ROLES,
  DEFAULT_ASSIGNEE,
  COMPILED_FORMS,
  personById,
} from "../data/seed";
import { Avatar } from "../components/ui";
import { FieldsBody, ChecklistBody } from "../components/BidManagerForms";
import {
  Sparkle,
  At,
  SendArrow,
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  ChevronDown,
  Check,
  Refresh,
  Quote,
  Folder,
  FileText,
  FileTypeIcon,
} from "../lib/icons";

type SectionState = { status: SectionStatus; content: Paragraph[] };

const STATUS_META: Record<SectionStatus, { label: string; dot: string; text: string }> =
  {
    "Not Started": {
      label: "Not Started",
      dot: "border-2 border-stone-300 bg-white",
      text: "text-stone-400",
    },
    "In Progress": {
      label: "In Progress",
      dot: "border-2 border-stone-400 bg-stone-200",
      text: "text-stone-500",
    },
    Completed: {
      label: "Completed",
      dot: "bg-stone-700 border-2 border-stone-700",
      text: "text-stone-600",
    },
  };

// ---- Sidebar ---------------------------------------------------------------

function SectionRow({
  section,
  state,
  selected,
  onSelect,
  assignments,
}: {
  section: Section;
  state: SectionState;
  selected: boolean;
  onSelect: () => void;
  assignments: Assignments;
}) {
  const meta = STATUS_META[state.status];
  const contributor = section.contributor;
  const person = contributor
    ? personById(assignments[contributor] ?? DEFAULT_ASSIGNEE[contributor])
    : undefined;

  return (
    <button
      onClick={onSelect}
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition ${
        selected ? "bg-navy-soft ring-1 ring-inset ring-navy/15" : "hover:bg-stone-50"
      }`}
    >
      <span className="flex flex-col items-center">
        <span className={`h-3 w-3 rounded-full ${meta.dot}`} />
      </span>
      <span className="min-w-0 flex-1">
        <span
          className={`block truncate text-sm ${
            selected ? "font-semibold text-ink" : "font-medium text-stone-700"
          }`}
        >
          {section.title}
        </span>
        <span className={`text-[11px] ${meta.text}`}>{meta.label}</span>
      </span>
      {contributor && person ? (
        <Avatar
          initials={person.initials}
          classes={ROLES[contributor].avatarClasses}
          size="sm"
        />
      ) : null}
    </button>
  );
}

function FormRow({
  form,
  selected,
  onSelect,
  assignments,
}: {
  form: BidForm;
  selected: boolean;
  onSelect: () => void;
  assignments: Assignments;
}) {
  const roleId = form.contributor;
  const person = roleId
    ? personById(assignments[roleId] ?? DEFAULT_ASSIGNEE[roleId])
    : undefined;
  const avatarClasses = roleId ? ROLES[roleId].avatarClasses : "bg-navy text-white";
  return (
    <button
      onClick={onSelect}
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition ${
        selected ? "bg-navy-soft ring-1 ring-inset ring-navy/15" : "hover:bg-stone-50"
      }`}
    >
      <span className="h-3 w-3 rounded-full border-2 border-stone-700 bg-stone-700" />
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5">
          <span className="rounded bg-stone-100 px-1 py-0.5 text-[9px] font-bold text-stone-500">
            {form.annexure.replace("Annexure ", "A")}
          </span>
          <span
            className={`truncate text-sm ${
              selected ? "font-semibold text-ink" : "font-medium text-stone-700"
            }`}
          >
            {form.title}
          </span>
        </span>
        <span className="text-[11px] text-stone-500">Completed</span>
      </span>
      {person ? (
        <Avatar initials={person.initials} classes={avatarClasses} size="sm" />
      ) : null}
    </button>
  );
}

// ---- Context file tree -----------------------------------------------------

function FileRow({
  file,
  checked,
  onToggle,
}: {
  file: ContextFile;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <label className="group flex cursor-pointer items-center gap-2.5 rounded-md py-1.5 pl-1 pr-2 transition hover:bg-stone-50">
      <FileTypeIcon kind={file.kind} />
      <span className="min-w-0 flex-1 truncate text-[13px] text-stone-700">
        {file.name}
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={onToggle}
        className="h-4 w-4 shrink-0 accent-navy"
      />
    </label>
  );
}

function FolderNode({
  folder,
  depth,
  checked,
  onToggle,
}: {
  folder: ContextFolder;
  depth: number;
  checked: Set<string>;
  onToggle: (id: string) => void;
}) {
  return (
    <div style={{ paddingLeft: depth * 12 }}>
      <div className="flex items-center gap-2 py-1.5 text-[13px] font-semibold text-stone-600">
        <Folder className="text-stone-400" width={16} height={16} />
        {folder.name}
      </div>
      <div className="ml-2 border-l border-stone-200 pl-2">
        {folder.folders?.map((f) => (
          <FolderNode
            key={f.id}
            folder={f}
            depth={0}
            checked={checked}
            onToggle={onToggle}
          />
        ))}
        {folder.files.map((file) => (
          <FileRow
            key={file.id}
            file={file}
            checked={checked.has(file.id)}
            onToggle={() => onToggle(file.id)}
          />
        ))}
      </div>
    </div>
  );
}

// ---- Editor paragraph ------------------------------------------------------

function ParagraphItem({
  index,
  para,
  onAccept,
}: {
  index: number;
  para: Paragraph;
  onAccept: () => void;
}) {
  return (
    <li className="group relative flex gap-3">
      <span className="mt-1 w-5 shrink-0 text-right text-xs font-medium text-stone-300">
        {index + 1}.
      </span>
      <div className="min-w-0 flex-1">
        <div
          className={`animate-para rounded-md text-[15px] leading-7 text-stone-800 ${
            para.ai
              ? "bg-cream px-3 py-2 ring-1 ring-inset ring-cream-line"
              : ""
          }`}
        >
          {para.text}
        </div>
        {para.ai ? (
          <div className="mt-1 hidden items-center gap-1 group-hover:flex">
            <button
              onClick={onAccept}
              className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-200 transition hover:bg-emerald-100"
            >
              <Check width={12} height={12} /> Accept
            </button>
            <button className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold text-stone-500 ring-1 ring-inset ring-stone-200 transition hover:bg-stone-50">
              <Refresh width={12} height={12} /> Regenerate
            </button>
            <button className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold text-stone-500 ring-1 ring-inset ring-stone-200 transition hover:bg-stone-50">
              <Quote width={12} height={12} /> Cite source
            </button>
          </div>
        ) : null}
      </div>
    </li>
  );
}

// ---- Toolbar ---------------------------------------------------------------

function Toolbar() {
  const btn =
    "flex h-8 w-8 items-center justify-center rounded-md text-stone-500 transition hover:bg-stone-100 hover:text-ink";
  return (
    <div className="flex flex-wrap items-center gap-1.5 border-y border-stone-200 py-2">
      <div className="relative">
        <select className="appearance-none rounded-md border border-stone-200 bg-white py-1.5 pl-2.5 pr-7 text-xs font-medium text-stone-600 focus:outline-none">
          <option>Inter</option>
          <option>Georgia</option>
          <option>Arial</option>
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 text-stone-400"
          width={14}
          height={14}
        />
      </div>
      <div className="relative">
        <select className="appearance-none rounded-md border border-stone-200 bg-white py-1.5 pl-2.5 pr-7 text-xs font-medium text-stone-600 focus:outline-none">
          <option>Normal text</option>
          <option>Heading 1</option>
          <option>Heading 2</option>
          <option>Title</option>
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 text-stone-400"
          width={14}
          height={14}
        />
      </div>
      <span className="mx-1 h-5 w-px bg-stone-200" />
      <button className={btn}>
        <Bold width={16} height={16} />
      </button>
      <button className={btn}>
        <Italic width={16} height={16} />
      </button>
      <span className="mx-1 h-5 w-px bg-stone-200" />
      <button className={btn}>
        <AlignLeft width={16} height={16} />
      </button>
      <button className={btn}>
        <AlignCenter width={16} height={16} />
      </button>
      <button className={btn}>
        <AlignRight width={16} height={16} />
      </button>
      <button className={btn}>
        <AlignJustify width={16} height={16} />
      </button>
    </div>
  );
}

// ---- Screen ----------------------------------------------------------------

export function CompilerScreen({
  assignments,
}: {
  assignments: Assignments;
}) {
  const [sectionState, setSectionState] = useState<Record<string, SectionState>>(
    () =>
      Object.fromEntries(
        SECTIONS.map((s) => [
          s.id,
          { status: s.status, content: s.content.map((p) => ({ ...p })) },
        ]),
      ),
  );
  const [selectedId, setSelectedId] = useState("project-understanding");
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [thinking, setThinking] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [checked, setChecked] = useState<Set<string>>(() => {
    const all = new Set<string>();
    const walk = (folders: ContextFolder[]) =>
      folders.forEach((f) => {
        f.files.forEach((file) => all.add(file.id));
        if (f.folders) walk(f.folders);
      });
    walk(CONTEXT_TREE);
    return all;
  });

  const timers = useRef<number[]>([]);
  useEffect(
    () => () => {
      timers.current.forEach((t) => window.clearTimeout(t));
    },
    [],
  );

  const selectedForm = COMPILED_FORMS.find((f) => f.id === selectedId);
  const selectedSection = SECTIONS.find((s) => s.id === selectedId);
  const state = selectedSection ? sectionState[selectedId] : undefined;
  const isAuthor = selectedSection?.kind === "author";
  const isEmpty = (state?.content.length ?? 0) === 0;
  const isGenerating = generatingId === selectedId;
  const formContributor = selectedForm?.contributor
    ? personById(
        assignments[selectedForm.contributor] ??
          DEFAULT_ASSIGNEE[selectedForm.contributor],
      )
    : undefined;

  const sourceParas = useMemo<Paragraph[]>(() => {
    if (isAuthor) return AUTHOR_CONTENT[selectedId] ?? [];
    // Compiled sections re-stream their own prose with the highlight wash.
    return (SECTIONS.find((s) => s.id === selectedId)?.content ?? []).map(
      (p) => ({ text: p.text, ai: true }),
    );
  }, [selectedId, isAuthor]);

  function generate(id: string) {
    if (generatingId) return;
    const paras = id === selectedId ? sourceParas : [];
    if (paras.length === 0) return;

    setGeneratingId(id);
    setThinking(true);
    setSectionState((s) => ({
      ...s,
      [id]: { status: "In Progress", content: [] },
    }));

    // Fake 800ms generation, then stream paragraph by paragraph.
    const think = window.setTimeout(() => {
      setThinking(false);
      let i = 0;
      const step = () => {
        i += 1;
        setSectionState((s) => ({
          ...s,
          [id]: { status: "In Progress", content: paras.slice(0, i) },
        }));
        if (i < paras.length) {
          const t = window.setTimeout(step, 520);
          timers.current.push(t);
        } else {
          setSectionState((s) => ({
            ...s,
            [id]: { status: "Completed", content: paras },
          }));
          setGeneratingId(null);
        }
      };
      step();
    }, 800);
    timers.current.push(think);
  }

  function acceptParagraph(idx: number) {
    setSectionState((s) => {
      const cur = s[selectedId];
      const content = cur.content.map((p, i) =>
        i === idx ? { ...p, ai: false } : p,
      );
      return { ...s, [selectedId]: { ...cur, content } };
    });
  }

  function toggleFile(id: string) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const generateLabel = isGenerating
    ? "Generating…"
    : isEmpty
      ? "Generate with AI"
      : "Regenerate";

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
      {/* Left sidebar */}
      <aside className="flex w-[300px] shrink-0 flex-col border-r border-stone-200 bg-white">
        <div className="border-b border-stone-200 px-5 py-4">
          <h2 className="text-sm font-bold text-ink">Sections</h2>
          <p className="mt-0.5 text-xs text-stone-400">
            11 sections · {COMPILED_FORMS.length} forms
          </p>
        </div>
        <div className="scroll-slim flex-1 space-y-0.5 overflow-y-auto p-2.5">
          <p className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wider text-stone-300">
            Authored
          </p>
          {SECTIONS.filter((s) => s.kind === "author").map((s) => (
            <SectionRow
              key={s.id}
              section={s}
              state={sectionState[s.id]}
              selected={s.id === selectedId}
              onSelect={() => setSelectedId(s.id)}
              assignments={assignments}
            />
          ))}
          <p className="px-3 pb-1 pt-3 text-[10px] font-semibold uppercase tracking-wider text-stone-300">
            Compiled from team
          </p>
          {SECTIONS.filter((s) => s.kind === "compiled").map((s) => (
            <SectionRow
              key={s.id}
              section={s}
              state={sectionState[s.id]}
              selected={s.id === selectedId}
              onSelect={() => setSelectedId(s.id)}
              assignments={assignments}
            />
          ))}
          <div className="mt-1 border-t border-stone-100 pt-1">
            <p className="px-3 pb-1 pt-1 text-[10px] font-semibold uppercase tracking-wider text-stone-300">
              Filled forms
            </p>
            {COMPILED_FORMS.map((f) => (
              <FormRow
                key={f.id}
                form={f}
                selected={f.id === selectedId}
                onSelect={() => setSelectedId(f.id)}
                assignments={assignments}
              />
            ))}
          </div>
        </div>
      </aside>

      {/* Centre column */}
      <main className="relative flex min-w-0 flex-1 flex-col bg-canvas">
        {/* Generate button pinned top-right (prose sections only) */}
        {selectedSection ? (
          <div className="pointer-events-none absolute right-6 top-4 z-10">
            <button
              onClick={() => generate(selectedId)}
              disabled={isGenerating}
              className={`pointer-events-auto flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold shadow-sm transition ${
                isGenerating
                  ? "cursor-wait bg-navy/70 text-white"
                  : "bg-navy text-white hover:bg-navy-dark"
              }`}
            >
              <Sparkle width={16} height={16} />
              {generateLabel}
            </button>
          </div>
        ) : null}

        <div className="scroll-slim flex-1 overflow-y-auto px-8 py-14">
          <div className="mx-auto max-w-3xl">
            {selectedForm ? (
              /* ---- Filled form viewer ---- */
              <div>
                <div className="text-center">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-2.5 py-1 text-[11px] font-semibold text-stone-600 ring-1 ring-inset ring-stone-200">
                    <Check width={12} height={12} /> Auto-filled
                  </span>
                  <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-ink">
                    {selectedForm.title}
                  </h1>
                  <p className="mt-1 text-sm text-stone-500">
                    {selectedForm.annexure} · prepared by{" "}
                    {formContributor?.name ?? "the team"}
                  </p>
                </div>
                <div className="mt-8 rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
                  <div className="mb-4 flex items-center gap-2 border-b border-stone-100 pb-3">
                    <FileText className="text-navy" width={17} height={17} />
                    <span className="text-sm font-semibold text-ink">
                      {selectedForm.annexure} — {selectedForm.title}
                    </span>
                  </div>
                  {selectedForm.kind === "fields" ? (
                    <FieldsBody form={selectedForm} filled />
                  ) : (
                    <ChecklistBody form={selectedForm} filled />
                  )}
                </div>
              </div>
            ) : selectedSection ? (
              <>
                {/* Section title */}
                <h1 className="text-center text-3xl font-extrabold tracking-tight text-ink">
                  {selectedSection.title}
                </h1>

                {/* Prompt bar */}
                <div className="mx-auto mt-6 flex max-w-2xl items-center gap-2 rounded-2xl border border-stone-200 bg-white px-4 py-2.5 shadow-sm">
                  <button className="shrink-0 text-stone-400 transition hover:text-navy">
                    <At width={18} height={18} />
                  </button>
                  <input
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") generate(selectedId);
                    }}
                    placeholder={`Write a 400 word ${selectedSection.title} section using output from…`}
                    className="min-w-0 flex-1 bg-transparent text-sm text-ink placeholder:text-stone-400 focus:outline-none"
                  />
                  <button
                    onClick={() => generate(selectedId)}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-navy text-white transition hover:bg-navy-dark"
                  >
                    <SendArrow width={16} height={16} />
                  </button>
                </div>

                {/* Toolbar */}
                <div className="mt-6">
                  <Toolbar />
                </div>

                {/* Document body */}
                <div className="mt-6">
                  {thinking && isGenerating ? (
                    <div className="flex items-center gap-3 rounded-lg border border-cream-line bg-cream-soft px-4 py-4 text-sm text-stone-600">
                      <Sparkle
                        className="animate-pulse text-amber-600"
                        width={18}
                        height={18}
                      />
                      Generating {selectedSection.title} from selected context
                      sources…
                    </div>
                  ) : isEmpty ? (
                    <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-stone-200 px-6 py-16 text-center">
                      <Sparkle className="text-amber-500" width={28} height={28} />
                      <p className="mt-3 text-sm font-semibold text-ink">
                        This section has not been written yet
                      </p>
                      <p className="mt-1 max-w-sm text-sm text-stone-500">
                        {selectedSection.title} is owned by the Bid Manager.
                        Generate a first draft from the compiled team
                        submissions and context sources.
                      </p>
                      <button
                        onClick={() => generate(selectedId)}
                        className="mt-5 flex items-center gap-2 rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-navy-dark"
                      >
                        <Sparkle width={16} height={16} />
                        Generate with AI
                      </button>
                    </div>
                  ) : (
                    <ol className="space-y-4">
                      {(state?.content ?? []).map((para, i) => (
                        <ParagraphItem
                          key={i}
                          index={i}
                          para={para}
                          onAccept={() => acceptParagraph(i)}
                        />
                      ))}
                    </ol>
                  )}
                </div>
              </>
            ) : null}
          </div>
        </div>
      </main>

      {/* Right rail */}
      <aside className="flex w-[300px] shrink-0 flex-col border-l border-stone-200 bg-white">
        <div className="border-b border-stone-200 px-5 py-4">
          <h2 className="text-sm font-bold text-ink">Context Sources</h2>
          <p className="mt-0.5 text-xs text-stone-400">
            {checked.size} files in AI context
          </p>
        </div>
        <div className="scroll-slim flex-1 space-y-3 overflow-y-auto p-4">
          {CONTEXT_TREE.map((folder) => (
            <FolderNode
              key={folder.id}
              folder={folder}
              depth={0}
              checked={checked}
              onToggle={toggleFile}
            />
          ))}
        </div>
      </aside>
    </div>
  );
}
