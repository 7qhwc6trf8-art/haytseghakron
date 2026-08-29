import { HeartHandshake, ShieldCheck } from "lucide-react";
import type { DetailPageKey, Language } from "../types";
import { clientContent } from "../data/content";
import { LargeTitle } from "../components/ui/Primitives";
import { TeamCard } from "../components/client/TeamCard";
import { HistoryTimeline } from "../components/client/HistoryTimeline";
import { ContactRow } from "../components/client/ContactRow";
import { FaqItem } from "../components/client/FaqItem";

function InfoList({ items }: { items:Array<{title:string;body:string;href?:string;linkLabel?:string}> }) {
  return <div className="ios-group detail-list">{items.map((item,index)=><article className="detail-item" key={`${item.title}-${index}`}><div className="detail-number">{String(index+1).padStart(2,"0")}</div><div><h3>{item.title}</h3><p>{item.body}</p>{item.href&&<a className="detail-inline-link" href={item.href} target="_blank" rel="noreferrer">{item.linkLabel}</a>}</div></article>)}</div>;
}

export function DetailPage({ page, language }: { page:DetailPageKey; language:Language }) {
  const content = clientContent[language];

  if (page === "staff") return <><LargeTitle title={content.staff.title} subtitle={content.staff.intro}/><section className="content-section first-section team-grid">{content.staff.members.map(member=><TeamCard key={member.name} {...member}/>)}</section><section className="content-section"><div className="privacy-note"><ShieldCheck size={20}/><p>{content.staff.privacyNote}</p></div></section></>;

  if (page === "history") return <><LargeTitle title={content.history.title} subtitle={content.history.intro}/><section className="content-section first-section"><HistoryTimeline items={content.history.timeline}/></section><section className="content-section"><div className="manifesto-card"><img src="/haytseghakron-white-transparent.png" alt="Hay Tseghakron"/><span>Hay Tseghakron</span><h2>{content.history.manifesto}</h2><p>{content.history.manifestoBody}</p></div></section><section className="content-section"><div className="independence-card"><ShieldCheck size={22}/><p>{content.history.independence}</p></div></section></>;

  if (page === "contact") return <><LargeTitle title={content.contact.title} subtitle={content.contact.intro}/><section className="content-section first-section"><div className="ios-group contact-list">{content.contact.items.map(item=><ContactRow key={`${item.label}-${item.value}`} item={item}/>)}</div></section></>;

  if (page === "faq") return <><LargeTitle title={content.faq.title} subtitle={content.faq.intro}/><section className="content-section first-section"><div className="ios-group faq-list">{content.faq.items.map(item=><FaqItem key={item.question} {...item}/>)}</div></section></>;

  if (page === "partners") return <><LargeTitle title={content.partners.title} subtitle={content.partners.intro}/><section className="content-section first-section"><div className="partner-grid">{content.partners.items.map((item,index)=><article className="partner-card" key={item.title}><div className="partner-logo"><img src="/haytseghakron-white-transparent.png" alt="Hay Tseghakron"/></div><div><small>{index === 0 ? "01" : "02"}</small><h3>{item.title}</h3><p>{item.body}</p></div><HeartHandshake size={22}/></article>)}</div></section></>;

  return <><LargeTitle title={content.services.title} subtitle={content.services.intro}/><section className="content-section first-section"><InfoList items={content.services.items}/></section></>;
}
