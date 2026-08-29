import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from "framer-motion";
import "./App.css";
import type { DashboardData, DetailPageKey, FollowersData, RouteKey, TabKey } from "./types";
import { copy, type Translator } from "./data/content";
import { fetchDashboard, fetchFollowers, trackVisit } from "./services/api";
import { useIOSViewport } from "./hooks/useIOSViewport";
import { usePreferences } from "./hooks/usePreferences";
import { lightHaptic } from "./utils/haptics";
import { ScreenSurface } from "./components/layout/ScreenSurface";
import { TabBar } from "./components/layout/TabBar";
import { SettingsSheet } from "./components/settings/SettingsSheet";
import { iosSpring } from "./components/ui/Primitives";

const navEase = [0.32, 0.72, 0, 1] as const;
const tabOrder: TabKey[] = ["home", "social", "about"];

function RouteLayer({ direction, children }: { direction:number; children:React.ReactNode }) {
  const reduce = useReducedMotion();
  return <motion.div className="stack-page-layer" initial={reduce ? false : { x: direction >= 0 ? "100%" : "-24%" }} animate={{ x: 0 }} exit={reduce ? undefined : { x: direction >= 0 ? "-24%" : "100%" }} transition={reduce ? {duration:0} : {duration:.34,ease:navEase}}>{children}</motion.div>;
}

export default function App() {
  useIOSViewport();
  const { language, setLanguage, appearance, setAppearance } = usePreferences();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>("home");
  const [route, setRoute] = useState<RouteKey>("home");
  const [direction, setDirection] = useState(1);
  const [loading, setLoading] = useState(false);
  const [followers, setFollowers] = useState<FollowersData>({ instagram:1482, telegram:251, twitter:2, tiktok:459, threads:0 });
  const [dashboard, setDashboard] = useState<DashboardData|null>(null);
  const t: Translator = (key) => copy[language][key] as string;

  useEffect(() => { trackVisit(); fetchDashboard().then(data => { setDashboard(data); if (data.followers) setFollowers({instagram:data.followers.instagram??0,telegram:data.followers.telegram??0,twitter:data.followers.twitter??0,tiktok:data.followers.tiktok??0,threads:data.followers.threads??0}); }).catch(()=>undefined); }, []);

  const refresh = async () => { if (loading) return; setLoading(true); try { setFollowers(await fetchFollowers()); } finally { setLoading(false); } };
  const share = async () => { try { if (navigator.share) await navigator.share({title:t("title"),text:t("subtitle"),url:window.location.href}); else await navigator.clipboard.writeText(window.location.href); } catch { /* cancellation */ } };

  const selectTab = (next:TabKey) => {
    lightHaptic();
    if (next===activeTab && route===next) { document.querySelector(".app-scroll")?.scrollTo({top:0,behavior:"smooth"}); return; }
    setDirection(tabOrder.indexOf(next) >= tabOrder.indexOf(activeTab) ? 1 : -1); setActiveTab(next); setRoute(next);
  };
  const openDetail = (page:DetailPageKey) => { lightHaptic(); setDirection(1); setRoute(page); };
  const back = () => { lightHaptic(); setDirection(-1); setRoute(activeTab); };
  const labels = useMemo(()=>({home:t("home"),social:t("social"),about:t("about")}),[language]);

  return <MotionConfig reducedMotion="user" transition={iosSpring}><div className="app-shell"><div className="stack-viewport"><AnimatePresence mode="sync" initial={false} custom={direction}><RouteLayer key={route} direction={direction}><ScreenSurface route={route} activeTab={activeTab} language={language} t={t} followers={followers} dashboard={dashboard} loading={loading} refresh={refresh} share={share} onSettings={()=>setSettingsOpen(true)} openDetail={openDetail} onBack={back}/></RouteLayer></AnimatePresence></div>
    <TabBar active={activeTab} onSelect={selectTab} labels={labels}/>
    <SettingsSheet open={settingsOpen} onClose={()=>setSettingsOpen(false)} language={language} setLanguage={setLanguage} appearance={appearance} setAppearance={setAppearance} t={t}/>
  </div></MotionConfig>;
}
