import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { getWorkspace } from "@/lib/workspace";
import ProjectCard from "@/components/ProjectCard";
import WorkspaceSetup from "@/components/WorkspaceSetup";

export default async function HomePage() {
  const workspace = await getWorkspace();

  if (!workspace) {
    return <WorkspaceSetup />;
  }

  const projects = await prisma.project.findMany({
    where: {
      workspaceId: workspace.id,
    },
    include: {
      issues: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const activeIssues = projects.flatMap((project) =>
    project.issues.filter((issue) => issue.archivedAt === null)
  );

  const totalProjects = projects.length;
  const totalActiveIssues = activeIssues.length;

  const openIssues = activeIssues.filter(
    (issue) => issue.status === "Open"
  ).length;

  const completedIssues = activeIssues.filter(
    (issue) => issue.status === "Done"
  ).length;

  const stats = [
    {
      label: "Total Projects",
      value: totalProjects,
      description: "Projects in your workspace",
    },
    {
      label: "Active Issues",
      value: totalActiveIssues,
      description: "Currently being tracked",
    },
    {
      label: "Open Issues",
      value: openIssues,
      description: "Waiting to be resolved",
    },
    {
      label: "Completed",
      value: completedIssues,
      description: "Issues marked as done",
    },
  ];

  return (
    <main className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
      <header className="mb-10">
        <p className="mb-2 text-sm font-medium text-gray-500">
          Workspace
        </p>

        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Dashboard
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-gray-400 sm:text-base">
              Track your projects, manage issues and monitor
              development progress.
            </p>
          </div>

          <Link
            href="/projects/new"
            className="inline-flex w-fit items-center justify-center rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-gray-200"
          >
            <span className="mr-2 text-lg leading-none">+</span>
            New Project
          </Link>
        </div>
      </header>
      <section aria-label="Dashboard statistics">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-gray-800 bg-gray-900/40 p-5"
            >
              <p className="text-sm font-medium text-gray-400">
                {stat.label}
              </p>

              <p className="mt-3 text-3xl font-bold tracking-tight text-white">
                {stat.value}
              </p>

              <p className="mt-2 text-xs text-gray-500">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </section>
      <section className="mt-14">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-white">
              Projects
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {projects.length === 0
                ? "No projects in this workspace."
                : `${projects.length} ${
                    projects.length === 1 ? "project" : "projects"
                  } in this workspace.`}
            </p>
          </div>
        </div>

        {projects.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-700 bg-gray-900/20 px-6 py-16 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-gray-800 bg-gray-900 text-xl text-gray-400">
              +
            </div>

            <h3 className="mt-5 text-lg font-semibold text-white">
              Create your first project
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-400">
              Projects keep related issues together and make it
              easier to track development progress.
            </p>

            <Link
              href="/projects/new"
              className="mt-6 inline-flex items-center rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-gray-200"
            >
              Create Project
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {projects.map((project) => {
              const projectActiveIssues = project.issues.filter(
                (issue) => issue.archivedAt === null
              );

              const projectCompletedIssues =
                projectActiveIssues.filter(
                  (issue) => issue.status === "Done"
                ).length;

              const projectOpenIssues = projectActiveIssues.filter(
                (issue) => issue.status === "Open"
              ).length;

              return (
                <ProjectCard
                  key={project.id}
                  id={project.id}
                  name={project.name}
                  description={project.description}
                  totalIssues={projectActiveIssues.length}
                  openIssues={projectOpenIssues}
                  completedIssues={projectCompletedIssues}
                />
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}