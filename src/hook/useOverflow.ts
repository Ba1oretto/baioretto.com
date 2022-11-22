import { useCallback, useEffect, useState } from "react";

export default function useOverflow() {
  const [style, setStyle] = useState<string>("");

  const reset = useCallback(() => {
    setStyle("");
  }, []);

  const isSet = () => {
    return style && true;
  };

  useEffect(() => {
    document.body.style.overflow = style;
  }, [style]);

  return { isSet, setOverflow: setStyle, resetOverflow: reset };
}