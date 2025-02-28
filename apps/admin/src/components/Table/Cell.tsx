'use client';

import React from 'react';
import { get, merge, omit } from 'lodash';
import { Breakpoint, TableCellProps, Skeleton, Box } from '@mui/material';

import { mixins } from 'src/theme';

import { useRowIndex, useSkeleton, useTableSource, HEAD_INDEX } from './context';
import { StyledTableCell } from './styles';

// ----------

export interface CellProps extends Omit<TableCellProps, 'align' | 'width'> {
  label?: React.ReactNode;
  path?: string;
  align?: CellAlign | [CellAlign, CellAlign];
  width?: number | string | Record<Breakpoint, number | string>;
  ellipsis?: boolean;
  bodyCellProps?: ExtraCellProps;
  headCellProps?: ExtraCellProps;
  render?: (value: any, item: any, index: number) => React.ReactNode;
}

interface ExtraCellProps
  extends Omit<
    Partial<CellProps>,
    'headCellProps' | 'bodyCellProps' | 'label' | 'path' | 'render'
  > {}

export default function Cell({ bodyCellProps, headCellProps, sx, ...props }: CellProps) {
  const rowIndex = useRowIndex();
  const headCombinedSx = mixins.combineSx({ typography: 'subtitle2' }, sx, headCellProps?.sx);
  const bodyCombinedSx = mixins.combineSx({ typography: 'body2' }, sx, bodyCellProps?.sx);

  if (rowIndex === HEAD_INDEX)
    return <HeadCell {...merge(props, headCellProps)} sx={headCombinedSx} />;
  return <BodyCell {...merge(props, bodyCellProps)} sx={bodyCombinedSx} />;
}

// ----- TYPES ------

type CellAlign = 'left' | 'center' | 'right';

// ----- RELATED COMPONENTS -----

/**
 *
 * Table Head Cell
 *
 */
function HeadCell({ label, align, width, ...props }: CellProps) {
  return (
    <StyledTableCell
      {...omit(props, ...['render', 'path', 'ellipsis'])}
      align={Array.isArray(align) ? align[0] : align}
      sx={mixins.combineSx({ width }, props.sx)}
    >
      {label}
    </StyledTableCell>
  );
}

/**
 *
 * Table Body Cell
 *
 */
function BodyCell({ path, children, align, ellipsis, render, ...props }: CellProps) {
  const rowIndex = useRowIndex();
  const loading = useSkeleton();
  const source = useTableSource();

  const item = source[rowIndex];
  const value = (path ? get(item, path) : item) as React.ReactNode;

  // --- FUNCTIONS ---

  function decodeCellAlign(align: undefined | CellAlign | [CellAlign, CellAlign]) {
    return Array.isArray(align) ? align[1] : align;
  }

  try {
    if (loading) {
      return (
        <StyledTableCell {...omit(props, ['label', 'width'])}>
          <Skeleton variant="text" />
        </StyledTableCell>
      );
    }

    return (
      <StyledTableCell {...omit(props, ['label', 'width'])} align={decodeCellAlign(align)}>
        <Box sx={ellipsis ? mixins.ellipse() : {}}>
          {typeof render === 'function' ? render(value, item, rowIndex) : (children ?? value)}
        </Box>
      </StyledTableCell>
    );
  } catch (err) {
    console.error(err);
    return (
      <StyledTableCell {...omit(props, ['label', 'width'])} align={decodeCellAlign(align)}>
        Invalid Value
      </StyledTableCell>
    );
  }
}
