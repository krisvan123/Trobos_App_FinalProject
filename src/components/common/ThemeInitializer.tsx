"use client";

import { useEffect } from "react";
import { useTrobosStore } from "@/store/useTrobosStore";

export const ThemeInitializer: React.FC = () => {
  const theme = useTrobosStore((s) => s.theme);

  useEffect(() => {
    if (typeof document !== "undefined") {
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [theme]);

  return null;
};
