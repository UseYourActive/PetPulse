import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  TableProps,
  Box,
  Typography,
} from '@mui/material';
import React from 'react';

interface DataColumn<T> {
  id: keyof T;
  label: string;
  width?: string | number;
  align?: 'left' | 'right' | 'center';
  render?: (value: any, row: T) => React.ReactNode;
}

interface DataTableProps<T> extends Omit<TableProps, 'size'> {
  columns: DataColumn<T>[];
  data: T[];
  rowKey: keyof T;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
}

/**
 * Reusable data table component with customizable columns
 */
export const DataTable = React.forwardRef<HTMLTableElement, DataTableProps<any>>(
  (
    {
      columns,
      data,
      rowKey,
      emptyMessage = 'No data available',
      onRowClick,
      ...props
    },
    ref
  ) => {
    if (data.length === 0) {
      return (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="textSecondary">{emptyMessage}</Typography>
        </Box>
      );
    }

    return (
      <TableContainer component={Paper}>
        <Table ref={ref} {...props}>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={String(column.id)}
                  align={column.align || 'left'}
                  sx={{ fontWeight: 'bold', width: column.width }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow
                key={String(row[rowKey])}
                onClick={() => onRowClick?.(row)}
                sx={{
                  cursor: onRowClick ? 'pointer' : 'auto',
                  '&:hover': onRowClick
                    ? { backgroundColor: '#f5f5f5' }
                    : undefined,
                }}
              >
                {columns.map((column) => (
                  <TableCell
                    key={String(column.id)}
                    align={column.align || 'left'}
                  >
                    {column.render
                      ? column.render(row[column.id], row)
                      : String(row[column.id])}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
);

DataTable.displayName = 'DataTable';
