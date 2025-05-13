"use server";

import { pool } from "@/app/lib/db";
import { auth } from "@/app/auth";
import { z } from "zod";
import { IElement } from "@/app/types/index";
import { findTitle } from "@/app/utils/helpers";
import slugify from "slugify";
import { redirect } from "next/navigation";

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

  // TODO check if the username exists already

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
export const createPage = async (data, otherData) => {
  const session = await auth();
  console.log("otherData", otherData);

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
        `INSERT INTO pages (userId, slug, data, blog_ids, other_data)
      VALUES ($1, $2, $3, '{}', $4);`,
        [session.user.id, session.user.name, data, otherData]
      );
      return { success: true };
    } else {
      // TODO once done, remove the update if you don't create a separate update handler
      // await pool.query(
      //   `UPDATE pages
      // SET data = $1
      // WHERE slug = $2;`,
      //   [data, session.user.name]
      // );
      await pool.query(
        `UPDATE pages
         SET data = $1, other_data = $2
         WHERE slug = $3;`,
        [data, otherData, session.user.name]
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
    // console.log("page", page);
    return await {
      data: page.rows[0].data,
      otherData: page.rows[0].other_data,
      id: page.rows[0].id,
    };
  } catch (error) {
    console.log(error);
    // return error.issues[0];
    return error;
  }
};

export const getBlogPost = async (slug: string) => {
  try {
    const post = await pool.query(
      `SELECT * FROM blog_posts
      WHERE slug = $1;`,
      [slug]
    );
    if (post.rows.length === 0) {
      return null;
    }

    return post.rows[0];
  } catch (error) {
    console.log(error);
    // return error.issues[0];
    return error;
  }
};

export const createBlogPost = async (blogSlug: string, htmlOutput: string) => {
  const session = await auth();

  const { id } = await getPage(blogSlug);

  const title = findTitle(htmlOutput);
  let slug = slugify(title, {
    strict: true,
    lower: true,
  });

  const alreadyCreated = await getBlogPost(slug);

  if (alreadyCreated) {
    let newSlug = slug;
    let id = 0;
    let foundAvailableSlug = false;
    while (!foundAvailableSlug) {
      id++;
      newSlug = slug + "-" + id;
      const isNewSlugAvailable = await getBlogPost(newSlug);
      if (isNewSlugAvailable === null) {
        console.log("available slug:", newSlug);
        foundAvailableSlug = true;
      }
    }
    slug = newSlug;
  }

  try {
    const post = await pool.query(
      `INSERT INTO blog_posts (page_id, slug, title, html, username)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;`,
      [id, slug, title, htmlOutput, session.user.name]
    );
    console.log("Post created:", post);
    // TODO return the post.rows or the slug and redirect?
    // return post.rows[0];
  } catch (error) {
    console.log(error);
    // return error.issues[0];
    return error;
  }
  redirect(`/${blogSlug}/${slug}`, "replace");
};
