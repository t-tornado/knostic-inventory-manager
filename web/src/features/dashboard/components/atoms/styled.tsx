import { Box, Button, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

export const StyledSectionCard = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(3),
  padding: theme.spacing(3),
  boxShadow: theme.shadows[1],
  border: `1px solid ${theme.palette.divider}`,
  marginBottom: theme.spacing(3),
}));

export const StyledSectionHeaderContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: theme.spacing(2.5),
}));

export const StyledSectionHeaderTitle = styled(Typography)(({ theme }) => ({
  fontSize: 18,
  fontWeight: 600,
  color: theme.palette.text.primary,
}));

export const StyledSectionHeaderIcon = styled(Box)(({ theme }) => ({
  color: theme.palette.error.main,
  display: "flex",
  alignItems: "center",
}));

export const StyledFilterButton = styled(Button)(({ theme }) => ({
  minWidth: "auto",
  paddingLeft: theme.spacing(1.5),
  paddingRight: theme.spacing(1.5),
  paddingTop: theme.spacing(0.75),
  paddingBottom: theme.spacing(0.75),
  fontSize: 13,
  textTransform: "none",
  fontWeight: 500,
  borderRadius: theme.spacing(2),
}));

export const StyledChartCard = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(3),
  padding: theme.spacing(3),
  boxShadow: theme.shadows[1],
  border: `1px solid ${theme.palette.divider}`,
}));

export const StyledChartCardHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: theme.spacing(3),
}));

export const StyledChartCardIcon = styled(Box)(({ theme }) => ({
  color: theme.palette.primary.main,
  display: "flex",
  alignItems: "center",
}));

export const StyledChartCardTitle = styled(Typography)(({ theme }) => ({
  fontSize: 18,
  fontWeight: 600,
  color: theme.palette.text.primary,
}));

export const StyledChartCardContent = styled(Box)({
  position: "relative",
  height: 300,
});

export const StyledAlertItemContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  borderRadius: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
  marginBottom: theme.spacing(1.5),
  transition: "all 0.2s",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

export const StyledAlertItemIcon = styled(Box)(({ theme }) => ({
  width: 40,
  height: 40,
  borderRadius: "50%",
  backgroundColor: theme.palette.error.light,
  color: theme.palette.error.main,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
}));

export const StyledAlertItemContent = styled(Box)({
  flex: 1,
  minWidth: 0,
});

export const StyledAlertItemTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(0.5),
}));

export const StyledAlertItemDescription = styled(Typography)(({ theme }) => ({
  fontSize: 13,
  color: theme.palette.text.secondary,
}));

export const StyledAlertItemButton = styled(Button)(({ theme }) => ({
  textTransform: "none",
  fontWeight: 500,
  fontSize: 13,
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  flexShrink: 0,
}));

export const StyledActivityItemContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(2),
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  "&:last-child": {
    borderBottom: "none",
  },
}));

export const StyledActivityItemIcon = styled(Box)<{
  bgcolor: string;
  color: string;
}>(({ bgcolor, color }) => ({
  width: 40,
  height: 40,
  borderRadius: "50%",
  backgroundColor: bgcolor,
  color: color,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
}));

export const StyledActivityItemContent = styled(Box)({
  flex: 1,
  minWidth: 0,
});

export const StyledActivityItemText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(0.5),
}));

export const StyledActivityItemTime = styled(Typography)(({ theme }) => ({
  fontSize: 13,
  color: theme.palette.text.secondary,
}));
