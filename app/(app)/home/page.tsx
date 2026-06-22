"use client";

import { useMemo, useState } from "react";
import { apps } from "@/lib/catalog";
import ApiKeyCard from "@/components/ApiKeyCard";
import AppCard from "@/components/AppCard";

type Sort = "popularity" | "name" | "category";

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("popularity");
  const [showCount, setShowCount] = useState(15);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const out = apps.filter(
      (a) =>
        !q ||
        a.name.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q),
    );
    if (sort === "name") {
      out.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === "category") {
      out.sort((a, b) => a.category.localeCompare(b.category));
    }
    return out;
  }, [query, sort]);

  const visible = filtered.slice(0, showCount);

  return (
    <div className="space-y-6">
      <ApiKeyCard />

      <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-md">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
            🔎
          </span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${apps.length} apps…`}
            className="input pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="input w-40"
          >
            <option value="popularity">Popularity</option>
            <option value="name">Name</option>
            <option value="category">Category</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((a) => (
          <AppCard key={a.id} app={a} />
        ))}
      </div>

      {filtered.length > showCount ? (
        <div className="flex justify-center pt-2">
          <button
            onClick={() => setShowCount((c) => c + 15)}
            className="btn-ghost"
          >
            Load More
          </button>
        </div>
      ) : null}

      <p className="pt-2 text-center text-[11px] text-muted">
        By using Agezero Connect, you agree to our{" "}
        <a className="underline hover:text-white" href="#">
          Terms
        </a>{" "}
        and{" "}
        <a className="underline hover:text-white" href="#">
          Privacy Policy
        </a>
        .
      </p>
    </div>
  );
}