import type { ActionFunction, LoaderFunction } from "@remix-run/node";

import { Form, useActionData, useLoaderData, useLocation, useNavigation } from "@remix-run/react";
import { json } from "@remix-run/node";
import { createUserSession, getUser, login } from "~/utils/session.server";
import { useEffect, useId, useRef } from "react";
import classNames from "classnames";
import FocusLock from "react-focus-lock";

type HistoryType = {
  username?: string
  message: string,
  level: number,
};

type CommandActionType = {
  name: string,
  action: (args: any[]) => Promise<Omit<HistoryType, "username"> & { response?: any } | undefined>,
};

const _CommandAction: CommandActionType[] = [
  {
    name: "clear",
    action: async (args) => {
      (args[args.length - 1] as Array<any>).splice(0);
      return undefined;
    },
  },
  {
    name: "su",
    action: async ([ username, password ]: any[]) => {
      if (typeof username != "string" || typeof password != "string")
        return {
          message: "su: username and password cannot be null.",
          level: 2,
        };

      const user = await login({ username, password });

      if (user == null)
        return {
          message: "su: username or password incorrect.",
          level: 2,
        };

      const headers = await createUserSession(user);

      return {
        message: `Welcome back ${ user.username }!`,
        level: 1,
        response: {
          headers,
        },
      };
    },
  },
];

export const action: ActionFunction = async ({ request }) => {
  const form_data = await request.formData();

  const command = form_data.get("command") as string;
  const username = form_data.get("current_username") as string;
  const screen_history: HistoryType[] = JSON.parse(form_data.get("screen_history") as string);

  if (!command) {
    screen_history.push({ username, message: "", level: 0 });
    return json({ screen_history });
  }

  screen_history.push({ username, message: command, level: 0 });

  const command_slice = command.match(/"[^"]+"|\S+/g) as string[];
  const command_action = _CommandAction.find(value => value.name === command_slice[0]);

  if (!command_action) {
    screen_history.push({ message: `${ command_slice[0] }: command not found.`, level: 2 });
    return json({ screen_history });
  }

  const result = await command_action.action([ ...command_slice.splice(1), screen_history ]);
  result && screen_history.push({ username, message: result.message, level: result.level });

  return json(
    { screen_history },
    result && result.response,
  );
};

export const loader: LoaderFunction = async ({ request }) => {
  return getUser(request);
};

export default function Bash() {
  const action_data = useActionData<typeof action>();
  const user = useLoaderData<typeof loader>();

  const current_user = user ? user.username : "guest";
  const screen_history: HistoryType[] | 0 = action_data && action_data.screen_history;

  const form_element_ref = useRef<HTMLFormElement>(null);
  const command_element_ref = useRef<HTMLInputElement>(null);

  const { state } = useNavigation();
  const id = useId();

  useEffect(() => {
    if (state !== "submitting") form_element_ref.current?.reset();
  }, [ state ]);

  useEffect(() => {
    if (!screen_history) return;
    let valid_history = screen_history.filter(({ username, message, level }) =>
      username === current_user && message !== "" && !level,
    );

    valid_history = Array.from(new Set(valid_history.map(({ message }) => message)))
    .map(_message => valid_history.find(({ message }) => message === _message)) as HistoryType[];

    if (!valid_history.length) return;
    valid_history.push({ username: current_user, message: "", level: 0 });

    const command_element = command_element_ref.current!;
    const max_index = valid_history.length - 1;
    let current_index = max_index;

    const arrow_up_handler = (event: KeyboardEvent) => {
      if (event.key !== "ArrowUp") return;
      event.preventDefault();
      if (current_index === 0) return;
      command_element.value = valid_history[--current_index].message;
    };

    const arrow_down_handler = (event: KeyboardEvent) => {
      if (event.key !== "ArrowDown") return;
      event.preventDefault();
      if (current_index === max_index) return;
      command_element.value = valid_history[++current_index].message;
    };

    command_element.addEventListener("keydown", arrow_up_handler);
    command_element.addEventListener("keydown", arrow_down_handler);
    return () => {
      command_element.removeEventListener("keydown", arrow_up_handler);
      command_element.removeEventListener("keydown", arrow_down_handler);
    };
  }, [ current_user, screen_history ]);

  return (
    <main className="container fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[75vh] bg-[#300A24]">
      <Form method="post" className="flex flex-col gap-1 p-5 font-medium" ref={ form_element_ref }>
        <input name="screen_history" type="hidden" defaultValue={ JSON.stringify(screen_history ?? []) } />
        <input name="current_username" type="hidden" defaultValue={ current_user } />
        { screen_history && screen_history.map(({ username, message, level }, index: number) => (
          <p className={ classNames(level && "mt-1", !(level - 1) && "text-amber-200", !(level - 2) && "text-red-100") } key={ index }>
            { Boolean(username && !level) && <PromptPrefix username={ username! } /> }
            { message }
          </p>
        )) }
        <FocusLock>
          <label htmlFor={ id + "input" }>
            <p>
              <PromptPrefix username={ current_user } />
              <input
                name="command"
                id={ id + "input" }
                type="text"
                className="focus:shadow-none bg-transparent"
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
                autoFocus
                ref={ command_element_ref }
              />
            </p>
          </label>
        </FocusLock>
      </Form>
    </main>
  );
}

function PromptPrefix({ username }: { username: string }) {
  const { pathname } = useLocation();
  return (
    <span>
      <span className="text-[#26A060]">{ `${ username }@barroit.com` }</span>
      <span className="px-0.5">:</span>
      <span className="text-[#13488B]">~{ pathname }</span>
      <span className="px-0.5">$ </span>
    </span>
  );
}