import { ArrowUpRight, Mail, MessageCircle, Phone } from "lucide-react";

export function ContactRow({ item }: { item:{label:string;value:string;note?:string;href?:string;kind:"telegram"|"email"|"phone"} }) {
  const icon = item.kind === "email" ? <Mail size={19}/> : item.kind === "phone" ? <Phone size={19}/> : <MessageCircle size={19}/>;
  const content = <><span className={`contact-symbol ${item.kind}`}>{icon}</span><span className="row-copy"><strong>{item.label}</strong><small>{item.value}{item.note ? ` · ${item.note}` : ""}</small></span>{item.href&&<span className="row-trailing"><ArrowUpRight size={17}/></span>}</>;
  return item.href ? <a className="ios-row contact-row" href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel={item.href.startsWith("http") ? "noreferrer" : undefined}>{content}</a> : <div className="ios-row contact-row">{content}</div>;
}
