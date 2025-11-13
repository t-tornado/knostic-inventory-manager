import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

interface ProductTableHeaderActionsProps {
  onExport?: () => void;
  onNewProduct?: () => void;
}

export const ProductTableHeaderActions = ({
  onNewProduct,
}: ProductTableHeaderActionsProps) => {
  return (
    <>
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
