import NextAuth from "next-auth";
import Nodemailer from "next-auth/providers/nodemailer";
import PostgresAdapter from "@auth/pg-adapter";
import { pool } from "@/app/lib/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PostgresAdapter(pool),
  providers: [
    Nodemailer({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],
});
