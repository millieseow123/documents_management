import { useEffect, useRef, useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Typography,
  IconButton,
} from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import FileIcon from "@/assets/icons/file.svg";
import FilterDownIcon from "@/assets/icons/filter_down.svg";
import FilterUpIcon from "@/assets/icons/filter_up.svg";
import FolderIcon from "@/assets/icons/folder.svg";
import { CONSTANTS } from '@/constants/constants';
import { DocumentType, FileEntry } from '@/services/fileService/model';
import { sortByDate, sortByName } from '@/utilities/sortFunction';
import ActionMenu from '../actionMenu';
import Spinner from '../spinner';
import TablePaginationControls from '../pagination';

import styles from './index.module.css';

/*
 * DocumentTable displays a list of uploaded documents and folders in a sortable, paginated table.
 * Supports document selection, renaming and deleting
 *
 * Props:
 * - files: Array of FileEntry items to display.
 * - setFiles: Function to update the list of documents after editing or deletion.
 *
 * Features:
 * - Sort by name and date
 * - Inline rename input
 * - Scrollable table body with fixed headers
 * - Context menu actions (rename, delete)
 */

interface DocumentTableProps {
  files: FileEntry[];
  setFiles: React.Dispatch<React.SetStateAction<FileEntry[]>>;
}

export default function DocumentTable({ files, setFiles }: DocumentTableProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState<number[]>([]);
  const [sortName, setSortName] = useState<'asc' | 'desc'>('desc');
  const [sortDate, setSortDate] = useState<'asc' | 'desc'>('asc');
  const [sortedFiles, setSortedFiles] = useState<FileEntry[]>(files);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);

  // Additional functions - rename & delete documents
  const menuClickRef = useRef(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedName, setEditedName] = useState('');
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [menuTargetId, setMenuTargetId] = useState<number | null>(null);


  const toggleSelectRow = (id: number) => {
    setSelectedFiles((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const allSelected = !isLoading && selectedFiles.length > 0 && selectedFiles.length === sortedFiles.length;
  const someSelected = !isLoading && selectedFiles.length > 0 && !allSelected;

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(sortedFiles.map((item) => item.id));
    }
  };

  const paginatedFiles = sortedFiles.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const sortHandler = (key: 'name' | 'date') => {
    if (key === 'name') {
      const newDirection = sortName === 'asc' ? 'desc' : 'asc';
      setSortName(newDirection);
      setSortedFiles(sortByName([...sortedFiles], newDirection));
    } else {
      const newDirection = sortDate === 'asc' ? 'desc' : 'asc';
      setSortDate(newDirection);
      setSortedFiles(sortByDate([...sortedFiles], newDirection));
    }
  };

  // Additional functions - rename 
  const renameHandler = () => {
    setMenuAnchorEl(null);
    menuClickRef.current = true;
    const fileToEdit = sortedFiles.find(f => f.id === menuTargetId);
    if (fileToEdit) {
      setEditingId(fileToEdit.id);
      setEditedName(fileToEdit.name);
    }
    setTimeout(() => {
      menuClickRef.current = false;
    }, 0);
  };

  // Additional functions - delete documents
  const deleteHandler = (id: number) => {
    const updated = files.filter((f) => f.id !== id);
    setFiles(updated);
    setSelectedFiles((prev) => prev.filter((selectedId) => selectedId !== id));
  };

  useEffect(() => {
    setIsLoading(true);
    setSelectedFiles([]);
    const sorted = sortByDate(files, 'desc');
    setSortedFiles(sorted);
    setPage(0);
    requestAnimationFrame(() => {
      setIsLoading(false);
    });
  }, [files]);

  return (
    <Box className={styles.tableContainer}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow className={styles.tableHeaderRow}>
              <TableCell padding="checkbox">
                <div className={styles.tableHeader}>
                  <Checkbox
                    checked={allSelected}
                    indeterminate={someSelected}
                    onChange={toggleSelectAll}
                    sx={{
                      color: 'white',
                      '&.Mui-checked': { color: 'white' },
                      '&.MuiCheckbox-indeterminate': { color: 'white' },
                    }}
                  />
                </div>
              </TableCell>
              <TableCell sx={{ width: '45%' }}>
                <div className={styles.tableHeader}>
                  <Typography variant="body2">{CONSTANTS.TABLE_HEADERS.NAME}</Typography>
                  {
                    sortName === 'asc' ?
                      <FilterUpIcon onClick={() => sortHandler('name')} />
                      : <FilterDownIcon onClick={() => sortHandler('name')} />
                  }
                </div>
              </TableCell>
              <TableCell sx={{ width: '15%' }}>
                <div className={styles.tableHeader}>
                  <Typography variant="body2" >{CONSTANTS.TABLE_HEADERS.CREATED_BY}</Typography>
                </div>
              </TableCell>
              <TableCell sx={{ width: '15%' }}>
                <div className={styles.tableHeader}>
                  <Typography variant="body2">{CONSTANTS.TABLE_HEADERS.DATE}</Typography>
                  {
                    sortDate === 'asc' ?
                      <FilterUpIcon onClick={() => sortHandler('date')} />
                      : <FilterDownIcon onClick={() => sortHandler('date')} />
                  }
                </div>
              </TableCell>
              <TableCell sx={{ width: '15%' }}>
                <div className={styles.tableHeader}>
                  <Typography variant="body2" >{CONSTANTS.TABLE_HEADERS.FILE_SIZE}</Typography>
                </div>
              </TableCell>
              <TableCell sx={{ width: '5%' }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody className={styles.tableBodyScrollable}>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Spinner />
                </TableCell>
              </TableRow>
            )}

            {!isLoading && paginatedFiles.length > 0 &&
              paginatedFiles.map((item) => (
                <TableRow
                  key={item.id}
                  hover
                  onClick={() => toggleSelectRow(item.id)}
                  className={styles.tableBodyRow}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedFiles.includes(item.id)}
                      onClick={(e) => e.stopPropagation()}
                      onChange={() => toggleSelectRow(item.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className={styles.nameCell}>
                      {item.type === DocumentType.Folder ? (
                        <FolderIcon fontSize="small" />
                      ) : (
                        <FileIcon />
                      )}
                      {editingId === item.id ? (
                        <input
                          value={editedName}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => setEditedName(e.target.value)}
                          onBlur={() => {
                            const updated = files.map(f =>
                              f.id === item.id ? { ...f, name: editedName } : f
                            );
                            setFiles(updated);

                            if (menuClickRef.current) return;
                            requestAnimationFrame(() => {
                              setEditingId(null);
                            });
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              const updated = files.map(f =>
                                f.id === item.id ? { ...f, name: editedName } : f
                              );
                              setFiles(updated);
                              setEditingId(null);
                            }
                          }}
                          autoFocus
                          className={styles.renameInput}
                        />
                      ) : (
                        <Typography variant="body2">{item.name}</Typography>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="textSecondary">{item.createdBy}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="textSecondary">{item.date}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="textSecondary">{item.size}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton onClick={(e) => {
                      e.stopPropagation();
                      setMenuAnchorEl(e.currentTarget);
                      setMenuTargetId(item.id);
                    }}>
                      <MoreHorizIcon sx={{
                        color: item.type === DocumentType.Folder ? 'primary.main' : 'primary.light',
                      }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            }

            {!isLoading && paginatedFiles.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body2" color="text.secondary" py={1}>
                    {CONSTANTS.MESSAGES.NO_DOCUMENTS}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>

        </Table>
      </TableContainer>
      <div>
        <TablePaginationControls
          page={page}
          rowsPerPage={rowsPerPage}
          totalItems={sortedFiles.length}
          onPageChange={setPage}
          onRowsPerPageChange={(newRows) => {
            setRowsPerPage(newRows);
            setPage(0);
          }}
        />
      </div>
      <ActionMenu
        anchorEl={menuAnchorEl}
        onClose={() => setMenuAnchorEl(null)}
        onRename={renameHandler}
        onDelete={() => {
          setMenuAnchorEl(null);
          if (menuTargetId !== null) {
            deleteHandler(menuTargetId);
          }
        }}
      />
    </Box >

  );
}

