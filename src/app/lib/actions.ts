"use server";

import { signIn } from "@/app/auth";
import { signOut } from "@/app/auth";

export const authenticate = async () => {
  await signIn({ redirectTo: "/" });
};

export const signOutUser = async () => {
  await signOut({ redirectTo: "/" });
};
