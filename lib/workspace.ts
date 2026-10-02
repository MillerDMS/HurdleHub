
import "server-only";

import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";

import { prisma } from "@/lib/prisma";

const COOKIE_NAME = "devtrack_workspace";

function hashToken(token: string) {
  return createHash("sha256")
    .update(token)
    .digest("hex");
}

export async function getWorkspace() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  return prisma.workspace.findUnique({
    where: {
      sessionTokenHash: hashToken(token),
    },
  });
}

export async function createWorkspace() {
  const token = randomBytes(32).toString("hex");

  const workspace = await prisma.workspace.create({
    data: {
      sessionTokenHash: hashToken(token),
    },
  });

  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return workspace;
}