import { Box, Typography } from "@mui/material";
import { SectionCard, SectionHeader, ActivityItem } from "./ui";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import type { ActivityItem as ActivityItemType } from "../types";

interface ActivitySectionProps {
  activity: ActivityItemType[];
}

const formatTimeAgo = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} second${diffInSeconds !== 1 ? "s" : ""} ago`;
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`;
};

export const ActivitySection = ({ activity }: ActivitySectionProps) => {
  if (activity.length === 0) {
    return (
      <SectionCard>
        <SectionHeader title='Recent Activity' icon={<AccessTimeIcon />} />
        <Typography
          variant='body2'
          color='text.secondary'
          sx={{ p: 2, textAlign: "center" }}
        >
          No recent activity to display.
        </Typography>
      </SectionCard>
    );
  }

  return (
    <SectionCard>
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
    </SectionCard>
  );
};
