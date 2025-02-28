'use client';

import { styled } from '@mui/material';
import ReactSimpleBar, { Props } from 'simplebar-react';

// ----------

const SimpleBar = styled(ReactSimpleBar)(() => ({}));

export interface SimpleBarProps extends Props {}

export default SimpleBar;
