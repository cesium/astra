"use client";

import { useSignOut } from "@/lib/mutations/session";
import { useGetSession } from "@/lib/queries/session";

export default function Home() {
  const session = useGetSession();
  const signOut = useSignOut();
  return (
    <div>
      {session.isPending
        ? "Loading..."
        : session.data?.accessToken + "\n" + session.data?.sessionId}
      <br />
      <button
        onClick={() => signOut.mutate()}
        className="bg-black p-3 text-white"
      >
        Sign Out
      </button>
    </div>
  );
}
