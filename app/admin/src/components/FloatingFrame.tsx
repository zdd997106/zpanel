'use client';

import { Grow, Paper } from '@mui/material';

// ----------

export interface FloatingFrameProps {
  children?: React.ReactNode;
}

/**
 *
 * A UI component that renders a floating frame which specifically designed for the auth views.
 *
 */
export default function FloatingFrame({ children }: FloatingFrameProps) {
  return (
    <Grow in>
      <Paper
        sx={(theme) => ({
          maxWidth: '100%',
          width: theme.breakpoints.values.sm,
          minHeight: theme.breakpoints.values.sm / 2,
          boxShadow: theme.shadows[5],
          borderRadius: 2,
          padding: 3,
        })}
      >
        {children}
      </Paper>
    </Grow>
  );
}
