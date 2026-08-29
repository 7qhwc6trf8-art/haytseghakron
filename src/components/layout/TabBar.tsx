import { Home, Info, Link2 } from "lucide-react";
import type { TabKey } from "../../types";

export function TabBar({ active, onSelect, labels }: { active: TabKey; onSelect: (tab: TabKey) => void; labels: Record<TabKey, string> }) {
  const tabs = [{ key: "home" as const, icon: Home }, { key: "social" as const, icon: Link2 }, { key: "about" as const, icon: Info }];
  return <div className="tabbar-shell"><nav className="liquid-tabbar">{tabs.map(({ key, icon: Icon }) => {
    const selected = active === key;
    return <button type="button" key={key} className={`tab-item${selected ? " selected" : ""}`} onClick={() => onSelect(key)}>
      {selected && <span className="tab-selection"/>}<span className="tab-content"><span className="tab-icon"><Icon size={22} strokeWidth={selected ? 2.5 : 2.15}/></span><span className="tab-label">{labels[key]}</span></span>
    </button>;
  })}</nav></div>;
}
