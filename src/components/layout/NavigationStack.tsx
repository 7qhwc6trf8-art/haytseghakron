import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import type { RouteKey } from "../../types";
import type { DevicePlatform } from "../../hooks/useDevicePlatform";

export type NavigationDirection = 1 | -1;

const iosEase = [0.32, 0.72, 0, 1] as const;
const androidEase = [0.2, 0, 0, 1] as const;

const iosVariants = {
  initial: (direction: NavigationDirection) => ({
    x: direction > 0 ? "100%" : "-24%",
    opacity: 1,
    scale: 1,
    zIndex: direction > 0 ? 2 : 1,
  }),
  animate: (direction: NavigationDirection) => ({
    x: "0%",
    opacity: 1,
    scale: 1,
    zIndex: direction > 0 ? 2 : 1,
    transition: { duration: 0.36, ease: iosEase },
  }),
  exit: (direction: NavigationDirection) => ({
    x: direction > 0 ? "-24%" : "100%",
    opacity: 1,
    scale: 1,
    zIndex: direction > 0 ? 1 : 2,
    transition: { duration: 0.36, ease: iosEase },
  }),
};

/* Material 3 shared-axis style: shorter travel, subtle fade/scale and a
   quicker emphasized curve. It feels native on Android and is cheaper to
   composite than moving an entire page by 100vw. */
const androidVariants = {
  initial: (direction: NavigationDirection) => ({
    x: direction > 0 ? "14%" : "-8%",
    opacity: 0.72,
    scale: 0.985,
    zIndex: direction > 0 ? 2 : 1,
  }),
  animate: (direction: NavigationDirection) => ({
    x: "0%",
    opacity: 1,
    scale: 1,
    zIndex: direction > 0 ? 2 : 1,
    transition: { duration: 0.28, ease: androidEase },
  }),
  exit: (direction: NavigationDirection) => ({
    x: direction > 0 ? "-8%" : "14%",
    opacity: 0.78,
    scale: 0.985,
    zIndex: direction > 0 ? 1 : 2,
    transition: { duration: 0.22, ease: androidEase },
  }),
};

export function NavigationStack({
  route,
  direction,
  platform,
  children,
}: {
  route: RouteKey;
  direction: NavigationDirection;
  platform: DevicePlatform;
  children: ReactNode;
}) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className="stack-viewport"><div className="stack-page-layer">{children}</div></div>;
  }

  const variants = platform === "android" ? androidVariants : iosVariants;

  return (
    <div className="stack-viewport">
      <AnimatePresence initial={false} mode="sync" custom={direction}>
        <motion.div
          key={route}
          className="stack-page-layer"
          custom={direction}
          variants={variants}
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
