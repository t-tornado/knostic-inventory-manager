import { Button } from "@mui/material";
import type { ButtonProps } from "@mui/material";

interface FilterButtonProps extends Omit<ButtonProps, "variant"> {
  active?: boolean;
}

export const FilterButton = ({
  active = false,
  children,
  ...props
}: FilterButtonProps) => {
  return (
    <Button
      variant={active ? "contained" : "outlined"}
      size='small'
      sx={{
        minWidth: "auto",
        px: 1.5,
        py: 0.75,
        fontSize: 13,
        textTransform: "none",
        fontWeight: 500,
        borderRadius: 2,
        ...props.sx,
      }}
      {...props}
    >
      {children}
    </Button>
  );
};
