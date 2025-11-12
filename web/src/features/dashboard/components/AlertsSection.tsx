import { SectionCard, SectionHeader, AlertItem } from "./ui";
import NotificationsIcon from "@mui/icons-material/Notifications";

export const AlertsSection = () => {
  const alerts = [
    {
      title: 'Laptop Pro 15" - Only 3 units remaining',
      description:
        "Store: Downtown Branch • Category: Electronics • Current Stock: 3",
    },
    {
      title: "Wireless Mouse - Only 5 units remaining",
      description:
        "Store: Main Store • Category: Accessories • Current Stock: 5",
    },
    {
      title: "USB-C Cable - Only 2 units remaining",
      description: "Store: Tech Hub • Category: Cables • Current Stock: 2",
    },
  ];

  const handleRestock = (title: string) => {
    console.log("Restocking:", title);
    // TODO: Implement restock functionality
  };

  return (
    <SectionCard>
      <SectionHeader title='Low Stock Alerts' icon={<NotificationsIcon />} />
      {alerts.map((alert, index) => (
        <AlertItem
          key={index}
          title={alert.title}
          description={alert.description}
          onAction={() => handleRestock(alert.title)}
        />
      ))}
    </SectionCard>
  );
};
