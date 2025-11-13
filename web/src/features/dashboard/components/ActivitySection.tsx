import { Box, Typography } from "@mui/material";
import { SectionHeader, ActivityItem } from "./atoms";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { formatTimeAgo } from "@/shared/utils/format";
import type { ActivityItem as ActivityItemType } from "../types";
import { StyledSectionCard } from "./atoms/styled";

interface ActivitySectionProps {
  activity: ActivityItemType[];
}

export const ActivitySection = ({ activity }: ActivitySectionProps) => {
  if (activity.length === 0) {
    return (
      <StyledSectionCard>
        <SectionHeader title='Recent Activity' icon={<AccessTimeIcon />} />
        <Typography
          variant='body2'
          color='text.secondary'
          sx={{ p: 2, textAlign: "center" }}
        >
          No recent activity to display.
        </Typography>
      </StyledSectionCard>
    );
  }

  return (
    <StyledSectionCard>
      <SectionHeader title='Recent Activity' icon={<AccessTimeIcon />} />
      <Box
        sx={{
          maxHeight: "400px",
          overflowY: "auto",
          mt: 2,
        }}
      >
        {activity.map((item, index) => (
          <ActivityItem
            key={index}
            type={item.type}
            text={item.text}
            time={formatTimeAgo(item.timestamp)}
          />
        ))}
      </Box>
    </StyledSectionCard>
  );
};
