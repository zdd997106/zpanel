'use client';

import { createMedia } from '@zpanel/ui/utils';
import { mixins } from 'gexii/theme';
import { SystemStyleObject } from '@mui/system';
import { uploadable } from '@zpanel/ui/hoc';
import Image from 'next/image';
import { Card, Stack, styled, Theme, Typography } from '@mui/material';
import AddPhotoIcon from '@mui/icons-material/AddPhotoAlternateOutlined';

// ----- COMPONENT: IMAGE FIELD -----

export interface ImageFieldProps extends React.ComponentProps<typeof ImageCard> {
  error?: boolean;
  height: number;
  width: number;
}

export function ImageField({ error, value, height, width, ...props }: ImageFieldProps) {
  return (
    <ImageCard
      {...props}
      sx={mixins.combineSx(
        { height, width },
        error ? { borderColor: 'error.light' } : {},
        value && !error ? { border: 'none' } : {},
        props.sx,
      )}
    >
      {value && (
        <BackgroundImage
          height={height}
          width={width}
          src={createMedia.url(value)}
          alt="upload-image"
        />
      )}

      <Stack
        height="100%"
        alignItems="center"
        justifyContent="center"
        spacing={0.5}
        sx={[{ color: value ? 'common.white' : 'text.secondary' }, value ? showContentOnHover : {}]}
      >
        <AddPhotoIcon fontSize="large" color="inherit" />

        <Typography variant="caption" color="inherit" sx={mixins.ellipse()}>
          Click to upload
        </Typography>
      </Stack>
    </ImageCard>
  );
}

// ----- INTERNAL COMPONENTS -----

const StyledCard = styled(Card)(({ theme }) => ({
  border: 'solid 2px',
  padding: theme.spacing(1),
  borderColor: theme.palette.divider,
  background: theme.palette.divider,
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  borderRadius: theme.shape.borderRadius,
  cursor: 'pointer',
  marginTop: theme.spacing(1),
  position: 'relative',
}));

const ImageCard = uploadable(StyledCard, {
  valueKey: 'src',
  accept: 'image/*',
});

const BackgroundImage = styled(Image)(() => ({
  objectFit: 'cover',
  position: 'absolute',
  top: 0,
  left: 0,
  zIndex: 0,
}));

// ----- MIXINS -----

const showContentOnHover: SystemStyleObject<Theme> = {
  zIndex: 2,

  '& > *': {
    zIndex: 2,
    opacity: 0,
    transition: (theme) => theme.transitions.create('opacity'),
  },
  '&:hover > *, &:hover::before': {
    opacity: 1,
  },
  '&::before': {
    content: '""',
    display: 'block',
    height: '100%',
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    opacity: 0,
    background: '#0007',
    transition: (theme) => theme.transitions.create('opacity'),
  },
};
