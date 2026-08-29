import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  MotionConfig,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import {
  BarChart3,
  Check,
  ChevronRight,
  Eye,
  Globe2,
  Heart,
  Home,
  Info,
  Languages,
  Link2,
  Moon,
  RefreshCw,
  Settings2,
  Share,
  Sun,
  Users,
  X,
} from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaTelegram,
  FaTiktok,
  FaXTwitter,
} from "react-icons/fa6";
import { TbBrandThreads } from "react-icons/tb";
import "./App.css";

type Language = "hy" | "en" | "ru";
type Appearance = "dark" | "light" | "system";
type TabKey = "home" | "social" | "about";

interface FollowersData {
  instagram: number;
  telegram: number;
  twitter: number;
  tiktok: number;
  threads: number;
}

interface DashboardData {
  visits: { total: number; unique: number };
  followers: FollowersData & { total: number; lastUpdate: string };
}

const API_URL = "https://link-server-xu6k.vercel.app/api";

const copy = {
  hy: {
    title: "Հայ Ցեղակրոն",
    subtitle: "Հայկական ոգու թվային համայնք",
    live: "Ակտիվ է հիմա",
    followers: "Հետևորդներ",
    visits: "Այցելություններ",
    unique: "Յուրահատուկ",
    overview: "Ամփոփում",
    connect: "Հղումներ",
    connectHint: "Պաշտոնական սոցիալական էջեր",
    refresh: "Թարմացնել տվյալները",
    refreshing: "Թարմացվում է…",
    community: "Համայնք",
    communityTitle: "Միասին ավելի ուժեղ",
    communityBody: "Մենք պահպանում ենք հայկական ինքնությունը, պատմությունը և մշակույթը՝ միավորելով մարդկանց մեկ թվային տարածքում։",
    active247: "24/7 ակտիվ",
    growing: "Աճող համայնք",
    settings: "Կարգավորումներ",
    appearance: "Տեսք",
    language: "Լեզու",
    dark: "Մուգ",
    light: "Բաց",
    system: "Ավտո",
    home: "Գլխավոր",
    social: "Հղումներ",
    about: "Մեր մասին",
    updated: "Թարմացված",
    quote: "Միասնությունը ուժ է։ Միասին պահպանում ենք մեր ժառանգությունը և կառուցում հայկական ապագան։",
    official: "Պաշտոնական",
    aboutTitle: "Հայկական միացյալ ցանց",
    aboutBody: "Hay Tseghakron-ը համայնքային թվային հանգույց է՝ ստեղծված հայկական բովանդակությունը, կապերը և նախաձեռնությունները մեկ տեղում միավորելու համար։",
    done: "Պատրաստ",
    profile: "Պրոֆիլ",
  },
  en: {
    title: "Hay Tseghakron",
    subtitle: "A digital community of Armenian spirit",
    live: "Active now",
    followers: "Followers",
    visits: "Visits",
    unique: "Unique",
    overview: "Overview",
    connect: "Links",
    connectHint: "Official social accounts",
    refresh: "Refresh data",
    refreshing: "Refreshing…",
    community: "Community",
    communityTitle: "Stronger together",
    communityBody: "We preserve Armenian identity, history and culture by bringing people together in one digital space.",
    active247: "Active 24/7",
    growing: "Growing community",
    settings: "Settings",
    appearance: "Appearance",
    language: "Language",
    dark: "Dark",
    light: "Light",
    system: "Auto",
    home: "Home",
    social: "Links",
    about: "About",
    updated: "Updated",
    quote: "Unity is strength. Together we preserve our heritage and build the Armenian future.",
    official: "Official",
    aboutTitle: "Armenian united network",
    aboutBody: "Hay Tseghakron is a community hub created to bring Armenian content, connections and initiatives together in one place.",
    done: "Done",
    profile: "Profile",
  },
  ru: {
    title: "Hay Tseghakron",
    subtitle: "Цифровое сообщество армянского духа",
    live: "Сейчас активно",
    followers: "Подписчики",
    visits: "Посещения",
    unique: "Уникальные",
    overview: "Обзор",
    connect: "Ссылки",
    connectHint: "Официальные социальные страницы",
    refresh: "Обновить данные",
    refreshing: "Обновление…",
    community: "Сообщество",
    communityTitle: "Вместе сильнее",
    communityBody: "Мы сохраняем армянскую идентичность, историю и культуру, объединяя людей в одном цифровом пространстве.",
    active247: "Активно 24/7",
    growing: "Растущее сообщество",
    settings: "Настройки",
    appearance: "Оформление",
    language: "Язык",
    dark: "Тёмное",
    light: "Светлое",
    system: "Авто",
    home: "Главная",
    social: "Ссылки",
    about: "О нас",
    updated: "Обновлено",
    quote: "Единство — сила. Вместе мы сохраняем наше наследие и строим армянское будущее.",
    official: "Официальные",
    aboutTitle: "Армянская объединённая сеть",
    aboutBody: "Hay Tseghakron — общественный цифровой центр, созданный для объединения армянского контента, связей и инициатив в одном месте.",
    done: "Готово",
    profile: "Профиль",
  },
} as const;

const socials = [
  { key: "instagram" as const, name: "Instagram", handle: "@haytseghakron", url: "https://instagram.com/haytseghakron", icon: FaInstagram, tone: "instagram" },
  { key: "telegram" as const, name: "Telegram", handle: "@HayTseghakron", url: "https://t.me/HayTseghakron", icon: FaTelegram, tone: "telegram" },
  { key: "twitter" as const, name: "X", handle: "@haytseghakron", url: "https://x.com/haytseghakron", icon: FaXTwitter, tone: "x" },
  { key: "threads" as const, name: "Threads", handle: "@haytseghakron", url: "https://threads.net/@haytseghakron", icon: TbBrandThreads, tone: "threads" },
  { key: "facebook" as const, name: "Facebook", handle: "HayTseghakron", url: "https://www.facebook.com/share/185yWbehcY/", icon: FaFacebookF, tone: "facebook" },
  { key: "tiktok" as const, name: "TikTok", handle: "@haytseghakron", url: "https://tiktok.com/@haytseghakron", icon: FaTiktok, tone: "tiktok" },
];

const tabOrder: TabKey[] = ["home", "social", "about"];
const iosSpring = { type: "spring", stiffness: 430, damping: 39, mass: 0.72 } as const;
const pageSpring = { type: "spring", stiffness: 410, damping: 42, mass: 0.82 } as const;
const sheetSpring = { type: "spring", stiffness: 390, damping: 40, mass: 0.9 } as const;
const pageEase = [0.22, 0.82, 0.22, 1] as const;

function trackVisit() {
  try {
    const img = new Image();
    img.src = `${API_URL}/track?_=${Date.now()}`;
  } catch {
    // Analytics must never block UI.
  }
}

async function fetchDashboard(): Promise<DashboardData> {
  const response = await fetch(`${API_URL}/dashboard`);
  if (!response.ok) throw new Error("Dashboard unavailable");
  return response.json();
}

async function fetchFollowers(): Promise<FollowersData> {
  const response = await fetch(`${API_URL}/followers?refresh=true`);
  if (!response.ok) throw new Error("Followers unavailable");
  const result = await response.json();
  return result.followers;
}

function useIOSViewport() {
  useEffect(() => {
    const setViewport = () => {
      const vv = window.visualViewport;
      const height = vv?.height ?? window.innerHeight;
      document.documentElement.style.setProperty("--app-height", `${Math.round(height)}px`);
    };

    let raf = 0;
    const scheduleViewport = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(setViewport);
    };

    setViewport();
    window.addEventListener("resize", scheduleViewport, { passive: true });
    window.addEventListener("orientationchange", scheduleViewport, { passive: true });
    window.visualViewport?.addEventListener("resize", scheduleViewport, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", scheduleViewport);
      window.removeEventListener("orientationchange", scheduleViewport);
      window.visualViewport?.removeEventListener("resize", scheduleViewport);
    };
  }, []);
}

function AnimatedNumber({ value }: { value: number }) {
  const reduce = useReducedMotion();
  const raw = useMotionValue(value);
  const display = useTransform(raw, (n) => Math.round(n).toLocaleString());

  useEffect(() => {
    if (reduce) {
      raw.set(value);
      return;
    }
    const controls = animate(raw, value, { duration: 0.48, ease: pageEase });
    return controls.stop;
  }, [raw, reduce, value]);

  return <motion.span>{display}</motion.span>;
}

function IconButton({ label, children, onClick }: React.PropsWithChildren<{ label: string; onClick: () => void }>) {
  return (
    <motion.button
      type="button"
      className="ios-icon-button"
      aria-label={label}
      onClick={onClick}
      whileTap={{ scale: 0.9 }}
      transition={iosSpring}
    >
      {children}
    </motion.button>
  );
}

function NavigationBar({ title, onShare, onSettings }: { title: string; onShare: () => void; onSettings: () => void }) {
  return (
    <header className="navigation-bar">
      <div className="navigation-inner">
        <motion.div className="navigation-brand" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.22 }}>
          <span className="navigation-logo"><img src="/haytseghakron-white-transparent.png" alt="" /></span>
          <strong>{title}</strong>
        </motion.div>
        <div className="navigation-actions">
          <IconButton label="Share" onClick={onShare}><Share size={19} strokeWidth={2.15} /></IconButton>
          <IconButton label="Settings" onClick={onSettings}><Settings2 size={19} strokeWidth={2.15} /></IconButton>
        </div>
      </div>
    </header>
  );
}

function LargeTitle({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string }) {
  return (
    <div className="large-title-block">
      {eyebrow && <span className="large-title-eyebrow">{eyebrow}</span>}
      <h1>{title}</h1>
      {subtitle && <p>{subtitle}</p>}
    </div>
  );
}

function ProfileHeader({ title, subtitle, live }: { title: string; subtitle: string; live: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.section
      className="profile-header"
      initial={reduce ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.34, ease: pageEase }}
    >
      <div className="profile-avatar">
        <img src="/haytseghakron-white-transparent.png" alt="Hay Tseghakron" />
        <span className="presence-dot" />
      </div>
      <div className="profile-copy">
        <h2>{title}</h2>
        <p>{subtitle}</p>
        <span className="status-line"><i />{live}</span>
      </div>
    </motion.section>
  );
}

function SectionHeader({ title, subtitle, trailing }: { title: string; subtitle?: string; trailing?: string }) {
  return (
    <div className="section-header">
      <div>
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {trailing && <span>{trailing}</span>}
    </div>
  );
}

function Overview({ followers, dashboard, labels }: { followers: FollowersData; dashboard: DashboardData | null; labels: [string, string, string] }) {
  const total = Object.values(followers).reduce((sum, value) => sum + (value || 0), 0);
  const items = [
    { icon: Users, value: total, label: labels[0], tone: "orange" },
    { icon: Eye, value: dashboard?.visits.total ?? 0, label: labels[1], tone: "blue" },
    { icon: BarChart3, value: dashboard?.visits.unique ?? 0, label: labels[2], tone: "purple" },
  ];

  return (
    <div className="ios-group overview-group">
      {items.map(({ icon: Icon, value, label, tone }, index) => (
        <motion.div
          className="overview-row"
          key={label}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.24, delay: index * 0.035, ease: pageEase }}
        >
          <span className={`row-symbol ${tone}`}><Icon size={19} strokeWidth={2.2} /></span>
          <span className="overview-label">{label}</span>
          <strong className="overview-value"><AnimatedNumber value={value} /></strong>
        </motion.div>
      ))}
    </div>
  );
}

function SocialList({ followers }: { followers: FollowersData }) {
  return (
    <motion.div className="ios-group social-list" initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.025 } } }}>
      {socials.map((item) => {
        const Icon = item.icon;
        const count = item.key === "facebook" ? 0 : followers[item.key];
        return (
          <motion.a
            key={item.name}
            href={item.url}
            target="_blank"
            rel="noreferrer"
            className="ios-row social-row"
            variants={{ hidden: { opacity: 0, x: 12 }, show: { opacity: 1, x: 0, transition: { duration: 0.23, ease: pageEase } } }}
            whileTap={{ scale: 0.985 }}
            transition={iosSpring}
          >
            <span className={`social-icon ${item.tone}`}><Icon size={20} /></span>
            <span className="row-copy"><strong>{item.name}</strong><small>{item.handle}</small></span>
            <span className="row-trailing">
              {count > 0 && <small>{count.toLocaleString()}</small>}
              <ChevronRight size={18} strokeWidth={2.1} />
            </span>
          </motion.a>
        );
      })}
    </motion.div>
  );
}

function RefreshButton({ loading, onClick, idle, busy }: { loading: boolean; onClick: () => void; idle: string; busy: string }) {
  return (
    <motion.button type="button" className="refresh-button" onClick={onClick} disabled={loading} whileTap={{ scale: 0.98 }} transition={iosSpring}>
      <motion.span animate={loading ? { rotate: 360 } : { rotate: 0 }} transition={loading ? { duration: 0.72, repeat: Infinity, ease: "linear" } : iosSpring}>
        <RefreshCw size={17} strokeWidth={2.35} />
      </motion.span>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span key={loading ? "busy" : "idle"} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.12 }}>
          {loading ? busy : idle}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}

function CommunityCard({ eyebrow, title, body, active247, growing, quote }: { eyebrow: string; title: string; body: string; active247: string; growing: string; quote: string }) {
  return (
    <motion.section className="community-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28, ease: pageEase }}>
      <span className="community-eyebrow">{eyebrow}</span>
      <h3>{title}</h3>
      <p>{body}</p>
      <div className="community-meta"><span><i />{active247}</span><span><Users size={14} />{growing}</span></div>
      <blockquote>“{quote}”</blockquote>
    </motion.section>
  );
}

function AboutPanel({ title, body }: { title: string; body: string }) {
  return (
    <section className="ios-group about-panel">
      <div className="about-hero">
        <span className="about-symbol"><Globe2 size={25} strokeWidth={2.15} /></span>
        <h2>{title}</h2>
        <p>{body}</p>
      </div>
      <div className="about-row"><Heart size={17} fill="currentColor" /><span>Armenian United Network</span></div>
    </section>
  );
}

function TabBar({ active, onSelect, labels }: { active: TabKey; onSelect: (tab: TabKey) => void; labels: Record<TabKey, string> }) {
  const tabs = [
    { key: "home" as const, icon: Home },
    { key: "social" as const, icon: Link2 },
    { key: "about" as const, icon: Info },
  ];

  return (
    <div className="tabbar-shell">
      <motion.nav className="liquid-tabbar" initial={{ opacity: 0, y: 18, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ ...iosSpring, delay: 0.12 }}>
        {tabs.map(({ key, icon: Icon }) => {
          const selected = active === key;
          return (
            <motion.button type="button" key={key} className={`tab-item${selected ? " selected" : ""}`} onClick={() => onSelect(key)} whileTap={{ scale: 0.9 }} transition={iosSpring}>
              {selected && <motion.span className="tab-selection" layoutId="tab-selection" transition={iosSpring} />}
              <span className="tab-content">
                <motion.span className="tab-icon" animate={{ y: selected ? -1 : 0, scale: selected ? 1.03 : 1 }} transition={iosSpring}><Icon size={22} strokeWidth={selected ? 2.5 : 2.15} /></motion.span>
                <span className="tab-label">{labels[key]}</span>
              </span>
            </motion.button>
          );
        })}
      </motion.nav>
    </div>
  );
}

function AppearanceControl({ value, onChange, labels }: { value: Appearance; onChange: (value: Appearance) => void; labels: Record<Appearance, string> }) {
  const options = [
    { key: "light" as const, icon: Sun },
    { key: "dark" as const, icon: Moon },
    { key: "system" as const, icon: Settings2 },
  ];

  return (
    <div className="segmented-control">
      {options.map(({ key, icon: Icon }) => (
        <motion.button type="button" key={key} className={value === key ? "selected" : ""} onClick={() => onChange(key)} whileTap={{ scale: 0.97 }} transition={iosSpring}>
          {value === key && <motion.span className="segment-selection" layoutId="appearance-selection" transition={iosSpring} />}
          <span className="segment-label"><Icon size={14} />{labels[key]}</span>
        </motion.button>
      ))}
    </div>
  );
}

function SettingsSheet({ open, onClose, language, setLanguage, appearance, setAppearance, t }: {
  open: boolean;
  onClose: () => void;
  language: Language;
  setLanguage: (language: Language) => void;
  appearance: Appearance;
  setAppearance: (appearance: Appearance) => void;
  t: (key: keyof typeof copy.en) => string;
}) {
  const languages: Array<{ key: Language; title: string; subtitle: string }> = [
    { key: "hy", title: "Հայերեն", subtitle: "Armenian" },
    { key: "en", title: "English", subtitle: "English" },
    { key: "ru", title: "Русский", subtitle: "Russian" },
  ];

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button className="sheet-backdrop" aria-label="Close settings" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }} />
          <motion.aside
            className="settings-sheet"
            role="dialog"
            aria-modal="true"
            aria-label={t("settings")}
            initial={{ y: "100%", scale: 0.985 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: "100%", scale: 0.985 }}
            transition={sheetSpring}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.18 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 105 || info.velocity.y > 680) onClose();
            }}
          >
            <div className="sheet-grabber" />
            <div className="sheet-navigation">
              <strong>{t("settings")}</strong>
              <motion.button type="button" className="done-button" onClick={onClose} whileTap={{ scale: 0.94 }} transition={iosSpring}>{t("done")}</motion.button>
            </div>

            <section className="settings-section">
              <h3>{t("appearance")}</h3>
              <AppearanceControl value={appearance} onChange={setAppearance} labels={{ light: t("light"), dark: t("dark"), system: t("system") }} />
            </section>

            <section className="settings-section">
              <h3>{t("language")}</h3>
              <div className="ios-group settings-list">
                {languages.map((item) => (
                  <motion.button type="button" key={item.key} className="ios-row settings-row" onClick={() => setLanguage(item.key)} whileTap={{ scale: 0.988 }} transition={iosSpring}>
                    <span className="language-symbol"><Languages size={18} strokeWidth={2.2} /></span>
                    <span className="row-copy"><strong>{item.title}</strong><small>{item.subtitle}</small></span>
                    <AnimatePresence initial={false}>
                      {language === item.key && (
                        <motion.span className="language-check" initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.7 }} transition={iosSpring}>
                          <Check size={14} strokeWidth={3} />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                ))}
              </div>
            </section>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

const pageVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : direction < 0 ? "-30%" : 0,
    opacity: direction < 0 ? 0.94 : 1,
    scale: direction < 0 ? 0.985 : 1,
    zIndex: direction > 0 ? 2 : 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    zIndex: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? "-30%" : direction < 0 ? "100%" : 0,
    opacity: direction > 0 ? 0.94 : 1,
    scale: direction > 0 ? 0.985 : 1,
    zIndex: direction < 0 ? 2 : 0,
  }),
};

function PageTransition({ direction, children }: React.PropsWithChildren<{ direction: number }>) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className="ios-page"
      custom={direction}
      variants={reduce ? undefined : pageVariants}
      initial={reduce ? false : "enter"}
      animate={reduce ? undefined : "center"}
      exit={reduce ? undefined : "exit"}
      transition={reduce ? { duration: 0 } : pageSpring}
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  useIOSViewport();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [language, setLanguage] = useState<Language>(() => (localStorage.getItem("ht-language") as Language) || "hy");
  const [appearance, setAppearance] = useState<Appearance>(() => (localStorage.getItem("ht-appearance") as Appearance) || "system");
  const [systemDark, setSystemDark] = useState(() => window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>("home");
  const [direction, setDirection] = useState(0);
  const [loading, setLoading] = useState(false);
  const [followers, setFollowers] = useState<FollowersData>({ instagram: 1482, telegram: 251, twitter: 2, tiktok: 459, threads: 0 });
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);

  const t = (key: keyof typeof copy.en) => copy[language][key] as string;
  const isDark = appearance === "dark" || (appearance === "system" && systemDark);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = (event: MediaQueryListEvent) => setSystemDark(event.matches);
    media.addEventListener?.("change", listener);
    return () => media.removeEventListener?.("change", listener);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = isDark ? "dark" : "light";
    document.documentElement.lang = language;
    localStorage.setItem("ht-language", language);
    localStorage.setItem("ht-appearance", appearance);

    const themeMeta = document.querySelector('meta[name="theme-color"]');
    themeMeta?.setAttribute("content", isDark ? "#000000" : "#f2f2f7");
  }, [appearance, isDark, language]);

  useEffect(() => {
    const scroller = scrollRef.current;
    if (!scroller) return;
    const previousOverflow = scroller.style.overflowY;
    if (settingsOpen) scroller.style.overflowY = "hidden";
    return () => {
      scroller.style.overflowY = previousOverflow;
    };
  }, [settingsOpen]);

  useEffect(() => {
    trackVisit();
    fetchDashboard()
      .then((data) => {
        setDashboard(data);
        if (data.followers) {
          setFollowers({
            instagram: data.followers.instagram ?? 0,
            telegram: data.followers.telegram ?? 0,
            twitter: data.followers.twitter ?? 0,
            tiktok: data.followers.tiktok ?? 0,
            threads: data.followers.threads ?? 0,
          });
        }
      })
      .catch(() => undefined);
  }, []);

  const refresh = async () => {
    if (loading) return;
    setLoading(true);
    try {
      setFollowers(await fetchFollowers());
    } finally {
      setLoading(false);
    }
  };

  const share = async () => {
    try {
      if (navigator.share) await navigator.share({ title: t("title"), text: t("subtitle"), url: window.location.href });
      else await navigator.clipboard.writeText(window.location.href);
    } catch {
      // Native share cancellation is expected.
    }
  };

  const selectTab = (next: TabKey) => {
    if (next === activeTab) {
      scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const currentIndex = tabOrder.indexOf(activeTab);
    const nextIndex = tabOrder.indexOf(next);
    setDirection(nextIndex > currentIndex ? 1 : -1);
    setActiveTab(next);
    requestAnimationFrame(() => scrollRef.current?.scrollTo({ top: 0, behavior: "auto" }));
  };

  const labels = useMemo(() => ({ home: t("home"), social: t("social"), about: t("about") }), [language]);

  return (
    <MotionConfig reducedMotion="user" transition={iosSpring}>
      <div className="app-shell">
        <NavigationBar title={t("title")} onShare={share} onSettings={() => setSettingsOpen(true)} />

        <div className="app-scroll" ref={scrollRef}>
          <main className="phone-canvas">
            <div className="page-stage">
              <AnimatePresence mode="sync" initial={false} custom={direction}>
                <PageTransition key={activeTab} direction={direction}>
                  {activeTab === "home" && (
                    <>
                      <LargeTitle title={t("home")} subtitle={t("subtitle")} />
                      <ProfileHeader title={t("title")} subtitle={t("subtitle")} live={t("live")} />

                      <section className="content-section">
                        <SectionHeader title={t("overview")} />
                        <Overview followers={followers} dashboard={dashboard} labels={[t("followers"), t("visits"), t("unique")]} />
                      </section>

                      <section className="content-section">
                        <SectionHeader title={t("connect")} subtitle={t("connectHint")} trailing={t("official")} />
                        <SocialList followers={followers} />
                        <RefreshButton loading={loading} onClick={refresh} idle={t("refresh")} busy={t("refreshing")} />
                      </section>

                      <section className="content-section">
                        <CommunityCard eyebrow={t("community")} title={t("communityTitle")} body={t("communityBody")} active247={t("active247")} growing={t("growing")} quote={t("quote")} />
                      </section>
                    </>
                  )}

                  {activeTab === "social" && (
                    <>
                      <LargeTitle title={t("social")} subtitle={t("connectHint")} />
                      <section className="content-section first-section">
                        <SocialList followers={followers} />
                        <RefreshButton loading={loading} onClick={refresh} idle={t("refresh")} busy={t("refreshing")} />
                      </section>
                    </>
                  )}

                  {activeTab === "about" && (
                    <>
                      <LargeTitle title={t("about")} subtitle={t("title")} />
                      <section className="content-section first-section">
                        <AboutPanel title={t("aboutTitle")} body={t("aboutBody")} />
                      </section>
                      <section className="content-section">
                        <CommunityCard eyebrow={t("community")} title={t("communityTitle")} body={t("communityBody")} active247={t("active247")} growing={t("growing")} quote={t("quote")} />
                      </section>
                    </>
                  )}
                </PageTransition>
              </AnimatePresence>
            </div>

            <footer className="footer">
              <span>© {new Date().getFullYear()} Hay Tseghakron</span>
              {dashboard?.followers.lastUpdate && (
                <span>{t("updated")} · {new Date(dashboard.followers.lastUpdate).toLocaleTimeString(language === "hy" ? "hy-AM" : language === "ru" ? "ru-RU" : "en-US", { hour: "2-digit", minute: "2-digit" })}</span>
              )}
            </footer>
          </main>
        </div>

        <TabBar active={activeTab} onSelect={selectTab} labels={labels} />
        <SettingsSheet open={settingsOpen} onClose={() => setSettingsOpen(false)} language={language} setLanguage={setLanguage} appearance={appearance} setAppearance={setAppearance} t={t} />
      </div>
    </MotionConfig>
  );
}
