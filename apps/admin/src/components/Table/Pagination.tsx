'use client';

import {
  Box,
  TablePagination as MuiTablePagination,
  TablePaginationProps as MuiTablePaginationProps,
} from '@mui/material';

// ----------

export interface TablePaginationProps
  extends Omit<MuiTablePaginationProps<typeof Box>, 'component'> {}

export default function TablePagination({
  labelRowsPerPage = 'Rows:',
  ...props
}: TablePaginationProps) {
  return <MuiTablePagination {...props} component={Box} labelRowsPerPage={labelRowsPerPage} />;
}
