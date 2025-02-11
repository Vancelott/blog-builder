"use client";
// import { signIn } from "@/app/auth";
// import { useActionState } from "react";

import { authenticate } from "@/app/lib/actions";

export default function Login() {
  return (
    <form action={() => authenticate()}>
      <button type="submit">Sign In</button>
    </form>
  );
}
