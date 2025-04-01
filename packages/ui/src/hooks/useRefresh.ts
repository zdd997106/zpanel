import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState, useTransition } from 'react';

/**
 * Wrapper around `router.refresh()` from `next/navigation` `useRouter()` to return Promise, and resolve after refresh completed
 * @returns Refresh function
 * @see https://github.com/vercel/next.js/discussions/58520#discussioncomment-9605299
 */
export function useRefresh() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [resolve, setResolve] = useState<((value: unknown) => void) | null>(null);
  const [isTriggered, setIsTriggered] = useState(false);

  const refresh = () => {
    return new Promise<void>((resolve) => {
      setResolve(() => resolve);
      startTransition(() => {
        router.refresh();
      });
    });
  };

  useEffect(() => {
    if (isTriggered && !isPending) {
      if (resolve) {
        resolve(null);

        setIsTriggered(false);
        setResolve(null);
      }
    }
    if (isPending) {
      setIsTriggered(true);
    }
  }, [isTriggered, isPending, resolve]);

  const refreshRef = useRef(refresh);
  refreshRef.current = refresh;

  return () => refreshRef.current();
}
