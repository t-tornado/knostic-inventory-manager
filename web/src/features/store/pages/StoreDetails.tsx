import { PageLayout } from "@/shared/components/PageLayout";
import StoreIcon from "@mui/icons-material/Store";

export const StoreDetails = () => {
  return (
    <PageLayout title='Store Details' headerIcon={<StoreIcon />}>
      <div>
        <h1>Store Details</h1>
      </div>
    </PageLayout>
  );
};
