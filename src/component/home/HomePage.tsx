import React from "react";
import usePageTransition from "../../hook/usePageTransition";

export default function HomePage() {
  const { setTransition } = usePageTransition();

  function set() {
    setTransition("on");
    setTimeout(() => {
      setTransition("off");
    }, 1000);
  }

  return (
    <button onClick={set}>
      1
    </button>
  );
}