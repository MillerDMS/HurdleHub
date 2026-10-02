"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";

import { deleteIssue } from "@/app/actions/issues";

type DeleteIssueButtonProps = {
  issueId: number;
  projectId: number;
};

function ConfirmDeleteButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? "Deleting..." : "Confirm Delete"}
    </button>
  );
}

export default function DeleteIssueButton({
  issueId,
  projectId,
}: DeleteIssueButtonProps) {
  const [confirming, setConfirming] = useState(false);

  const deleteAction = deleteIssue.bind(
    null,
    issueId,
    projectId
  );

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="rounded-lg border border-red-900 px-4 py-2.5 text-sm font-medium text-red-400 transition hover:border-red-800 hover:bg-red-950/40"
      >
        Delete Issue
      </button>
    );
  }

  return (
    <div className="rounded-xl border border-red-950 bg-red-950/20 p-5">
      <p className="font-medium text-red-300">
        Permanently delete this issue?
      </p>

      <p className="mt-1 text-sm leading-6 text-gray-400">
        This action cannot be undone. The issue will be permanently
        removed from the project.
      </p>

      <form action={deleteAction} className="mt-4">
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setConfirming(false)}
            className="rounded-lg border border-gray-700 px-4 py-2 text-sm font-medium text-gray-300 transition hover:bg-gray-800"
          >
            Cancel
          </button>

          <ConfirmDeleteButton />
        </div>
      </form>
    </div>
  );
}