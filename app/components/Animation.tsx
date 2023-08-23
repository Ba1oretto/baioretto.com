import type { ReactNode } from "react";

import { useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";

type HoverVisibleArgs = {
  trigger: string,
  styles?: string,
  children: ReactNode,
};

function HoverVisible({ trigger, styles, children }: HoverVisibleArgs) {
  const [ is_hover, setHover ] = useState(false);
  const node_ref = useRef(null);

  return (
    <>
      <span onMouseOver={() => setHover(true)} onMouseOut={() => setHover(false)}>
        {trigger}
      </span>
      <CSSTransition in={is_hover} nodeRef={node_ref} classNames="tag" unmountOnExit timeout={500}>
        <span ref={node_ref} className={styles}>
          {children}
        </span>
      </CSSTransition>
    </>
  );
}

function LoadingShimmer() {
  return (
    <article className="shimmer">
      <div/>
      <div/>
      <div/>
      <div/>
    </article>
  );
}

export {
  HoverVisible,
  LoadingShimmer,
};