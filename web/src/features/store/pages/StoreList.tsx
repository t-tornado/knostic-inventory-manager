import { PageLayout } from "@/app/layout";
import StoreIcon from "@mui/icons-material/Store";

export const StoreList = () => {
  return (
    <PageLayout title='Stores' headerIcon={<StoreIcon />}>
      <div>
        <h1>Store List</h1>
      </div>
    </PageLayout>
  );
};
