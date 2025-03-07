import { Action, ActionOptions, useAction } from 'gexii/hooks';
import { useEffect, useState } from 'react';

export function useData<T extends (...args: any[]) => any, TDefault = undefined>(
  callback: T,
  {
    defaultValue = undefined as TDefault,
    manual = false,
    ...options
  }: ActionOptions<T> & { defaultValue?: TDefault; manual?: boolean } = {},
): [Awaited<ReturnType<T>> | TDefault, Action<T>] {
  const action = useAction(callback, options);
  const [ready, setReady] = useState(!!manual);

  // --- EFFECTS ---

  useEffect(() => {
    if (manual) return;

    if (!ready) {
      setReady(true);
      return;
    }

    action.call();
  }, [ready]);

  return [action.getData() ?? defaultValue, action];
}
