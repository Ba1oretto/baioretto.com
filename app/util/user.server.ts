import bcrypt from "bcrypt";
import { db } from "./database.server";
import { COOKIE_SECRET, IS_PRODUCTION } from "./variable.server";
import { createCookieSessionStorage } from "@remix-run/node";

export interface User {
  id: string;
  username: string;
  password: string;
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

export async function hasPermission(user: Omit<User, "password"> | null, permission: number): Promise<boolean> {
  if (!user) {
    return false;
  }

  const recorded_user = await db.user.findUnique({
    select: {
      group: {
        select: {
          permissions: true,
        },
      },
    },
    where: {
      id: user.id,
    },
  });

  if (!recorded_user) return false;

  return (recorded_user.group.permissions & permission) === permission;
}

export async function login({ username, password }: Omit<User, "id">): Promise<Omit<User, "password"> | null> {
  const user = await db.user.findUnique({
    where: { username },
  });

  if (!user || !await bcrypt.compare(password, user.password)) return null;

  return {
    id: user.id,
    username,
  };
}

export async function createSessionUser(user: Omit<User, "password">): Promise<HeadersInit> {
  const session = await user_storage.getSession();
  session.set("user", JSON.stringify(user));
  return {
    "Set-Cookie": await user_storage.commitSession(session),
  };
}

export async function getSessionUser(request: Request): Promise<Omit<User, "password"> | null> {
  const session = await getSession(request);
  const user_content = session.get("user");
  if (!user_content) return null;
  try {
    return JSON.parse(user_content);
  } catch (_) {
    return null;
  }
}

export async function removeSessionUser(request: Request): Promise<HeadersInit> {
  const session = await getSession(request);
  return {
    "Set-Cookie": await user_storage.destroySession(session),
  };
}

function getSession(request: Request) {
  return user_storage.getSession(request.headers.get("Cookie"));
}