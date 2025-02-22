'use client';

import { noop } from 'lodash';
import { Box, BoxProps, IconButton, styled } from '@mui/material';

import Icons from 'src/icons';

// ----------

interface CollapseButtonProps extends BoxProps {
  open: boolean;
  toggleOpen?: () => void;
}

export default function CollapseButton({
  open,
  top = 0,
  left = 0,
  toggleOpen = noop,
  ...props
}: CollapseButtonProps) {
  return (
    <Anchor {...props} position="absolute" top={top} left={left}>
      <IconButton
        size="small"
        sx={{
          padding: 0.5,
          border: 'solid 1px',
          borderColor: 'divider',
          rotate: open ? '0deg' : '180deg',
          bgcolor: (theme) => `${theme.palette.background.default} !important`,
        }}
        onClick={() => toggleOpen()}
      >
        <Icons.Back fontSize="inherit" sx={{ fontSize: 12 }} />
      </IconButton>
    </Anchor>
  );
}

// ----- STYLED -----

const Anchor = styled(Box)(() => ({
  height: '1px',
  width: '1px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}));
