
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getWorkspace } from "@/lib/workspace";

const projectSchema = z.object({
    name: z.string().trim().min(1).max(100),
    description: z.string().trim().max(500),
});

export async function createProject(formData: FormData) {
    const validated = projectSchema.safeParse({
        name: formData.get("name"),
        description: formData.get("description"),
    });

    if (!validated.success) {
        throw new Error("Invalid project information.");
    }

    const workspace = await getWorkspace();

    if (!workspace) {
        throw new Error("Workspace not found. Please refresh the page.");
    }

    await prisma.project.create({
        data: {
            name: validated.data.name,
            description: validated.data.description,
            workspaceId: workspace.id,
        },
    });

    revalidatePath("/");
    redirect("/");
}

export async function updateProject(
    projectId: number,
    formData: FormData
) {
    const validated = projectSchema.safeParse({
        name: formData.get("name"),
        description: formData.get("description"),
    });

    if (!validated.success) {
        throw new Error("Invalid project information.");
    }

    const workspace = await getWorkspace();

    if (!workspace) {
        throw new Error("Workspace not found.");
    }

    const result = await prisma.project.updateMany({
        where: {
            id: projectId,
            workspaceId: workspace.id,
        },
        data: validated.data,
    });

    if (result.count === 0) {
        throw new Error("Project not found.");
    }

    revalidatePath("/");
    revalidatePath(`/projects/${projectId}`);

    redirect(`/projects/${projectId}`);
}

export async function deleteProject(projectId: number) {
    const workspace = await getWorkspace();

    if (!workspace) {
        throw new Error("Workspace not found.");
    }

    const result = await prisma.project.deleteMany({
        where: {
            id: projectId,
            workspaceId: workspace.id,
        },
    });

    if (result.count === 0) {
        throw new Error("Project not found.");
    }

    revalidatePath("/");
    redirect("/");
}