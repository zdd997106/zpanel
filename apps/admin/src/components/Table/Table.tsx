'use client';

import React, { forwardRef } from 'react';
import {
  Table as MuiTable,
  TableProps as MuiTableProps,
  TableHead,
  TableBody,
  TableRow,
  TableRowProps,
  Box,
  BoxProps,
  Typography,
} from '@mui/material';

import { Provider, IndexProvider, SkeletonProvider, HEAD_INDEX } from './context';
import { StyledBodyPlaceholder, StyledTableContainer } from './styles';

// ----------

export interface TableProps extends MuiTableProps {
  source?: any[];
  keyIndex?: string | null;
  loading?: boolean;
  minHeight?: number;
  containerProps?: BoxProps;
  getRowProps?: (item: any, index: number) => TableRowProps;
}

export default forwardRef(function Table(
  {
    source = [],
    keyIndex,
    loading = false,
    containerProps,
    children,
    getRowProps,
    ...props
  }: TableProps,
  ref: React.ForwardedRef<HTMLTableElement>,
) {
  return (
    <StyledTableContainer {...containerProps}>
      <MuiTable {...props} ref={ref}>
        <SkeletonProvider value={loading}>
          <Provider value={source}>
            {/* TABLE HEAD */}

            <TableHead>
              <IndexProvider value={HEAD_INDEX}>
                <TableRow {...getRowProps?.({}, -1)}>{children}</TableRow>
              </IndexProvider>
            </TableHead>

            {/* TABLE BODY */}

            <TableBody>
              {source.map((item, i) => (
                <IndexProvider key={String(!loading && keyIndex ? item[keyIndex] : i)} value={i}>
                  <TableRow {...getRowProps?.(item, i)}>{children}</TableRow>
                </IndexProvider>
              ))}
            </TableBody>
          </Provider>
        </SkeletonProvider>
      </MuiTable>

      {/* NOT FOUND HOLDER */}

      {!loading && source.length === 0 && (
        <StyledBodyPlaceholder spacing={1}>
          {/* <Iconify
            icon="line-md:cloud-braces-loop"
            width="min(80%, 100px)"
            color="action.disabled"
          /> */}
          <Typography variant="body2">No Records Found</Typography>
        </StyledBodyPlaceholder>
      )}

      {/* INITIALLY LOADING HOLDER */}

      {loading && source.length === 0 && (
        <StyledBodyPlaceholder spacing={1}>
          {/* <Iconify
            icon="svg-spinners:12-dots-scale-rotate"
            width="min(80%, 100px)"
            color="action.disabled"
          /> */}
        </StyledBodyPlaceholder>
      )}
    </StyledTableContainer>
  );
});
