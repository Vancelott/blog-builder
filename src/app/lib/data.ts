"use server";

import { pool } from "@/app/lib/db";
import { auth } from "@/app/auth";
import { z } from "zod";

export const updateUser = async (prevState, formData: FormData) => {
  const session = await auth();
  const schema = z
    .string()
    .regex(/a-zA-Z0-9_/, {
      message:
        "The username can only contain letters, numbers, and underscores.",
    })
    .min(3, { message: "Minimum length is 3 characters." })
    .max(16, { message: "Maximum length is 16 characters." });
  const formName = formData.get("name") as string;

  try {
    schema.parse(formName);
    await pool.query(
      `UPDATE users
      SET name = $1
      WHERE email = $2;`,
      [formName, session.user.email]
    );
    return { success: true };
  } catch (error) {
    console.log(error);
    return error.issues[0];
    // return error.issues;
  }
};
