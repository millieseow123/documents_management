'use client';

import { Menu, MenuItem, Typography } from '@mui/material';
import { CONSTANTS } from '@/constants/constants';

/*
 * ActionMenu component that displays a context menu for document actions.
 * Allows users to trigger Rename or Delete actions from the 3 dots (MoreHorizIcon) button.
 *
 * Props:
 * - anchorEl: HTML element that anchors the menu.
 * - onClose: Function to close the menu.
 * - onRename: Callback when "Rename" is selected.
 * - onDelete: Callback when "Delete" is selected.
 */


interface ActionMenuProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  onRename: () => void;
  onDelete: () => void;
}

export default function ActionMenu({
  anchorEl,
  onClose,
  onRename,
  onDelete,
}: ActionMenuProps) {
  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
    >
      <MenuItem onClick={() => { onRename(); onClose(); }}>
        <Typography variant="body2">
          {CONSTANTS.BUTTONS.RENAME}
        </Typography>
      </MenuItem>
      <MenuItem onClick={() => { onDelete(); onClose(); }}><Typography variant="body2">
        {CONSTANTS.BUTTONS.DELETE}
      </Typography></MenuItem>
    </Menu>
  );
}
