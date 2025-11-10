import styled from "styled-components";
import { useThemeMode } from "@/app/providers";

const ToggleButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.9rem;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.accent};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 2px;
  }
`;

const Indicator = styled.span<{ $active: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${({ theme, $active }) =>
    $active ? theme.colors.accent : theme.colors.border};
  transition: background 0.2s ease;
`;

export default function ThemeToggle() {
  const { themeMode, toggleTheme } = useThemeMode();
  const isDark = themeMode === "dark";

  return (
    <ToggleButton
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle color theme"
      aria-pressed={isDark}
    >
      <Indicator $active={isDark} />
      {isDark ? "Dark mode" : "Light mode"}
    </ToggleButton>
  );
}

