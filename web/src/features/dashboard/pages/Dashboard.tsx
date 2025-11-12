import { PageLayout } from "@/shared/components/PageLayout";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import {
  StatsGrid,
  ChartsGrid,
  AlertsSection,
  ActivitySection,
} from "../components";

export const DashboardPage = () => {
  return (
    <PageLayout title='Inventory Dashboard' headerIcon={<ShowChartIcon />}>
      <StatsGrid />
      <ChartsGrid />
      <AlertsSection />
      <ActivitySection />
    </PageLayout>
  );
};
