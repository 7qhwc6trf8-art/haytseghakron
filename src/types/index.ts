export type Language = "hy" | "en" | "ru";
export type Appearance = "dark" | "light" | "system";
export type TabKey = "home" | "social" | "about";
export type DetailPageKey = "services" | "staff" | "history" | "contact" | "faq" | "partners";
export type RouteKey = TabKey | DetailPageKey;

export interface FollowersData {
  instagram: number;
  telegram: number;
  twitter: number;
  tiktok: number;
  threads: number;
}

export interface DashboardData {
  visits: { total: number; unique: number };
  followers: FollowersData & { total: number; lastUpdate: string };
}

export interface ClientSection {
  key: DetailPageKey;
  title: string;
  subtitle: string;
  icon: string;
}
