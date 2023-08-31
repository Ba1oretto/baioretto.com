import bcrypt from "bcrypt";
import { db } from "./database.server";
import { COOKIE_SECRET, IS_PRODUCTION } from "./variable.server";
import { createCookieSessionStorage } from "@remix-run/node";

export interface User {
  id: string;
  username: string;
}

const user_storage = createCookieSessionStorage({
  cookie: {
    name: "user",
    secure: IS_PRODUCTION,
    secrets: [ COOKIE_SECRET ],
    sameSite: "lax",
    path: "/",
    maxAge: 30 * 24 * 60 * 60,
    httpOnly: true,
  },
});

export async function login({ username, password }: { username: string, password: string }) {
  const user = await db.user.findUnique({
    where: { username },
  });

  if (!user) {
    return null;
  }

  const is_pass = await bcrypt.compare(password, user.password);

  return is_pass ? {
    id: user.id,
    username,
  } : null;
}

export async function getUser(request: Request) {
  const user = await getStoredUser(request);

  try {
    return JSON.parse(user) as User;
  } catch (_) {
    return null;
  }
}

export async function createUserSession(user: User) {
  const session = await user_storage.getSession();
  session.set("user", JSON.stringify(user));
  return {
    "Set-Cookie": await user_storage.commitSession(session),
  };
}

export async function validate(request: Request) {
  const stored_user = await getStoredUser(request);
  if (!stored_user) return false;

  const stored_user_object = JSON.parse(stored_user);
  if (!stored_user_object) return false;


  const id = stored_user_object.id;
  if (!id) return false;

  const user = await db.user.findUnique({
    where: { id },
  });
  return !!user;
}

async function getStoredUser(request: Request) {
  const session = await user_storage.getSession(request.headers.get("Cookie"));
  return session.get("user");
}