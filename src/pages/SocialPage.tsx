import type { FollowersData } from "../types";
import type { Translator } from "../data/content";
import { LargeTitle } from "../components/ui/Primitives";
import { SocialList } from "../components/ui/SocialList";
import { RefreshButton } from "../components/ui/DashboardCards";
export function SocialPage({ t, followers, loading, refresh }: { t:Translator; followers:FollowersData; loading:boolean; refresh:()=>void }) { return <><LargeTitle title={t("social")} subtitle={t("connectHint")}/><section className="content-section first-section"><SocialList followers={followers}/><RefreshButton loading={loading} onClick={refresh} idle={t("refresh")} busy={t("refreshing")}/></section></>; }
