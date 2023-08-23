import { useFetcher } from "@remix-run/react";
import { useEffect, useRef } from "react";

export default function Terminal() {
  const fetcher = useFetcher();
  const fetcher_ref = useRef(fetcher);
  useEffect(() => {
    fetcher_ref.current = fetcher;
  }, [ fetcher ]);

  return (
    <div>111</div>
  );
}