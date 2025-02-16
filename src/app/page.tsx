"use server";

import Landing from "@/app/ui/landing.tsx";
import NavBar from "@/app/ui/navBar.tsx";
import { FirstSignInForm } from "@/app/ui/login/firstSignInForm";
import { auth } from "@/app/auth";
import { SessionProvider } from "next-auth/react";

export default async function Home() {
  const session = await auth();

  return (
    <div>
      <SessionProvider session={session}>
        <FirstSignInForm />
        <div className="relative">
          <NavBar />
          <>
            <Landing />
          </>
        </div>
      </SessionProvider>
    </div>
  );
}
