import { alpha, CSSObject } from '@mui/material/styles';

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
