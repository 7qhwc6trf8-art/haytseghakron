import { AnimatePresence, motion } from "framer-motion";
import { Check, Languages, Moon, Settings2, Sun } from "lucide-react";
import type { Appearance, Language } from "../../types";
import type { Translator } from "../../data/content";
import type { DevicePlatform } from "../../hooks/useDevicePlatform";

export function SettingsSheet({ open, onClose, language, setLanguage, appearance, setAppearance, t, platform }: { open:boolean; onClose:()=>void; language:Language; setLanguage:(v:Language)=>void; appearance:Appearance; setAppearance:(v:Appearance)=>void; t:Translator; platform:DevicePlatform }) {
  const langs = [
    {key:"hy" as const,title:"Հայերեն",subtitle:"Armenian"},
    {key:"en" as const,title:"English",subtitle:"English"},
    {key:"ru" as const,title:"Русский",subtitle:"Russian"},
  ];
  const apps = [
    {key:"light" as const,icon:Sun},
    {key:"dark" as const,icon:Moon},
    {key:"system" as const,icon:Settings2},
  ];

  return <AnimatePresence>{open && <>
    <motion.button
      className="sheet-backdrop"
      aria-label={t("done")}
      onClick={onClose}
      initial={{opacity:0}}
      animate={{opacity:1}}
      exit={{opacity:0}}
      transition={{duration:.2,ease:"easeOut"}}
    />
    <motion.aside
      className="settings-sheet"
      role="dialog"
      aria-modal="true"
      aria-label={t("settings")}
      initial={{y:"100%"}}
      animate={{y:0}}
      exit={{y:"100%"}}
      transition={platform === "android" ? {duration:.28,ease:[.2,0,0,1]} : {duration:.34,ease:[.32,.72,0,1]}}
    >
      <div className="sheet-grabber"/>
      <div className="sheet-navigation">
        <strong>{t("settings")}</strong>
        <button type="button" className="done-button" onClick={onClose}>{t("done")}</button>
      </div>

      <section className="settings-section">
        <h3>{t("appearance")}</h3>
        <div className="segmented-control">
          {apps.map(({key,icon:Icon})=><button type="button" key={key} className={appearance===key?"selected":""} onClick={()=>setAppearance(key)}>
            <span className="segment-label"><Icon size={14}/>{t(key)}</span>
          </button>)}
        </div>
      </section>

      <section className="settings-section">
        <h3>{t("language")}</h3>
        <div className="ios-group settings-list">
          {langs.map(item=><button type="button" key={item.key} className="ios-row settings-row" onClick={()=>setLanguage(item.key)}>
            <span className="language-symbol"><Languages size={18}/></span>
            <span className="row-copy"><strong>{item.title}</strong><small>{item.subtitle}</small></span>
            {language===item.key&&<span className="language-check"><Check size={14}/></span>}
          </button>)}
        </div>
      </section>
    </motion.aside>
  </>}</AnimatePresence>;
}
