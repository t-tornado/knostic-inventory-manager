import {
  StyledSectionHeaderContainer,
  StyledSectionHeaderTitle,
  StyledSectionHeaderIcon,
  StyledSectionHeaderContent,
  StyledSectionHeaderActions,
} from "./styled";

interface SectionHeaderProps {
  title: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
}

export const SectionHeader = ({ title, icon, actions }: SectionHeaderProps) => {
  return (
    <StyledSectionHeaderContainer>
      <StyledSectionHeaderContent>
        {icon && <StyledSectionHeaderIcon>{icon}</StyledSectionHeaderIcon>}
        <StyledSectionHeaderTitle variant='h6'>
          {title}
        </StyledSectionHeaderTitle>
      </StyledSectionHeaderContent>
      {actions && (
        <StyledSectionHeaderActions>{actions}</StyledSectionHeaderActions>
      )}
    </StyledSectionHeaderContainer>
  );
};
