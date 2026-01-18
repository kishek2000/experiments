"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  colors: typeof lightColors;
}

// Light theme colors (Atlassian Design System)
const lightColors = {
  // Surfaces
  surfaceDefault: "#FFFFFF",
  surfaceRaised: "#FFFFFF",
  surfaceSunken: "#F4F5F7",
  surfaceHovered: "#EBECF0",
  
  // Text
  textDefault: "#172B4D",
  textSubtle: "#6B778C",
  textSubtlest: "#8993A4",
  textInverse: "#FFFFFF",
  textBrand: "#0052CC",
  
  // Borders
  border: "#DFE1E6",
  borderBold: "#C1C7D0",
  
  // Brand
  blue500: "#0052CC",
  blue600: "#0747A6",
  blue100: "#DEEBFF",
  blue200: "#B3D4FF",
  blue50: "#E6F2FF",
  green500: "#36B37E",
  green100: "#E3FCEF",
  green700: "#006644",
  red500: "#DE350B",
  red100: "#FFEBE6",
  red700: "#BF2600",
  yellow500: "#FFAB00",
  yellow100: "#FFFAE6",
  yellow300: "#FFE380",
  yellow700: "#FF8B00",
  yellow900: "#5C3D00",
  purple500: "#6554C0",
  purple100: "#EAE6FF",
  purple700: "#403294",
  teal500: "#00B8D9",
  teal100: "#E6FCFF",
  teal700: "#008DA6",
  
  // Backgrounds
  backgroundDefault: "#FFFFFF",
  backgroundBrandBold: "#0052CC",
  backgroundNeutral: "#F4F5F7",
  backgroundNeutralHovered: "#EBECF0",
  backgroundSelected: "#DEEBFF",
  backgroundSuccess: "#E3FCEF",
  backgroundDanger: "#FFEBE6",
  backgroundWarning: "#FFFAE6",
  backgroundInformation: "#DEEBFF",
  
  // Links
  linkDefault: "#0052CC",
  
  // Shadows
  shadowColor: "rgba(9, 30, 66, 0.15)",
};

// Dark theme colors (Atlassian Design System Dark)
const darkColors = {
  // Surfaces
  surfaceDefault: "#1D2125",
  surfaceRaised: "#22272B",
  surfaceSunken: "#161A1D",
  surfaceHovered: "#282E33",
  
  // Text
  textDefault: "#B6C2CF",
  textSubtle: "#8C9BAB",
  textSubtlest: "#626F86",
  textInverse: "#1D2125",
  textBrand: "#579DFF",
  
  // Borders
  border: "#3D4750",
  borderBold: "#505A66",
  
  // Brand (adjusted for dark mode)
  blue500: "#579DFF",
  blue600: "#388BFF",
  blue100: "#09326C",
  blue200: "#0055CC",
  blue50: "#082145",
  green500: "#4BCE97",
  green100: "#164B35",
  green700: "#7EE2B8",
  red500: "#F87168",
  red100: "#5D1F1A",
  red700: "#FF9C8F",
  yellow500: "#F5CD47",
  yellow100: "#533F04",
  yellow300: "#D9A514",
  yellow700: "#FFDE5D",
  yellow900: "#FFDE5D",
  purple500: "#9F8FEF",
  purple100: "#352C63",
  purple700: "#B8ACF6",
  teal500: "#6CC3E0",
  teal100: "#164555",
  teal700: "#8BDBE5",
  
  // Backgrounds
  backgroundDefault: "#1D2125",
  backgroundBrandBold: "#0C66E4",
  backgroundNeutral: "#22272B",
  backgroundNeutralHovered: "#2C333A",
  backgroundSelected: "#09326C",
  backgroundSuccess: "#164B35",
  backgroundDanger: "#5D1F1A",
  backgroundWarning: "#533F04",
  backgroundInformation: "#09326C",
  
  // Links
  linkDefault: "#579DFF",
  
  // Shadows
  shadowColor: "rgba(0, 0, 0, 0.35)",
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  
  useEffect(() => {
    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
    }
  }, []);
  
  useEffect(() => {
    // Update document attribute for any CSS that needs it
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);
  
  const toggleTheme = () => {
    setTheme(prev => prev === "light" ? "dark" : "light");
  };
  
  const colors = theme === "light" ? lightColors : darkColors;
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

// Export color types for components that need them
export type { Theme };
export { lightColors, darkColors };

