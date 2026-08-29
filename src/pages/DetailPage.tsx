import { ArrowUpRight } from "lucide-react";
import type { DetailPageKey, Language } from "../types";
import { detailContent } from "../data/content";
import { LargeTitle } from "../components/ui/Primitives";

export function DetailPage({ page, language }: { page:DetailPageKey; language:Language }) {
  const content = detailContent[language][page] ?? detailContent.hy[page];
  return <><LargeTitle title={content.title} subtitle={content.intro}/><section className="content-section first-section"><div className="ios-group detail-list">{content.items.map((item,index)=><article className="detail-item" key={`${item.title}-${index}`}><div className="detail-number">{String(index+1).padStart(2,"0")}</div><div><h3>{item.title}</h3><p>{item.body}</p></div></article>)}</div></section>{page==="contact"&&<section className="content-section"><a className="primary-action" href="https://t.me/HayTseghakron" target="_blank" rel="noreferrer">Telegram <ArrowUpRight size={18}/></a></section>}</>;
}
