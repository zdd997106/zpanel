import { alpha, CSSObject, SxProps, Theme } from '@mui/material/styles';

// ----------

interface BgBlurProps {
  blur?: number;
  opacity?: number;
  color?: string;
  imgUrl?: string;
}

export function bgBlur({ color, blur = 6, imgUrl, opacity = 1 }: BgBlurProps): CSSObject {
  if (imgUrl) {
    return {
      position: 'relative',
      backgroundImage: `url(${imgUrl})`,
      '&::before': {
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 9,
        content: '""',
        width: '100%',
        height: '100%',
        backdropFilter: `blur(${blur}px)`,
        WebkitBackdropFilter: `blur(${blur}px)`,
        backgroundColor: color && alpha(color, opacity),
      },
    };
  }
  return {
    backdropFilter: `blur(${blur}px)`,
    WebkitBackdropFilter: `blur(${blur}px)`,
    backgroundColor: color && alpha(color, opacity),
  };
}

// ----------

interface EllipseOptions {
  lines?: number;
  breakWord?: boolean;
}

export function ellipse({ breakWord = true, lines = 1 }: EllipseOptions = {}): CSSObject {
  return {
    display: '-webkit-box',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    WebkitBoxOrient: 'vertical',
    overflowWrap: breakWord ? 'anywhere' : 'normal',
    WebkitLineClamp: String(lines ?? 1),
  };
}

// ----------

export function combineSx(
  sx: SxProps<Theme>,
  ...targets: (SxProps<Theme> | undefined)[]
): SxProps<Theme> {
  return targets.reduce(
    (accumulator, sx) => {
      if (!sx) return accumulator;

      if (Array.isArray(sx)) return [...accumulator, ...sx];

      return [...accumulator, sx];
    },
    [sx],
  );
}

export function loading(enable: boolean): CSSObject {
  return {
    position: 'relative',

    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 2,
      width: '100%',
      height: '100%',
      backgroundColor: '#FFF',
      opacity: enable ? 0.3 : 0,
      pointerEvents: enable ? undefined : 'none',
      transition: 'opacity ease 0.3s',
    } as CSSObject,
  };
}
