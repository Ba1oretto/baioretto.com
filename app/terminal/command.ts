import { createUserSession, login } from "~/util/user.server";

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
  action: (...args: any) => Promise<Omit<History, "username"> & { response?: any } | 0>;
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

      if (user == null)
        return {
          message: "su: username or password incorrect.",
          level: HistoryLevel.WARNING,
        };

      const headers = await createUserSession(user);

      return {
        message: `Welcome back ${ user.username }!`,
        level: HistoryLevel.INFO,
        response: {
          headers,
        },
      };
    },
  },
];

export default CommandAction;