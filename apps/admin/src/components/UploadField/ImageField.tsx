'use client';

import { Card, Stack, styled, Theme, Typography } from '@mui/material';
import { SystemStyleObject } from '@mui/system';

import { createMedia } from 'src/utils';
import { mixins } from 'src/theme';
import { uploadable } from 'src/hoc';
import Icons from 'src/icons';

// ----- COMPONENT: IMAGE FIELD -----

export interface ImageFieldProps extends React.ComponentProps<typeof ImageCard> {
  error?: boolean;
}

export function ImageField({ error, value, ...props }: ImageFieldProps) {
  return (
    <ImageCard
      {...props}
      sx={mixins.combineSx(
        value ? { backgroundImage: `url(${createMedia.url(value)})` } : {},
        error ? { borderColor: 'error.light' } : {},
        value && !error ? { border: 'none' } : {},
        props.sx,
      )}
    >
      <Stack
        height="100%"
        alignItems="center"
        justifyContent="center"
        spacing={0.5}
        sx={[{ color: value ? 'common.white' : 'text.secondary' }, value ? showContentOnHover : {}]}
      >
        <Icons.AddPhoto fontSize="large" color="inherit" />

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

// ----- MIXINS -----

const showContentOnHover: SystemStyleObject<Theme> = {
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
