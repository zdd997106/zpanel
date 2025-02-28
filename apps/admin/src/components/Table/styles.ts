'use client';

import { Box, Stack, TableCell, styled } from '@mui/material';

// ----------

export const StyledBodyPlaceholder = styled(Stack)(({ theme }) => ({
  width: '100%',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: 180,
  paddingY: theme.spacing(4),
}));

export const StyledTableContainer = styled(Box)<{ loading?: string }>(({ loading, theme }) => ({
  opacity: loading ? 0.7 : 1,
  transition: theme.transitions.create('opacity', {
    duration: theme.transitions.duration.short,
  }),
}));

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(2),

  [`${theme.breakpoints.down('md')}`]: {
    paddingTop: theme.spacing(1.25),
    paddingBottom: theme.spacing(1.25),
  },
}));
