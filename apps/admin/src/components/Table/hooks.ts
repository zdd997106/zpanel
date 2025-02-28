'use client';

import { TablePaginationProps } from '@mui/material';
import { noop } from 'lodash';
import { useState } from 'react';
import { useUpdateEffect } from 'react-use';

export interface UsePaginationPrams {
  defaultPage?: number | string;
  defaultRowsPerPage?: number | string;
  rowsPerPageOptions?: number[];
  total?: number;
  onChange?: (value: { page: number; rowsPerPage: number }) => void;
}

export const usePagination = ({
  defaultPage,
  defaultRowsPerPage,
  rowsPerPageOptions,
  onChange = noop,
}: UsePaginationPrams) => {
  const [page, setPage] = useState(Number(defaultPage || 1));
  const [rowsPerPage, setRowsPerPage] = useState(Number(defaultRowsPerPage || ERowsPerPage.NORMAL));

  // --- EFFECTS ---

  useUpdateEffect(() => {
    onChange({ page, rowsPerPage });
  }, [page, rowsPerPage]);

  return {
    page,
    rowsPerPage,
    setPage,
    setRowsPerPage,
    getPaginationProps({ total }: { total: number }): TablePaginationProps {
      return {
        page: page - 1,
        rowsPerPage,
        count: total,
        rowsPerPageOptions: rowsPerPageOptions || [
          ERowsPerPage.VERY_FEW,
          ERowsPerPage.FEW,
          ERowsPerPage.NORMAL,
          ERowsPerPage.MANY,
          ERowsPerPage.VERY_MANY,
        ],
        onPageChange: (_, page) => setPage(page + 1),
        onRowsPerPageChange: (event) => setRowsPerPage(parseInt(event.target.value, 10)),
      };
    },
  };
};

// --- ENUMS ---

const ERowsPerPage = {
  VERY_FEW: 5,
  FEW: 10,
  NORMAL: 25,
  MANY: 50,
  VERY_MANY: 100,
};
