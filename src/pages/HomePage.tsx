import type { DashboardData, FollowersData } from "../types";
import type { Translator } from "../data/content";
import { LargeTitle, SectionHeader } from "../components/ui/Primitives";
import { Overview, RefreshButton } from "../components/ui/DashboardCards";
import { SocialList } from "../components/ui/SocialList";
import { CommunityCard } from "../components/ui/CommunityCard";

export function HomePage({ t, followers, dashboard, loading, refresh }: { t:Translator; followers:FollowersData; dashboard:DashboardData|null; loading:boolean; refresh:()=>void }) {
  return <><LargeTitle title={t("home")} subtitle={t("subtitle")}/><section className="profile-header"><div className="profile-avatar"><img src="/haytseghakron-white-transparent.png" alt="Hay Tseghakron"/><span className="presence-dot"/></div><div className="profile-copy"><h2>{t("title")}</h2><p>{t("subtitle")}</p><span className="status-line"><i/>{t("live")}</span></div></section>
    <section className="content-section"><SectionHeader title={t("overview")}/><Overview followers={followers} dashboard={dashboard} labels={[t("followers"),t("visits"),t("unique")]}/></section>
    <section className="content-section"><SectionHeader title={t("connect")} subtitle={t("connectHint")} trailing={t("official")}/><SocialList followers={followers}/><RefreshButton loading={loading} onClick={refresh} idle={t("refresh")} busy={t("refreshing")}/></section>
    <section className="content-section"><CommunityCard eyebrow={t("community")} title={t("communityTitle")} body={t("communityBody")} active247={t("active247")} growing={t("growing")} quote={t("quote")}/></section></>;
}
