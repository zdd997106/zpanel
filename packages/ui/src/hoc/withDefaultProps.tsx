import { createElement, forwardRef } from 'react';

export function withDefaultProps<
  TComponent extends React.ComponentType<any>,
  TDefaultProps extends Partial<React.ComponentProps<TComponent>>,
>(Component: TComponent, defaultProps: TDefaultProps) {
  return forwardRef((props, ref) =>
    createElement(Component, { ...defaultProps, ...props, ref }),
  ) as unknown as React.FC<
    Omit<React.ComponentProps<TComponent>, keyof TDefaultProps> &
      Partial<Pick<React.ComponentProps<TComponent>, keyof TDefaultProps>>
  >;
}
