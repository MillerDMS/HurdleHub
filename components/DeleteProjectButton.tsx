
"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";

import { deleteProject } from "@/app/actions/projects";

type DeleteProjectButtonProps = {
  projectId: number;
};

function ConfirmDeleteButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-red-600 px-4 py-2 font-medium text-white disabled:opacity-50"
    >
      {pending ? "Deleting..." : "Confirm Delete"}
    </button>
  );
}

export default function DeleteProjectButton({
  projectId,
}: DeleteProjectButtonProps) {
  const [confirming, setConfirming] = useState(false);

  const deleteAction = deleteProject.bind(null, projectId);

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="rounded-lg border border-red-800 px-5 py-3 text-red-400 hover:bg-red-950"
      >
        Delete Project
      </button>
    );
  }

  return (
    <div className="rounded-lg border border-red-800 p-4">
      <p className="mb-4 text-sm text-red-300">
        Are you sure you want to delete this project?
        All its issues will also be permanently deleted.
        This action cannot be undone.
      </p>

      <form action={deleteAction}>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setConfirming(false)}
            className="rounded-lg border border-gray-700 px-4 py-2"
          >
            Cancel
          </button>

          <ConfirmDeleteButton />
        </div>
      </form>
    </div>
  );
}