import { Box, Button, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
/**
 *
 * The idea is simple, keep the core components more cleaner. inline styling pollutes the code and makes it harder to read.
 *
 */

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

export const StyledSectionHeaderContent = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
}));

export const StyledSectionHeaderActions = styled(Box)({});

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

export const StyledActivityList = styled(Box)(({ theme }) => ({
  maxHeight: "400px",
  overflowY: "auto",
  marginTop: theme.spacing(2),
}));

export const StyledEmptyState = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: "center",
}));

export const StyledLoadingContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  padding: theme.spacing(3),
}));

export const StyledErrorState = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: "center",
}));

export const StyledChartsGrid = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: theme.spacing(3),
  marginBottom: theme.spacing(3),
  [theme.breakpoints.up("lg")]: {
    gridTemplateColumns: "repeat(2, 1fr)",
  },
}));

export const StyledStatsGrid = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: theme.spacing(3),
  marginBottom: theme.spacing(3),
  [theme.breakpoints.up("sm")]: {
    gridTemplateColumns: "repeat(2, 1fr)",
  },
  [theme.breakpoints.up("md")]: {
    gridTemplateColumns: "repeat(4, 1fr)",
  },
}));

export const StyledStatCard = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(3),
  padding: theme.spacing(4),
  boxShadow: theme.shadows[1],
  transition: "all 0.3s",
  border: `1px solid ${theme.palette.divider}`,
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: theme.shadows[2],
  },
}));

export const StyledStatCardContent = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
}));

export const StyledStatCardIcon = styled(Box)<{
  bgcolor: string;
  iconColor: string;
}>(({ theme, bgcolor, iconColor }) => ({
  width: 56,
  height: 56,
  borderRadius: theme.spacing(2),
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 24,
  marginBottom: theme.spacing(1),
  backgroundColor: bgcolor,
  color: iconColor,
}));

export const StyledStatCardTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: 13,
  fontWeight: 500,
  textTransform: "uppercase",
  letterSpacing: 0.5,
  lineHeight: 1.2,
}));

export const StyledStatCardValue = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: theme.palette.text.primary,
  fontSize: "1.75rem",
}));

export const StyledStatCardChange = styled(Box)<{
  isPositive: boolean;
}>(({ theme, isPositive }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(0.5),
  fontSize: 13,
  color: isPositive ? theme.palette.success.main : theme.palette.error.main,
}));

export const StyledStatCardChangeText = styled(Typography)({
  fontSize: 13,
});
