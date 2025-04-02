import { CircularProgress, Box } from '@mui/material';

/**
 * Spinner component for displaying a loading indicator during documents loading.
 */

export default function Spinner() {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" py={4}>
      <CircularProgress color="primary" />
    </Box>
  );
}
