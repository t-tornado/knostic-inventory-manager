import { useTheme } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import StoreIcon from "@mui/icons-material/Store";
import {
  StyledActivityItemContainer,
  StyledActivityItemIcon,
  StyledActivityItemContent,
  StyledActivityItemText,
  StyledActivityItemTime,
} from "./styled";
import { createActivityColors } from "../../utils/theme/createActivityColors";
import { useMemo } from "react";

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

export const ActivityItem = ({ type, text, time }: ActivityItemProps) => {
  const theme = useTheme();
  const Icon = activityIcons[type];

  const activityColors = useMemo(() => createActivityColors(theme), [theme]);

  const colors = activityColors[type];

  return (
    <StyledActivityItemContainer>
      <StyledActivityItemIcon bgcolor={colors.bg} color={colors.color}>
        <Icon sx={{ color: "primary.contrastText" }} />
      </StyledActivityItemIcon>
      <StyledActivityItemContent>
        <StyledActivityItemText variant='body2'>{text}</StyledActivityItemText>
        <StyledActivityItemTime variant='caption'>
          {time}
        </StyledActivityItemTime>
      </StyledActivityItemContent>
    </StyledActivityItemContainer>
  );
};
