import { createSessionUser, login, removeSessionUser } from "~/util/user.server";
import { Routes } from "~/header/Header";

export enum HistoryLevel {
  LOG,
  INFO,
  WARNING,
}

export interface History {
  username?: string;
  pathname?: string;
  message: string;
  level: HistoryLevel;
}

interface CommandAction {
  name: string,
  action: (...args: any) => Promise<{
    message?: string,
    level?: HistoryLevel,
    response?: any,
  } | 0>;
}

const CommandAction: CommandAction[] = [
  {
    name: "help",
    action: async () => ({
      message: `available command: ${ CommandAction.map(({ name }) => name).join(", ") }`,
      level: HistoryLevel.LOG,
    }),
  },
  {
    name: "cd",
    action: async (...[ target_path ]) => {
      if (typeof target_path != "string") {
        return {
          message: "invalid path",
          level: HistoryLevel.WARNING,
        };
      }

      if (!Routes.some(({ path }) => path === target_path)) {
        return {
          message: `no such route: ${ target_path }`,
          level: HistoryLevel.WARNING,
        };
      }

      return {
        response: {
          status: 302,
          headers: {
            Location: target_path,
          },
        },
      };
    },
  },
  {
    name: "clear",
    action: async (...args) => {
      (args.at(-1) as Array<any>).splice(0);
      return 0;
    },
  },
  {
    name: "su",
    action: async (...[ username, password ]: any) => {
      if (typeof username != "string" || typeof password != "string")
        return {
          message: "su: username and password cannot be null.",
          level: HistoryLevel.WARNING,
        };

      const user = await login({ username, password });

      if (!user)
        return {
          message: "su: username or password incorrect.",
          level: HistoryLevel.WARNING,
        };

      const headers = await createSessionUser(user);

      return {
        message: `Welcome back ${ user.username }!`,
        level: HistoryLevel.INFO,
        response: {
          headers,
        },
      };
    },
  },
  {
    name: "exit",
    action: async (...args) => {
      return {
        response: {
          headers: await removeSessionUser(args.at(-2) as Request),
        },
      };
    },
  },
];

export default CommandAction;