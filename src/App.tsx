import React, { useEffect, useMemo, useState } from "react";
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
  Languages,
  Moon,
  RefreshCw,
  Settings2,
  Share,
  Sparkles,
  Sun,
  Users,
  X,
} from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaTelegramPlane,
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
    connect: "Սոցիալական հարթակներ",
    connectHint: "Մեր պաշտոնական էջերը",
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
  },
  en: {
    title: "Hay Tseghakron",
    subtitle: "A digital community of Armenian spirit",
    live: "Active now",
    followers: "Followers",
    visits: "Visits",
    unique: "Unique",
    overview: "Overview",
    connect: "Social platforms",
    connectHint: "Our official accounts",
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
  },
  ru: {
    title: "Hay Tseghakron",
    subtitle: "Цифровое сообщество армянского духа",
    live: "Сейчас активно",
    followers: "Подписчики",
    visits: "Посещения",
    unique: "Уникальные",
    overview: "Обзор",
    connect: "Социальные платформы",
    connectHint: "Наши официальные страницы",
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
  },
} as const;

const socials = [
  { key: "instagram" as const, name: "Instagram", handle: "@haytseghakron", url: "https://instagram.com/haytseghakron", icon: FaInstagram, tone: "instagram" },
  { key: "telegram" as const, name: "Telegram", handle: "@HayTseghakron", url: "https://t.me/HayTseghakron", icon: FaTelegramPlane, tone: "telegram" },
  { key: "twitter" as const, name: "X", handle: "@haytseghakron", url: "https://x.com/haytseghakron", icon: FaXTwitter, tone: "x" },
  { key: "threads" as const, name: "Threads", handle: "@haytseghakron", url: "https://threads.net/@haytseghakron", icon: TbBrandThreads, tone: "threads" },
  { key: "facebook" as const, name: "Facebook", handle: "HayTseghakron", url: "https://www.facebook.com/share/185yWbehcY/", icon: FaFacebookF, tone: "facebook" },
  { key: "tiktok" as const, name: "TikTok", handle: "@haytseghakron", url: "https://tiktok.com/@haytseghakron", icon: FaTiktok, tone: "tiktok" },
];

const iosSpring = { type: "spring", stiffness: 430, damping: 38, mass: 0.72 } as const;
const sheetSpring = { type: "spring", stiffness: 390, damping: 39, mass: 0.86 } as const;
const pageEase = [0.2, 0.8, 0.2, 1] as const;

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

function AnimatedNumber({ value }: { value: number }) {
  const reduce = useReducedMotion();
  const raw = useMotionValue(value);
  const display = useTransform(raw, (n) => Math.round(n).toLocaleString());

  useEffect(() => {
    if (reduce) {
      raw.set(value);
      return;
    }
    const controls = animate(raw, value, { duration: 0.55, ease: pageEase });
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
      whileTap={{ scale: 0.88 }}
      transition={iosSpring}
    >
      {children}
    </motion.button>
  );
}

function TopNavigation({ title, onShare, onSettings }: { title: string; onShare: () => void; onSettings: () => void }) {
  return (
    <header className="top-navigation">
      <div className="top-navigation-inner">
        <motion.div className="nav-brand" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.32, ease: pageEase }}>
          <div className="nav-logo"><img src="/haytseghakron-white-transparent.png" alt="" /></div>
          <strong>{title}</strong>
        </motion.div>
        <div className="nav-actions">
          <IconButton label="Share" onClick={onShare}><Share size={19} strokeWidth={2.2} /></IconButton>
          <IconButton label="Settings" onClick={onSettings}><Settings2 size={19} strokeWidth={2.2} /></IconButton>
        </div>
      </div>
    </header>
  );
}

function ProfileHero({ title, subtitle, live }: { title: string; subtitle: string; live: string }) {
  const reduce = useReducedMotion();
  return (
    <section className="profile-hero">
      <motion.div
        className="profile-avatar"
        initial={reduce ? false : { opacity: 0, scale: 0.84, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ ...iosSpring, delay: 0.04 }}
      >
        <img src="/haytseghakron-white-transparent.png" alt="Hay Tseghakron" />
        <span className="presence-dot" />
      </motion.div>
      <motion.h1 initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.34, delay: 0.08, ease: pageEase }}>{title}</motion.h1>
      <motion.p initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.34, delay: 0.12, ease: pageEase }}>{subtitle}</motion.p>
      <motion.div className="status-pill" initial={reduce ? false : { opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ ...iosSpring, delay: 0.16 }}>
        <span className="status-dot" />
        {live}
      </motion.div>
    </section>
  );
}

function SectionTitle({ title, subtitle, trailing }: { title: string; subtitle?: string; trailing?: string }) {
  return (
    <div className="section-title">
      <div>
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {trailing && <span>{trailing}</span>}
    </div>
  );
}

function Overview({ followers, dashboard, label }: { followers: FollowersData; dashboard: DashboardData | null; label: string }) {
  const total = Object.values(followers).reduce((sum, v) => sum + (v || 0), 0);
  const items = [
    { icon: Users, value: total, label: label.split("|")[0], tint: "orange" },
    { icon: Eye, value: dashboard?.visits.total ?? 0, label: label.split("|")[1], tint: "blue" },
    { icon: BarChart3, value: dashboard?.visits.unique ?? 0, label: label.split("|")[2], tint: "purple" },
  ];

  return (
    <motion.div
      className="ios-group overview-group"
      initial="hidden"
      animate="show"
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.045, delayChildren: 0.12 } } }}
    >
      {items.map(({ icon: Icon, value, label: itemLabel, tint }) => (
        <motion.div key={itemLabel} className="overview-item" variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.28, ease: pageEase } } }}>
          <div className={`overview-icon ${tint}`}><Icon size={17} strokeWidth={2.4} /></div>
          <strong><AnimatedNumber value={value} /></strong>
          <span>{itemLabel}</span>
        </motion.div>
      ))}
    </motion.div>
  );
}

function SocialList({ followers }: { followers: FollowersData }) {
  return (
    <motion.div
      className="ios-group social-list"
      initial="hidden"
      animate="show"
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.035 } } }}
    >
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
            variants={{ hidden: { opacity: 0, x: 12 }, show: { opacity: 1, x: 0, transition: { duration: 0.26, ease: pageEase } } }}
            whileTap={{ scale: 0.987 }}
            transition={iosSpring}
          >
            <motion.span className={`social-icon ${item.tone}`} whileTap={{ scale: 0.88 }} transition={iosSpring}><Icon size={20} /></motion.span>
            <span className="row-copy">
              <strong>{item.name}</strong>
              <small>{item.handle}</small>
            </span>
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
    <motion.button type="button" className="refresh-button" onClick={onClick} disabled={loading} whileTap={{ scale: 0.975 }} transition={iosSpring}>
      <motion.span animate={loading ? { rotate: 360 } : { rotate: 0 }} transition={loading ? { duration: 0.7, repeat: Infinity, ease: "linear" } : iosSpring}>
        <RefreshCw size={17} strokeWidth={2.4} />
      </motion.span>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span key={loading ? "busy" : "idle"} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.14 }}>
          {loading ? busy : idle}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}

function CommunityCard({ eyebrow, title, body, active247, growing, quote }: { eyebrow: string; title: string; body: string; active247: string; growing: string; quote: string }) {
  return (
    <motion.section className="community-card" initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.38, ease: pageEase }}>
      <div className="community-mark"><Sparkles size={17} /></div>
      <span className="community-eyebrow">{eyebrow}</span>
      <h3>{title}</h3>
      <p>{body}</p>
      <div className="community-meta">
        <span><i />{active247}</span>
        <span><Users size={14} />{growing}</span>
      </div>
      <blockquote>“{quote}”</blockquote>
    </motion.section>
  );
}

function AboutPanel({ title, body }: { title: string; body: string }) {
  return (
    <motion.section className="ios-group about-panel" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.32, ease: pageEase }}>
      <div className="about-symbol"><Globe2 size={24} strokeWidth={2.2} /></div>
      <h2>{title}</h2>
      <p>{body}</p>
      <div className="about-foot"><Heart size={14} fill="currentColor" /> Armenian United Network</div>
    </motion.section>
  );
}

function TabBar({ active, setActive, labels }: { active: TabKey; setActive: (tab: TabKey) => void; labels: Record<TabKey, string> }) {
  const tabs = [
    { key: "home" as const, icon: Sparkles },
    { key: "social" as const, icon: Users },
    { key: "about" as const, icon: Globe2 },
  ];

  return (
    <motion.nav className="ios-tabbar" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.36, delay: 0.18, ease: pageEase }}>
      <div className="ios-tabbar-inner">
        {tabs.map(({ key, icon: Icon }) => {
          const selected = active === key;
          return (
            <motion.button type="button" key={key} className={selected ? "tab-item selected" : "tab-item"} onClick={() => setActive(key)} whileTap={{ scale: 0.88 }} transition={iosSpring}>
              <motion.span animate={{ y: selected ? -1 : 0, scale: selected ? 1.05 : 1 }} transition={iosSpring}>
                <Icon size={22} strokeWidth={selected ? 2.6 : 2.2} />
              </motion.span>
              <span>{labels[key]}</span>
            </motion.button>
          );
        })}
      </div>
    </motion.nav>
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
        <motion.button type="button" key={key} className={value === key ? "selected" : ""} onClick={() => onChange(key)} whileTap={{ scale: 0.96 }} transition={iosSpring}>
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
  setLanguage: (l: Language) => void;
  appearance: Appearance;
  setAppearance: (a: Appearance) => void;
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
          <motion.button className="sheet-backdrop" aria-label="Close settings" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} />
          <motion.aside
            className="settings-sheet"
            role="dialog"
            aria-modal="true"
            aria-label={t("settings")}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={sheetSpring}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.22 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 110 || info.velocity.y > 700) onClose();
            }}
          >
            <div className="sheet-grabber" />
            <div className="sheet-header">
              <div>
                <small>Hay Tseghakron</small>
                <h2>{t("settings")}</h2>
              </div>
              <IconButton label="Close" onClick={onClose}><X size={18} strokeWidth={2.3} /></IconButton>
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
                    <span className="language-symbol"><Languages size={18} strokeWidth={2.25} /></span>
                    <span className="row-copy"><strong>{item.title}</strong><small>{item.subtitle}</small></span>
                    <AnimatePresence initial={false}>
                      {language === item.key && (
                        <motion.span className="language-check" initial={{ opacity: 0, scale: 0.65 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.65 }} transition={iosSpring}>
                          <Check size={15} strokeWidth={3} />
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

function PageTransition({ id, children }: React.PropsWithChildren<{ id: string }>) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      key={id}
      className="page-content"
      initial={reduce ? false : { opacity: 0, x: 14 }}
      animate={{ opacity: 1, x: 0 }}
      exit={reduce ? undefined : { opacity: 0, x: -10 }}
      transition={{ duration: 0.25, ease: pageEase }}
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  const [language, setLanguage] = useState<Language>(() => (localStorage.getItem("ht-language") as Language) || "hy");
  const [appearance, setAppearance] = useState<Appearance>(() => (localStorage.getItem("ht-appearance") as Appearance) || "dark");
  const [systemDark, setSystemDark] = useState(() => window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>("home");
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
  }, [appearance, isDark, language]);

  useEffect(() => {
    if (!settingsOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
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
      // Dismissing the native share sheet is expected.
    }
  };

  const labels = useMemo(() => ({ home: t("home"), social: t("social"), about: t("about") }), [language]);

  return (
    <MotionConfig reducedMotion="user" transition={iosSpring}>
      <div className="app-shell">
        <TopNavigation title={t("title")} onShare={share} onSettings={() => setSettingsOpen(true)} />

        <main className="phone-canvas">
          <ProfileHero title={t("title")} subtitle={t("subtitle")} live={t("live")} />

          <AnimatePresence mode="wait" initial={false}>
            {activeTab === "home" && (
              <PageTransition id="home">
                <section className="content-section first-section">
                  <SectionTitle title={t("overview")} />
                  <Overview followers={followers} dashboard={dashboard} label={`${t("followers")}|${t("visits")}|${t("unique")}`} />
                </section>

                <section className="content-section">
                  <SectionTitle title={t("connect")} subtitle={t("connectHint")} trailing={t("official")} />
                  <SocialList followers={followers} />
                  <RefreshButton loading={loading} onClick={refresh} idle={t("refresh")} busy={t("refreshing")} />
                </section>

                <section className="content-section">
                  <CommunityCard eyebrow={t("community")} title={t("communityTitle")} body={t("communityBody")} active247={t("active247")} growing={t("growing")} quote={t("quote")} />
                </section>
              </PageTransition>
            )}

            {activeTab === "social" && (
              <PageTransition id="social">
                <section className="content-section first-section standalone-section">
                  <SectionTitle title={t("connect")} subtitle={t("connectHint")} trailing={t("official")} />
                  <SocialList followers={followers} />
                </section>
              </PageTransition>
            )}

            {activeTab === "about" && (
              <PageTransition id="about">
                <section className="content-section first-section standalone-section">
                  <AboutPanel title={t("aboutTitle")} body={t("aboutBody")} />
                  <CommunityCard eyebrow={t("community")} title={t("communityTitle")} body={t("communityBody")} active247={t("active247")} growing={t("growing")} quote={t("quote")} />
                </section>
              </PageTransition>
            )}
          </AnimatePresence>

          <footer className="footer">
            <span>© {new Date().getFullYear()} Hay Tseghakron</span>
            {dashboard?.followers.lastUpdate && (
              <span>{t("updated")} · {new Date(dashboard.followers.lastUpdate).toLocaleTimeString(language === "hy" ? "hy-AM" : language === "ru" ? "ru-RU" : "en-US", { hour: "2-digit", minute: "2-digit" })}</span>
            )}
          </footer>
        </main>

        <TabBar active={activeTab} setActive={setActiveTab} labels={labels} />
        <SettingsSheet open={settingsOpen} onClose={() => setSettingsOpen(false)} language={language} setLanguage={setLanguage} appearance={appearance} setAppearance={setAppearance} t={t} />
      </div>
    </MotionConfig>
  );
}
