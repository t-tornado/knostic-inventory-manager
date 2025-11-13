import { CircularProgress } from "@mui/material";
import { SectionHeader, ActivityItem } from "./atoms";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { formatTimeAgo } from "@/shared/utils/format";
import type { ActivityItem as ActivityItemType } from "../types";
import {
  StyledSectionCard,
  StyledActivityList,
  StyledEmptyState,
  StyledLoadingContainer,
  StyledErrorState,
} from "./atoms/styled";

interface ActivitySectionProps {
  activity: ActivityItemType[];
  isLoading?: boolean;
  error?: Error | null;
}

const ActivityContent = ({ activity }: { activity: ActivityItemType[] }) => {
  if (activity.length === 0) {
    return (
      <StyledEmptyState variant='body2' color='text.secondary'>
        No recent activity to display.
      </StyledEmptyState>
    );
  }

  return (
    <StyledActivityList>
      {activity.map((item, index) => (
        <ActivityItem
          key={`${item.timestamp}-${index}`}
          type={item.type}
          text={item.text}
          time={formatTimeAgo(item.timestamp)}
        />
      ))}
    </StyledActivityList>
  );
};

const LoadingState = () => (
  <StyledLoadingContainer>
    <CircularProgress size={24} />
  </StyledLoadingContainer>
);

const ErrorState = () => (
  <StyledErrorState variant='body2' color='error'>
    Failed to load activities.
  </StyledErrorState>
);

export const ActivitySection = ({
  activity,
  isLoading = false,
  error = null,
}: ActivitySectionProps) => {
  return (
    <StyledSectionCard>
      <SectionHeader title='Recent Activity' icon={<AccessTimeIcon />} />
      {isLoading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState />
      ) : (
        <ActivityContent activity={activity} />
      )}
    </StyledSectionCard>
  );
};
