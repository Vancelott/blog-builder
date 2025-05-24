"use server";

import { getPage } from "@/app/lib/data";
import { auth } from "@/app/auth";

export const isAuthenticated = async (subdomain: string) => {
  const session = await auth();
  const page = await getPage(subdomain);

  if (!session) {
    return false;
  }

  if (page.userId !== (session.userId ?? session.user.id)) {
    return false;
  }

  return true;
};
