import { ArrowUpRight } from "lucide-react";

export function HistoryTimeline({ items }: { items:Array<{era:string;title:string;body:string;href?:string;linkLabel?:string}> }) {
  return <div className="history-timeline">{items.map((item,index)=><article className="history-step" key={`${item.title}-${index}`}>
    <div className="history-rail"><span>{String(index+1).padStart(2,"0")}</span></div>
    <div className="history-copy"><small>{item.era}</small><h3>{item.title}</h3><p>{item.body}</p>{item.href&&<a href={item.href} target="_blank" rel="noreferrer">{item.linkLabel}<ArrowUpRight size={15}/></a>}</div>
  </article>)}</div>;
}
