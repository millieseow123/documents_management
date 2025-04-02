import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { CONSTANTS } from "@/constants/constants";

import styles from './index.module.css';

/**
 * PopUp is a reusable dialog component used for uploading files or creating folders.
 * It takes in a child component and provides cancel/submit buttons.
 *
 * Props:
 * - open: Controls the visibility of the dialog.
 * - onClose: Function to close the popup.
 * - onSubmit: Callback when submit button is pressed.
 * - onExited: Optional cleanup callback after dialog closes.
 * - title: Title text displayed at the top.
 * - submitText: Text for the submit button.
 * - children: Content inside the dialog (e.g. form or upload area).
 */

interface PopUpProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  isDisabled?: boolean;
  title: string;
  submitText?: string;
  children?: React.ReactNode;
}

export default function PopUp({
  open,
  onClose,
  onSubmit,
  isDisabled,
  title,
  submitText,
  children, }: PopUpProps) {

  return (
    <Dialog open={open} onClose={onClose}>
      <div className={styles.title}>
        <Typography variant="h6">{title}</Typography>
        <button className={styles.closeButton} onClick={onClose}>
          <CloseIcon fontSize="small" />
        </button>
      </div>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{CONSTANTS.BUTTONS.CANCEL}</Button>
        <Button variant="contained" onClick={onSubmit} disabled={isDisabled}>
          {submitText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

