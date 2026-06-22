"use client";

import { useState } from "react";

const suggestions = [
  {
    title: "Fetch this week's events on my calendar",
    body: "Get upcoming meetings and events from Google Calendar.",
  },
  {
    title: "Summarize yesterday's unread emails",
    body: "Review and summarize unread messages from Gmail.",
  },
  {
    title: "Find my recent documents in Notion",
    body: "Search and retrieve your recently edited Notion pages.",
  },
];

export default function TaskChat({
  onSubmitted,
}: {
  onSubmitted: () => void;
}) {
  const [value, setValue] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [model, setModel] = useState("Sonnet 4.6");
  const [permission, setPermission] = useState("Bypass permissions");
  const [skills, setSkills] = useState("Skills");

  async function submit(title: string) {
    setSubmitting(true);
    try {
      await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      setValue("");
      onSubmitted();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center pt-16">
      <div className="mb-4 flex items-center gap-2">
        <span className="text-2xl">✶</span>
        <span className="text-2xl">⌬</span>
        <span className="grid h-7 w-7 place-items-center rounded-md bg-white text-ink-900 text-xs font-black">
          ▣
        </span>
      </div>
      <h2 className="mb-6 text-sm font-medium text-muted-soft">
        What task can I help you with?
      </h2>

      <div className="w-full">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Ask Claude Code to perform a task…"
          className="input min-h-[88px] resize-none py-3"
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && value.trim()) {
              e.preventDefault();
              submit(value.trim());
            }
          }}
        />
        <div className="mt-2 flex items-center justify-between text-xs text-muted-soft">
          <div className="flex items-center gap-3">
            <Picker
              label={`✱ ${model}`}
              value={model}
              options={["Sonnet 4.6", "Opus 4.7", "Haiku 4.5"]}
              onChange={setModel}
            />
            <Picker
              label={`⊘ ${permission}`}
              value={permission}
              options={["Bypass permissions", "Ask permissions"]}
              onChange={setPermission}
            />
            <Picker
              label={`✦ ${skills}`}
              value={skills}
              options={["Skills", "No skills"]}
              onChange={setSkills}
            />
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => value.trim() && submit(value.trim())}
              disabled={!value.trim() || submitting}
              className="btn-ghost"
              aria-label="Attach"
            >
              ＋
            </button>
            <button
              onClick={() => value.trim() && submit(value.trim())}
              disabled={!value.trim() || submitting}
              className="btn-primary"
            >
              {submitting ? "…" : "↑"}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-10 w-full space-y-4">
        {suggestions.map((s) => (
          <button
            key={s.title}
            onClick={() => submit(s.title)}
            className="flex w-full items-start gap-3 rounded-lg p-2 text-left transition-colors hover:bg-white/[0.03]"
          >
            <span className="mt-0.5 text-muted">↗</span>
            <div>
              <div className="text-sm font-medium">
                {s.title}{" "}
                <span className="font-normal text-muted-soft">— {s.body}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function Picker({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="cursor-pointer rounded-md border border-line bg-ink-900/60 px-2 py-1 text-xs text-muted-soft hover:text-white"
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}