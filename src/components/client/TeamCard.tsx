import { ArrowUpRight, LockKeyhole } from "lucide-react";

export function TeamCard({ name, role, bio, tags, telegram }: { name:string; role:string; bio:string; tags:string[]; telegram?:string }) {
  return <article className="team-card">
    <div className="team-card-head">
      <div className="team-logo-avatar"><img src="/haytseghakron-white-transparent.png" alt="Hay Tseghakron" /></div>
      <div className="team-title"><span>{role}</span><h3>{name}</h3></div>
      {telegram ? <a className="team-link" href={telegram} target="_blank" rel="noreferrer" aria-label={`${name} Telegram`}><ArrowUpRight size={18}/></a> : <span className="team-private" title="Private"><LockKeyhole size={17}/></span>}
    </div>
    <p>{bio}</p>
    <div className="team-tags">{tags.map(tag=><span key={tag}>{tag}</span>)}</div>
  </article>;
}
