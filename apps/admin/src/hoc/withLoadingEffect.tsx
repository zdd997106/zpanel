import { useAction } from 'gexii/hooks';
import { noop } from 'lodash';
import React, { createElement, forwardRef } from 'react';

// ----------

export function withLoadingEffect<T extends React.ComponentType<any>>(
  Component: T,
  eventName = 'onClick',
) {
  return forwardRef(function NewComponent(
    props: React.ComponentPropsWithoutRef<T>,
    ref: React.ForwardedRef<React.ComponentRef<T>>,
  ) {
    const handleEvent = useAction(typeof props[eventName] === 'function' ? props[eventName] : noop);

    return createElement(Component, {
      ...props,
      ref,
      [eventName]: handleEvent.call,
      loading: handleEvent.isLoading(),
    });
  }) as unknown as T;
}
