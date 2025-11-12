import { Box, Typography, Card, CardContent } from "@mui/material";
import StoreIconMUI from "@mui/icons-material/Store";
import LinkIcon from "@mui/icons-material/Link";
import type { SxProps, Theme } from "@mui/material";

export const StoreInfoCard = ({ children }: { children: React.ReactNode }) => (
  <Card
    sx={{
      borderRadius: 3,
      boxShadow: 1,
      border: 1,
      borderColor: "divider",
      flexShrink: 0,
    }}
  >
    <CardContent sx={{ p: 2 }}>{children}</CardContent>
  </Card>
);

export const StoreInfoHeader = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      mb: 2,
    }}
  >
    {children}
  </Box>
);

export const StoreInfoMain = ({ children }: { children: React.ReactNode }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 1.5,
    }}
  >
    {children}
  </Box>
);

export const StoreInfoDetails = ({
  children,
}: {
  children: React.ReactNode;
}) => <Box sx={{ flex: 1 }}>{children}</Box>;

export const StoreInfoActions = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <Box
    sx={{
      display: "flex",
      gap: 1.5,
    }}
  >
    {children}
  </Box>
);

export const StoreStats = ({ children }: { children: React.ReactNode }) => (
  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: {
        xs: "1fr",
        sm: "repeat(2, 1fr)",
        md: "repeat(4, 1fr)",
      },
      gap: 2,
      pt: 2,
      borderTop: 1,
      borderColor: "divider",
    }}
  >
    {children}
  </Box>
);

export const StoreName = ({ children }: { children: React.ReactNode }) => (
  <Typography
    variant='h5'
    sx={{
      fontWeight: 700,
      mb: 0.5,
      color: "text.primary",
      fontSize: "1.25rem",
    }}
  >
    {children}
  </Typography>
);

interface StoreStatProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  iconColor?: "primary" | "success" | "warning" | "info";
}

const iconColorMap: Record<
  "primary" | "success" | "warning" | "info",
  SxProps<Theme>
> = {
  primary: {
    bgcolor: (theme) => `${theme.palette.primary.main}1A`,
    color: "primary.main",
  },
  success: {
    bgcolor: (theme) => `${theme.palette.success.main}1A`,
    color: "success.main",
  },
  warning: {
    bgcolor: (theme) => `${theme.palette.warning.main}1A`,
    color: "warning.main",
  },
  info: {
    bgcolor: (theme) => `${theme.palette.info.main}1A`,
    color: "info.main",
  },
};

export const StoreStat = ({
  icon,
  label,
  value,
  iconColor = "primary",
}: StoreStatProps) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      gap: 0.5,
    }}
  >
    <Box
      sx={{
        width: 32,
        height: 32,
        borderRadius: 1.5,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 16,
        mb: 0.5,
        ...iconColorMap[iconColor],
      }}
    >
      {icon}
    </Box>
    <Typography
      variant='overline'
      sx={{
        color: "text.secondary",
        fontSize: 11,
        fontWeight: 500,
        textTransform: "uppercase",
        letterSpacing: 0.5,
        lineHeight: 1.2,
      }}
    >
      {label}
    </Typography>
    <Typography
      variant='h6'
      sx={{
        fontWeight: 700,
        color: "text.primary",
        fontSize: "1rem",
      }}
    >
      {value}
    </Typography>
  </Box>
);

export const StoreIcon = ({ size = 80 }: { size?: number }) => (
  <Box
    sx={{
      width: size,
      height: size,
      borderRadius: 3,
      background: (theme) =>
        `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      boxShadow: 2,
    }}
  >
    <StoreIconMUI sx={{ fontSize: size * 0.45 }} />
  </Box>
);

interface StoreIdProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  isLink?: boolean;
}

export const StoreId = ({ children, isLink, ...props }: StoreIdProps) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 1,
      cursor: isLink ? "pointer" : "default",
    }}
    {...props}
  >
    {isLink && <LinkIcon />}
    <Typography
      variant='body2'
      sx={{
        color: "text.secondary",
        fontFamily: "monospace",
        fontSize: 14,
        cursor: isLink ? "pointer" : "default",
      }}
    >
      ID: {children}
    </Typography>
  </Box>
);
