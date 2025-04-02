'use client';

import { Box, Typography, Select, MenuItem, Pagination, SelectChangeEvent } from '@mui/material';
import { CONSTANTS } from '@/constants/constants';

import styles from './index.module.css';

/*
 * TablePaginationControls component for navigating pages in document table.
 *
 * Props:
 * - page: Current page number.
 * - rowsPerPage: Number of rows displayed per page.
 * - totalItems: Total number of documents/folders.
 * - onPageChange: Function to update the current page.
 * - onRowsPerPageChange: Function to update the rows displayed per page.
 */

interface PaginationProps {
  page: number;
  rowsPerPage: number;
  totalItems: number;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (newRowsPerPage: number) => void;
}

export default function TablePaginationControls({
  page,
  rowsPerPage,
  totalItems,
  onPageChange,
  onRowsPerPageChange,
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / rowsPerPage);

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    onPageChange(value - 1);
  };

  const handleRowsChange = (event: SelectChangeEvent<number>) => {
    onRowsPerPageChange(Number(event.target.value));
  };

  return (
    <div className={styles.container}>
      <Box mt={2}>
        <Box>
          <Typography variant="body2" mr={1}>{CONSTANTS.PAGINATION.SHOW}</Typography>
          <Select size="small" value={rowsPerPage} onChange={handleRowsChange}>
            {[5, 10, 15, 20].map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
          <Typography variant="body2" ml={1}>{CONSTANTS.PAGINATION.ROWS_PER_PAGE}</Typography>
        </Box>

        <Pagination count={totalPages} page={page + 1} onChange={handlePageChange} className={styles.pageNumbers} />
      </Box>
    </div>
  );
}
