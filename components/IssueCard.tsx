import Link from "next/link";

type IssueCardProps = {
  id: number;
  projectId: number;
  number: number;
  title: string;
  status: "Open" | "In Progress" | "Done";
  priority: "Low" | "Medium" | "High";
};

export default function IssueCard({
  id,
  projectId,
  number,
  title,
  status,
  priority,
}: IssueCardProps) {
  const statusStyles = {
    Open: "border-blue-900/60 bg-blue-950/40 text-blue-300",
    "In Progress":
      "border-yellow-900/60 bg-yellow-950/40 text-yellow-300",
    Done: "border-green-900/60 bg-green-950/40 text-green-300",
  };

  const priorityStyles = {
    Low: "text-gray-400",
    Medium: "text-yellow-400",
    High: "text-red-400",
  };

  return (
    <Link
      href={`/projects/${projectId}/issues/${id}`}
      className="group block"
    >
      <article className="flex flex-col gap-4 rounded-xl border border-gray-800 bg-gray-900/30 p-4 transition hover:border-gray-700 hover:bg-gray-900/60 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-500">
              #{number}
            </span>

            <span
              className={`rounded-full border px-2 py-0.5 text-xs font-medium ${statusStyles[status]}`}
            >
              {status}
            </span>
          </div>

          <h3 className="mt-2 truncate font-medium text-gray-200 transition group-hover:text-white">
            {title}
          </h3>
        </div>

        <div className="flex shrink-0 items-center justify-between gap-5 sm:justify-end">
          <span
            className={`text-xs font-medium ${priorityStyles[priority]}`}
          >
            {priority} priority
          </span>

          <span className="text-gray-600 transition group-hover:translate-x-1 group-hover:text-gray-300">
            →
          </span>
        </div>
      </article>
    </Link>
  );
}