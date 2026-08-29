import { Users } from "lucide-react";
export function CommunityCard({ eyebrow, title, body, active247, growing, quote }: { eyebrow:string; title:string; body:string; active247:string; growing:string; quote:string }) {
  return <section className="community-card"><span className="community-eyebrow">{eyebrow}</span><h3>{title}</h3><p>{body}</p><div className="community-meta"><span><i/>{active247}</span><span><Users size={14}/>{growing}</span></div><blockquote>“{quote}”</blockquote></section>;
}
