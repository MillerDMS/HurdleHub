
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getWorkspace } from "@/lib/workspace";

const issueSchema = z.object({
    projectId: z.coerce.number<number>().int().positive(),
    title: z.string().trim().min(1).max(100),
    description: z.string().trim().max(1000),
    status: z.enum(["Open", "In Progress", "Done"]),
    priority: z.enum(["Low", "Medium", "High"]),
});


export async function createIssue(formData: FormData) {
    const validated = issueSchema.safeParse({
        projectId: formData.get("projectId"),
        title: formData.get("title"),
        description: formData.get("description"),
        status: formData.get("status"),
        priority: formData.get("priority"),
    });

    if (!validated.success) {
        throw new Error("Invalid issue information.");
    }

    const workspace = await getWorkspace();

    if (!workspace) {
        throw new Error("Workspace not found.");
    }

    const { projectId } = validated.data;

    await prisma.$transaction(async (tx) => {
        const result = await tx.project.updateMany({
            where: {
                id: projectId,
                workspaceId: workspace.id,
            },
            data: {
                nextIssueNumber: {
                    increment: 1,
                },
            },
        });

        if (result.count !== 1) {
            throw new Error("Project not found.");
        }

        const project = await tx.project.findUniqueOrThrow({
            where: {
                id: projectId,
            },
            select: {
                nextIssueNumber: true,
            },
        });

        await tx.issue.create({
            data: {
                projectId,
                number: project.nextIssueNumber - 1,
                title: validated.data.title,
                description: validated.data.description,
                status: validated.data.status,
                priority: validated.data.priority,
            },
        });
    });

    revalidatePath("/");
    revalidatePath(`/projects/${projectId}`);

    redirect(`/projects/${projectId}`);
}

const updateIssueSchema = z.object({
    title: z.string().trim().min(1).max(100),
    description: z.string().trim().max(1000),
    status: z.enum(["Open", "In Progress", "Done"]),
    priority: z.enum(["Low", "Medium", "High"]),
});

export async function updateIssue(
    issueId: number,
    projectId: number,
    formData: FormData
) {
    const validated = updateIssueSchema.safeParse({
        title: formData.get("title"),
        description: formData.get("description"),
        status: formData.get("status"),
        priority: formData.get("priority"),
    });

    if (!validated.success) {
        throw new Error("Invalid issue information.");
    }

    const workspace = await getWorkspace();

    if (!workspace) {
        throw new Error("Workspace not found.");
    }

    const result = await prisma.issue.updateMany({
        where: {
            id: issueId,
            projectId,
            archivedAt: null,
            project: {
                workspaceId: workspace.id,
            },
        },
        data: validated.data,
    });

    if (result.count !== 1) {
        throw new Error("Issue not found or cannot be edited.");
    }

    revalidatePath("/");
    revalidatePath(`/projects/${projectId}`);

    redirect(`/projects/${projectId}`);
}

export async function deleteIssue(
    issueId: number,
    projectId: number
) {
    const workspace = await getWorkspace();

    if (!workspace) {
        throw new Error("Workspace not found.");
    }

    const result = await prisma.issue.deleteMany({
        where: {
            id: issueId,
            projectId,
            project: {
                workspaceId: workspace.id,
            },
        },
    });

    if (result.count !== 1) {
        throw new Error("Issue not found.");
    }

    revalidatePath("/");
    revalidatePath(`/projects/${projectId}`);

    redirect(`/projects/${projectId}`);
}


export async function archiveIssue(
    issueId: number,
    projectId: number
) {
    const workspace = await getWorkspace();

    if (!workspace) {
        throw new Error("Workspace not found.");
    }

    const result = await prisma.issue.updateMany({
        where: {
            id: issueId,
            projectId,
            status: "Done",
            archivedAt: null,
            project: {
                workspaceId: workspace.id,
            },
        },
        data: {
            archivedAt: new Date(),
        },
    });

    if (result.count !== 1) {
        throw new Error(
            "Issue not found, already archived, or not completed."
        );
    }

    revalidatePath("/");
    revalidatePath(`/projects/${projectId}`);

    redirect(`/projects/${projectId}`);
}


export async function restoreIssue(
    issueId: number,
    projectId: number
) {
    const workspace = await getWorkspace();

    if (!workspace) {
        throw new Error("Workspace not found.");
    }

    const result = await prisma.issue.updateMany({
        where: {
            id: issueId,
            projectId,
            archivedAt: {
                not: null,
            },
            project: {
                workspaceId: workspace.id,
            },
        },
        data: {
            archivedAt: null,
        },
    });

    if (result.count !== 1) {
        throw new Error("Archived issue not found.");
    }

    revalidatePath("/");
    revalidatePath(`/projects/${projectId}`);

    redirect(`/projects/${projectId}`);
}