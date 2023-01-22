import { atom, useAtom } from "jotai";
import { useEffect, useState } from "react";

type PageTransition = "on" | "off";
const pageTransitionAtom = atom<boolean>(false);

export default function usePageTransition() {
  const [ isTransition, setIsTransition ] = useAtom(pageTransitionAtom);
  const setTransition = (on: PageTransition) => setIsTransition(on === "on");
  const [ maskEl ] = useState(document.getElementById("mask") as HTMLDivElement);

  useEffect(() => {
    maskEl.classList[isTransition ? "remove" : "add"]("pointer-events-none", "opacity-0");
  }, [ isTransition ]);

  return {
    setTransition,
  };
}