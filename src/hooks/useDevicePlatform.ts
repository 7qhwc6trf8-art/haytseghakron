import { useEffect, useState } from "react";

export type DevicePlatform = "ios" | "android" | "desktop";

function detectPlatform(): DevicePlatform {
  if (typeof navigator === "undefined") return "desktop";

  const ua = navigator.userAgent || "";
  const platform = navigator.platform || "";
  const maxTouchPoints = navigator.maxTouchPoints || 0;

  if (/Android/i.test(ua)) return "android";

  const isiOS = /iPhone|iPad|iPod/i.test(ua) ||
    (/Mac/i.test(platform) && maxTouchPoints > 1);

  return isiOS ? "ios" : "desktop";
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
