import { useCallback, useMemo, useRef, useState } from 'react';

// ----------

/**
 * A hook to manage a list of open items.
 */
export function useOpenList<T extends string = string>(defaultValue: T[] = []) {
  const [openList, setOpenList] = useState<T[]>(defaultValue);
  const openListRef = useRef(openList);
  openListRef.current = openList;

  // --- FUNCTIONS ---

  const open = useCallback((...ids: T[]) => {
    setOpenList((list) => Array.from(new Set([...list, ...ids])));
  }, []);

  const close = useCallback((id: T) => {
    setOpenList((list) => list.filter((item) => item !== id));
  }, []);

  const toggle = useCallback((id: T) => (isOpen(id) ? close(id) : open(id)), []);

  const isOpen = useCallback((id: T) => openListRef.current.includes(id), []);

  const get = useCallback(() => openListRef.current, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => ({ open, close, toggle, isOpen, get, set: setOpenList }), [openList]);
}
