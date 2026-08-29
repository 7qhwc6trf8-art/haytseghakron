import { useState } from "react";
import { ChevronDown } from "lucide-react";

export function FaqItem({ question, answer }: { question:string; answer:string }) {
  const [open,setOpen] = useState(false);
  return <div className={`faq-item ${open ? "open" : ""}`}><button type="button" onClick={()=>setOpen(v=>!v)} aria-expanded={open}><span>{question}</span><ChevronDown size={18}/></button><div className="faq-answer" aria-hidden={!open}><div><p>{answer}</p></div></div></div>;
}
