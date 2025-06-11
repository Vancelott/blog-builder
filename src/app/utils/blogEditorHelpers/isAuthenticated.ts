"use server";

import { getPage } from "@/app/lib/data";
import { auth } from "@/app/auth";

export const isAuthenticated = async (subdomain: string) => {
  const session = await auth();
  const page = await getPage(subdomain);

  if (!session) {
    console.log("The user is Unauthenticated");
    return false;
  }

  if (page.userId !== (session.userId ?? session.user.id)) {
    console.log("The user is Unauthorized");
    return false;
  }

  return true;
};
