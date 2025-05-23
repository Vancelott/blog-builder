"use server";

import { getPage } from "@/app/lib/data";
import { auth } from "@/app/auth";

export const isAuthenticated = async (subdomain: string) => {
  const session = await auth();
  const page = await getPage(subdomain);

  if (page.userId !== session.userId) {
    return false;
  }

  return true;
};
