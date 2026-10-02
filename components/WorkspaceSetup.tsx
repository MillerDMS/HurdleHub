
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function WorkspaceSetup() {
  const router = useRouter();
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function setup() {
      try {
        const response = await fetch("/api/workspace", {
          method: "POST",
        });

        if (!response.ok) {
          throw new Error("Workspace setup failed.");
        }

        if (!cancelled) {
          router.refresh();
        }
      } catch {
        if (!cancelled) {
          setError(true);
        }
      }
    }

    setup();

    return () => {
      cancelled = true;
    };
  }, [router]);

  if (error) {
    return (
      <p className="p-6 text-red-400">
        Could not create your workspace. Refresh to try again.
      </p>
    );
  }

  return (
    <p className="p-6 text-gray-400">
      Preparing your workspace...
    </p>
  );
}