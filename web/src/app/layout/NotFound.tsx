import { PageLayout } from "./PageLayout";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

export const NotFound = () => {
  return (
    <PageLayout title='404 - Page Not Found' headerIcon={<ErrorOutlineIcon />}>
      <div>
        <h1>404 - Page Not Found</h1>
      </div>
    </PageLayout>
  );
};
