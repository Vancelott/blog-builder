"use client";

import { authenticate } from "@/app/lib/actions";
import { signOutUser } from "@/app/lib/actions";
// import { Session } from "next-auth";
import { useSession } from "next-auth/react";

export function AuthButtons() {
  const { data: session, status } = useSession();

  if (status == "authenticated") {
    return (
      <>
        <button
          onClick={() => signOutUser()}
          className="flex py-4 px-2 text-sm text-white bg-blue-600"
        >
          Sign Out
        </button>
      </>
    );
  }

  return (
    <>
      <button
        onClick={() => authenticate()}
        className="flex py-3 px-2 text-sm text-white bg-blue-500 rounded-lg"
      >
        Sign In
      </button>
    </>
  );
}
