import type { DashboardData, DetailPageKey, FollowersData, Language, RouteKey, TabKey } from "../../types";
import type { Translator } from "../../data/content";
import { NavigationBar } from "./NavigationBar";
import { HomePage } from "../../pages/HomePage";
import { SocialPage } from "../../pages/SocialPage";
import { AboutPage } from "../../pages/AboutPage";
import { DetailPage } from "../../pages/DetailPage";

export function ScreenSurface({ route, activeTab, language, t, followers, dashboard, loading, refresh, share, onSettings, openDetail, onBack }: {
  route:RouteKey; activeTab:TabKey; language:Language; t:Translator; followers:FollowersData; dashboard:DashboardData|null; loading:boolean; refresh:()=>void; share:()=>void; onSettings:()=>void; openDetail:(p:DetailPageKey)=>void; onBack:()=>void;
}) {
  const isDetail = !["home","social","about"].includes(route);
  return <div className="screen-surface"><NavigationBar title={t("title")} onShare={share} onSettings={onSettings} onBack={isDetail ? onBack : undefined} backLabel={t("back")}/><div className="app-scroll"><main className="phone-canvas">
    {!isDetail && activeTab==="home" && <HomePage t={t} followers={followers} dashboard={dashboard} loading={loading} refresh={refresh}/>} 
    {!isDetail && activeTab==="social" && <SocialPage t={t} followers={followers} loading={loading} refresh={refresh}/>} 
    {!isDetail && activeTab==="about" && <AboutPage t={t} open={openDetail}/>} 
    {isDetail && <DetailPage page={route as DetailPageKey} language={language}/>} 
    <footer className="footer"><span>© {new Date().getFullYear()} Hay Tseghakron</span></footer>
  </main></div></div>;
}
