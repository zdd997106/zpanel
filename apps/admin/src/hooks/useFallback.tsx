import { useEffect, useState } from 'react';

// ----------

/**
 * useSessionFallback
 *
 * This hook provides a temporary fallback value from sessionStorage while waiting
 * for fresh data from an API. It helps bridge the gap between the initial render
 * and the successful API response, ensuring the UI has some data without affecting
 * user interactions.
 *
 * Note: **It should only be using for the GET request and insensitive data**
 *
 */
export function useFallback<T>(data: T, key: string, defaultValue: NonNullable<T>): NonNullable<T> {
  const [defaultData, setDefaultData] = useState(defaultValue);

  // --- EFFECTS ---

  useEffect(() => {
    try {
      const storedStringifiedData = sessionStorage.getItem(key);
      if (!storedStringifiedData) return;

      setDefaultData(JSON.parse(Buffer.from(storedStringifiedData, 'base64').toString('ascii')));
    } catch {
      /* empty */
    }
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem(key, Buffer.from(JSON.stringify(data), 'ascii').toString('base64'));
    } catch {
      /* empty */
    }
  }, [data]);

  return (data ?? defaultData) as NonNullable<T>;
}
