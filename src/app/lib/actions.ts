"use server";

import { signIn } from "@/app/auth";

export const authenticate = async () => {
  await signIn();
};
