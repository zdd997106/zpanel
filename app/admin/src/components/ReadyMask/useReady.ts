'use client';

import { useEffect, useState } from 'react';

/**
 *
 * Returns a boolean value indicating whether the first rendering of the current component has occurred.
 *
 */
export function useReady() {
  const [ready, setReady] = useState(false);

  // --- EFFECTS ---

  // Effect to be executed after the initial render
  useEffect(() => {
    if (!global.window) return;

    // Introduce a micro-task to update the ready state after the initial render
    const timer = setTimeout(() => setReady(true), 0);

    return () => clearTimeout(timer);
  }, []);

  return ready;
}
