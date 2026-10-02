
import Link from "next/link";
import { notFound } from "next/navigation";

import { updateIssue } from "@/app/actions/issues";
import { prisma } from "@/lib/prisma";
import DeleteIssueButton from "@/components/DeleteIssueButton";
import IssueArchiveButton from "@/components/IssueArchiveButton";
import { getWorkspace } from "@/lib/workspace";

type IssuePageProps = {
    params: Promise<{
        id: string;
        issueId: string;
    }>;
};

export default async function IssuePage({
    params,
}: IssuePageProps) {
    const { id, issueId } = await params;

    const projectId = Number(id);
    const issueDatabaseId = Number(issueId);

    if (
        !Number.isSafeInteger(projectId) ||
        projectId <= 0 ||
        !Number.isSafeInteger(issueDatabaseId) ||
        issueDatabaseId <= 0
    ) {
        notFound();
    }

    const workspace = await getWorkspace();

    if (!workspace) {
        notFound();
    }

    const issue = await prisma.issue.findFirst({
        where: {
            id: issueDatabaseId,
            projectId,
            project: {
                workspaceId: workspace.id,
            },
        },
    });

    if (!issue) {
        notFound();
    }

    const saveIssue = updateIssue.bind(
        null,
        issue.id,
        projectId
    );

    const isArchived = issue.archivedAt !== null;

    return (
        <main className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
            <Link
                href={`/projects/${projectId}`}
                className="inline-flex items-center text-sm text-gray-500 transition hover:text-white"
            >
                ← Back to project
            </Link>

            {/* Issue header */}
            <header className="mt-8 border-b border-gray-800 pb-8">
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium text-gray-500">
                        Issue #{issue.number}
                    </span>

                    {isArchived && (
                        <span className="rounded-full border border-gray-700 bg-gray-800 px-2.5 py-1 text-xs font-medium text-gray-300">
                            Archived
                        </span>
                    )}
                </div>

                <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    {issue.title}
                </h1>

                <div className="mt-5 flex flex-wrap gap-2">
                    <span className="rounded-full border border-gray-700 bg-gray-900 px-3 py-1 text-xs font-medium text-gray-300">
                        {issue.status}
                    </span>

                    <span className="rounded-full border border-gray-700 bg-gray-900 px-3 py-1 text-xs font-medium text-gray-300">
                        {issue.priority} priority
                    </span>
                </div>
            </header>

            {isArchived ? (
                /* Archived read-only view */
                <section className="mt-8 rounded-xl border border-gray-800 bg-gray-900/30 p-6">
                    <div className="flex items-center justify-between gap-4 border-b border-gray-800 pb-5">
                        <div>
                            <h2 className="font-semibold text-white">
                                Archived issue
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                This issue is read-only until it is restored.
                            </p>
                        </div>

                        <span className="rounded-full bg-gray-800 px-3 py-1 text-xs text-gray-400">
                            Read-only
                        </span>
                    </div>

                    <div className="mt-6 space-y-6">
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                Description
                            </p>

                            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-300">
                                {issue.description || "No description provided."}
                            </p>
                        </div>

                        <div className="grid gap-5 border-t border-gray-800 pt-5 sm:grid-cols-3">
                            <div>
                                <p className="text-xs text-gray-500">Status</p>
                                <p className="mt-1 text-sm font-medium text-gray-300">
                                    {issue.status}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-500">Priority</p>
                                <p className="mt-1 text-sm font-medium text-gray-300">
                                    {issue.priority}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-500">Archived</p>
                                <p className="mt-1 text-sm font-medium text-gray-300">
                                    {issue.archivedAt?.toLocaleDateString("en-GB")}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            ) : (
                /* Edit form */
                <section className="mt-8">
                    <div className="mb-5">
                        <h2 className="text-lg font-semibold text-white">
                            Issue details
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Update the issue information, status and priority.
                        </p>
                    </div>

                    <form
                        action={saveIssue}
                        className="space-y-6 rounded-xl border border-gray-800 bg-gray-900/30 p-6"
                    >
                        <div>
                            <label
                                htmlFor="title"
                                className="mb-2 block text-sm font-medium text-gray-300"
                            >
                                Title
                            </label>

                            <input
                                id="title"
                                name="title"
                                type="text"
                                defaultValue={issue.title}
                                required
                                maxLength={100}
                                className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-sm text-white outline-none transition focus:border-gray-500"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="description"
                                className="mb-2 block text-sm font-medium text-gray-300"
                            >
                                Description
                            </label>

                            <textarea
                                id="description"
                                name="description"
                                rows={6}
                                defaultValue={issue.description ?? ""}
                                maxLength={1000}
                                className="w-full resize-y rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-sm text-white outline-none transition focus:border-gray-500"
                            />
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="status"
                                    className="mb-2 block text-sm font-medium text-gray-300"
                                >
                                    Status
                                </label>

                                <select
                                    id="status"
                                    name="status"
                                    defaultValue={issue.status}
                                    className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-sm text-gray-300 outline-none transition focus:border-gray-500"
                                >
                                    <option value="Open">Open</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Done">Done</option>
                                </select>
                            </div>

                            <div>
                                <label
                                    htmlFor="priority"
                                    className="mb-2 block text-sm font-medium text-gray-300"
                                >
                                    Priority
                                </label>

                                <select
                                    id="priority"
                                    name="priority"
                                    defaultValue={issue.priority}
                                    className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-sm text-gray-300 outline-none transition focus:border-gray-500"
                                >
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex flex-col-reverse gap-3 border-t border-gray-800 pt-6 sm:flex-row sm:justify-end">
                            <Link
                                href={`/projects/${projectId}`}
                                className="rounded-lg border border-gray-700 px-5 py-2.5 text-center text-sm font-medium text-gray-300 transition hover:bg-gray-800"
                            >
                                Cancel
                            </Link>

                            <button
                                type="submit"
                                className="rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-gray-200"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                </section>
            )}

            {/* Archive / restore */}
            {(issue.status === "Done" || isArchived) && (
                <section className="mt-10 border-t border-gray-800 pt-8">
                    <h2 className="text-base font-semibold text-white">
                        {isArchived ? "Restore issue" : "Archive issue"}
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        {isArchived
                            ? "Return this issue to the project's active issue list."
                            : "Move this completed issue out of the active issue list."}
                    </p>

                    <div className="mt-5">
                        <IssueArchiveButton
                            issueId={issue.id}
                            projectId={projectId}
                            archived={isArchived}
                        />
                    </div>
                </section>
            )}

            {/* Danger zone */}
            <section className="mt-10 border-t border-gray-800 pt-8">
                <div className="rounded-xl border border-red-950 bg-red-950/10 p-6">
                    <h2 className="font-semibold text-red-400">
                        Danger Zone
                    </h2>

                    <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="font-medium text-gray-200">
                                Delete this issue
                            </p>

                            <p className="mt-1 text-sm text-gray-500">
                                Permanently remove this issue. This action cannot
                                be undone.
                            </p>
                        </div>

                        <div className="shrink-0">
                            <DeleteIssueButton
                                issueId={issue.id}
                                projectId={projectId}
                            />
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}