import type { TypographyOptions } from '@mui/material/styles/createTypography';

import { Theme } from '@mui/material';
import { inRem } from 'src/utils';

// ----------------------------------------------------------------------

declare module '@mui/material/styles' {
  interface TypographyVariants {
    fontSecondaryFamily: React.CSSProperties['fontFamily'];
    fontWeightSemiBold: React.CSSProperties['fontWeight'];
  }
  interface TypographyVariantsOptions {
    fontSecondaryFamily?: React.CSSProperties['fontFamily'];
    fontWeightSemiBold?: React.CSSProperties['fontWeight'];
  }
  interface ThemeVars {
    typography: Theme['typography'];
  }
}

// ----------------------------------------------------------------------

export const defaultFont = 'Public Sans Variable';

export const primaryFont = setFont(defaultFont);

export const secondaryFont = setFont('Barlow');

// ----------------------------------------------------------------------

export const typography: TypographyOptions = {
  fontFamily: primaryFont,
  fontSecondaryFamily: secondaryFont,
  fontWeightLight: '300',
  fontWeightRegular: '400',
  fontWeightMedium: '500',
  fontWeightSemiBold: '600',
  fontWeightBold: '700',
  h1: {
    fontWeight: 800,
    lineHeight: 80 / 64,
    fontSize: inRem(40),
    fontFamily: secondaryFont,
    ...responsiveFontSizes({ sm: 52, md: 58, lg: 64 }),
  },
  h2: {
    fontWeight: 700,
    lineHeight: 64 / 48,
    fontSize: inRem(32),
    fontFamily: secondaryFont,
    ...responsiveFontSizes({ sm: 40, md: 44, lg: 48 }),
  },
  h3: {
    fontWeight: 700,
    lineHeight: 1.5,
    fontSize: inRem(24),
    fontFamily: secondaryFont,
    ...responsiveFontSizes({ sm: 26, md: 30, lg: 32 }),
  },
  h4: {
    fontWeight: 700,
    lineHeight: 1.5,
    fontSize: inRem(20),
    ...responsiveFontSizes({ sm: 20, md: 24, lg: 24 }),
  },
  h5: {
    fontWeight: 700,
    lineHeight: 1.5,
    fontSize: inRem(18),
    ...responsiveFontSizes({ sm: 19, md: 20, lg: 20 }),
  },
  h6: {
    fontWeight: 600,
    lineHeight: 28 / 18,
    fontSize: inRem(17),
    ...responsiveFontSizes({ sm: 18, md: 18, lg: 18 }),
  },
  subtitle1: {
    fontWeight: 500,
    lineHeight: 1.5,
    fontSize: inRem(16),
  },
  subtitle2: {
    fontWeight: 500,
    lineHeight: 22 / 14,
    fontSize: inRem(14),
  },
  body1: {
    lineHeight: 1.5,
    fontSize: inRem(16),
  },
  body2: {
    lineHeight: 22 / 14,
    fontSize: inRem(14),
  },
  caption: {
    lineHeight: 1.5,
    fontSize: inRem(12),
  },
  overline: {
    fontWeight: 700,
    lineHeight: 1.5,
    fontSize: inRem(12),
    textTransform: 'uppercase',
  },
  button: {
    fontWeight: 700,
    lineHeight: 24 / 14,
    fontSize: inRem(14),
    textTransform: 'unset',
  },
};

// Helpers -----

function responsiveFontSizes({ sm, md, lg }: { sm?: number; md?: number; lg?: number }) {
  return {
    '@media (min-width:600px)': {
      fontSize: sm && inRem(sm),
    },
    '@media (min-width:900px)': {
      fontSize: md && inRem(md),
    },
    '@media (min-width:1200px)': {
      fontSize: lg && inRem(lg),
    },
  };
}

function setFont(fontName: string) {
  return `"${fontName}",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"`;
}
