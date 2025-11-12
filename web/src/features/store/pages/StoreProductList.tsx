import { PageLayout } from "@/app/layout";
import InventoryIcon from "@mui/icons-material/Inventory";

export const StoreProductList = () => {
  return (
    <PageLayout title='Store Products' headerIcon={<InventoryIcon />}>
      <div>
        <h1>Store Product List</h1>
      </div>
    </PageLayout>
  );
};
