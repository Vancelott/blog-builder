"use server";

import { pool } from "@/app/lib/db";
import { auth } from "@/app/auth";
import { z } from "zod";
import { IElement } from "@/app/types/index";

export const updateUser = async (prevState, formData: FormData) => {
  const session = await auth();
  const schema = z
    .string()
    // TODO commented out because the regex didn't seem to work as intended
    // .regex(/a-zA-Z0-9_/, {
    //   message:
    //     "The username can only contain letters, numbers, and underscores.",
    // })
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
    // TODO refactor this once you add photo upload
    return error.issues[0];
  }
};

// export const createPage = async ({ data }: IElement[]) => {
export const createPage = async (data) => {
  const session = await auth();

  if (!session.user.name) {
    console.log("no username");
    return;
  }

  try {
    // TODO pass the data correctly, atm the column is set as JSONB, but you are passing an array of objects fix either of the two
    console.log("data", data);
    const page = await pool.query(
      `SELECT * FROM pages
      WHERE slug = $1;`,
      [session.user.name]
    );
    if (!page) {
      await pool.query(
        `INSERT INTO pages (userId, slug, data, blog_ids)
      VALUES ($1, $2, $3, '{}');`,
        [session.user.id, session.user.name, data]
      );
      return { success: true };
    } else {
      // TODO once done, remove the update if you don't create a separate update handler
      await pool.query(
        `UPDATE pages
      SET data = $1
      WHERE slug = $2;`,
        [data, session.user.name]
      );
    }
  } catch (error) {
    console.log(error);
    // return error.issues[0];
    return error;
  }
};

export const getPage = async (slug: string) => {
  try {
    const page = await pool.query(
      `SELECT * FROM pages
      WHERE slug = $1;`,
      [slug]
    );
    return page.rows[0].data;
  } catch (error) {
    console.log(error);
    // return error.issues[0];
    return error;
  }
};
