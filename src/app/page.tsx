"use client";

import { useEffect, useRef, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Stack,
  TextField,
  Paper
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import UploadIcon from '@/assets/icons/upload.svg';
import DocumentTable from '@/components/documentTable';
import PopUp from '@/components/popUp';
import SearchBar from '@/components/searchBar';
import { CONSTANTS } from '@/constants/constants';
import { getAllDocuments } from '@/services/fileService';
import { DocumentType, FileEntry } from '@/services/fileService/model';

import styles from './page.module.css';

/*
 * Homepage which displays the documents management system UI.
 * Handles document list rendering, file/ folder creation, searching across documents, deleting, and renaming documents.
 */

export default function HomePage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [allFiles, setAllFiles] = useState<FileEntry[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<FileEntry[]>([]);
  const [folderName, setFolderName] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [popupType, setPopupType] = useState<DocumentType.File | DocumentType.Folder | null>(null);
  const [renderedPopupType, setRenderedPopupType] = useState<DocumentType | null>(null);

  const searchHandler = (term: string) => {
    if (term.trim() === '') {
      setFilteredFiles(allFiles);
    } else {
      const filtered = allFiles.filter((file) =>
        file.name.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredFiles(filtered);
    }
  };

  const handleCreateFolder = () => {
    const trimmedName = folderName.trim();
    if (!trimmedName) return;

    const nameExists = allFiles.some(file =>
      file.name.toLowerCase() === trimmedName.toLowerCase() &&
      file.type === DocumentType.Folder
    );

    if (nameExists) {
      alert("A folder with this name already exists.");
      return;
    }
    const newFolder = {
      id: Date.now(),
      name: folderName,
      type: DocumentType.Folder,
      createdBy: "New User",
      date: new Date().toLocaleDateString("en-GB", {
        day: "2-digit", month: "short", year: "numeric"
      }),
      size: "-",
    };

    const updatedFiles = [newFolder, ...allFiles];
    setPopupType(null);
    setAllFiles(updatedFiles);
    setFilteredFiles(updatedFiles);
  };

  const handleUploadFiles = () => {
    const nonDuplicateFiles = selectedFiles.filter((file) =>
      !allFiles.some(existing =>
        existing.name.toLowerCase() === file.name.toLowerCase() &&
        existing.type === DocumentType.File
      )
    );

    if (nonDuplicateFiles.length === 0) {
      alert("Selected file already exists.");
      return;
    }

    const newFile: FileEntry[] = selectedFiles.map((file, index) => ({
      id: Date.now() + index,
      name: file.name,
      size: `${(file.size / 1024).toFixed(1)} KB`,
      type: DocumentType.File,
      createdBy: "New User",
      date: new Date().toLocaleDateString("en-GB", {
        day: "2-digit", month: "short", year: "numeric"
      }),
    }));

    const updatedFiles = [...newFile, ...allFiles];
    setPopupType(null);
    setAllFiles(updatedFiles);
    setFilteredFiles(updatedFiles);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleDialogClose = () => {
    setPopupType(null);
    setFolderName('');
    setSelectedFiles([]);
  };

  const handleOpenPopup = (type: DocumentType) => {
    setRenderedPopupType(type);
    setPopupType(type);
  };

  useEffect(() => {
    getAllDocuments().then((data) => {
      setAllFiles(data);
      setFilteredFiles(data);
    });
  }, []);

  const folderContent = (
    <TextField
      autoFocus
      label="Folder name"
      fullWidth
      variant="outlined"
      value={folderName}
      onChange={(e) => setFolderName(e.target.value)}
    />
  );

  const fileContent = (
    <Box>
      <div className={styles.uploadFileContainer}>
        <Paper
          variant="outlined"
          onClick={() => fileInputRef.current?.click()}
        >
          <CloudUploadIcon fontSize="large" color="primary" />
          <Typography mt={2}>{CONSTANTS.BUTTONS.BROWSE}</Typography>
          <input
            type="file"
            multiple
            hidden
            ref={fileInputRef}
            onChange={handleFileChange}
          />
        </Paper>
      </div>
      {selectedFiles.length > 0 && (
        <Box mt={2}>
          <Typography variant="body2" color="text.secondary" mb={1}>
            {CONSTANTS.MESSAGES.SELECTED_FILES}
          </Typography>
          {selectedFiles.map((file, idx) => (
            <Typography key={idx}>- {file.name}</Typography>
          ))}
        </Box>
      )}
    </Box>
  );

  return (
    <Box p={4}>
      <Typography variant="h4" mb={2} color="text.secondary">{CONSTANTS.TITLES.DOCUMENTS}</Typography>

      <Stack direction="row" spacing={2} mb={2} justifyContent="space-between">
        <SearchBar placeholderText={CONSTANTS.PLACEHOLDERS.SEARCH} onSearch={searchHandler} />
        <Stack className={styles.buttons} direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<UploadIcon />}
            onClick={() => handleOpenPopup(DocumentType.File)}
          >
            <Typography variant="button">{CONSTANTS.BUTTONS.UPLOAD_FILES}</Typography>
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenPopup(DocumentType.Folder)}
          >
            <Typography variant="button">{CONSTANTS.BUTTONS.ADD_FOLDER}</Typography>
          </Button>
        </Stack>
      </Stack>

      <DocumentTable files={filteredFiles} setFiles={(newFiles) => {
        setAllFiles(newFiles);
        setFilteredFiles(newFiles);
      }} />

      <PopUp
        open={popupType !== null}
        onClose={handleDialogClose}
        onSubmit={popupType === DocumentType.Folder
          ? handleCreateFolder
          : handleUploadFiles}
        isDisabled={
          (renderedPopupType === DocumentType.Folder && folderName.trim() === "") ||
          (renderedPopupType === DocumentType.File && selectedFiles.length === 0)
        }
        title={renderedPopupType === DocumentType.Folder
          ? CONSTANTS.TITLES.CREATE_FOLDER
          : renderedPopupType === DocumentType.File
            ? CONSTANTS.TITLES.UPLOAD_FILES
            : ""}
        submitText={renderedPopupType === DocumentType.Folder
          ? CONSTANTS.BUTTONS.CREATE
          : renderedPopupType === DocumentType.File
            ? CONSTANTS.BUTTONS.UPLOAD
            : ""}
      >
        {renderedPopupType === DocumentType.Folder ? folderContent :
          renderedPopupType === DocumentType.File ? fileContent :
            null}
      </PopUp>
    </Box>
  );
}
