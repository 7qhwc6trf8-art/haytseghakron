import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import type { RouteKey } from "../../types";
import type { DevicePlatform } from "../../hooks/useDevicePlatform";

export type NavigationDirection = 1 | -1;

const iosEase = [0.32, 0.72, 0, 1] as const;
const androidEase = [0.2, 0, 0, 1] as const;
const macEase = [0.22, 0.78, 0.18, 1] as const;
const windowsEase = [0.1, 0.9, 0.2, 1] as const;
const gnomeEase = [0.25, 0.1, 0.25, 1] as const;

const iosVariants = {
  initial: (direction: NavigationDirection) => ({
    x: direction > 0 ? "100%" : "-24%",
    opacity: 1,
    scale: 1,
    zIndex: direction > 0 ? 2 : 1,
  }),
  animate: (direction: NavigationDirection) => ({
    x: "0%", opacity: 1, scale: 1, zIndex: direction > 0 ? 2 : 1,
    transition: { duration: 0.36, ease: iosEase },
  }),
  exit: (direction: NavigationDirection) => ({
    x: direction > 0 ? "-24%" : "100%", opacity: 1, scale: 1,
    zIndex: direction > 0 ? 1 : 2,
    transition: { duration: 0.36, ease: iosEase },
  }),
};

const androidVariants = {
  initial: (direction: NavigationDirection) => ({
    x: direction > 0 ? "14%" : "-8%", opacity: 0.72, scale: 0.985,
    zIndex: direction > 0 ? 2 : 1,
  }),
  animate: (direction: NavigationDirection) => ({
    x: "0%", opacity: 1, scale: 1, zIndex: direction > 0 ? 2 : 1,
    transition: { duration: 0.28, ease: androidEase },
  }),
  exit: (direction: NavigationDirection) => ({
    x: direction > 0 ? "-8%" : "14%", opacity: 0.78, scale: 0.985,
    zIndex: direction > 0 ? 1 : 2,
    transition: { duration: 0.22, ease: androidEase },
  }),
};

// macOS navigation uses a restrained cross-slide/fade like a split-view
// content replacement rather than the full-screen iPhone push gesture.
const macVariants = {
  initial: (direction: NavigationDirection) => ({
    x: direction > 0 ? 28 : -18, opacity: 0, scale: 0.995, zIndex: 2,
  }),
  animate: () => ({
    x: 0, opacity: 1, scale: 1, zIndex: 2,
    transition: { duration: 0.26, ease: macEase },
  }),
  exit: (direction: NavigationDirection) => ({
    x: direction > 0 ? -18 : 28, opacity: 0, scale: 0.995, zIndex: 1,
    transition: { duration: 0.2, ease: macEase },
  }),
};

// Windows 11 Fluent-style navigation: short translation + fade, matching
// NavigationView content transitions and avoiding touch-style long travel.
const windowsVariants = {
  initial: (direction: NavigationDirection) => ({
    x: direction > 0 ? 38 : -26, opacity: 0, scale: 0.992, zIndex: 2,
  }),
  animate: () => ({
    x: 0, opacity: 1, scale: 1, zIndex: 2,
    transition: { duration: 0.24, ease: windowsEase },
  }),
  exit: (direction: NavigationDirection) => ({
    x: direction > 0 ? -22 : 34, opacity: 0, scale: 0.994, zIndex: 1,
    transition: { duration: 0.17, ease: windowsEase },
  }),
};

// GNOME/libadwaita pages use a compact slide/fade similar to navigation-view.
const gnomeVariants = {
  initial: (direction: NavigationDirection) => ({
    x: direction > 0 ? 32 : -24, opacity: 0, scale: 1, zIndex: 2,
  }),
  animate: () => ({
    x: 0, opacity: 1, scale: 1, zIndex: 2,
    transition: { duration: 0.25, ease: gnomeEase },
  }),
  exit: (direction: NavigationDirection) => ({
    x: direction > 0 ? -22 : 32, opacity: 0, scale: 1, zIndex: 1,
    transition: { duration: 0.19, ease: gnomeEase },
  }),
};

function variantsFor(platform: DevicePlatform) {
  if (platform === "android") return androidVariants;
  if (platform === "macos") return macVariants;
  if (platform === "windows") return windowsVariants;
  if (platform === "gnome") return gnomeVariants;
  return iosVariants;
}

export function NavigationStack({ route, direction, platform, children }: {
  route: RouteKey;
  direction: NavigationDirection;
  platform: DevicePlatform;
  children: ReactNode;
}) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className="stack-viewport"><div className="stack-page-layer">{children}</div></div>;
  }

  return (
    <div className="stack-viewport">
      <AnimatePresence initial={false} mode="sync" custom={direction}>
        <motion.div
          key={route}
          className="stack-page-layer"
          custom={direction}
          variants={variantsFor(platform)}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
