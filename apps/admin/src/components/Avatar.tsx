'use client';

import { Avatar as MuiAvatar, AvatarProps as MuiAvatarProps, styled } from '@mui/material';
import Image from 'next/image';
import { mixins } from 'src/theme';

// ----------

export interface AvatarProps extends MuiAvatarProps {
  height?: number;
  width?: number;
  alt?: string;
}

export default function Avatar({ src, height = 40, width = 40, children, ...props }: AvatarProps) {
  return (
    <MuiAvatar
      {...props}
      sx={mixins.combineSx({ height, width, img: { objectFit: 'cover' } }, props.sx)}
    >
      {src ? <StyledImage src={src} height={height} width={width} alt="avatar" /> : children}
    </MuiAvatar>
  );
}

// ----- STYLED -----

const StyledImage = styled(Image)(() => ({
  height: '100%',
  width: '100%',
  objectFit: 'cover',
}));
