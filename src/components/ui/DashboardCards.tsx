import { BarChart3, Eye, RefreshCw, Users } from "lucide-react";
import type { DashboardData, FollowersData } from "../../types";
import { AnimatedNumber } from "./Primitives";

export function Overview({ followers, dashboard, labels }: { followers: FollowersData; dashboard: DashboardData | null; labels: [string,string,string] }) {
  const total = Object.values(followers).reduce((sum, value) => sum + (value || 0), 0);
  const items = [{ icon: Users, value: total, label: labels[0], tone: "orange" }, { icon: Eye, value: dashboard?.visits.total ?? 0, label: labels[1], tone: "blue" }, { icon: BarChart3, value: dashboard?.visits.unique ?? 0, label: labels[2], tone: "purple" }];
  return <div className="ios-group overview-group">{items.map(({icon:Icon,value,label,tone}) => <div className="overview-row" key={label}><span className={`row-symbol ${tone}`}><Icon size={19}/></span><span className="overview-label">{label}</span><strong className="overview-value"><AnimatedNumber value={value}/></strong></div>)}</div>;
}

export function RefreshButton({ loading, onClick, idle, busy }: { loading:boolean; onClick:()=>void; idle:string; busy:string }) {
  return <button type="button" className="refresh-button" onClick={onClick} disabled={loading}><RefreshCw size={17}/><span>{loading ? busy : idle}</span></button>;
}
