import bcrypt from "bcrypt";
import { db } from "./database.server";
import { IS_PRODUCTION, COOKIE_SECRET } from "./variable.server";
import { createCookieSessionStorage } from "@remix-run/node";

export type UserInfo = {
  id: string,
  username: string
};

export async function login({ username, password }: { username: string, password: string }) {
  const user = await db.user.findUnique({
    where: { username },
  });

  if (!user) return null;
  if (!(await bcrypt.compare(password, user.password))) return null;

  return { id: user.id, username };
}

const storage = createCookieSessionStorage({
  cookie: {
    name: "user",
    secure: IS_PRODUCTION,
    secrets: [ COOKIE_SECRET ],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
});

function getUserSession(request: Request) {
  return storage.getSession(request.headers.get("Cookie"));
}

export async function getUser(request: Request) {
  const session = await getUserSession(request);
  const user = session.get("user");

  try {
    return JSON.parse(user) as UserInfo;
  } catch (_) {
    return null;
  }
}

export async function createUserSession(user: UserInfo) {
  const session = await storage.getSession();
  session.set("user", JSON.stringify(user));
  return {
    "Set-Cookie": await storage.commitSession(session),
  };
}