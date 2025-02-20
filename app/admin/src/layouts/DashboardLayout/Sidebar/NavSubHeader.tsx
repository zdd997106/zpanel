'use client';

import { Collapse, ListSubheader, Typography } from '@mui/material';

// ----------

export interface NavSubHeaderProps {
  title: string;
  hidden?: boolean;
}

export default function NavSubHeader({ title, hidden }: NavSubHeaderProps) {
  return (
    <Collapse in={!hidden}>
      <ListSubheader sx={{ lineHeight: 2, textTransform: 'uppercase' }}>
        <Typography variant="caption" fontWeight={700} color="textDisabled">
          {title}
        </Typography>
      </ListSubheader>
    </Collapse>
  );
}
