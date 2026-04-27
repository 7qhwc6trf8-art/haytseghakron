// App.tsx - Integrated with Backend API for Live Followers + Multi-Language Support
import React, {
	useState,
	useEffect,
	useRef,
	useCallback,
	createContext,
	useContext,
} from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import {
	FaInstagram,
	FaTwitter,
	FaFacebook,
	FaTelegram,
	FaTiktok,
	FaHeart,
	FaStar,
	FaBolt,
	FaCompass,
	FaGem,
	FaCrown,
	FaInfinity,
	FaFire,
	FaQuoteLeft,
	FaSun,
	FaMoon,
	FaPalette,
	FaDiamond,
	FaSpinner,
	FaChartLine,
	FaUsers,
	FaEye,
	FaLanguage,
} from "react-icons/fa6";
import {
	FiShare2,
	FiMenu,
	FiX,
	FiArrowUp,
	FiMusic,
	FiCamera,
	FiUserPlus,
	FiSettings,
	FiHexagon,
	FiRefreshCw,
} from "react-icons/fi";
import {
	IoSparkles,
	IoDiamond,
	IoRose,
	IoColorPalette,
	IoPhonePortrait,
	IoTabletPortrait,
	IoDesktop,
	IoStatsChart,
} from "react-icons/io5";
import { TbBrandTiktok, TbBrandThreads } from "react-icons/tb";

// ============================================
// API CONFIGURATION
// ============================================
const API_URL = "https://link-server-xu6k.vercel.app/api";

// ============================================
// TYPES
// ============================================
type ThemeMode =
	| "dark"
	| "light"
	| "midnight"
	| "sunset"
	| "aurora"
	| "crimson";
type DevicePreview = "mobile" | "tablet" | "desktop";
type Language = "en" | "hy" | "ru";

interface FollowersData {
	instagram: number;
	telegram: number;
	twitter: number;
	tiktok: number;
	threads: number;
}

interface DashboardData {
	visits: {
		total: number;
		unique: number;
	};
	followers: {
		instagram: number;
		telegram: number;
		twitter: number;
		tiktok: number;
		threads: number;
		total: number;
		lastUpdate: string;
	};
	analytics: {
		browsers: Record<string, number>;
		operatingSystems: Record<string, number>;
		devices: Record<string, number>;
	};
}

// ============================================
// TRANSLATIONS
// ============================================
const translations = {
	en: {
		// General
		appName: "Hay Tseghakron",
		tagline: "Digital Bridge of Armenian Spirit",
		activeNow: "Active Now",
		connectWithUs: "Connect With Us",
		refreshLiveFollowers: "Refresh Live Followers",
		updating: "Updating...",
		
		// Stats
		totalFollowers: "Total Followers",
		totalVisits: "Total Visits",
		uniqueVisitors: "Unique Visitors",
		
		// Social Names
		instagram: "Instagram",
		telegram: "Telegram",
		twitter: "X (Twitter)",
		threads: "Threads",
		facebook: "Facebook",
		tiktok: "TikTok",
		
		// Features
		premiumContent: "Premium Content",
		premiumDesc: "Exclusive Armenian heritage",
		dailyUpdates: "Daily Updates",
		dailyDesc: "Curated news & highlights",
		communityHub: "Community Hub",
		communityDesc: "6 active members",
		active247: "24/7 Active",
		activeDesc: "Always growing",
		
		// Quote
		quote: '"Unity is strength. Together we preserve our heritage, share our stories, and build a brighter future for Armenians worldwide."',
		quoteAuthor: "— Hay Tseghakron Community",
		
		// Footer
		footerText: "Armenian United Network",
		updated: "Updated",
		
		// Theme settings
		themes: "Themes",
		dark: "Dark",
		light: "Light",
		midnight: "Midnight",
		sunset: "Sunset",
		aurora: "Aurora",
		crimson: "Crimson",
		
		// Language
		language: "Language",
		english: "English",
		armenian: "Armenian",
		russian: "Russian",
		
		// Mobile menu
		followersCount: "followers",
	},
	hy: {
		// General
		appName: "Հայ Ցեղակրոն",
		tagline: "Հայկական ոգու թվային կամուրջ",
		activeNow: "Ակտիվ է հիմա",
		connectWithUs: "Միացե՛ք մեզ",
		refreshLiveFollowers: "Թարմացնել հետևորդները",
		updating: "Թարմացվում է...",
		
		// Stats
		totalFollowers: "Ընդհանուր հետևորդ",
		totalVisits: "Ընդհանուր այցելություն",
		uniqueVisitors: "Յուրահատուկ այցելուներ",
		
		// Social Names
		instagram: "Ինստագրամ",
		telegram: "Տելեգրամ",
		twitter: "Թվիթթեր",
		threads: "Թրեդս",
		facebook: "Ֆեյսբուք",
		tiktok: "ՏիկՏոկ",
		
		// Features
		premiumContent: "Պրեմիում բովանդակություն",
		premiumDesc: "Բացառիկ հայկական ժառանգություն",
		dailyUpdates: "Ամենօրյա թարմացումներ",
		dailyDesc: "Ընտրված նորություններ և իրադարձություններ",
		communityHub: "Համայնքի կենտրոն",
		communityDesc: "6 ակտիվ անդամ",
		active247: "24/7 Ակտիվ",
		activeDesc: "Միշտ զարգացող",
		
		// Quote
		quote: '"Միասնությունը ուժ է։ Միասին պահպանում ենք մեր ժառանգությունը, կիսվում մեր պատմություններով և կառուցում պայծառ ապագա համաշխարհային հայության համար։"',
		quoteAuthor: "— Հայ Ցեղակրոն Համայնք",
		
		// Footer
		footerText: "Հայկական Միացյալ Ցանց",
		updated: "Թարմացվել է",
		
		// Theme settings
		themes: "Թեմաներ",
		dark: "Մուգ",
		light: "Բաց",
		midnight: "Կեսգիշեր",
		sunset: "Մայրամուտ",
		aurora: "Արշալույս",
		crimson: "Բոսորագույն",
		
		// Language
		language: "Լեզու",
		english: "Անգլերեն",
		armenian: "Հայերեն",
		russian: "Ռուսերեն",
		
		// Mobile menu
		followersCount: "հետևորդ",
	},
	ru: {
		// General
		appName: "Hay Tseghakron",
		tagline: "Цифровой мост армянского духа",
		activeNow: "Сейчас активно",
		connectWithUs: "Подключитесь к нам",
		refreshLiveFollowers: "Обновить подписчиков",
		updating: "Обновление...",
		
		// Stats
		totalFollowers: "Всего подписчиков",
		totalVisits: "Всего посещений",
		uniqueVisitors: "Уникальных посетителей",
		
		// Social Names
		instagram: "Инстаграм",
		telegram: "Телеграм",
		twitter: "Твиттер",
		threads: "Тредс",
		facebook: "Фейсбук",
		tiktok: "ТикТок",
		
		// Features
		premiumContent: "Премиум контент",
		premiumDesc: "Эксклюзивное армянское наследие",
		dailyUpdates: "Ежедневные обновления",
		dailyDesc: "Отобранные новости и события",
		communityHub: "Центр сообщества",
		communityDesc: "6 активных участников",
		active247: "24/7 Активен",
		activeDesc: "Постоянно развивается",
		
		// Quote
		quote: '"Единство — это сила. Вместе мы сохраняем наше наследие, делимся нашими историями и строим светлое будущее для армян во всем мире."',
		quoteAuthor: "— Сообщество Ай Цегакрон",
		
		// Footer
		footerText: "Армянская объединенная сеть",
		updated: "Обновлено",
		
		// Theme settings
		themes: "Темы",
		dark: "Темная",
		light: "Светлая",
		midnight: "Полночь",
		sunset: "Закат",
		aurora: "Аврора",
		crimson: "Багровый",
		
		// Language
		language: "Язык",
		english: "Английский",
		armenian: "Армянский",
		russian: "Русский",
		
		// Mobile menu
		followersCount: "подписчиков",
	},
};

// ============================================
// LANGUAGE CONTEXT
// ============================================
interface LanguageContextType {
	language: Language;
	setLanguage: (lang: Language) => void;
	t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const useLanguage = () => {
	const context = useContext(LanguageContext);
	if (!context) throw new Error("useLanguage must be used within LanguageProvider");
	return context;
};

// ============================================
// THEME CONTEXT
// ============================================
interface ThemeContextType {
	theme: ThemeMode;
	setTheme: (theme: ThemeMode) => void;
	devicePreview: DevicePreview;
	setDevicePreview: (device: DevicePreview) => void;
	isSettingsOpen: boolean;
	setIsSettingsOpen: (open: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const useTheme = () => {
	const context = useContext(ThemeContext);
	if (!context) throw new Error("useTheme must be used within ThemeProvider");
	return context;
};

const themes: Record<
	ThemeMode,
	{
		primary: string;
		secondary: string;
		accent: string;
		background: string;
		surface: string;
		text: string;
		gradient: string;
		glow: string;
	}
> = {
	dark: {
		primary: "#ef4444",
		secondary: "#f97316",
		accent: "#8b5cf6",
		background: "radial-gradient(circle at 10% 20%, #0a0a1a, #000000)",
		surface: "rgba(255,255,255,0.05)",
		text: "#ffffff",
		gradient: "from-red-500 via-orange-500 to-purple-500",
		glow: "rgba(239,68,68,0.3)",
	},
	light: {
		primary: "#dc2626",
		secondary: "#ea580c",
		accent: "#7c3aed",
		background: "radial-gradient(circle at 10% 20%, #fef3c7, #fde68a)",
		surface: "rgba(0,0,0,0.05)",
		text: "#1f2937",
		gradient: "from-red-600 via-orange-600 to-purple-600",
		glow: "rgba(220,38,38,0.2)",
	},
	midnight: {
		primary: "#3b82f6",
		secondary: "#06b6d4",
		accent: "#8b5cf6",
		background: "radial-gradient(circle at 10% 20%, #0f172a, #020617)",
		surface: "rgba(59,130,246,0.1)",
		text: "#f8fafc",
		gradient: "from-blue-500 via-cyan-400 to-indigo-500",
		glow: "rgba(59,130,246,0.4)",
	},
	sunset: {
		primary: "#f43f5e",
		secondary: "#f97316",
		accent: "#eab308",
		background: "radial-gradient(circle at 10% 20%, #1e1b4b, #0c0a3e)",
		surface: "rgba(244,63,94,0.1)",
		text: "#fff7ed",
		gradient: "from-rose-500 via-orange-500 to-yellow-500",
		glow: "rgba(244,63,94,0.4)",
	},
	aurora: {
		primary: "#10b981",
		secondary: "#06b6d4",
		accent: "#8b5cf6",
		background: "radial-gradient(circle at 10% 20%, #064e3b, #042f2e)",
		surface: "rgba(16,185,129,0.1)",
		text: "#ecfdf5",
		gradient: "from-emerald-500 via-teal-400 to-cyan-500",
		glow: "rgba(16,185,129,0.4)",
	},
	crimson: {
		primary: "#be123c",
		secondary: "#9d174d",
		accent: "#831843",
		background: "radial-gradient(circle at 10% 20%, #4c0519, #2e0a1e)",
		surface: "rgba(190,18,60,0.15)",
		text: "#fef2f2",
		gradient: "from-rose-800 via-pink-700 to-purple-800",
		glow: "rgba(190,18,60,0.5)",
	},
};

// ============================================
// API SERVICES
// ============================================
const trackVisit = async () => {
	try {
		const img = new Image();
		img.src = `${API_URL}/track?_=${Date.now()}`;
	} catch (error) {
		console.error("Track error:", error);
	}
};

const fetchFollowers = async (refresh = false): Promise<FollowersData> => {
	const res = await fetch(
		`${API_URL}/followers${refresh ? "?refresh=true" : ""}`,
	);
	const data = await res.json();
	return data.followers;
};

const fetchDashboard = async (): Promise<DashboardData> => {
	const res = await fetch(`${API_URL}/dashboard`);
	return res.json();
};

// ============================================
// PARTICLE SYSTEM
// ============================================
const ParticleSystem: React.FC<{ theme: ThemeMode }> = ({ theme }) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const particles = useRef<any[]>([]);
	const animationRef = useRef<number>(0);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		let width = window.innerWidth;
		let height = window.innerHeight;

		const resize = () => {
			width = window.innerWidth;
			height = window.innerHeight;
			canvas.width = width;
			canvas.height = height;
		};

		const initParticles = () => {
			const count = Math.min(150, Math.floor((width * height) / 10000));
			particles.current = [];
			for (let i = 0; i < count; i++) {
				particles.current.push({
					x: Math.random() * width,
					y: Math.random() * height,
					vx: (Math.random() - 0.5) * 0.3,
					vy: (Math.random() - 0.5) * 0.2,
					size: Math.random() * 2 + 1,
					alpha: Math.random() * 0.3 + 0.1,
				});
			}
		};

		const animate = () => {
			if (!ctx) return;
			ctx.clearRect(0, 0, width, height);

			for (const p of particles.current) {
				p.x += p.vx;
				p.y += p.vy;
				if (p.x < 0) p.x = width;
				if (p.x > width) p.x = 0;
				if (p.y < 0) p.y = height;
				if (p.y > height) p.y = 0;

				ctx.beginPath();
				ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
				ctx.fillStyle = `rgba(255, 100, 100, ${p.alpha * 0.5})`;
				ctx.fill();
			}

			animationRef.current = requestAnimationFrame(animate);
		};

		window.addEventListener("resize", resize);
		resize();
		initParticles();
		animate();

		return () => {
			window.removeEventListener("resize", resize);
			if (animationRef.current)
				cancelAnimationFrame(animationRef.current);
		};
	}, [theme]);

	return (
		<canvas
			ref={canvasRef}
			className="fixed top-0 left-0 w-full h-full -z-10 opacity-40"
		/>
	);
};

// ============================================
// GLASS CARD
// ============================================
const GlassCard: React.FC<{
	children: React.ReactNode;
	delay?: number;
	className?: string;
}> = ({ children, delay = 0, className = "" }) => {
	const { theme } = useTheme();
	const themeData = themes[theme];
	const cardRef = useRef<HTMLDivElement>(null);
	const [rotate, setRotate] = useState({ x: 0, y: 0 });

	const handleMove = (e: React.MouseEvent) => {
		if (!cardRef.current) return;
		const rect = cardRef.current.getBoundingClientRect();
		const x = (e.clientX - rect.left) / rect.width - 0.5;
		const y = (e.clientY - rect.top) / rect.height - 0.5;
		setRotate({ x: y * 5, y: x * 5 });
	};

	const handleLeave = () => setRotate({ x: 0, y: 0 });

	return (
		<motion.div
			ref={cardRef}
			initial={{ opacity: 0, y: 30 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{
				delay,
				duration: 0.6,
				type: "spring",
				stiffness: 100,
			}}
			onMouseMove={handleMove}
			onMouseLeave={handleLeave}
			style={{
				transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
			}}
			className={`relative rounded-2xl overflow-hidden transition-all duration-200 ${className}`}
		>
			<div
				className="absolute inset-0 backdrop-blur-xl"
				style={{
					background: themeData.surface,
					border: `1px solid ${themeData.surface}`,
				}}
			/>
			<div className="relative z-10">{children}</div>
		</motion.div>
	);
};

// ============================================
// SOCIAL CARD
// ============================================
const SocialCard: React.FC<{
	icon: React.ElementType;
	name: string;
	username: string;
	url: string;
	color: string;
	delay: number;
	followers?: number;
}> = ({ icon: Icon, name, username, url, color, delay, followers }) => {
	const { theme } = useTheme();
	const { t } = useLanguage();
	const [hovered, setHovered] = useState(false);

	return (
		<motion.a
			href={url}
			target="_blank"
			initial={{ opacity: 0, x: -30 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ delay, duration: 0.5 }}
			whileHover={{ scale: 1.02, y: -2 }}
			onHoverStart={() => setHovered(true)}
			onHoverEnd={() => setHovered(false)}
			className="relative block w-full mb-4 rounded-xl cursor-pointer overflow-hidden group"
			style={{
				background: `linear-gradient(135deg, ${color}15, ${color}05)`,
				border: `1px solid ${color}30`,
			}}
		>
			<motion.div
				className="absolute inset-0"
				style={{
					background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
				}}
				animate={{ x: hovered ? ["-100%", "200%"] : "-100%" }}
				transition={{ duration: 1.2, repeat: hovered ? Infinity : 0 }}
			/>
			<div className="relative p-4 flex items-center justify-between">
				<div className="flex items-center gap-3">
					<motion.div
						animate={hovered ? { rotate: 360 } : {}}
						transition={{ duration: 0.5 }}
						style={{
							background: color,
							borderRadius: 12,
							padding: 10,
						}}
					>
						<Icon size={24} className="text-white" />
					</motion.div>
					<div>
						<h3 className="font-bold text-white">{name}</h3>
						<p className="text-xs opacity-60">{username}</p>
						{followers !== undefined && (
							<p className="text-[10px] opacity-50 mt-0.5">
								{followers.toLocaleString()} {t("followersCount")}
							</p>
						)}
					</div>
				</div>
				<motion.div animate={{ x: hovered ? 5 : 0 }} style={{ color }}>
					<FiShare2 size={18} />
				</motion.div>
			</div>
		</motion.a>
	);
};

// ============================================
// LANGUAGE SWITCHER
// ============================================
const LanguageSwitcher: React.FC = () => {
	const { language, setLanguage } = useLanguage();
	const [isOpen, setIsOpen] = useState(false);
	
	const languages = [
		{ code: "en" as Language, name: "English", flag: "🇬🇧" },
		{ code: "hy" as Language, name: "Հայերեն", flag: "🇦🇲" },
		{ code: "ru" as Language, name: "Русский", flag: "🇷🇺" },
	];

	return (
		<div className="relative">
			<motion.button
				whileHover={{ scale: 1.05 }}
				whileTap={{ scale: 0.95 }}
				onClick={() => setIsOpen(!isOpen)}
				className="fixed top-20 left-5 z-50 w-10 h-10 rounded-full backdrop-blur-xl bg-white/10 border border-white/20 flex items-center justify-center"
			>
				<FaLanguage size={18} className="text-white" />
			</motion.button>
			
			<AnimatePresence>
				{isOpen && (
					<>
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							onClick={() => setIsOpen(false)}
							className="fixed inset-0 z-40"
						/>
						<motion.div
							initial={{ opacity: 0, scale: 0.9, y: -10 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.9, y: -10 }}
							className="fixed top-28 left-5 z-50 bg-gray-900/95 backdrop-blur-xl rounded-xl border border-white/10 shadow-2xl overflow-hidden"
						>
							{languages.map((lang) => (
								<button
									key={lang.code}
									onClick={() => {
										setLanguage(lang.code);
										setIsOpen(false);
									}}
									className={`w-full px-4 py-2 text-left flex items-center gap-2 transition-all hover:bg-white/10 ${
										language === lang.code ? "bg-red-500/20 text-red-400" : "text-white/80"
									}`}
								>
									<span className="text-lg">{lang.flag}</span>
									<span className="text-sm">{lang.name}</span>
									{language === lang.code && (
										<div className="ml-auto w-1.5 h-1.5 rounded-full bg-red-500" />
									)}
								</button>
							))}
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</div>
	);
};

// ============================================
// THEME SWITCHER
// ============================================
const ThemeSwitcher: React.FC = () => {
	const { theme, setTheme, isSettingsOpen, setIsSettingsOpen } = useTheme();
	const { t } = useLanguage();
	
	const themesList = [
		{ id: "dark" as ThemeMode, name: t("dark"), icon: FaMoon, color: "#1f2937" },
		{ id: "light" as ThemeMode, name: t("light"), icon: FaSun, color: "#fbbf24" },
		{ id: "midnight" as ThemeMode, name: t("midnight"), icon: FaDiamond, color: "#3b82f6" },
		{ id: "sunset" as ThemeMode, name: t("sunset"), icon: FaFire, color: "#f97316" },
		{ id: "aurora" as ThemeMode, name: t("aurora"), icon: IoSparkles, color: "#10b981" },
		{ id: "crimson" as ThemeMode, name: t("crimson"), icon: FaHeart, color: "#be123c" },
	];

	return (
		<>
			<motion.button
				initial={{ opacity: 0, scale: 0 }}
				animate={{ opacity: 1, scale: 1 }}
				whileHover={{ scale: 1.05, rotate: 90 }}
				whileTap={{ scale: 0.95 }}
				onClick={() => setIsSettingsOpen(true)}
				className="fixed top-5 left-5 z-50 w-10 h-10 rounded-full backdrop-blur-xl bg-white/10 border border-white/20 flex items-center justify-center"
			>
				<IoColorPalette size={20} className="text-white" />
			</motion.button>

			<AnimatePresence>
				{isSettingsOpen && (
					<>
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							onClick={() => setIsSettingsOpen(false)}
							className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
						/>
						<motion.div
							initial={{ x: "100%" }}
							animate={{ x: 0 }}
							exit={{ x: "100%" }}
							transition={{ type: "spring", damping: 25 }}
							className="fixed right-0 top-0 h-full w-[300px] z-50 bg-gray-900/95 backdrop-blur-2xl border-l border-white/10 shadow-2xl overflow-y-auto"
						>
							<div className="p-5">
								<div className="flex items-center justify-between mb-6">
									<div className="flex items-center gap-2">
										<div className="w-8 h-8 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center">
											<FiSettings size={16} className="text-white" />
										</div>
										<span className="font-bold text-white">{t("themes")}</span>
									</div>
									<button
										onClick={() => setIsSettingsOpen(false)}
										className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center"
									>
										<FiX size={14} className="text-white/60" />
									</button>
								</div>
								<div className="grid grid-cols-2 gap-2">
									{themesList.map((t) => (
										<button
											key={t.id}
											onClick={() => setTheme(t.id)}
											className={`p-3 rounded-xl flex items-center gap-2 transition-all ${theme === t.id ? "bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/50" : "bg-white/5 border border-white/10"}`}
										>
											<div
												className="w-7 h-7 rounded-full flex items-center justify-center"
												style={{ background: t.color }}
											>
												<t.icon size={12} className="text-white" />
											</div>
											<span className="text-xs text-white">{t.name}</span>
										</button>
									))}
								</div>
							</div>
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</>
	);
};

// ============================================
// DEVICE PREVIEW
// ============================================
const DevicePreview: React.FC = () => {
	const { devicePreview, setDevicePreview } = useTheme();
	const devices = [
		{ id: "mobile" as DevicePreview, icon: IoPhonePortrait, name: "Mobile" },
		{ id: "tablet" as DevicePreview, icon: IoTabletPortrait, name: "Tablet" },
		{ id: "desktop" as DevicePreview, icon: IoDesktop, name: "Desktop" },
	];

	return (
		<div className="fixed hidden bottom-6 left-1/2 transform -translate-x-1/2 z-40 flex gap-2 p-2 rounded-full backdrop-blur-xl bg-white/10 border border-white/20">
			{devices.map((d) => (
				<button
					key={d.id}
					onClick={() => setDevicePreview(d.id)}
					className={`px-3 py-1.5 rounded-full text-xs transition-all ${devicePreview === d.id ? "bg-gradient-to-r from-red-500 to-orange-500 text-white" : "text-white/60"}`}
				>
					<d.icon size={12} className="inline mr-1" />
					{d.name}
				</button>
			))}
		</div>
	);
};

// ============================================
// ANIMATED STATS
// ============================================
const AnimatedStat: React.FC<{ 
  value: number; 
  label: string; 
  icon: React.ElementType; 
  delay?: number 
}> = ({ value = 0, label, icon: Icon, delay = 0 }) => {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Start animation immediately if value is available
    if (value > 0 && !hasStarted) {
      setHasStarted(true);
      let start = 0;
      const duration = 1500;
      const step = (value / duration) * 16;
      const timer = setInterval(() => {
        start += step;
        if (start >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [value, hasStarted]);

  // If value is 0, just show 0
  const displayValue = value === 0 ? 0 : (isNaN(count) ? 0 : count);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      className="text-center"
    >
      <motion.div
        whileHover={{ scale: 1.1, rotate: 5 }}
        className="w-14 h-14 mx-auto mb-2 rounded-xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center"
      >
        <Icon size={26} className="text-red-400" />
      </motion.div>
      <div className="text-3xl font-black bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
        {displayValue.toLocaleString()}
      </div>
      <div className="text-[11px] uppercase tracking-wider opacity-50 mt-1">{label}</div>
    </motion.div>
  );
};

const AnimatedStatsCard: React.FC<{ 
  title: string; 
  value: number; 
  icon: React.ElementType; 
  color: string;
  delay?: number;
}> = ({ title, value, icon: Icon, color, delay = 0 }) => {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    // Start animation immediately
    if (value > 0 && !hasStarted) {
      setHasStarted(true);
      let start = 0;
      const duration = 1200;
      const step = (value / duration) * 16;
      const timer = setInterval(() => {
        start += step;
        if (start >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [value, hasStarted]);

  const displayValue = value === 0 ? 0 : (isNaN(count) ? 0 : count);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="p-4 rounded-xl text-center backdrop-blur-sm"
      style={{
        background: `linear-gradient(135deg, ${color}15, ${color}05)`,
        border: `1px solid ${color}25`,
      }}
    >
      <Icon size={24} style={{ color }} className="mx-auto mb-2" />
      <div className="text-xl font-bold text-white">{displayValue.toLocaleString()}</div>
      <div className="text-[10px] opacity-60 uppercase tracking-wide">{title}</div>
    </motion.div>
  );
};

// ============================================
// STATS CARD
// ============================================
const StatsCard: React.FC<{
	title: string;
	value: number;
	icon: React.ElementType;
	color: string;
}> = ({ title, value, icon: Icon, color }) => (
	<motion.div
		whileHover={{ y: -3 }}
		className="p-4 rounded-xl text-center"
		style={{
			background: `linear-gradient(135deg, ${color}15, ${color}05)`,
			border: `1px solid ${color}25`,
		}}
	>
		<Icon size={24} style={{ color }} className="mx-auto mb-2" />
		<div className="text-xl font-bold text-white">
			{value.toLocaleString()}
		</div>
		<div className="text-[10px] opacity-60">{title}</div>
	</motion.div>
);

// ============================================
// FEATURE CARD
// ============================================
const FeatureCard: React.FC<{
	icon: React.ElementType;
	title: string;
	desc: string;
	color: string;
	delay: number;
}> = ({ icon: Icon, title, desc, color, delay }) => (
	<motion.div
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ delay }}
		whileHover={{ y: -3 }}
		className="p-4 rounded-xl text-center"
		style={{
			background: `linear-gradient(135deg, ${color}15, ${color}05)`,
			border: `1px solid ${color}25`,
		}}
	>
		<Icon size={24} style={{ color }} className="mx-auto mb-2" />
		<h4 className="text-sm font-bold text-white">{title}</h4>
		<p className="text-[10px] opacity-60 mt-1">{desc}</p>
	</motion.div>
);

// ============================================
// SCROLL PROGRESS
// ============================================
const ScrollProgressBar: React.FC = () => {
	const { scrollYProgress } = useScroll();
	const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
	return (
		<motion.div
			className="fixed top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 origin-left z-50"
			style={{ scaleX }}
		/>
	);
};

// ============================================
// BACK TO TOP
// ============================================
const BackToTopButton: React.FC = () => {
	const [visible, setVisible] = useState(false);
	const { scrollY } = useScroll();
	useEffect(() => scrollY.onChange((v) => setVisible(v > 500)), [scrollY]);
	return (
		<AnimatePresence>
			{visible && (
				<motion.button
					initial={{ opacity: 0, scale: 0 }}
					animate={{ opacity: 1, scale: 1 }}
					exit={{ opacity: 0, scale: 0 }}
					onClick={() =>
						window.scrollTo({ top: 0, behavior: "smooth" })
					}
					whileHover={{ scale: 1.1 }}
					className="fixed bottom-24 right-6 z-50 w-10 h-10 rounded-full bg-gradient-to-r from-red-500 to-orange-500 shadow-lg flex items-center justify-center"
				>
					<FiArrowUp size={20} className="text-white" />
				</motion.button>
			)}
		</AnimatePresence>
	);
};

// ============================================
// MAIN APP
// ============================================
const App: React.FC = () => {
	const [theme, setTheme] = useState<ThemeMode>("dark");
	const [devicePreview, setDevicePreview] = useState<DevicePreview>("desktop");
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);
	const [language, setLanguage] = useState<Language>("en");
	const [time, setTime] = useState(new Date());
	const [mobileMenu, setMobileMenu] = useState(false);
	const [followers, setFollowers] = useState<FollowersData>({
		instagram: 1482,
		telegram: 251,
		twitter: 2,
		tiktok: 459,
		threads: 0,
	});
	const [loading, setLoading] = useState(false);
	const [dashboard, setDashboard] = useState<DashboardData | null>(null);
	const themeData = themes[theme];

	const t = (key: string): string => {
		return translations[language][key as keyof typeof translations[typeof language]] || key;
	};

	useEffect(() => {
		const timer = setInterval(() => setTime(new Date()), 1000);
		trackVisit();
		loadDashboard();
		return () => clearInterval(timer);
	}, []);

	const loadDashboard = async () => {
		try {
			const data = await fetchDashboard();
			setDashboard(data);
			setFollowers(data.followers);
		} catch (error) {
			console.error("Dashboard error:", error);
		}
	};

	const refreshFollowers = async () => {
		setLoading(true);
		try {
			const data = await fetchFollowers(true);
			setFollowers(data);
		} catch (error) {
			console.error("Refresh error:", error);
		}
		setLoading(false);
	};

	const socialLinks = [
		{
			icon: FaInstagram,
			name: t("instagram"),
			username: "@haytseghakron",
			url: "https://instagram.com/haytseghakron",
			color: "#E4405F",
			delay: 0.1,
			followers: followers.instagram,
		},
		{
			icon: FaTelegram,
			name: t("telegram"),
			username: "@HayTseghakron",
			url: "https://t.me/HayTseghakron",
			color: "#26A5E4",
			delay: 0.15,
			followers: followers.telegram,
		},
		{
			icon: FaTwitter,
			name: t("twitter"),
			username: "@haytseghakron",
			url: "https://x.com/haytseghakron",
			color: "#1DA1F2",
			delay: 0.2,
			followers: followers.twitter,
		},
		{
			icon: TbBrandThreads,
			name: t("threads"),
			username: "haytseghakron",
			url: "https://threads.net/@haytseghakron",
			color: "#000000",
			delay: 0.25,
			followers: followers.threads,
		},
		{
			icon: FaFacebook,
			name: t("facebook"),
			username: "HayTseghakron",
			url: "https://www.facebook.com/share/185yWbehcY/",
			color: "#1877F2",
			delay: 0.3,
			followers: 0,
		},
		{
			icon: FaTiktok,
			name: t("tiktok"),
			username: "@haytseghakron",
			url: "https://tiktok.com/@haytseghakron",
			color: "#000000",
			delay: 0.35,
			followers: followers.tiktok,
		},
	];

	const totalFollowers = React.useMemo(() => {
		if (!followers) return 0;
		return Object.values(followers).reduce((a, b) => (a || 0) + (b || 0), 0);
	}, [followers]);

	const features = [
		{
			icon: FaCrown,
			title: t("communityHub"),
			desc: t("communityDesc"),
			color: "#FFD93D",
			delay: 0.7,
		},
		{
			icon: FaInfinity,
			title: t("active247"),
			desc: t("activeDesc"),
			color: "#6C5CE7",
			delay: 0.75,
		},
	];

	const deviceWidths = {
		mobile: "max-w-[400px] mx-auto",
		tablet: "max-w-[768px] mx-auto",
		desktop: "max-w-2xl mx-auto",
	};

	return (
		<LanguageContext.Provider value={{ language, setLanguage, t }}>
			<ThemeContext.Provider
				value={{
					theme,
					setTheme,
					devicePreview,
					setDevicePreview,
					isSettingsOpen,
					setIsSettingsOpen,
				}}
			>
				<div
					style={{ background: themeData.background, minHeight: "100vh" }}
					className="relative overflow-x-hidden"
				>
					<ScrollProgressBar />
					<ParticleSystem theme={theme} />
					<LanguageSwitcher />
					<ThemeSwitcher />
					<DevicePreview />
					<BackToTopButton />

					<motion.button
						className="fixed top-5 right-5 z-50 md:hidden w-10 h-10 rounded-full backdrop-blur-xl bg-white/10 border border-white/20 flex items-center justify-center"
						onClick={() => setMobileMenu(!mobileMenu)}
					>
						{mobileMenu ? <FiX size={20} /> : <FiMenu size={20} />}
					</motion.button>

					<div
						className={`relative z-10 container px-4 py-8 md:py-12 transition-all duration-300 ${deviceWidths[devicePreview]}`}
					>
						{/* Hero */}
						<GlassCard delay={0} className="p-8 text-center">
							<motion.div
								whileHover={{ scale: 1.05 }}
								className="w-24 h-24 mx-auto mb-5 rounded-full bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 p-1"
							>
								<div className="w-full h-full rounded-full bg-black flex items-center justify-center">
									<span className="text-3xl p-2 font-black bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
										<img src="/haytseghakron-white-transparent.png" alt="" />
									</span>
								</div>
							</motion.div>
							<h1 className="text-3xl md:text-4xl font-black mb-2 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
								{t("appName")}
							</h1>
							<p className="text-white/60 text-sm mb-3">
								{t("tagline")} 🔥
							</p>
							<div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
								<div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
								<span className="text-[10px] text-white/50">
									{t("activeNow")} • {time.toLocaleTimeString()}
								</span>
							</div>
						</GlassCard>

						{/* Stats Row */}
						<div className="grid grid-cols-3 gap-3 mt-6">
							<AnimatedStat
								value={totalFollowers}
								label={t("totalFollowers")}
								icon={FaUsers}
								delay={0.2}
							/>
							<AnimatedStat
								value={dashboard?.visits.total || 0}
								label={t("totalVisits")}
								icon={FaEye}
								delay={0.3}
							/>
							<AnimatedStat
								value={dashboard?.visits.unique || 0}
								label={t("uniqueVisitors")}
								icon={FaChartLine}
								delay={0.4}
							/>
						</div>

						{/* Stats Cards */}
						<div className="grid grid-cols-3 gap-2 mt-4">
							<StatsCard
								title={t("instagram")}
								value={followers.instagram}
								icon={FaInstagram}
								color="#E4405F"
							/>
							<StatsCard
								title={t("telegram")}
								value={followers.telegram}
								icon={FaTelegram}
								color="#26A5E4"
							/>
							<StatsCard
								title={t("twitter")}
								value={followers.twitter}
								icon={FaTwitter}
								color="#1DA1F2"
							/>
						</div>

						{/* Refresh Button */}
						<motion.button
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							onClick={refreshFollowers}
							disabled={loading}
							className="w-full mt-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/70 text-sm flex items-center justify-center gap-2"
						>
							{loading ? (
								<FaSpinner className="animate-spin" />
							) : (
								<FiRefreshCw />
							)}
							{loading ? t("updating") : t("refreshLiveFollowers")}
						</motion.button>

						{/* Social Links */}
						<div className="mt-8">
							<h2 className="text-lg font-bold text-center mb-4 text-white/80">
								{t("connectWithUs")}
							</h2>
							{socialLinks.map((link, idx) => (
								<SocialCard key={idx} {...link} />
							))}
						</div>

						{/* Features */}
						<div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
							{features.map((f, i) => (
								<FeatureCard key={i} {...f} />
							))}
						</div>

						{/* Quote */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.8 }}
							className="mt-8 p-5 rounded-xl text-center"
							style={{
								background: themeData.surface,
								border: `1px solid ${themeData.surface}`,
							}}
						>
							<FaQuoteLeft
								size={20}
								className="text-red-400/50 mx-auto mb-2"
							/>
							<p className="text-white/60 text-xs italic">
								{t("quote")}
							</p>
							<p className="text-[10px] text-white/30 mt-2">
								{t("quoteAuthor")}
							</p>
						</motion.div>

						{/* Footer */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 1 }}
							className="text-center mt-8 pt-5 border-t border-white/10 pb-8"
						>
							<div className="flex justify-center items-center gap-2 text-[10px] text-white/30">
								<FaHeart size={10} className="text-red-500" />
								<span>{t("footerText")}</span>
								{dashboard?.followers.lastUpdate && (
									<span className="ml-2">
										{t("updated")}:{" "}
										{new Date(
											dashboard.followers.lastUpdate,
										).toLocaleTimeString()}
									</span>
								)}
							</div>
						</motion.div>
					</div>

					{/* Mobile Menu */}
					<AnimatePresence>
						{mobileMenu && (
							<motion.div
								initial={{ x: "100%" }}
								animate={{ x: 0 }}
								exit={{ x: "100%" }}
								className="fixed inset-0 z-40 bg-black/95 backdrop-blur-2xl md:hidden"
							>
								<div className="flex flex-col items-center justify-center h-full gap-5">
									{socialLinks.map((link, idx) => (
										<a
											key={idx}
											href={link.url}
											target="_blank"
											className="flex items-center gap-3 text-white"
											style={{ color: link.color }}
										>
											<link.icon size={24} />
											<span>{link.name}</span>
										</a>
									))}
								</div>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</ThemeContext.Provider>
		</LanguageContext.Provider>
	);
};

export default App;