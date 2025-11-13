import { Box } from "@mui/material";
import {
  StyledSectionHeaderContainer,
  StyledSectionHeaderTitle,
  StyledSectionHeaderIcon,
} from "./styled";

interface SectionHeaderProps {
  title: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
}

export const SectionHeader = ({ title, icon, actions }: SectionHeaderProps) => {
  return (
    <StyledSectionHeaderContainer>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {icon && <StyledSectionHeaderIcon>{icon}</StyledSectionHeaderIcon>}
        <StyledSectionHeaderTitle variant='h6'>
          {title}
        </StyledSectionHeaderTitle>
      </Box>
      {actions && <Box>{actions}</Box>}
    </StyledSectionHeaderContainer>
  );
};
