import React, { forwardRef } from "react";
import classNames from "classnames";

export default forwardRef<HTMLDivElement, {className?: string}>(function PageModal({ className }, ref) {
  return (
    <div id={"modal-root"} ref={ref}
         className={classNames("z-50 fixed bg-black/80 inset-0 grid items-center justify-center transition-opacity duration-300 overflow-auto py-6", className)} />
  );
});