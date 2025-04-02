import { useState } from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import ClearIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';

import styles from './index.module.css';

/*
 * SearchBar component for filtering document names in real-time (search as you type).
 *
 * Props:
 * - placeholderText: Optional placeholder inside the search input.
 * - onSearch: Callback function triggered with the current search query.
 */

interface SearchBarProps {
  placeholderText?: string;
  onSearch: (search: string) => void;
}

export default function SearchBar({ placeholderText, onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    onSearch(query.trim());
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value.trim());

    if (value.trim() === '') {
      onSearch('');
    }
  };

  return (
    <div className={styles.container}>
      <TextField
        placeholder={placeholderText}
        variant="outlined"
        size="small"
        value={query}
        onChange={handleChange}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                {query ? (
                  <IconButton onClick={handleClear} size="small">
                    <ClearIcon fontSize="small" />
                  </IconButton>
                ) : (
                  <IconButton size="small" style={{ visibility: 'hidden' }}>
                    <ClearIcon fontSize="small" />
                  </IconButton>
                )}

                <IconButton onClick={handleSearch} className={styles.searchButton}>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
        className={styles.searchField}
      />
    </div>
  );
}
