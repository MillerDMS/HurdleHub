
import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import IssueList from "@/components/IssueList";
import DeleteProjectButton from "@/components/DeleteProjectButton";
import IssueCard from "@/components/IssueCard";
import { getWorkspace } from "@/lib/workspace";

type ProjectPageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function ProjectPage({
    params,
}: ProjectPageProps) {
    const { id } = await params;
    const projectId = Number(id);

    if (!Number.isSafeInteger(projectId) || projectId <= 0) {
        notFound();
    }

    const workspace = await getWorkspace();

    if (!workspace) {
        notFound();
    }

    const project = await prisma.project.findFirst({
        where: {
            id: projectId,
            workspaceId: workspace.id,
        },
        include: {
            issues: {
                orderBy: {
                    createdAt: "desc",
                },
            },
        },
    });

    if (!project) {
        notFound();
    }

    const activeIssues = project.issues.filter(
        (issue) => issue.archivedAt === null
    );

    const archivedIssues = project.issues.filter(
        (issue) => issue.archivedAt !== null
    );

    return (
        <main className="mx-auto max-w-5xl px-6 py-12 sm:py-16">
            <Link
                href="/"
                className="inline-flex items-center text-sm text-gray-500 transition hover:text-white"
            >
                ← Back to dashboard
            </Link>
            <header className="mt-8 border-b border-gray-800 pb-10">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                    <div className="max-w-2xl">
                        <p className="mb-2 text-sm font-medium text-gray-500">
                            Project
                        </p>

                        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                            {project.name}
                        </h1>

                        <p className="mt-3 leading-7 text-gray-400">
                            {project.description || "No description provided."}
                        </p>
                    </div>

                    <Link
                        href={`/projects/${project.id}/edit`}
                        className="inline-flex w-fit items-center justify-center rounded-lg border border-gray-700 px-4 py-2.5 text-sm font-medium text-gray-200 transition hover:border-gray-600 hover:bg-gray-900"
                    >
                        Edit Project
                    </Link>
                </div>
                <div className="mt-8 flex flex-wrap gap-3">
                    <div className="rounded-lg border border-gray-800 bg-gray-900/40 px-4 py-3">
                        <span className="text-lg font-semibold text-white">
                            {activeIssues.length}
                        </span>
                        <span className="ml-2 text-sm text-gray-500">
                            active
                        </span>
                    </div>

                    <div className="rounded-lg border border-gray-800 bg-gray-900/40 px-4 py-3">
                        <span className="text-lg font-semibold text-white">
                            {
                                activeIssues.filter(
                                    (issue) => issue.status === "Done"
                                ).length
                            }
                        </span>
                        <span className="ml-2 text-sm text-gray-500">
                            completed
                        </span>
                    </div>

                    <div className="rounded-lg border border-gray-800 bg-gray-900/40 px-4 py-3">
                        <span className="text-lg font-semibold text-white">
                            {archivedIssues.length}
                        </span>
                        <span className="ml-2 text-sm text-gray-500">
                            archived
                        </span>
                    </div>
                </div>
            </header>

            <section className="mt-10">
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h2 className="text-xl font-semibold tracking-tight text-white">
                            Active Issues
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            {activeIssues.length === 0
                                ? "No issues are currently being tracked."
                                : `${activeIssues.length} ${activeIssues.length === 1
                                    ? "issue"
                                    : "issues"
                                } currently being tracked.`}
                        </p>
                    </div>

                    <Link
                        href={`/projects/${project.id}/issues/new`}
                        className="inline-flex w-fit items-center justify-center rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-black transition hover:bg-gray-200"
                    >
                        <span className="mr-2 text-lg leading-none">+</span>
                        New Issue
                    </Link>
                </div>

                {activeIssues.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-gray-700 bg-gray-900/20 px-6 py-12 text-center">
                        <h3 className="font-medium text-white">
                            No active issues
                        </h3>

                        <p className="mt-2 text-sm text-gray-400">
                            Create an issue to start tracking work for this
                            project.
                        </p>

                        <Link
                            href={`/projects/${project.id}/issues/new`}
                            className="mt-5 inline-flex rounded-lg border border-gray-700 px-4 py-2 text-sm font-medium transition hover:bg-gray-900"
                        >
                            Create Issue
                        </Link>
                    </div>
                ) : (
                    <IssueList issues={activeIssues} />
                )}
            </section>

            <section className="mt-14 border-t border-gray-800 pt-10">
                <div className="mb-6">
                    <h2 className="text-xl font-semibold tracking-tight text-white">
                        Archived Issues
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Completed issues that have been moved out of the
                        active list.
                    </p>
                </div>

                {archivedIssues.length === 0 ? (
                    <div className="rounded-xl border border-gray-800 bg-gray-900/20 px-6 py-8">
                        <p className="text-sm text-gray-500">
                            No archived issues yet.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {archivedIssues.map((issue) => (
                            <IssueCard
                                key={issue.id}
                                id={issue.id}
                                number={issue.number}
                                projectId={project.id}
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
            </section>
            <section className="mt-14 border-t border-gray-800 pt-10">
                <div className="rounded-xl border border-red-950 bg-red-950/10 p-6">
                    <h2 className="text-base font-semibold text-red-400">
                         
                    </h2>

                    <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="font-medium text-gray-200">
                                Delete this project
                            </p>

                            <p className="mt-1 text-sm text-gray-500">
                                Permanently deletes the project and all of
                                its issues. This cannot be undone.
                            </p>
                        </div>

                        <div className="shrink-0">
                            <DeleteProjectButton projectId={project.id} />
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}