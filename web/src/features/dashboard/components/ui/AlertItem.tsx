import { Box, Button, Typography } from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";

interface AlertItemProps {
  title: string;
  description: string;
  onAction?: () => void;
  actionLabel?: string;
}

export const AlertItem = ({
  title,
  description,
  onAction,
  actionLabel = "Restock",
}: AlertItemProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        p: 2,
        borderRadius: 2,
        bgcolor: "background.default",
        mb: 1.5,
        transition: "all 0.2s",
        "&:hover": {
          bgcolor: "action.hover",
        },
      }}
    >
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          bgcolor: "error.light",
          color: "error.main",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <WarningIcon fontSize='small' />
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant='subtitle2'
          sx={{
            fontWeight: 600,
            color: "text.primary",
            mb: 0.5,
          }}
        >
          {title}
        </Typography>
        <Typography
          variant='caption'
          sx={{
            fontSize: 13,
            color: "text.secondary",
          }}
        >
          {description}
        </Typography>
      </Box>
      <Button
        variant='contained'
        size='small'
        onClick={onAction}
        disabled
        sx={{
          textTransform: "none",
          fontWeight: 500,
          fontSize: 13,
          px: 2,
          flexShrink: 0,
        }}
      >
        {actionLabel}
      </Button>
    </Box>
  );
};
