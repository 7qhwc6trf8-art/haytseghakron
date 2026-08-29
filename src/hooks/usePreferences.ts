import { useEffect, useState } from "react";
import type { Appearance, Language } from "../types";

export function usePreferences() {
  const [language, setLanguage] = useState<Language>(() => (localStorage.getItem("ht-language") as Language) || "hy");
  const [appearance, setAppearance] = useState<Appearance>(() => (localStorage.getItem("ht-appearance") as Appearance) || "system");
  const [systemDark, setSystemDark] = useState(() => window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? true);
  const isDark = appearance === "dark" || (appearance === "system" && systemDark);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = (event: MediaQueryListEvent) => setSystemDark(event.matches);
    media.addEventListener?.("change", listener);
    return () => media.removeEventListener?.("change", listener);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = isDark ? "dark" : "light";
    document.documentElement.lang = language;
    localStorage.setItem("ht-language", language);
    localStorage.setItem("ht-appearance", appearance);
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", isDark ? "#000000" : "#f2f2f7");
  }, [appearance, isDark, language]);

  return { language, setLanguage, appearance, setAppearance, isDark };
}
