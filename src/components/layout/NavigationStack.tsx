import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import type { RouteKey } from "../../types";

export type NavigationDirection = 1 | -1;

const navEase = [0.32, 0.72, 0, 1] as const;

const variants = {
  initial: (direction: NavigationDirection) => ({
    x: direction > 0 ? "100%" : "-24%",
    zIndex: direction > 0 ? 2 : 1,
  }),
  animate: (direction: NavigationDirection) => ({
    x: "0%",
    zIndex: direction > 0 ? 2 : 1,
    transition: { duration: 0.36, ease: navEase },
  }),
  exit: (direction: NavigationDirection) => ({
    x: direction > 0 ? "-24%" : "100%",
    zIndex: direction > 0 ? 1 : 2,
    transition: { duration: 0.36, ease: navEase },
  }),
};

export function NavigationStack({
  route,
  direction,
  children,
}: {
  route: RouteKey;
  direction: NavigationDirection;
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
