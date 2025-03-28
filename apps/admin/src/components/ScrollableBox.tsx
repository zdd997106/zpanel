'use client';

import { Box, BoxProps } from '@mui/material';
import SimpleBar from './SimpleBar';

// ----------

export interface ScrollableBoxProps extends BoxProps {}

export default function ScrollableBox({ children, ...props }: BoxProps) {
  return (
    <Box {...props} position="relative">
      <SimpleBar sx={{ height: '100%', width: '100%', position: 'absolute' }}>{children}</SimpleBar>
    </Box>
  );
}
