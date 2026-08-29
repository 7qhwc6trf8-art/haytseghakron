import { Building2, CircleHelp, Clock3, Handshake, History, Mail, Newspaper, ShieldCheck, UsersRound } from "lucide-react";
import type { DetailPageKey } from "../types";
import type { Translator } from "../data/content";
import { LargeTitle, MenuRow, SectionHeader } from "../components/ui/Primitives";

export function AboutPage({ t, open }: { t:Translator; open:(page:DetailPageKey)=>void }) {
  const rows = [
    { key:"services" as const, icon:<Building2 size={19}/>, title:t("services"), subtitle:t("servicesSub") },
    { key:"staff" as const, icon:<UsersRound size={19}/>, title:t("staff"), subtitle:t("staffSub") },
    { key:"history" as const, icon:<History size={19}/>, title:t("history"), subtitle:t("historySub") },
    { key:"contact" as const, icon:<Mail size={19}/>, title:t("contact"), subtitle:t("contactSub") },
    { key:"faq" as const, icon:<CircleHelp size={19}/>, title:t("faq"), subtitle:t("faqSub") },
    { key:"news" as const, icon:<Newspaper size={19}/>, title:t("news"), subtitle:t("newsSub") },
    { key:"partners" as const, icon:<Handshake size={19}/>, title:t("partners"), subtitle:t("partnersSub") },
    { key:"privacy" as const, icon:<ShieldCheck size={19}/>, title:t("privacy"), subtitle:t("privacySub") },
  ];
  return <><LargeTitle title={t("about")} subtitle={t("aboutBody")}/><section className="content-section first-section"><SectionHeader title={t("explore")}/><div className="ios-group client-menu">{rows.map(row=><MenuRow key={row.key} icon={row.icon} title={row.title} subtitle={row.subtitle} onClick={()=>open(row.key)}/>)}</div></section><section className="content-section"><div className="ios-group about-panel"><div className="about-hero"><span className="about-symbol"><Clock3 size={25}/></span><h2>{t("aboutTitle")}</h2><p>{t("aboutBody")}</p></div></div></section></>;
}
