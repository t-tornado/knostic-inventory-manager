import { Button } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import AddIcon from "@mui/icons-material/Add";

interface ProductTableHeaderActionsProps {
  onExport?: () => void;
  onNewProduct?: () => void;
}

export const ProductTableHeaderActions = ({
  onExport,
  onNewProduct,
}: ProductTableHeaderActionsProps) => {
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
        onClick={onNewProduct}
        size='small'
      >
        New Product
      </Button>
    </>
  );
};
