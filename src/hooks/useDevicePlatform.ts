import { useEffect, useState } from "react";

export type DevicePlatform = "ios" | "android" | "macos" | "windows" | "gnome";

function detectPlatform(): DevicePlatform {
  if (typeof navigator === "undefined") return "windows";

  const nav = navigator as Navigator & { userAgentData?: { platform?: string } };
  const ua = navigator.userAgent || "";
  const legacyPlatform = navigator.platform || "";
  const hintedPlatform = nav.userAgentData?.platform || "";
  const platform = `${hintedPlatform} ${legacyPlatform} ${ua}`;
  const maxTouchPoints = navigator.maxTouchPoints || 0;

  if (/Android/i.test(ua)) return "android";

  const isiOS = /iPhone|iPad|iPod/i.test(ua) ||
    (/Mac/i.test(legacyPlatform) && maxTouchPoints > 1);
  if (isiOS) return "ios";

  if (/Macintosh|MacIntel|MacPPC|Mac68K|macOS/i.test(platform)) return "macos";
  if (/Windows|Win32|Win64|WinCE/i.test(platform)) return "windows";
  if (/Linux|X11|Ubuntu|Fedora|Debian|GNOME/i.test(platform)) return "gnome";

  // Generic desktop fallback uses the GNOME-style neutral desktop shell rather
  // than accidentally inheriting the touch-first iOS presentation.
  return "gnome";
}

export function useDevicePlatform() {
  const [platform] = useState<DevicePlatform>(() => detectPlatform());

  useEffect(() => {
    document.documentElement.dataset.platform = platform;
    document.body.dataset.platform = platform;
    return () => {
      delete document.documentElement.dataset.platform;
      delete document.body.dataset.platform;
    };
  }, [platform]);

  return platform;
}
