import type { ButtonProps } from "@mui/material";
import { StyledFilterButton } from "./styled";

interface FilterButtonProps extends Omit<ButtonProps, "variant"> {
  active?: boolean;
}

export const FilterButton = ({
  active = false,
  children,
  ...props
}: FilterButtonProps) => {
  return (
    <StyledFilterButton
      variant={active ? "contained" : "outlined"}
      size='small'
      {...props}
    >
      {children}
    </StyledFilterButton>
  );
};
