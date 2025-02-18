import { Inter } from 'next/font/google';

import { inRem } from 'src/utils';

// ----- Type Declaration -----

declare module '@mui/material/styles' {
  interface TypographyVariants {
    fontSecondaryFamily: React.CSSProperties['fontFamily'];
    fontWeightSemiBold: React.CSSProperties['fontWeight'];
  }
}

// ----------

const primaryFont = Inter({
  weight: ['400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  display: 'swap',
  fallback: ['Helvetica', 'Arial', 'sans-serif'],
});

// ----------

export const typography = {
  fontFamily: primaryFont.style.fontFamily,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightSemiBold: 600,
  fontWeightBold: 700,
  h1: {
    ...responsiveFontSizes({ sm: 26, md: 32, lg: 32 }),
    fontWeight: 800,
    lineHeight: 80 / 64,
    fontSize: inRem(26),
  },
  h2: {
    ...responsiveFontSizes({ sm: 20, md: 24, lg: 24 }),
    fontWeight: 700,
    lineHeight: 64 / 48,
    fontSize: inRem(20),
  },
  h3: {
    ...responsiveFontSizes({ sm: 18, md: 22, lg: 22 }),
    fontWeight: 700,
    lineHeight: 1.5,
    fontSize: inRem(18),
  },
  h4: {
    ...responsiveFontSizes({ sm: 18, md: 20, lg: 20 }),
    fontWeight: 700,
    lineHeight: 1.5,
    fontSize: inRem(18),
  },
  h5: {
    ...responsiveFontSizes({ sm: 16, md: 18, lg: 18 }),
    fontWeight: 700,
    lineHeight: 1.5,
    fontSize: inRem(16),
  },
  h6: {
    ...responsiveFontSizes({ sm: 14, md: 16, lg: 16 }),
    fontWeight: 700,
    lineHeight: 28 / 18,
    fontSize: inRem(14),
  },
  subtitle1: {
    ...responsiveFontSizes({ md: 16 }),
    fontWeight: 500,
    lineHeight: 1.5,
    fontSize: inRem(14),
  },
  subtitle2: {
    ...responsiveFontSizes({ md: 14 }),
    fontWeight: 500,
    lineHeight: 22 / 14,
    fontSize: inRem(13),
  },
  body1: {
    ...responsiveFontSizes({ md: 16 }),
    lineHeight: 1.5,
    fontSize: inRem(14),
  },
  body2: {
    ...responsiveFontSizes({ md: 14 }),
    lineHeight: 22 / 14,
    fontSize: inRem(13),
  },
  caption: {
    ...responsiveFontSizes({ md: 12 }),
    lineHeight: 1.5,
    fontSize: inRem(11),
  },
  overline: {
    ...responsiveFontSizes({ md: 12 }),
    fontWeight: 700,
    lineHeight: 1.5,
    fontSize: inRem(11),
    textTransform: 'uppercase',
  },
  button: {
    ...responsiveFontSizes({ md: 14 }),
    fontWeight: 600,
    lineHeight: 24 / 14,
    fontSize: inRem(12),
    textTransform: 'unset',
  },
} as const;

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
