import { Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";

interface StoreDetailsHeaderActionsProps {
  onAddProduct?: () => void;
}

export const StoreDetailsHeaderActions = ({
  onAddProduct,
}: StoreDetailsHeaderActionsProps) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/stores");
  };

  return (
    <>
      <Button
        variant='outlined'
        startIcon={<ArrowBackIcon />}
        onClick={handleBack}
        size='small'
      >
        Back to Stores
      </Button>
      <Button
        variant='contained'
        startIcon={<AddIcon />}
        onClick={onAddProduct}
        size='small'
      >
        Add Product
      </Button>
    </>
  );
};
