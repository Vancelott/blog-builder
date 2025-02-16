"use server";

// import { Session } from "next-auth";
import { pool } from "@/app/lib/db";
import { auth } from "@/app/auth";

export const updateUser = async (prevState, formData: FormData) => {
  const formName = formData.get("name");
  const session = await auth();

  try {
    await pool.query(
      `UPDATE users
      SET name = $1
      WHERE email = $2;`,
      [formName, session.user.email]
    );
    return { success: true };
  } catch (error) {
    console.log(error);
  }
};
