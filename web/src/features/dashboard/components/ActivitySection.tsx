import { SectionCard, SectionHeader, ActivityItem } from "./ui";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

export const ActivitySection = () => {
  const activities = [
    {
      type: "add" as const,
      text: 'New product "Gaming Keyboard" added to Main Store',
      time: "2 minutes ago",
    },
    {
      type: "update" as const,
      text: 'Product "Laptop Pro 15"" stock updated to 3 units',
      time: "15 minutes ago",
    },
    {
      type: "store" as const,
      text: 'New store "Tech Hub" created',
      time: "1 hour ago",
    },
    {
      type: "update" as const,
      text: 'Product "Wireless Mouse" price updated to $29.99',
      time: "2 hours ago",
    },
    {
      type: "add" as const,
      text: 'New product "USB-C Cable" added to Tech Hub',
      time: "3 hours ago",
    },
  ];

  return (
    <SectionCard>
      <SectionHeader title='Recent Activity' icon={<AccessTimeIcon />} />
      {activities.map((activity, index) => (
        <ActivityItem
          key={index}
          type={activity.type}
          text={activity.text}
          time={activity.time}
        />
      ))}
    </SectionCard>
  );
};
