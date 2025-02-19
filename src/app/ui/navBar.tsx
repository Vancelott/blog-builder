"use client";

import { AuthButtons } from "@/app/ui/login/authButtons";
import { useSession } from "next-auth/react";

export default function NavBar() {
  const { data: session } = useSession();

  const username = session?.user?.name;

  return (
    <div className="flex w-screen justify-center content-between place-items-center h-10 relative z-10 bg-slate-500 py-8 px-64">
      <p className="text-center text-nowrap text-2xl">Logo</p>
      <div className="flex w-screen justify-end place-items-center content-end gap-4">
        {session ? <p>Welcome, {username}!</p> : <p>Welcome!</p>}
        <AuthButtons />
      </div>
    </div>
  );
}
