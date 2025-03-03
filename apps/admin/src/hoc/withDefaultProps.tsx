import { createElement, forwardRef } from 'react';

export function withDefaultProps<TComponent extends React.ComponentType<any>>(
  Component: TComponent,
  defaultProps: Partial<React.ComponentProps<TComponent>>,
): TComponent {
  return forwardRef((props, ref) =>
    createElement(Component, { ...defaultProps, ...props, ref }),
  ) as unknown as TComponent;
}
