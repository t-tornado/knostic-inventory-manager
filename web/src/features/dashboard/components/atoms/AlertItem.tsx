import WarningIcon from "@mui/icons-material/Warning";
import type { LowStockAlert } from "../../types";
import {
  StyledAlertItemContainer,
  StyledAlertItemIcon,
  StyledAlertItemContent,
  StyledAlertItemTitle,
  StyledAlertItemDescription,
  StyledAlertItemButton,
} from "./styled";

interface AlertItemProps {
  data: LowStockAlert;
  onAction?: () => void;
  actionLabel?: string;
}

export const AlertItem = ({
  data,
  onAction,
  actionLabel = "Restock",
}: AlertItemProps) => {
  const title = `${data.productName} - Only ${data.stockQuantity} unit${
    data.stockQuantity !== 1 ? "s" : ""
  } remaining`;

  const description = `Store: ${data.storeName} • Category: ${data.category} • Current Stock: ${data.stockQuantity}`;

  return (
    <StyledAlertItemContainer
      data-testid={`alert-item-${data.productId}-${data.storeId}`}
    >
      <StyledAlertItemIcon>
        <WarningIcon fontSize='small' sx={{ color: "primary.contrastText" }} />
      </StyledAlertItemIcon>
      <StyledAlertItemContent>
        <StyledAlertItemTitle
          variant='subtitle2'
          data-testid='alert-product-name'
        >
          {title}
        </StyledAlertItemTitle>
        <StyledAlertItemDescription
          variant='caption'
          data-testid='alert-store-name'
        >
          {description}
        </StyledAlertItemDescription>
      </StyledAlertItemContent>
      <StyledAlertItemButton
        variant='contained'
        size='small'
        onClick={onAction}
        disabled
      >
        {actionLabel}
      </StyledAlertItemButton>
    </StyledAlertItemContainer>
  );
};
