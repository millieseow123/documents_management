"use client";

import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';

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
import { getAllDocuments } from '@/services/fileService';
import { DocumentType, FileEntry } from '@/services/fileService/model';

import styles from './page.module.css';

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
      createdBy: "John Green",
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
      createdBy: "John Green",
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

  const isFolder = popupType === DocumentType.Folder;

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
      <div className={styles.uploadContainer}>
        <Paper
          variant="outlined"
          onClick={() => fileInputRef.current?.click()}
        >
          <CloudUploadIcon fontSize="large" color="primary" />
          <Typography mt={2}>Click to browse</Typography>
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
            Selected files:
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
      <Typography variant="h4" mb={2} color="text.secondary">Documents</Typography>

      <Stack direction="row" spacing={2} mb={2} justifyContent="space-between">
        <SearchBar placeholderText="Search" onSearch={searchHandler} />
        <Stack className={styles.buttons} direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<UploadIcon />}
            onClick={() => handleOpenPopup(DocumentType.File)}
          >
            <Typography variant="button">Upload files</Typography>
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenPopup(DocumentType.Folder)}
          >
            <Typography variant="button">Add new folder</Typography>
          </Button>
        </Stack>
      </Stack>

      <DocumentTable files={filteredFiles} />

      <PopUp
        open={popupType !== null}
        onClose={handleDialogClose}
        onSubmit={isFolder ? handleCreateFolder : handleUploadFiles}
        isDisabled={
          (renderedPopupType === DocumentType.Folder && folderName.trim() === "") ||
          (renderedPopupType === DocumentType.File && selectedFiles.length === 0)
        }
        title={renderedPopupType === DocumentType.Folder
          ? "Create New Folder"
          : renderedPopupType === DocumentType.File
            ? "Upload Files"
            : ""}
        submitText={renderedPopupType === DocumentType.Folder
          ? "Create"
          : renderedPopupType === DocumentType.File
            ? "Upload"
            : ""}
      >
        {renderedPopupType === DocumentType.Folder ? folderContent :
          renderedPopupType === DocumentType.File ? fileContent :
            null}
      </PopUp>
    </Box>
  );
}
