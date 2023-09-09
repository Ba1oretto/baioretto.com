import type { ActionArgs, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/router";
import type { History } from "~/routes/action.execute_command/command";
import CommandAction, { HistoryLevel } from "~/routes/action.execute_command/command";

function getRequired(body: FormData, key: string) {
  const has_value = body.has(key);
  if (!has_value) {
    throw new Error(`command from data missing required key: ${ key }`);
  }
  return String(body.get(key));
}

export const action = async ({ request }: ActionArgs) => {
  const body = await request.formData();

  const command_text = getRequired(body, "command");
  const screen_history_text = getRequired(body, "screen_history");

  const current_username = getRequired(body, "current_username");
  const current_pathname = getRequired(body, "current_pathname");

  const screen_history: History[] = JSON.parse(screen_history_text);

  const last_command: History = {
    username: current_username,
    pathname: current_pathname,
    message: "",
    level: HistoryLevel.LOG,
  };

  screen_history.push(last_command);

  const command_slice = command_text.match(/"[^"]+"|\S+/g);

  if (!command_slice) {
    return { screen_history };
  }

  last_command.message = command_text;
  const [ command_name, ...command_args ] = command_slice;
  const command_action = CommandAction.find(value => value.name === command_name);

  if (!command_action) {
    screen_history.push({
      message: `${ command_name }: command not found.`,
      level: HistoryLevel.WARNING,
    });

    return { screen_history };
  } else {
    const result = await command_action.action(...command_args, request, screen_history);

    if (result && result.message && result.level !== undefined) {
      screen_history.push({
        username: current_username,
        pathname: current_pathname,
        message: result.message,
        level: result.level,
      });
    }

    return json({ screen_history }, result && result.response && result.response);
  }
};

export const loader: LoaderFunction = ({ request }) => {
  return redirect(request.referrer.length ? request.referrer : "/home");
};