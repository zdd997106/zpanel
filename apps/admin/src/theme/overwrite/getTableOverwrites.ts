import { tableRowClasses } from '@mui/material/TableRow';
import { tableCellClasses } from '@mui/material/TableCell';
import { Components, Theme, alpha } from '@mui/material/styles';

// ----------

export const getTableOverwrites = (): Components<Theme> => ({
  MuiTableRow: {
    styleOverrides: {
      root: ({ theme }) => ({
        [`&.${tableRowClasses.selected}`]: {
          backgroundColor: alpha(theme.palette.primary.dark, 0.04),
          '&:hover': {
            backgroundColor: alpha(theme.palette.primary.dark, 0.08),
          },
        },
        [`&:last-of-type .${tableCellClasses.root}`]: {
          borderColor: 'transparent',
        },
        th: {
          whiteSpace: 'nowrap',
        },
      }),
    },
  },

  MuiTableCell: {
    styleOverrides: {
      root: {
        borderBottomStyle: 'dashed',
      },
      head: ({ theme }) => ({
        fontSize: 14,
        color: theme.palette.text.secondary,
        fontWeight: theme.typography.fontWeightSemiBold,
        backgroundColor: theme.palette.background.neutral,
      }),
      stickyHeader: ({ theme }) => ({
        backgroundColor: theme.palette.background.paper,
        backgroundImage: `linear-gradient(to bottom, ${theme.palette.background.neutral} 0%, ${theme.palette.background.neutral} 100%)`,
      }),
      paddingCheckbox: ({ theme }) => ({
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
      }),
    },
  },

  MuiTablePagination: {
    styleOverrides: {
      toolbar: {
        height: 64,
      },
      actions: {
        marginRight: 8,
      },
      select: ({ theme }) => ({
        paddingLeft: 8,
        '&:focus': {
          borderRadius: theme.shape.borderRadius,
        },
      }),
      selectIcon: {
        right: 4,
        width: 16,
        height: 16,
        top: 'calc(50% - 8px)',
      },
    },
  },
});
