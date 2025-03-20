'use client';

import { Avatar as MuiAvatar, AvatarProps as MuiAvatarProps } from '@mui/material';
import Image from 'next/image';
import { mixins } from 'src/theme';

// ----------

export interface AvatarProps extends MuiAvatarProps {
  height?: number;
  width?: number;
  alt?: string;
}

export default function Avatar({ src, height = 40, width = 40, ...props }: AvatarProps) {
  return (
    <MuiAvatar
      {...props}
      sx={mixins.combineSx({ height, width, img: { objectFit: 'cover' } }, props.sx)}
    >
      {src && <Image src={src} height={height} width={width} alt="avatar" />}
    </MuiAvatar>
  );
}
