import { useEffect } from "react";

/**
 * Keeps optional viewport metrics for sheets/keyboard-aware UI without using
 * visualViewport.height as the app's root height. On some iPhone WebViews
 * visualViewport can be stale and considerably shorter than the rendered
 * viewport, which used to lift the tab bar away from the bottom edge.
 */
export function useIOSViewport() {
  useEffect(() => {
    const updateViewportMetrics = () => {
      const vv = window.visualViewport;
      const layoutHeight = Math.max(
        window.innerHeight || 0,
        document.documentElement.clientHeight || 0,
      );
      const visualHeight = vv?.height ?? layoutHeight;
      const visualTop = vv?.offsetTop ?? 0;

      document.documentElement.style.setProperty(
        "--app-height",
        `${Math.round(layoutHeight)}px`,
      );
      document.documentElement.style.setProperty(
        "--visual-height",
        `${Math.round(visualHeight)}px`,
      );
      document.documentElement.style.setProperty(
        "--visual-offset-top",
        `${Math.round(visualTop)}px`,
      );
    };

    let raf = 0;
    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(updateViewportMetrics);
    };

    updateViewportMetrics();
    window.addEventListener("resize", schedule, { passive: true });
    window.addEventListener("orientationchange", schedule, { passive: true });
    window.visualViewport?.addEventListener("resize", schedule, { passive: true });
    window.visualViewport?.addEventListener("scroll", schedule, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("orientationchange", schedule);
      window.visualViewport?.removeEventListener("resize", schedule);
      window.visualViewport?.removeEventListener("scroll", schedule);
    };
  }, []);
}
