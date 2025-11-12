import { Box, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import StoreIcon from "@mui/icons-material/Store";

type ActivityType = "add" | "update" | "delete" | "store";

interface ActivityItemProps {
  type: ActivityType;
  text: string;
  time: string;
}

const activityIcons = {
  add: AddIcon,
  update: EditIcon,
  delete: DeleteIcon,
  store: StoreIcon,
};

const activityColors = {
  add: { bg: "success.light", color: "success.main" },
  update: { bg: "info.light", color: "info.main" },
  delete: { bg: "error.light", color: "error.main" },
  store: { bg: "primary.light", color: "primary.main" },
};

export const ActivityItem = ({ type, text, time }: ActivityItemProps) => {
  const Icon = activityIcons[type];
  const colors = activityColors[type];

  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        py: 2,
        borderBottom: 1,
        borderColor: "divider",
        "&:last-child": {
          borderBottom: "none",
        },
      }}
    >
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          bgcolor: colors.bg,
          color: colors.color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon fontSize='small' />
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant='body2'
          sx={{
            color: "text.primary",
            mb: 0.5,
          }}
        >
          {text}
        </Typography>
        <Typography
          variant='caption'
          sx={{
            fontSize: 13,
            color: "text.secondary",
          }}
        >
          {time}
        </Typography>
      </Box>
    </Box>
  );
};
