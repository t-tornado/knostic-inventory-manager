import { Typography } from "@mui/material";

interface HeaderTitleProps {
  title: string;
}

export const HeaderTitle = ({ title }: HeaderTitleProps) => {
  return (
    <Typography
      variant='h5'
      sx={{
        fontWeight: 700,
        color: "text.primary",
      }}
    >
      {title}
    </Typography>
  );
};
