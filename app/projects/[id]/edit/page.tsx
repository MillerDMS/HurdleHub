
import Link from "next/link";
import { notFound } from "next/navigation";

import { updateProject } from "@/app/actions/projects";
import { prisma } from "@/lib/prisma";
import { getWorkspace } from "@/lib/workspace";

type EditProjectPageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function EditProjectPage({
    params,
}: EditProjectPageProps) {
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

    const saveProject = updateProject.bind(null, projectId);

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
                    Project settings
                </p>

                <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    Edit Project
                </h1>

                <p className="mt-3 text-sm leading-6 text-gray-400">
                    Update the name and description for this project.
                </p>
            </header>

            <form
                action={saveProject}
                className="mt-8 space-y-6 rounded-xl border border-gray-800 bg-gray-900/30 p-6"
            >
                <div>
                    <label
                        htmlFor="name"
                        className="mb-2 block text-sm font-medium text-gray-300"
                    >
                        Project Name
                    </label>

                    <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        maxLength={100}
                        defaultValue={project.name}
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
                        maxLength={500}
                        defaultValue={project.description}
                        className="w-full resize-y rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-sm text-white outline-none transition focus:border-gray-500"
                    />
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
        </main>
    );
}