'use client';

import { Box, BoxProps, Collapse, styled } from '@mui/material';

// ----------

export interface LogoProps extends BoxProps {
  expand: boolean;
}

export default function Logo({ expand, ...props }: LogoProps) {
  return (
    <StyledRoot {...props}>
      <Box component="span" fontSize="1em">
        ζ
      </Box>

      <Box component="span" fontSize="0.75em">
        P
      </Box>

      <Box
        component="span"
        fontSize=".5em"
        letterSpacing="-0.05em"
        fontWeight={400}
        sx={{
          opacity: expand ? 0.75 : 0,
          transition: 'all ease .6s',
          marginTop: '0.25em',
          marginLeft: '-0.1em',
        }}
      >
        <Collapse in={expand} orientation="horizontal" sx={{ display: 'inline-flex' }}>
          αnel
        </Collapse>
      </Box>
    </StyledRoot>
  );
}

// ----- STYLED -----

const StyledRoot = styled(Box)(({ theme }) => ({
  height: '100%',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  userSelect: 'none',

  '& > span': {
    background: `-webkit-linear-gradient(60deg, ${theme.palette.primary.darker}, ${theme.palette.primary.light})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: '#0000',
  },
}));
