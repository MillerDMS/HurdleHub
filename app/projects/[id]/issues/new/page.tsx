
import Link from "next/link";
import { notFound } from "next/navigation";

import { createIssue } from "@/app/actions/issues";
import { prisma } from "@/lib/prisma";
import { getWorkspace } from "@/lib/workspace";

type NewIssuePageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function NewIssuePage({
    params,
}: NewIssuePageProps) {
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
    });

    if (!project) {
        notFound();
    }

    return (
        <main className="mx-auto max-w-2xl px-6 py-12 sm:py-16">
            <Link
                href={`/projects/${projectId}`}
                className="inline-flex items-center text-sm text-gray-500 transition hover:text-white"
            >
                ← Back to project
            </Link>

            <header className="mt-8">
                <p className="text-sm font-medium text-gray-500">
                    {project.name}
                </p>

                <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    Create Issue
                </h1>

                <p className="mt-3 text-sm leading-6 text-gray-400">
                    Add a new issue and choose its initial status and priority.
                </p>
            </header>

            <form
                action={createIssue}
                className="mt-8 space-y-6 rounded-xl border border-gray-800 bg-gray-900/30 p-6"
            >
                <input
                    type="hidden"
                    name="projectId"
                    value={projectId}
                />

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
                        required
                        maxLength={100}
                        placeholder="e.g. Fix login button"
                        className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-gray-500"
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
                        maxLength={1000}
                        placeholder="Describe the issue..."
                        className="w-full resize-y rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-gray-500"
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
                            defaultValue="Open"
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
                            defaultValue="Medium"
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
                        Create Issue
                    </button>
                </div>
            </form>
        </main>
    );
}