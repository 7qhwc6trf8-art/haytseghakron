import type { DashboardData, FollowersData } from "../types";

const API_URL = "https://link-server-xu6k.vercel.app/api";

export function trackVisit() {
  try {
    const img = new Image();
    img.src = `${API_URL}/track?_=${Date.now()}`;
  } catch { /* analytics must never block UI */ }
}

export async function fetchDashboard(): Promise<DashboardData> {
  const response = await fetch(`${API_URL}/dashboard`);
  if (!response.ok) throw new Error("Dashboard unavailable");
  return response.json();
}

export async function fetchFollowers(): Promise<FollowersData> {
  const response = await fetch(`${API_URL}/followers?refresh=true`);
  if (!response.ok) throw new Error("Followers unavailable");
  const result = await response.json();
  return result.followers;
}
