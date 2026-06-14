import { useEffect, useState } from "react";

/**
 * Returns `fallback` immediately (so first render + tests are synchronous and
 * offline-safe) then refreshes from the API. Network/parse failures are
 * swallowed — the static fallback simply remains.
 */
export function useContent<T>(
  loader: () => Promise<unknown>,
  fallback: T,
  accept: (data: unknown) => data is T = (d): d is T => Array.isArray(d)
): T {
  const [data, setData] = useState<T>(fallback);

  useEffect(() => {
    let active = true;
    if (typeof fetch === "undefined") return;
    loader()
      .then((res) => {
        if (active && accept(res)) setData(res);
      })
      .catch(() => {
        /* keep fallback */
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return data;
}
