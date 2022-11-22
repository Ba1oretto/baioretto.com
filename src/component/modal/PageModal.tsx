import React, { forwardRef, useCallback, useImperativeHandle, useRef, useState } from "react";
import classNames from "classnames";
import type { DomModalContext } from "../../type";

const defaultClassList = "opacity-0 pointer-events-none";

export default forwardRef<DomModalContext>(function PageModal(_, ref) {
  const modalRef = useRef<HTMLDivElement>({} as HTMLDivElement);
  const [classList, setClassList] = useState(defaultClassList);

  useImperativeHandle(ref, () => ({
    ref: modalRef,
    setClassList,
    backToDefault,
  }));

  const backToDefault = useCallback(() => {
    setClassList(defaultClassList);
  }, []);

  return (
    <div id={"modal-root"} ref={modalRef}
         className={classNames("z-50 fixed bg-black/80 inset-0 grid items-center justify-center transition-opacity duration-300 overflow-auto py-6", classList)} />
  );
});