import type { DragEvent } from "react";
import { Fragment, useId, useRef, useState } from "react";
import type { CloseButtonFunction, ModalFunction } from "~/components/Modal";
import Modal, { isClick } from "~/components/Modal";
import { useFetcher } from "@remix-run/react";
import classNames from "classnames";

export function ToggleColorSchemeButton() {
  const fetcher = useFetcher();

  function onButtonClick() {
    fetcher.submit(null, { action: "Action/UpdateTheme", method: "post" });
  }

  return (
    <button className="circle-button" onClick={ onButtonClick }>
      <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" className="hidden md:dark:block">
        <path d="M9.37,5.51C9.19,6.15,9.1,6.82,9.1,7.5c0,4.08,3.32,7.4,7.4,7.4c0.68,0,1.35-0.09,1.99-0.27C17.45,17.19,14.93,19,12,19 c-3.86,0-7-3.14-7-7C5,9.07,6.81,6.55,9.37,5.51z M12,3c-4.97,0-9,4.03-9,9s4.03,9,9,9s9-4.03,9-9c0-0.46-0.04-0.92-0.1-1.36 c-0.98,1.37-2.58,2.26-4.4,2.26c-2.98,0-5.4-2.42-5.4-5.4c0-1.81,0.89-3.42,2.26-4.4C12.92,3.04,12.46,3,12,3L12,3z" />
      </svg>
      <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" className="dark:hidden max-md:hidden">
        <path d="M12,9c1.65,0,3,1.35,3,3s-1.35,3-3,3s-3-1.35-3-3S10.35,9,12,9 M12,7c-2.76,0-5,2.24-5,5s2.24,5,5,5s5-2.24,5-5 S14.76,7,12,7L12,7z M2,13l2,0c0.55,0,1-0.45,1-1s-0.45-1-1-1l-2,0c-0.55,0-1,0.45-1,1S1.45,13,2,13z M20,13l2,0c0.55,0,1-0.45,1-1 s-0.45-1-1-1l-2,0c-0.55,0-1,0.45-1,1S19.45,13,20,13z M11,2v2c0,0.55,0.45,1,1,1s1-0.45,1-1V2c0-0.55-0.45-1-1-1S11,1.45,11,2z M11,20v2c0,0.55,0.45,1,1,1s1-0.45,1-1v-2c0-0.55-0.45-1-1-1C11.45,19,11,19.45,11,20z M5.99,4.58c-0.39-0.39-1.03-0.39-1.41,0 c-0.39,0.39-0.39,1.03,0,1.41l1.06,1.06c0.39,0.39,1.03,0.39,1.41,0s0.39-1.03,0-1.41L5.99,4.58z M18.36,16.95 c-0.39-0.39-1.03-0.39-1.41,0c-0.39,0.39-0.39,1.03,0,1.41l1.06,1.06c0.39,0.39,1.03,0.39,1.41,0c0.39-0.39,0.39-1.03,0-1.41 L18.36,16.95z M19.42,5.99c0.39-0.39,0.39-1.03,0-1.41c-0.39-0.39-1.03-0.39-1.41,0l-1.06,1.06c-0.39,0.39-0.39,1.03,0,1.41 s1.03,0.39,1.41,0L19.42,5.99z M7.05,18.36c0.39-0.39,0.39-1.03,0-1.41c-0.39-0.39-1.03-0.39-1.41,0l-1.06,1.06 c-0.39,0.39-0.39,1.03,0,1.41s1.03,0.39,1.41,0L7.05,18.36z" />
      </svg>
      <span className="md:hidden font-bold text-xl">Toggle Color Scheme</span>
    </button>
  );
}

export function UploadFileButton() {
  const uid = useId();

  const [ drag, setDrag ] = useState(false);
  const drop_area_ref = useRef(null);

  const modal = useRef<ModalFunction>({
    setOpen: () => {},
    setMouseInteraction: () => {},
  });

  function onButtonClick() {
    modal.current.setOpen(true);
  }

  function onCloseButtonClick(...[ event ]: Parameters<CloseButtonFunction>) {
    const { setOpen, setMouseInteraction } = modal.current;
    const is_mouse_click = isClick(event);

    if (!is_mouse_click && event.key.toLowerCase() !== "enter") {
      return;
    }

    event.preventDefault();

    setMouseInteraction(is_mouse_click);
    setOpen(false);
  }

  function dragover(e: DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    setDrag(true);
  }

  function dragenter(e: DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    setDrag(true);
  }

  function dragleave(e: DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    setDrag(false);
  }

  function filedrop(e: DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    setDrag(false);
  }

  return (
    <Fragment>
      <button className="circle-button" onClick={ onButtonClick }>
        <svg viewBox="0 -960 960 960" height="28" width="28" fill="currentColor" className="max-md:hidden">
          <path d="M222.681-147.246q-30.994 0-53.374-22.436-22.38-22.437-22.38-53.509v-147.338h75.754v147.37H737v-147.37h75.754v147.295q0 31.06-22.464 53.524-22.464 22.464-53.29 22.464H222.681Zm219.442-173.667v-352.015L329.051-559.616l-53.95-54.297L480-818.812l204.899 204.899-53.95 54.297-113.072-113.312v352.015h-75.754Z" />
        </svg>
        <span className="md:hidden font-bold text-xl">Show File Uploader Panel</span>
      </button>
      <Modal ref={ modal } class_prefix="modal">
        <section className="relative p-16 bg-blue-1100 rounded-3xl">
          <label
            onDragOver={ dragover }
            onDragEnter={ dragenter }
            onDragLeave={ dragleave }
            onDrop={ filedrop }
            ref={ drop_area_ref }
            htmlFor={ uid + "uploader" }
            className={ classNames(drag && "drag-active", "file-uploader flex flex-col gap-2.5 items-center justify-center p-5 border-2 border-dashed rounded-xl cursor-pointer hover:text-white-400 hover:bg-blue-1000 hover:border-white-900/70 transition-colors duration-300") }
          >
            <span className="text-xl font-bold">Drop files here</span>
            or
            <input type="file" id={ uid + "uploader" } className="p-2 box-border w-[calc(100%-20px)] rounded-xl border-2 border-white-500/70 file:px-5 file:py-2.5 file:mr-5 file:text-white-500 file:font-semibold file:bg-blue-400 file:border-none file:rounded-lg " />
          </label>
          <button onClick={ onCloseButtonClick } onKeyDown={ onCloseButtonClick } className="absolute right-4 top-4 p-2 font-bold rounded-xl hover:bg-amber-200 hover:text-amber-800 transition-colors">Close</button>
        </section>
      </Modal>
    </Fragment>
  );
}