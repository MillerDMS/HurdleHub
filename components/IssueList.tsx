"use client";

import { useState } from "react";
import IssueCard from "@/components/IssueCard";

type Issue = {
  id: number;
  number: number;
  projectId: number;
  title: string;
  status: string;
  priority: string;
};

type IssueListProps = {
  issues: Issue[];
};

export default function IssueList({ issues }: IssueListProps) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [priority, setPriority] = useState("All");

  const filteredIssues = issues.filter((issue) => {
    const matchesSearch = issue.title
      .toLowerCase()
      .includes(search.trim().toLowerCase());

    const matchesStatus =
      status === "All" || issue.status === status;

    const matchesPriority =
      priority === "All" || issue.priority === priority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const hasFilters =
    search !== "" || status !== "All" || priority !== "All";

  function clearFilters() {
    setSearch("");
    setStatus("All");
    setPriority("All");
  }

  return (
    <div>
      <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-4">
        <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto]">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search issues..."
            aria-label="Search issues"
            className="min-w-0 rounded-lg border border-gray-700 bg-gray-950 px-4 py-2.5 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-gray-500"
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            aria-label="Filter by status"
            className="rounded-lg border border-gray-700 bg-gray-950 px-4 py-2.5 text-sm text-gray-300 outline-none transition focus:border-gray-500"
          >
            <option value="All">All statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            aria-label="Filter by priority"
            className="rounded-lg border border-gray-700 bg-gray-950 px-4 py-2.5 text-sm text-gray-300 outline-none transition focus:border-gray-500"
          >
            <option value="All">All priorities</option>
            <option value="Low">Low priority</option>
            <option value="Medium">Medium priority</option>
            <option value="High">High priority</option>
          </select>
        </div>
      </div>
      <div className="my-4 flex items-center justify-between gap-4">
        <p className="text-xs text-gray-500">
          Showing {filteredIssues.length} of {issues.length}{" "}
          {issues.length === 1 ? "issue" : "issues"}
        </p>

        {hasFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-xs font-medium text-gray-400 transition hover:text-white"
          >
            Clear filters
          </button>
        )}
      </div>
      {filteredIssues.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-700 bg-gray-900/20 px-6 py-10 text-center">
          <p className="font-medium text-gray-300">
            No matching issues
          </p>

          <p className="mt-1 text-sm text-gray-500">
            Try changing your search or filters.
          </p>

          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="mt-4 rounded-lg border border-gray-700 px-4 py-2 text-sm font-medium text-gray-300 transition hover:bg-gray-900 hover:text-white"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredIssues.map((issue) => (
            <IssueCard
              key={issue.id}
              id={issue.id}
              projectId={issue.projectId}
              number={issue.number}
              title={issue.title}
              status={
                issue.status as
                  | "Open"
                  | "In Progress"
                  | "Done"
              }
              priority={
                issue.priority as
                  | "Low"
                  | "Medium"
                  | "High"
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}