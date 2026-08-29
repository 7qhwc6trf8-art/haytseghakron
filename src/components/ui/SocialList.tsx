import { ChevronRight } from "lucide-react";
import { socials } from "../../data/content";
import type { FollowersData } from "../../types";

export function SocialList({ followers }: { followers: FollowersData }) {
  return <div className="ios-group social-list">{socials.map((item) => {
    const Icon = item.icon; const count = item.key === "facebook" ? 0 : followers[item.key];
    return <a key={item.name} href={item.url} target="_blank" rel="noreferrer" className="ios-row social-row"><span className={`social-icon ${item.tone}`}><Icon size={20}/></span><span className="row-copy"><strong>{item.name}</strong><small>{item.handle}</small></span><span className="row-trailing">{count > 0 && <small>{count.toLocaleString()}</small>}<ChevronRight size={18}/></span></a>;
  })}</div>;
}
