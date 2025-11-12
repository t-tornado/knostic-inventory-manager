import { PageLayout } from "@/app/layout";
import InventoryIcon from "@mui/icons-material/Inventory";

export const ProductList = () => {
  return (
    <PageLayout title='Products' headerIcon={<InventoryIcon />}>
      <div>
        <h1>Product List</h1>
      </div>
    </PageLayout>
  );
};
