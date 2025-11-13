import { PageLayout } from "@/shared/components/PageLayout";
import { PageLoader } from "@/shared/components/PageLoader";
import { PageError } from "@/shared/components/PageError";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import { useDashboard } from "../hooks/useDashboard";
import { useActivities } from "../hooks/useActivities";
import {
  StatsGrid,
  ChartsGrid,
  AlertsSection,
  ActivitySection,
} from "../components";

const DASHBOARD_TITLE = "Dashboard";
const DASHBOARD_HEADER_ICON = <ShowChartIcon />;

export const DashboardPage = () => {
  const { data, isLoading, error, refetch } = useDashboard();
  const {
    data: activitiesData,
    isLoading: isLoadingActivities,
    error: activitiesError,
  } = useActivities();

  if (isLoading) {
    return (
      <PageLayout title={DASHBOARD_TITLE} headerIcon={DASHBOARD_HEADER_ICON}>
        <PageLoader message='Loading dashboard data...' />
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout title={DASHBOARD_TITLE} headerIcon={DASHBOARD_HEADER_ICON}>
        <PageError
          title='Failed to load dashboard'
          message={
            error.message || "Unable to fetch dashboard data. Please try again."
          }
          onRetry={() => refetch()}
        />
      </PageLayout>
    );
  }

  if (!data) {
    return (
      <PageLayout title={DASHBOARD_TITLE} headerIcon={DASHBOARD_HEADER_ICON}>
        <PageError
          title='No data available'
          message='Dashboard data is not available at this time.'
        />
      </PageLayout>
    );
  }

  return (
    <PageLayout title={DASHBOARD_TITLE} headerIcon={DASHBOARD_HEADER_ICON}>
      <div data-testid='dashboard-content'>
        <StatsGrid stats={data.stats} />
        <ChartsGrid
          categories={data.categories}
          stores={data.stores}
          stockLevels={data.stockLevels}
          inventoryValue={data.inventoryValue}
        />
        <AlertsSection alerts={data.alerts} />
        <ActivitySection
          activity={activitiesData || []}
          isLoading={isLoadingActivities}
          error={activitiesError}
        />
      </div>
    </PageLayout>
  );
};
