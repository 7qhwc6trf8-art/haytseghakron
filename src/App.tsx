import React, { useEffect, useMemo, useState } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  ArrowUpRight,
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
  analytics?: {
    browsers: Record<string, number>;
    operatingSystems: Record<string, number>;
    devices: Record<string, number>;
  };
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
    connect: "Միացիր համայնքին",
    connectHint: "Ընտրիր հարթակը և բացիր պաշտոնական էջը",
    refresh: "Թարմացնել տվյալները",
    refreshing: "Թարմացվում է…",
    community: "Համայնք",
    communityTitle: "Միասին ավելի ուժեղ",
    communityBody:
      "Մենք պահպանում ենք հայկական ինքնությունը, պատմությունը և մշակույթը՝ միավորելով մարդկանց մեկ թվային տարածքում։",
    active247: "24/7 ակտիվ",
    growing: "Անընդհատ աճող համայնք",
    settings: "Կարգավորումներ",
    appearance: "Տեսք",
    language: "Լեզու",
    dark: "Մուգ",
    light: "Բաց",
    system: "Համակարգային",
    home: "Գլխավոր",
    social: "Սոց. ցանցեր",
    about: "Մեր մասին",
    share: "Կիսվել",
    updated: "Թարմացված",
    today: "Այսօր",
    quote:
      "Միասնությունը ուժ է։ Միասին պահպանում ենք մեր ժառանգությունը և կառուցում հայկական ապագան։",
    official: "Պաշտոնական հղումներ",
    aboutTitle: "Հայկական միացյալ ցանց",
    aboutBody:
      "Hay Tseghakron-ը համայնքային թվային հանգույց է՝ ստեղծված հայկական բովանդակությունը, կապերը և նախաձեռնությունները մեկ տեղում միավորելու համար։",
  },
  en: {
    title: "Hay Tseghakron",
    subtitle: "A digital community of Armenian spirit",
    live: "Active now",
    followers: "Followers",
    visits: "Visits",
    unique: "Unique",
    connect: "Join the community",
    connectHint: "Choose a platform and open the official page",
    refresh: "Refresh live data",
    refreshing: "Refreshing…",
    community: "Community",
    communityTitle: "Stronger together",
    communityBody:
      "We preserve Armenian identity, history and culture by bringing people together in one digital space.",
    active247: "Active 24/7",
    growing: "A continuously growing community",
    settings: "Settings",
    appearance: "Appearance",
    language: "Language",
    dark: "Dark",
    light: "Light",
    system: "System",
    home: "Home",
    social: "Social",
    about: "About",
    share: "Share",
    updated: "Updated",
    today: "Today",
    quote:
      "Unity is strength. Together we preserve our heritage and build the Armenian future.",
    official: "Official links",
    aboutTitle: "Armenian united network",
    aboutBody:
      "Hay Tseghakron is a community hub created to bring Armenian content, connections and initiatives together in one place.",
  },
  ru: {
    title: "Hay Tseghakron",
    subtitle: "Цифровое сообщество армянского духа",
    live: "Сейчас активно",
    followers: "Подписчики",
    visits: "Посещения",
    unique: "Уникальные",
    connect: "Присоединиться",
    connectHint: "Выберите платформу и откройте официальную страницу",
    refresh: "Обновить данные",
    refreshing: "Обновление…",
    community: "Сообщество",
    communityTitle: "Вместе сильнее",
    communityBody:
      "Мы сохраняем армянскую идентичность, историю и культуру, объединяя людей в одном цифровом пространстве.",
    active247: "Активно 24/7",
    growing: "Постоянно растущее сообщество",
    settings: "Настройки",
    appearance: "Оформление",
    language: "Язык",
    dark: "Тёмное",
    light: "Светлое",
    system: "Системное",
    home: "Главная",
    social: "Соцсети",
    about: "О нас",
    share: "Поделиться",
    updated: "Обновлено",
    today: "Сегодня",
    quote:
      "Единство — сила. Вместе мы сохраняем наше наследие и строим армянское будущее.",
    official: "Официальные ссылки",
    aboutTitle: "Армянская объединённая сеть",
    aboutBody:
      "Hay Tseghakron — общественный цифровой центр, созданный для объединения армянского контента, связей и инициатив в одном месте.",
  },
} as const;

const socialData = [
  {
    key: "instagram" as const,
    name: "Instagram",
    handle: "@haytseghakron",
    url: "https://instagram.com/haytseghakron",
    icon: FaInstagram,
    className: "instagram",
  },
  {
    key: "telegram" as const,
    name: "Telegram",
    handle: "@HayTseghakron",
    url: "https://t.me/HayTseghakron",
    icon: FaTelegramPlane,
    className: "telegram",
  },
  {
    key: "twitter" as const,
    name: "X",
    handle: "@haytseghakron",
    url: "https://x.com/haytseghakron",
    icon: FaXTwitter,
    className: "x-social",
  },
  {
    key: "threads" as const,
    name: "Threads",
    handle: "@haytseghakron",
    url: "https://threads.net/@haytseghakron",
    icon: TbBrandThreads,
    className: "threads",
  },
  {
    key: "facebook" as const,
    name: "Facebook",
    handle: "HayTseghakron",
    url: "https://www.facebook.com/share/185yWbehcY/",
    icon: FaFacebookF,
    className: "facebook",
  },
  {
    key: "tiktok" as const,
    name: "TikTok",
    handle: "@haytseghakron",
    url: "https://tiktok.com/@haytseghakron",
    icon: FaTiktok,
    className: "tiktok",
  },
];

const spring = { type: "spring", stiffness: 420, damping: 34, mass: 0.78 } as const;
const softSpring = { type: "spring", stiffness: 220, damping: 28, mass: 0.9 } as const;

function trackVisit() {
  try {
    const img = new Image();
    img.src = `${API_URL}/track?_=${Date.now()}`;
  } catch {
    // Tracking must never block the UI.
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
  const reducedMotion = useReducedMotion();
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) => Math.round(latest).toLocaleString());

  useEffect(() => {
    if (reducedMotion) {
      motionValue.set(value);
      return;
    }
    const controls = animate(motionValue, value, {
      duration: 0.85,
      ease: [0.16, 1, 0.3, 1],
    });
    return controls.stop;
  }, [motionValue, reducedMotion, value]);

  return <motion.span>{rounded}</motion.span>;
}

function Pressable({ children, className = "", onClick }: React.PropsWithChildren<{ className?: string; onClick?: () => void }>) {
  return (
    <motion.button
      className={className}
      onClick={onClick}
      whileTap={{ scale: 0.965 }}
      whileHover={{ scale: 1.012 }}
      transition={spring}
    >
      {children}
    </motion.button>
  );
}

function TopBar({ title, subtitle, onSettings, onShare }: { title: string; subtitle: string; onSettings: () => void; onShare: () => void }) {
  const { scrollY } = useScroll();
  const rawOpacity = useTransform(scrollY, [0, 48, 110], [0, 0.62, 1]);
  const titleScale = useTransform(scrollY, [0, 120], [0.96, 1]);
  const opacity = useSpring(rawOpacity, { stiffness: 250, damping: 30 });

  return (
    <motion.header className="ios-topbar" style={{ "--header-opacity": opacity } as React.CSSProperties}>
      <div className="topbar-inner">
        <motion.div className="compact-brand" style={{ opacity, scale: titleScale }}>
          <img src="/haytseghakron-white-transparent.png" alt="" />
          <div>
            <strong>{title}</strong>
            <span>{subtitle}</span>
          </div>
        </motion.div>
        <div className="topbar-actions">
          <Pressable className="circle-button" onClick={onShare}>
            <Share size={18} strokeWidth={2.4} />
          </Pressable>
          <Pressable className="circle-button" onClick={onSettings}>
            <Settings2 size={19} strokeWidth={2.4} />
          </Pressable>
        </div>
      </div>
    </motion.header>
  );
}

function Hero({ title, subtitle, live }: { title: string; subtitle: string; live: string }) {
  const reducedMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 300], [0, -50]);
  const scale = useTransform(scrollY, [0, 250], [1, 0.93]);
  const opacity = useTransform(scrollY, [0, 260], [1, 0.15]);

  return (
    <motion.section className="hero" style={reducedMotion ? undefined : { y, scale, opacity }}>
      <motion.div
        className="hero-orb hero-orb-one"
        animate={reducedMotion ? undefined : { x: [0, 24, -10, 0], y: [0, -18, 14, 0], scale: [1, 1.1, 0.96, 1] }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="hero-orb hero-orb-two"
        animate={reducedMotion ? undefined : { x: [0, -20, 14, 0], y: [0, 18, -10, 0], scale: [1, 0.92, 1.08, 1] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="avatar-shell"
        initial={{ opacity: 0, scale: 0.72, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ ...softSpring, delay: 0.05 }}
      >
        <motion.div
          className="avatar-glow"
          animate={reducedMotion ? undefined : { rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        />
        <div className="avatar">
          <img src="/haytseghakron-white-transparent.png" alt="Hay Tseghakron" />
        </div>
        <motion.span
          className="live-dot"
          animate={reducedMotion ? undefined : { scale: [1, 1.22, 1], boxShadow: ["0 0 0 0 rgba(52,199,89,.35)", "0 0 0 8px rgba(52,199,89,0)", "0 0 0 0 rgba(52,199,89,0)"] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        />
      </motion.div>

      <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ ...softSpring, delay: 0.12 }}>
        {title}
      </motion.h1>
      <motion.p className="hero-subtitle" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ ...softSpring, delay: 0.18 }}>
        {subtitle}
      </motion.p>
      <motion.div className="live-pill" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ ...spring, delay: 0.24 }}>
        <span className="live-mini-dot" /> {live}
      </motion.div>
    </motion.section>
  );
}

function StatCard({ icon: Icon, label, value, delay }: { icon: React.ElementType; label: string; value: number; delay: number }) {
  return (
    <motion.div
      className="stat-card ios-material"
      initial={{ opacity: 0, y: 22, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ ...softSpring, delay }}
      whileHover={{ y: -3, scale: 1.018 }}
      whileTap={{ scale: 0.97 }}
    >
      <div className="stat-icon"><Icon size={17} /></div>
      <strong><AnimatedNumber value={value} /></strong>
      <span>{label}</span>
    </motion.div>
  );
}

function SectionHeader({ title, detail }: { title: string; detail?: string }) {
  return (
    <div className="section-header">
      <h2>{title}</h2>
      {detail && <span>{detail}</span>}
    </div>
  );
}

function SocialRow({ item, followers, index }: { item: (typeof socialData)[number]; followers: number; index: number }) {
  const Icon = item.icon;
  return (
    <motion.a
      href={item.url}
      target="_blank"
      rel="noreferrer"
      className="social-row"
      initial={{ opacity: 0, x: -18 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ ...softSpring, delay: 0.04 * index }}
      whileTap={{ scale: 0.985, x: 2 }}
      whileHover={{ x: 3 }}
    >
      <motion.div className={`social-icon ${item.className}`} whileHover={{ rotate: -5, scale: 1.08 }} transition={spring}>
        <Icon size={21} />
      </motion.div>
      <div className="social-copy">
        <strong>{item.name}</strong>
        <span>{item.handle}</span>
      </div>
      <div className="social-meta">
        {followers > 0 && <span>{followers.toLocaleString()}</span>}
        <ChevronRight size={18} />
      </div>
    </motion.a>
  );
}

function SocialGroup({ followers }: { followers: FollowersData }) {
  return (
    <motion.div className="group-card" layout>
      {socialData.map((item, index) => {
        const value = item.key === "facebook" ? 0 : followers[item.key];
        return <SocialRow key={item.name} item={item} followers={value} index={index} />;
      })}
    </motion.div>
  );
}

function RefreshButton({ loading, label, loadingLabel, onClick }: { loading: boolean; label: string; loadingLabel: string; onClick: () => void }) {
  return (
    <motion.button className="ios-primary-button" onClick={onClick} disabled={loading} whileTap={{ scale: 0.975 }} whileHover={{ scale: 1.01 }} transition={spring}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={loading ? "loading" : "idle"}
          className="button-content"
          initial={{ opacity: 0, y: 7 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -7 }}
          transition={{ duration: 0.18 }}
        >
          <motion.span animate={loading ? { rotate: 360 } : { rotate: 0 }} transition={loading ? { duration: 0.9, repeat: Infinity, ease: "linear" } : spring}>
            <RefreshCw size={17} />
          </motion.span>
          {loading ? loadingLabel : label}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}

function CommunityCard({ eyebrow, title, body, active247, growing, quote }: { eyebrow: string; title: string; body: string; active247: string; growing: string; quote: string }) {
  return (
    <motion.section className="community-card" initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.28 }} transition={softSpring}>
      <motion.div className="community-shine" animate={{ x: ["-120%", "180%"] }} transition={{ duration: 7, repeat: Infinity, repeatDelay: 2.2, ease: "easeInOut" }} />
      <div className="community-topline">
        <span><Sparkles size={13} /> {eyebrow}</span>
      </div>
      <h3>{title}</h3>
      <p>{body}</p>
      <div className="community-badges">
        <motion.span whileHover={{ scale: 1.04 }}><span className="green-dot" />{active247}</motion.span>
        <motion.span whileHover={{ scale: 1.04 }}><Users size={13} />{growing}</motion.span>
      </div>
      <blockquote>“{quote}”</blockquote>
    </motion.section>
  );
}

function AboutCard({ title, body }: { title: string; body: string }) {
  return (
    <motion.div className="about-card" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={softSpring}>
      <div className="about-icon"><Globe2 size={23} /></div>
      <h2>{title}</h2>
      <p>{body}</p>
      <div className="about-signature">
        <Heart size={15} fill="currentColor" /> Armenian United Network
      </div>
    </motion.div>
  );
}

function TabBar({ active, setActive, labels }: { active: TabKey; setActive: (tab: TabKey) => void; labels: Record<TabKey, string> }) {
  const tabs: Array<{ key: TabKey; icon: React.ElementType }> = [
    { key: "home", icon: Sparkles },
    { key: "social", icon: Users },
    { key: "about", icon: Globe2 },
  ];

  return (
    <motion.nav className="tabbar-wrap" initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ ...softSpring, delay: 0.32 }}>
      <div className="tabbar ios-material">
        {tabs.map(({ key, icon: Icon }) => (
          <motion.button key={key} onClick={() => setActive(key)} className={active === key ? "tab active" : "tab"} whileTap={{ scale: 0.9 }} transition={spring}>
            <span className="tab-icon-shell">
              {active === key && <motion.span className="tab-active-bg" layoutId="activeTab" transition={spring} />}
              <motion.span className="tab-icon" animate={{ y: active === key ? -1 : 0, scale: active === key ? 1.06 : 1 }} transition={spring}>
                <Icon size={20} strokeWidth={active === key ? 2.7 : 2.25} />
              </motion.span>
            </span>
            <span>{labels[key]}</span>
          </motion.button>
        ))}
      </div>
    </motion.nav>
  );
}

function SegmentedControl({ appearance, setAppearance, labels }: { appearance: Appearance; setAppearance: (a: Appearance) => void; labels: Record<Appearance, string> }) {
  const choices: Array<{ key: Appearance; icon: React.ElementType }> = [
    { key: "light", icon: Sun },
    { key: "dark", icon: Moon },
    { key: "system", icon: Settings2 },
  ];
  return (
    <div className="segmented">
      {choices.map(({ key, icon: Icon }) => (
        <motion.button key={key} className={appearance === key ? "selected" : ""} onClick={() => setAppearance(key)} whileTap={{ scale: 0.96 }}>
          {appearance === key && <motion.span layoutId="appearanceSegment" className="segment-selection" transition={spring} />}
          <span className="segment-content"><Icon size={15} /> {labels[key]}</span>
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
          <motion.button className="sheet-backdrop" aria-label="Close" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          <motion.aside
            className="sheet"
            initial={{ y: "105%", scale: 0.97 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: "105%", scale: 0.98 }}
            transition={{ type: "spring", stiffness: 340, damping: 34, mass: 0.95 }}
          >
            <div className="sheet-handle" />
            <div className="sheet-title-row">
              <div>
                <span className="sheet-kicker">Hay Tseghakron</span>
                <h2>{t("settings")}</h2>
              </div>
              <Pressable className="sheet-close" onClick={onClose}><X size={18} /></Pressable>
            </div>

            <section className="settings-section">
              <h3>{t("appearance")}</h3>
              <SegmentedControl appearance={appearance} setAppearance={setAppearance} labels={{ light: t("light"), dark: t("dark"), system: t("system") }} />
            </section>

            <section className="settings-section">
              <h3>{t("language")}</h3>
              <div className="settings-list">
                {languages.map((item) => (
                  <motion.button key={item.key} className="settings-row" onClick={() => setLanguage(item.key)} whileTap={{ scale: 0.985, x: 2 }}>
                    <div className="language-icon"><Languages size={18} /></div>
                    <div className="settings-copy"><strong>{item.title}</strong><span>{item.subtitle}</span></div>
                    <AnimatePresence mode="popLayout">
                      {language === item.key && <motion.div initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }} transition={spring} className="check"><Check size={14} strokeWidth={3} /></motion.div>}
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

function HomeContent({ followers, dashboard, loading, refresh, t }: {
  followers: FollowersData;
  dashboard: DashboardData | null;
  loading: boolean;
  refresh: () => void;
  t: (key: keyof typeof copy.en) => string;
}) {
  const totalFollowers = Object.values(followers).reduce((sum, value) => sum + (value || 0), 0);
  return (
    <motion.div key="home" initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}>
      <div className="stats-grid">
        <StatCard icon={Users} label={t("followers")} value={totalFollowers} delay={0.18} />
        <StatCard icon={Eye} label={t("visits")} value={dashboard?.visits.total ?? 0} delay={0.24} />
        <StatCard icon={BarChart3} label={t("unique")} value={dashboard?.visits.unique ?? 0} delay={0.3} />
      </div>

      <section className="content-section">
        <SectionHeader title={t("connect")} detail={t("official")} />
        <p className="section-caption">{t("connectHint")}</p>
        <SocialGroup followers={followers} />
        <RefreshButton loading={loading} label={t("refresh")} loadingLabel={t("refreshing")} onClick={refresh} />
      </section>

      <CommunityCard eyebrow={t("community")} title={t("communityTitle")} body={t("communityBody")} active247={t("active247")} growing={t("growing")} quote={t("quote")} />
    </motion.div>
  );
}

function SocialContent({ followers, t }: { followers: FollowersData; t: (key: keyof typeof copy.en) => string }) {
  return (
    <motion.div key="social" className="tab-page" initial={{ opacity: 0, x: 24, scale: 0.985 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: -18 }} transition={{ ...softSpring }}>
      <SectionHeader title={t("connect")} detail={t("official")} />
      <p className="section-caption">{t("connectHint")}</p>
      <SocialGroup followers={followers} />
    </motion.div>
  );
}

function AboutContent({ t }: { t: (key: keyof typeof copy.en) => string }) {
  return (
    <motion.div key="about" className="tab-page" initial={{ opacity: 0, x: 24, scale: 0.985 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: -18 }} transition={softSpring}>
      <AboutCard title={t("aboutTitle")} body={t("aboutBody")} />
      <CommunityCard eyebrow={t("community")} title={t("communityTitle")} body={t("communityBody")} active247={t("active247")} growing={t("growing")} quote={t("quote")} />
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
      const data = await fetchFollowers();
      setFollowers(data);
    } finally {
      setLoading(false);
    }
  };

  const share = async () => {
    const shareData = { title: t("title"), text: t("subtitle"), url: window.location.href };
    try {
      if (navigator.share) await navigator.share(shareData);
      else await navigator.clipboard.writeText(window.location.href);
    } catch {
      // Native share sheets can be dismissed; no error UI is needed.
    }
  };

  const labels = useMemo(() => ({ home: t("home"), social: t("social"), about: t("about") }), [language]);

  return (
    <div className="app-shell">
      <div className="ambient-bg" aria-hidden="true">
        <motion.div className="ambient-blob blob-a" animate={{ x: [0, 42, -20, 0], y: [0, 26, -22, 0], scale: [1, 1.08, 0.96, 1] }} transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }} />
        <motion.div className="ambient-blob blob-b" animate={{ x: [0, -38, 18, 0], y: [0, -32, 16, 0], scale: [1, 0.94, 1.08, 1] }} transition={{ duration: 21, repeat: Infinity, ease: "easeInOut" }} />
      </div>

      <TopBar title={t("title")} subtitle={t("subtitle")} onSettings={() => setSettingsOpen(true)} onShare={share} />

      <main className="phone-canvas">
        <Hero title={t("title")} subtitle={t("subtitle")} live={t("live")} />
        <AnimatePresence mode="wait" initial={false}>
          {activeTab === "home" && <HomeContent followers={followers} dashboard={dashboard} loading={loading} refresh={refresh} t={t} />}
          {activeTab === "social" && <SocialContent followers={followers} t={t} />}
          {activeTab === "about" && <AboutContent t={t} />}
        </AnimatePresence>

        <motion.footer initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="footer">
          <span>© {new Date().getFullYear()} Hay Tseghakron</span>
          {dashboard?.followers.lastUpdate && <span>{t("updated")} · {new Date(dashboard.followers.lastUpdate).toLocaleTimeString(language === "hy" ? "hy-AM" : language === "ru" ? "ru-RU" : "en-US", { hour: "2-digit", minute: "2-digit" })}</span>}
        </motion.footer>
      </main>

      <TabBar active={activeTab} setActive={setActiveTab} labels={labels} />
      <SettingsSheet open={settingsOpen} onClose={() => setSettingsOpen(false)} language={language} setLanguage={setLanguage} appearance={appearance} setAppearance={setAppearance} t={t} />
    </div>
  );
}
