"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";

import {
  archiveIssue,
  restoreIssue,
} from "@/app/actions/issues";

type Props = {
  issueId: number;
  projectId: number;
  archived: boolean;
};

function SubmitButton({
  archived,
}: {
  archived: boolean;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending
        ? "Saving..."
        : archived
          ? "Confirm Restore"
          : "Confirm Archive"}
    </button>
  );
}

export default function IssueArchiveButton({
  issueId,
  projectId,
  archived,
}: Props) {
  const [confirming, setConfirming] = useState(false);

  const action = archived
    ? restoreIssue.bind(null, issueId, projectId)
    : archiveIssue.bind(null, issueId, projectId);

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="rounded-lg border border-gray-700 px-4 py-2.5 text-sm font-medium text-gray-300 transition hover:border-gray-600 hover:bg-gray-900 hover:text-white"
      >
        {archived ? "Restore Issue" : "Archive Issue"}
      </button>
    );
  }

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900/40 p-5">
      <p className="font-medium text-gray-200">
        {archived ? "Restore this issue?" : "Archive this issue?"}
      </p>

      <p className="mt-1 text-sm leading-6 text-gray-500">
        {archived
          ? "The issue will return to the active issue list."
          : "The issue will be moved out of the active list. You can restore it later."}
      </p>

      <form action={action} className="mt-4">
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setConfirming(false)}
            className="rounded-lg border border-gray-700 px-4 py-2 text-sm font-medium text-gray-300 transition hover:bg-gray-800"
          >
            Cancel
          </button>

          <SubmitButton archived={archived} />
        </div>
      </form>
    </div>
  );
}