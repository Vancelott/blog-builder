"use server";

import { pool } from "@/app/lib/db";
import { auth } from "@/app/auth";
import { z } from "zod";
import { IElement, IOtherData } from "@/app/types/index";
import { findTitle } from "@/app/utils/helpers";
import slugify from "slugify";
import { redirect } from "next/navigation";
import { Block } from "@blocknote/core";

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
  } catch {
    return { error: "The blog page could not be created, please try again." };
  }
};

export const createPage = async (
  data: IElement[],
  subdomain: string,
  otherData: IOtherData
) => {
  const session = await auth();

  if (!session) {
    return { error: "Please log in, in order to create your own blog page." };
  }

  if (!subdomain) {
    return {
      error: "Please enter a subdomain in order to create your blog successfully.",
    };
  }

  const alreadyTaken = await getPage(subdomain);
  // TODO should this be called beforehand?
  if (alreadyTaken) {
    return {
      error: "This subdomain has already been taken.",
    };
  }

  // TODO handle this error when slugs are implemented for the blog pages
  if (!session.user.name) {
    console.log("no username");
    return;
  }

  try {
    await pool.query(
      `INSERT INTO pages (userId, subdomain, data, blog_ids, other_data)
      VALUES ($1, $2, $3, '{}', $4);`,
      [session.user.id, subdomain, data, otherData]
    );
  } catch {
    return { error: "The blog page could not be created, please try again." };
  }
  redirect(`/${subdomain}`, "replace");
};

export const updatePage = async (
  data: IElement[],
  subdomain: string,
  otherData: IOtherData
) => {
  const session = await auth();

  if (!subdomain) {
    return { error: "The blog page could not be updated, please try again." };
  }

  // TODO handle this error when slugs are implemented for the blog pages
  if (!session.user.name) {
    console.log("no username");
    return;
  }

  try {
    await pool.query(
      `UPDATE pages
       SET data = $1, other_data = $2
       WHERE subdomain = $3;`,
      [data, otherData, subdomain]
    );
  } catch {
    return { error: "The blog page could not be updated, please try again." };
  }
  redirect(`/${subdomain}`, "replace");
};

export const getPage = async (subdomain: string) => {
  try {
    const page = await pool.query(
      `SELECT * FROM pages
      WHERE subdomain = $1;`,
      [subdomain]
    );

    if (page.rows.length === 0) {
      return null;
    }

    return await {
      data: page.rows[0].data,
      otherData: page.rows[0].other_data,
      id: page.rows[0].id,
    };
  } catch {
    return { error: "The page could not be loaded, please try again." };
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
  } catch {
    return { error: "The blog post could not be loaded, please try again." };
  }
};

const createBlogPost = async (
  subdomain: string,
  htmlOutput: string,
  editorData: Block[]
) => {
  const session = await auth();

  const { id } = await getPage(subdomain);

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
        foundAvailableSlug = true;
      }
    }
    slug = newSlug;
  }

  try {
    await pool.query(
      `INSERT INTO blog_posts (page_id, slug, title, html, username, editor_data)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;`,
      [id, slug, title, htmlOutput, session.user.name, JSON.stringify(editorData)]
    );
  } catch {
    return { error: "Failed to create blog post, please try again." };
  }
  const post = await getBlogPost(slug);
  if (post) {
    redirect(`/${blogSlug}/${slug}`, "replace");
  }
};

const updateBlogPost = async (
  blogSlug: string,
  htmlOutput: string,
  editorData: Block[],
  postSlug: string
) => {
  try {
    const editedAt = new Date();

    await pool.query(
      `UPDATE blog_posts
      SET html = $1, editor_data = $2, edited_at = $3
      WHERE slug = $4
      RETURNING *;`,
      [htmlOutput, JSON.stringify(editorData), editedAt, postSlug]
    );
  } catch {
    return { error: "The blog post could not be updated, please try again." };
  }
  redirect(`/${blogSlug}/${postSlug}`, "replace");
};

export const createOrUpdateBlogPost = async (
  subdomain: string,
  htmlOutput: string,
  editorData: Block[],
  postSlug: string
) => {
  if (!postSlug) {
    return await createBlogPost(subdomain, htmlOutput, editorData);
  } else {
    return await updateBlogPost(subdomain, htmlOutput, editorData, postSlug);
  }
};

export const getDraftPost = async (postId: number) => {
  try {
    const draft = await pool.query(
      `SELECT * FROM blog_posts
        WHERE id = $1;`,
      [postId]
    );
    return draft.rows[0];
  } catch {
    return { error: "The draft post could not be located, please try again." };
  }
};

const createDraft = async (
  subdomain: string,
  postProp: number | string,
  draftJson: Block[]
) => {
  const session = await auth();
  const { id: pageId } = await getPage(subdomain);

  try {
    const post = await pool.query(
      `INSERT INTO blog_posts (page_id, editor_data, username)
      VALUES ($1, $2, $3)
      RETURNING *;`,
      [pageId, JSON.stringify(draftJson), session.user.name]
    );
    return post.rows[0];
  } catch {
    return { error: "The draft could not be created, please try again." };
  }
};

const updateDraft = async (
  subdomain: string,
  postProp: number | string,
  draftJson: Block[]
) => {
  const { id: pageId } = await getPage(subdomain);
  const parsedPostProp = isNaN(parseInt(postProp)) ? -1 : parseInt(postProp);

  try {
    const post = await pool.query(
      `UPDATE blog_posts 
        SET editor_data = $1
        WHERE (id = $2 OR slug = $3) AND page_id = $4
        RETURNING *;`,
      [JSON.stringify(draftJson), parsedPostProp, postProp, pageId]
    );
    return post.rows[0];
  } catch {
    return { error: "The draft could not be updated, please try again." };
  }
};

export const createOrUpdateDraft = async (
  subdomain: string,
  postProp: number | string,
  draftJson: Block[]
) => {
  const parsedPostProp = isNaN(parseInt(postProp)) ? -1 : parseInt(postProp);

  const shouldUpdate =
    parsedPostProp > 0 ? await getDraftPost(parsedPostProp) : await getBlogPost(postProp);

  if (shouldUpdate) {
    return await updateDraft(subdomain, postProp, draftJson);
  } else {
    return await createDraft(subdomain, postProp, draftJson);
  }
};
