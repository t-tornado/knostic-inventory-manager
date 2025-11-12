import { Button } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import AddIcon from "@mui/icons-material/Add";
import { ThemeToggle } from "./ThemeToggle";

export const HeaderDefaultActions = () => {
  return (
    <>
      <ThemeToggle />
      <Button
        variant='outlined'
        startIcon={<DownloadIcon />}
        sx={{
          textTransform: "none",
          fontWeight: 500,
        }}
      >
        Export
      </Button>
      <Button
        variant='contained'
        startIcon={<AddIcon />}
        sx={{
          textTransform: "none",
          fontWeight: 500,
        }}
      >
        New Product
      </Button>
    </>
  );
};
