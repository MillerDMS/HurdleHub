import Link from "next/link";

type ProjectCardProps = {
  id: number;
  name: string;
  description: string;
  totalIssues: number;
  openIssues: number;
  completedIssues: number;
};

export default function ProjectCard({
  id,
  name,
  description,
  totalIssues,
  openIssues,
  completedIssues,
}: ProjectCardProps) {
  const completionPercentage =
    totalIssues === 0
      ? 0
      : Math.round((completedIssues / totalIssues) * 100);

  return (
    <article className="group flex h-full flex-col rounded-xl border border-gray-800 bg-gray-900/40 p-6 transition hover:border-gray-700 hover:bg-gray-900/70">
      <div className="flex-1">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-lg font-semibold tracking-tight text-white">
            {name}
          </h2>

          <span className="shrink-0 rounded-full border border-gray-700 bg-gray-800 px-2.5 py-1 text-xs text-gray-300">
            {totalIssues} {totalIssues === 1 ? "issue" : "issues"}
          </span>
        </div>

        <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-400">
          {description || "No description provided."}
        </p>

        <div className="mt-6 flex items-center gap-4 text-sm">
          <div>
            <span className="font-medium text-white">{openIssues}</span>
            <span className="ml-1 text-gray-500">open</span>
          </div>

          <div className="h-4 w-px bg-gray-800" />

          <div>
            <span className="font-medium text-white">
              {completedIssues}
            </span>
            <span className="ml-1 text-gray-500">done</span>
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="text-gray-500">Progress</span>
            <span className="font-medium text-gray-300">
              {completionPercentage}%
            </span>
          </div>

          <div
            role="progressbar"
            aria-label={`${name} completion`}
            aria-valuenow={completionPercentage}
            aria-valuemin={0}
            aria-valuemax={100}
            className="h-1.5 overflow-hidden rounded-full bg-gray-800"
          >
            <div
              className="h-full rounded-full bg-green-500 transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 border-t border-gray-800 pt-4">
        <Link
          href={`/projects/${id}`}
          className="inline-flex items-center text-sm font-medium text-gray-300 transition group-hover:text-white"
        >
          View project
          <span className="ml-1 transition-transform group-hover:translate-x-1">
            →
          </span>
        </Link>
      </div>
    </article>
  );
}