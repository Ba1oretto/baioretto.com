import { useEffect, useState } from "react";

export default function useOverflow() {
  const [enable, setEnable] = useState(true);

  useEffect(() => {
    document.body.style.overflow = enable ? "" : "hidden";
  }, [enable]);

  return setEnable;
}