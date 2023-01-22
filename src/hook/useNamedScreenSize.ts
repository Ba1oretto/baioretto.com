import { useState } from "react";
import { useEventListener } from "usehooks-ts";
import { useDebouncedCallback } from "use-debounce";

type NamedScreen = "xl" | "lg" | "md" | "sm"

export default function (wait = 50) {
  const [ namedScreenSize, setNamedScreenSize ] = useState<{ [Prop in NamedScreen]: boolean }>(() => {
    const width = window.innerWidth;
    return {
      xl: width > 1100,
      lg: width > 992,
      md: width > 768,
      sm: width > 640,
    };
  });

  const [ prevWidth, setPrevWidth ] = useState(() => window.innerWidth);

  const debouncedSetScreenSize = useDebouncedCallback(() => {
    const width = window.innerWidth;
    if (prevWidth === width) return;
    setNamedScreenSize({
      xl: width > 1100,
      lg: width > 992,
      md: width > 768,
      sm: width > 640,
    });
    setPrevWidth(width);
  }, wait);

  useEventListener("resize", debouncedSetScreenSize);

  return namedScreenSize;
}