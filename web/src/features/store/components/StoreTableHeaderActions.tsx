import { Button } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import AddIcon from "@mui/icons-material/Add";

interface StoreTableHeaderActionsProps {
  onExport?: () => void;
  onNewStore?: () => void;
}

export const StoreTableHeaderActions = ({
  onExport,
  onNewStore,
}: StoreTableHeaderActionsProps) => {
  return (
    <>
      <Button
        variant='outlined'
        startIcon={<DownloadIcon />}
        onClick={onExport}
        size='small'
      >
        Export
      </Button>
      <Button
        variant='contained'
        startIcon={<AddIcon />}
        onClick={onNewStore}
        size='small'
      >
        New Store
      </Button>
    </>
  );
};
