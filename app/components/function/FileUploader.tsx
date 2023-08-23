import type { DragEvent } from "react";
import { Fragment, useContext, useId, useRef, useState } from "react";
import { ModalContext } from "~/components/modal/Modal";
import classNames from "classnames";

export default function FileUploader() {
  const { hideModal } = useContext(ModalContext);
  const id = useId();

  const [ drag, setDrag ] = useState(false);
  const drop_area_ref = useRef(null);

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
      <label
        onDragOver={ dragover }
        onDragEnter={ dragenter }
        onDragLeave={ dragleave }
        onDrop={ filedrop }
        ref={ drop_area_ref }
        htmlFor={ id + "uploader" }
        className={ classNames(drag && "drag-active", "file-uploader flex flex-col gap-2.5 items-center justify-center p-5 border-2 border-dashed rounded-xl cursor-pointer hover:text-white-400 hover:bg-blue-1000 hover:border-white-900/70 transition-colors duration-300") }
      >
        <span className="text-xl font-bold">Drop files here</span>
        or
        <input type="file" id={ id + "uploader" } className="p-2 box-border w-[calc(100%-20px)] rounded-xl border-2 border-white-500/70 file:px-5 file:py-2.5 file:mr-5 file:text-white-500 file:font-semibold file:bg-blue-400 file:border-none file:rounded-lg " />
      </label>
      <button onClick={ hideModal } onKeyDown={ hideModal } className="absolute right-4 top-4 p-2 font-bold rounded-xl hover:bg-amber-200 hover:text-amber-800 transition-colors">Close</button>
    </Fragment>
  );
}