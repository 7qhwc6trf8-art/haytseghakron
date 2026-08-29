import React, { useEffect } from "react";
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import { ChevronRight } from "lucide-react";

export const iosSpring = { type: "spring", stiffness: 430, damping: 39, mass: 0.72 } as const;
export const androidMotion = { duration: 0.22, ease: [0.2, 0, 0, 1] } as const;
const pageEase = [0.22, 0.82, 0.22, 1] as const;

export function AnimatedNumber({ value }: { value: number }) {
  const reduce = useReducedMotion();
  const raw = useMotionValue(value);
  const display = useTransform(raw, (n) => Math.round(n).toLocaleString());
  useEffect(() => {
    if (reduce) { raw.set(value); return; }
    const controls = animate(raw, value, { duration: 0.48, ease: pageEase });
    return controls.stop;
  }, [raw, reduce, value]);
  return <motion.span>{display}</motion.span>;
}

export function IconButton({ label, children, onClick }: React.PropsWithChildren<{ label: string; onClick: () => void }>) {
  return <button type="button" className="ios-icon-button" aria-label={label} onClick={onClick}>{children}</button>;
}

export function LargeTitle({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string }) {
  return <div className="large-title-block">{eyebrow && <span className="large-title-eyebrow">{eyebrow}</span>}<h1>{title}</h1>{subtitle && <p>{subtitle}</p>}</div>;
}

export function SectionHeader({ title, subtitle, trailing }: { title: string; subtitle?: string; trailing?: string }) {
  return <div className="section-header"><div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>{trailing && <span>{trailing}</span>}</div>;
}

export function MenuRow({ icon, title, subtitle, onClick }: { icon: React.ReactNode; title: string; subtitle: string; onClick: () => void }) {
  return <button className="ios-row client-menu-row" type="button" onClick={onClick}><span className="client-menu-icon">{icon}</span><span className="row-copy"><strong>{title}</strong><small>{subtitle}</small></span><span className="row-trailing"><ChevronRight size={18}/></span></button>;
}
