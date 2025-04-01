/**
 * This file contains utility functions for interacting with native HTML elements.
 */
export const inputValue = (input: HTMLInputElement, value: string) => {
  const descriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
  if (!descriptor?.set) return;

  descriptor.set.call(input, value);
  input.dispatchEvent(new Event('input', { bubbles: true }));
};
