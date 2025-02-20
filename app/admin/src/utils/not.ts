export function not<T extends (...args: any[]) => boolean>(callback: T) {
  return (...args: Parameters<T>) => !callback(...args);
}
