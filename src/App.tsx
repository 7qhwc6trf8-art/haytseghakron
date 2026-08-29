import { useEffect, useMemo, useState } from "react";
import { MotionConfig } from "framer-motion";
import "./App.css";
import type { DashboardData, DetailPageKey, FollowersData, RouteKey, TabKey } from "./types";
import { copy, type Translator } from "./data/content";
import { fetchDashboard, fetchFollowers, trackVisit } from "./services/api";
import { useIOSViewport } from "./hooks/useIOSViewport";
import { usePreferences } from "./hooks/usePreferences";
import { useDevicePlatform } from "./hooks/useDevicePlatform";
import { lightHaptic } from "./utils/haptics";
import { ScreenSurface } from "./components/layout/ScreenSurface";
import { NavigationStack, type NavigationDirection } from "./components/layout/NavigationStack";
import { TabBar } from "./components/layout/TabBar";
import { SettingsSheet } from "./components/settings/SettingsSheet";
import { androidMotion, gnomeMotion, iosSpring, macMotion, windowsMotion } from "./components/ui/Primitives";

const tabOrder: TabKey[] = ["home", "social", "about"];

export default function App() {
  useIOSViewport();
  const platform = useDevicePlatform();
  const { language, setLanguage, appearance, setAppearance, isDark } = usePreferences();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>("home");
  const [route, setRoute] = useState<RouteKey>("home");
  const [direction, setDirection] = useState<NavigationDirection>(1);
  const [loading, setLoading] = useState(false);
  const [followers, setFollowers] = useState<FollowersData>({ instagram:1482, telegram:251, twitter:2, tiktok:459, threads:0 });
  const [dashboard, setDashboard] = useState<DashboardData|null>(null);
  const t: Translator = (key) => copy[language][key] as string;

  useEffect(() => {
    const themeColors = {
      ios: isDark ? "#000000" : "#f2f2f7",
      android: isDark ? "#111318" : "#f8f9ff",
      macos: isDark ? "#1c1c1e" : "#f5f5f7",
      windows: isDark ? "#202020" : "#f3f3f3",
      gnome: isDark ? "#1e1e1e" : "#fafafa",
    } as const;
    document.querySelector('meta[name="theme-color"]')?.setAttribute(
      "content",
      themeColors[platform],
    );
  }, [platform, isDark]);

  useEffect(() => {
    trackVisit();
    fetchDashboard().then(data => {
      setDashboard(data);
      if (data.followers) {
        setFollowers({
          instagram:data.followers.instagram??0,
          telegram:data.followers.telegram??0,
          twitter:data.followers.twitter??0,
          tiktok:data.followers.tiktok??0,
          threads:data.followers.threads??0,
        });
      }
    }).catch(()=>undefined);
  }, []);

  const refresh = async () => {
    if (loading) return;
    setLoading(true);
    try { setFollowers(await fetchFollowers()); }
    finally { setLoading(false); }
  };

  const share = async () => {
    try {
      if (navigator.share) await navigator.share({title:t("title"),text:t("subtitle"),url:window.location.href});
      else await navigator.clipboard.writeText(window.location.href);
    } catch { /* user cancelled */ }
  };

  const selectTab = (next:TabKey) => {
    lightHaptic();

    // Reselecting the visible tab behaves like iOS: scroll to top.
    if (next === activeTab && route === next) {
      document.querySelector(".app-scroll")?.scrollTo({top:0,behavior:"smooth"});
      return;
    }

    // If a detail screen is open, tapping its parent tab pops back instead of
    // incorrectly pushing the parent page from the right.
    if (next === activeTab && route !== next) {
      setDirection(-1);
      setRoute(next);
      return;
    }

    const currentIndex = tabOrder.indexOf(activeTab);
    const nextIndex = tabOrder.indexOf(next);
    setDirection(nextIndex >= currentIndex ? 1 : -1);
    setActiveTab(next);
    setRoute(next);
  };

  const openDetail = (page:DetailPageKey) => {
    lightHaptic();
    setDirection(1);
    setRoute(page);
  };

  const back = () => {
    lightHaptic();
    setDirection(-1);
    setRoute(activeTab);
  };

  const labels = useMemo(()=>({home:t("home"),social:t("social"),about:t("about")}),[language]);

  const platformMotion = platform === "android"
    ? androidMotion
    : platform === "macos"
      ? macMotion
      : platform === "windows"
        ? windowsMotion
        : platform === "gnome"
          ? gnomeMotion
          : iosSpring;

  return (
    <MotionConfig reducedMotion="user" transition={platformMotion}>
      <div className={`app-shell platform-${platform}${settingsOpen ? " modal-open" : ""}`}>
        <NavigationStack route={route} direction={direction} platform={platform}>
          <ScreenSurface
            route={route}
            language={language}
            t={t}
            followers={followers}
            dashboard={dashboard}
            loading={loading}
            refresh={refresh}
            share={share}
            onSettings={()=>setSettingsOpen(true)}
            openDetail={openDetail}
            onBack={back}
          />
        </NavigationStack>

        <TabBar active={activeTab} onSelect={selectTab} labels={labels}/>

        <SettingsSheet
          open={settingsOpen}
          onClose={()=>setSettingsOpen(false)}
          language={language}
          setLanguage={setLanguage}
          appearance={appearance}
          setAppearance={setAppearance}
          t={t}
          platform={platform}
        />
      </div>
    </MotionConfig>
  );
}
