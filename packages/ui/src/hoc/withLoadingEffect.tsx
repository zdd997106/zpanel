import { get, noop } from 'lodash';
import React, { createElement, forwardRef } from 'react';
import { useAction } from 'gexii/hooks';

// ----------

export function withLoadingEffect<T extends React.ComponentType<any>>(
  Component: T,
  eventName = 'onClick',
  loadingName = 'loading',
) {
  return forwardRef(function NewComponent(
    props: React.ComponentPropsWithoutRef<T>,
    ref: React.ForwardedRef<React.ComponentRef<T>>,
  ) {
    const handleEvent = useAction(
      typeof props[eventName] === 'function' ? props[eventName] : noop,
      { throwOnError: false },
    );

    return createElement(Component, {
      ...props,
      ref,
      [eventName]: handleEvent.call,
      [loadingName]: get(props, loadingName) ?? handleEvent.isLoading(),
    });
  }) as unknown as T;
}
