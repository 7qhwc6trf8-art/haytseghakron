import { ChevronLeft, Settings2, Share } from "lucide-react";
import { IconButton } from "../ui/Primitives";

export function NavigationBar({ title, onShare, onSettings, onBack, backLabel = "Back" }: { title: string; onShare: () => void; onSettings: () => void; onBack?: () => void; backLabel?: string }) {
  return <header className="navigation-bar"><div className="navigation-inner">
    {onBack ? <button className="nav-back-button" type="button" onClick={onBack}><ChevronLeft size={22}/><span>{backLabel}</span></button> : <div className="navigation-brand"><span className="navigation-logo"><img src="/haytseghakron-white-transparent.png" alt="" /></span><strong>{title}</strong></div>}
    <div className="navigation-actions"><IconButton label="Share" onClick={onShare}><Share size={19}/></IconButton><IconButton label="Settings" onClick={onSettings}><Settings2 size={19}/></IconButton></div>
  </div></header>;
}
