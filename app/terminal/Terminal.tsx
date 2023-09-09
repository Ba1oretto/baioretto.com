import Modal, { ModalInit } from "~/modal/Modal";
import type { KeyboardEvent } from "react";
import { forwardRef, useEffect, useId, useRef, useState } from "react";
import { useFetcher, useLoaderData, useLocation } from "@remix-run/react";
import { CSSTransition } from "react-transition-group";
import type { loader } from "~/root";
import classNames from "classnames";
import type { History } from "~/routes/action.execute_command/command";
import { HistoryLevel } from "~/routes/action.execute_command/command";

export default function Terminal() {
  const { username } = useLoaderData<typeof loader>();
  const current_username = username ?? "guest";

  const modal = useRef(ModalInit);
  const input_id = useId() + "input";

  const prompt = useRef<HTMLSpanElement>(null);
  const command = useRef<HTMLTextAreaElement>(null);
  const form = useRef<HTMLFormElement>(null);
  const submit_button = useRef<HTMLButtonElement>(null);
  const loading_spanner = useRef(null);

  const fetcher = useFetcher();
  const current_pathname = useLocation().pathname;

  const [ screen_history, setScreenHistory ] = useState<History[]>([]);

  function onModalEntering() {
    adjustCommandTextIndent();
  }

  function adjustCommandTextIndent() {
    command.current!.style.textIndent = prompt.current!.offsetWidth + 5 + "px";
  }

  // simulate terminal history restore
  useEffect(() => {
    let valid_history = screen_history.filter(({ username, message, level }) =>
      username === current_username && message !== "" && !level,
    );

    valid_history = Array
      .from(new Set(valid_history.map(({ message }) => message)))
      .map(_message => valid_history.find(({ message }) => message === _message)) as History[];

    if (!valid_history.length) return;
    valid_history.push({ username: current_username, message: "", level: HistoryLevel.LOG });

    const command_element = command.current!;
    const max_index = valid_history.length - 1;
    let current_index = max_index;

    const handlePrevHistoryAccess = (event: globalThis.KeyboardEvent) => {
      if (event.key !== "ArrowUp") return;
      event.preventDefault();
      if (current_index === 0) return;
      command_element.value = valid_history[--current_index].message;
    };

    const handleNextHistoryAccess = (event: globalThis.KeyboardEvent) => {
      if (event.key !== "ArrowDown") return;
      event.preventDefault();
      if (current_index === max_index) return;
      command_element.value = valid_history[++current_index].message;
    };

    command_element.addEventListener("keydown", handlePrevHistoryAccess);
    command_element.addEventListener("keydown", handleNextHistoryAccess);
    return () => {
      command_element.removeEventListener("keydown", handlePrevHistoryAccess);
      command_element.removeEventListener("keydown", handleNextHistoryAccess);
    };
  }, [ current_username, screen_history ]);

  // add a key bind to open the terminal
  useEffect(() => {
    function handleModalDisplay(event: globalThis.KeyboardEvent) {
      if (!(event.ctrlKey && event.altKey && event.key === "/")) return;
      modal.current.setOpen(prev_state => !prev_state);
    }

    window.addEventListener("keydown", handleModalDisplay);
    return () => window.removeEventListener("keydown", handleModalDisplay);
  }, []);

  // automatically adjust textarea indent when its content grows
  useEffect(() => {
    modal.current.is_open && adjustCommandTextIndent();
  }, [ current_pathname, current_username ]);

  // automatically scroll to the bottom when form grows
  useEffect(() => {
    const form_element = form.current;
    if (!form_element) {
      return;
    }
    form_element.scrollTop = form_element.scrollHeight;
  }, [ screen_history ]);

  function handleEnterOnTextarea(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key !== "Enter") {
      return;
    }
    event.preventDefault();
    submit_button.current!.click();
    form.current!.reset();
  }

  function handleInputOnTextarea(event: KeyboardEvent<HTMLTextAreaElement>) {
    const target = event.currentTarget;
    target.style.height = target.scrollHeight + "px";
  }

  // update data
  useEffect(() => {
    const data: { screen_history: History[] } = fetcher.data;
    if (!(fetcher.state !== "idle" && data)) return;
    setScreenHistory(data.screen_history);
  }, [ fetcher ]);

  const is_fetcher_busy = fetcher.state !== "idle";

  return (
    <Modal ref={ modal } freeze={ false } onModalEntering={ onModalEntering } className="terminal-container">
      <fetcher.Form ref={ form } action="action/execute_command" method="post" replace className="terminal-commandline">
        <input name="screen_history" type="hidden" defaultValue={ JSON.stringify(screen_history) } />
        <input name="current_username" type="hidden" defaultValue={ current_username } />
        <input name="current_pathname" type="hidden" defaultValue={ current_pathname } />
        { screen_history && screen_history.map(({ username, pathname, message, level }, index) => {
          const display_prompt = (username && pathname && level === 0);
          const info = !(level - 1);
          const warning = !(level - 2);
          return (
            <p className={ classNames(level && "mt-1", info && "text-goldenrod-yellow", warning && "text-crimson") } key={ index }>
              { display_prompt && <Prompt username={ username } pathname={ pathname } /> }
              <span className={ display_prompt ? "ml-1" : undefined }>{ message }</span>
            </p>
          );
        }) }
        <label htmlFor={ input_id }>
          <p className="relative flex items-start">
            <Prompt ref={ prompt } username={ current_username } pathname={ current_pathname } />
            <textarea
              onKeyDown={ handleEnterOnTextarea } onInput={ handleInputOnTextarea }
              id={ input_id } name="command" ref={ command }
              rows={ 1 } className="terminal-input"
              autoComplete="off" autoCorrect="off" spellCheck="false" autoFocus
            />
          </p>
        </label>
        <button ref={ submit_button } type="submit" hidden />
      </fetcher.Form>
      <CSSTransition in={ is_fetcher_busy } classNames="modal" nodeRef={ loading_spanner } timeout={ 150 } mountOnEnter unmountOnExit>
        <section ref={ loading_spanner } className="absolute inset-x-0 inset-y-0 center">
          <div className="lds-roller pt-12">
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
          </div>
        </section>
      </CSSTransition>
    </Modal>
  );
}

const Prompt = forwardRef<HTMLSpanElement, { username: string, pathname: string }>(function Prompt({ username, pathname }, ref) {
  return (
    <span ref={ ref }>
      <span className="text-seaweed-green">{ `${ username }@baioretto.com` }</span>
      <span className="px-0.5">:</span>
      <span className="text-darkish-blue"> { pathname }</span>
      <span className="px-0.5">$</span>
    </span>
  );
});