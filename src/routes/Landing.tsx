"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// ─── THEME HOOK ────────────────────────────────────────────────────────────────
function useTheme() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      if (saved) return saved;
      // DEFAULT: always light mode
      return "light";
    }
    return "light";
  });
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);
  const toggleTheme = useCallback(() => setTheme((p) => (p === "light" ? "dark" : "light")), []);
  return { theme, toggleTheme };
}

// ─── SCROLL REVEAL ─────────────────────────────────────────────────────────────
function useScrollReveal(threshold = 0.1) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function Reveal({ children, delay = 0, style = {}, className = "" }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties; className?: string }) {
  const { ref, visible } = useScrollReveal();
  return (
    <div ref={ref} className={className} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(24px)",
      transition: `opacity 0.65s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.65s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      ...style,
    }}>{children}</div>
  );
}

// ─── COUNTER ──────────────────────────────────────────────────────────────────
function useCounter(target: number, duration: number, active: boolean) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let v = 0;
    const step = target / (duration / 16);
    const t = setInterval(() => {
      v = Math.min(v + step, target);
      setVal(Math.floor(v));
      if (v >= target) clearInterval(t);
    }, 16);
    return () => clearInterval(t);
  }, [active, target, duration]);
  return val;
}

// ─── SVG ICONS ────────────────────────────────────────────────────────────────
const Sun = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>;
const Moon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>;
const Arrow = ({ size = 14 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;
const Check = ({ size = 14, color = "var(--color-sage)" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const X = ({ size = 13, color = "var(--text-tertiary)" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const Star = ({ size = 13 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="var(--color-ochre)" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const ChevronDown = ({ size = 16 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>;
const Play = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5 3 19 12 5 21 5 3"/></svg>;
const Shield = ({ size = 13 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const Globe = ({ size = 13 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>;
const Clock = ({ size = 13 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const Brain = ({ size = 22 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2A2.5 2.5 0 017 4.5v0A2.5 2.5 0 014.5 7H4a2 2 0 00-2 2v0a2 2 0 002 2h.5A2.5 2.5 0 017 13.5v0A2.5 2.5 0 019.5 16v0A2.5 2.5 0 0112 13.5V4.5A2.5 2.5 0 009.5 2z"/><path d="M14.5 2A2.5 2.5 0 0117 4.5v0A2.5 2.5 0 0119.5 7H20a2 2 0 012 2v0a2 2 0 01-2 2h-.5A2.5 2.5 0 0117 13.5v0A2.5 2.5 0 0114.5 16v0A2.5 2.5 0 0112 13.5V4.5A2.5 2.5 0 0114.5 2z"/><path d="M12 16v6"/></svg>;
const Zap = ({ size = 22 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
const Target = ({ size = 22 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>;
const Building = ({ size = 22 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01"/></svg>;
const TrendingUp = ({ size = 22 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>;
const Mail = ({ size = 22 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
const Calendar = ({ size = 22 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const BarChart = ({ size = 22 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>;
const MessageSquare = ({ size = 22 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>;
const Lock = ({ size = 13 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>;
const Megaphone = ({ size = 22 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11l19-9-9 19-2-8-8-2z"/></svg>;
const Rocket = ({ size = 14 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09zM12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z"/><path d="M9 12H4l.5-1.5a6 6 0 014.5-4.5L9 6v6zM15 12h5l-.5 1.5a6 6 0 01-4.5 4.5L15 18v-6z"/></svg>;
const Zap2 = ({ size = 14 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
const Upload = ({ size = 14 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>;
const Code = ({ size = 14 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>;
const Package = ({ size = 14 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>;
const Layout = ({ size = 14 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>;
const Home = ({ size = 14 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const Dollar = ({ size = 14 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>;
const AlertTriangle = ({ size = 14 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
const WhatsApp = ({ size = 16 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>;
const FormIcon = ({ size = 16 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="4" width="20" height="16" rx="2"/><line x1="6" y1="8" x2="18" y2="8"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="6" y1="16" x2="12" y2="16"/></svg>;

const Logo = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="9" fill="var(--color-espresso)"/>
    <path d="M8 22L12 14L16 19L20 12L24 22" stroke="var(--color-ochre)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="22" cy="12" r="2.5" fill="var(--color-ochre)" opacity="0.9"/>
  </svg>
);

// ─── ANIMATED LEAD DASHBOARD ──────────────────────────────────────────────────
function LiveDashboard() {
  const [hotLeads, setHotLeads] = useState(31);
  const [aiMsg, setAiMsg] = useState("Ahmed Al-Rashid is ready to make an offer — call him now");
  const [newLead, setNewLead] = useState<string | null>(null);
  const msgs = [
    "Ahmed Al-Rashid is ready to make an offer — call him now",
    "New hot lead from Dubai Marina — responded in 4 seconds",
    "Sarah Mitchell's budget increased to $1.4M per latest reply",
    "3 cold leads re-engaged automatically by AI follow-up",
    "Deal alert: James is comparing 2 properties — nudge needed",
  ];
  const leads = [
    { name: "Ahmed Al-Rashid", init: "AA", score: "hot", status: "Viewing Booked", budget: "$850K", pct: 92 },
    { name: "Sarah Mitchell", init: "SM", score: "hot", status: "Negotiating", budget: "$1.2M", pct: 78 },
    { name: "James Okafor", init: "JO", score: "warm", status: "Qualified", budget: "$420K", pct: 54 },
    { name: "Priya Sharma", init: "PS", score: "warm", status: "Contacted", budget: "$670K", pct: 38 },
    { name: "Tom Andersen", init: "TA", score: "cold", status: "New Lead", budget: "$290K", pct: 15 },
  ];
  useEffect(() => {
    let idx = 0;
    const names = ["Maria Costa", "David Park", "Omar Hassan", "Nina Patel"];
    const budgets = ["$310K", "$520K", "$1.1M", "$445K"];
    const iv = setInterval(() => {
      idx = (idx + 1) % msgs.length;
      setAiMsg(msgs[idx]);
      setHotLeads((h: number) => h + (Math.random() > 0.6 ? 1 : 0));
      const pick = Math.floor(Math.random() * names.length);
      setNewLead(`${names[pick]} — ${budgets[pick]}`);
      setTimeout(() => setNewLead(null), 2800);
    }, 3500);
    return () => clearInterval(iv);
  }, []);

  const sc = (s: string) => s === "hot" ? "var(--color-terracotta)" : s === "warm" ? "#c98a1a" : "var(--text-tertiary)";
  const sbg = (s: string) => s === "hot" ? "rgba(195,95,70,0.09)" : s === "warm" ? "rgba(201,138,26,0.09)" : "var(--bg-hover)";

  return (
    <div style={{ width: "100%", maxWidth: 460, background: "var(--bg-secondary)", border: "1px solid var(--border-primary)", borderRadius: 18, overflow: "hidden", boxShadow: "var(--shadow-xl)", position: "relative", fontFamily: "var(--font-body)" }}>
      <div style={{ background: "var(--color-espresso)", padding: "10px 16px", display: "flex", alignItems: "center", gap: 6 }}>
        {["#ef4444","#f59e0b","#22c55e"].map((c,i) => <div key={i} style={{ width: 9, height: 9, borderRadius: "50%", background: c }}/>)}
        <span style={{ marginLeft: 8, color: "rgba(255,255,255,0.35)", fontSize: 10, fontWeight: 600, letterSpacing: "0.05em" }}>RevaCore — Live CRM</span>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", animation: "rc-pulse 1.5s infinite" }}/>
          <span style={{ color: "#22c55e", fontSize: 9, fontWeight: 800, letterSpacing: "0.08em" }}>LIVE</span>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", borderBottom: "1px solid var(--border-secondary)" }}>
        {[["142","Leads","var(--text-primary)"],[`${hotLeads}`,"Hot","var(--color-terracotta)"],["18","Viewings","var(--text-primary)"],["$94K","Pipeline","var(--color-sage)"]].map(([v,l,c],i) => (
          <div key={l} style={{ padding: "11px 8px", borderRight: i<3?"1px solid var(--border-secondary)":"none", textAlign:"center" }}>
            <div style={{ fontSize: 17, fontWeight: 800, color: c, lineHeight: 1 }}>{v}</div>
            <div style={{ fontSize: 9, color: "var(--text-tertiary)", marginTop: 3, textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 700 }}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{ background: "var(--bg-tertiary)", borderBottom: "1px solid var(--border-secondary)", padding: "9px 14px", display: "flex", alignItems: "center", gap: 8, minHeight: 38 }}>
        <div style={{ width: 22, height: 22, background: "var(--color-espresso)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Brain size={12} />
        </div>
        <span style={{ fontSize: 11, color: "var(--text-primary)", fontWeight: 500, flex: 1, fontStyle: "italic", lineHeight: 1.4 }}>{aiMsg}<span style={{ opacity: 0.3, animation: "rc-blink 0.8s step-end infinite" }}>▋</span></span>
      </div>
      <div style={{ padding: "6px 0 2px" }}>
        <div style={{ padding: "4px 14px 8px", display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: 9, fontWeight: 800, color: "var(--text-primary)", textTransform: "uppercase", letterSpacing: "0.09em" }}>Active Leads</span>
          <span style={{ fontSize: 9, color: "var(--text-tertiary)", fontWeight: 600 }}>Sorted by AI score</span>
        </div>
        {leads.map((lead, i) => (
          <div key={lead.name} style={{ padding: "8px 14px", display: "flex", alignItems: "center", gap: 10, borderBottom: i < leads.length-1 ? "1px solid var(--border-secondary)" : "none" }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: sbg(lead.score), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ fontSize: 9, fontWeight: 800, color: sc(lead.score) }}>{lead.init}</span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 4 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-primary)" }}>{lead.name}</span>
                <span style={{ fontSize: 8, padding: "1px 5px", borderRadius: 3, background: sbg(lead.score), color: sc(lead.score), fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.04em" }}>{lead.score}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ flex: 1, height: 3, background: "var(--bg-hover)", borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${lead.pct}%`, background: sc(lead.score), borderRadius: 2, transition: "width 1s ease" }}/>
                </div>
                <span style={{ fontSize: 9, color: "var(--text-tertiary)", whiteSpace: "nowrap" }}>{lead.status}</span>
              </div>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-primary)" }}>{lead.budget}</div>
            </div>
          </div>
        ))}
      </div>
      {newLead && (
        <div style={{ position: "absolute", bottom: 10, right: 10, background: "var(--color-espresso)", color: "#fff", fontSize: 11, padding: "8px 12px", borderRadius: 9, boxShadow: "var(--shadow-lg)", display: "flex", alignItems: "center", gap: 7, maxWidth: 220, fontWeight: 500, zIndex: 10, animation: "rc-slideup 0.3s ease" }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", flexShrink: 0 }}/>
          New lead: {newLead}
        </div>
      )}
    </div>
  );
}

// ─── AI CHAT DEMO ─────────────────────────────────────────────────────────────
function AIChatDemo() {
  const [step, setStep] = useState(0);
  const [typing, setTyping] = useState(false);
  const messages = [
    { role: "lead", text: "Hi, looking for a 3BR apartment in Dubai Marina, budget around 2M AED", time: "2:14 PM" },
    { role: "ai", text: "Hi! Thanks for reaching out. I found 3 properties in Dubai Marina matching your criteria. Would you like me to send the details?", time: "2:14 PM" },
    { role: "lead", text: "Yes please!", time: "2:15 PM" },
    { role: "ai", text: "Here are the top matches based on your budget and location. Unit 4B at Marina Gate — 3BR, 1,820 sqft, AED 1.95M. Available immediately. Shall I book a viewing?", time: "2:15 PM" },
    { role: "ai", text: "I have availability this Tuesday at 4pm or Wednesday at 11am. Which works for you?", time: "2:15 PM" },
  ];
  useEffect(() => {
    if (step >= messages.length) return;
    const delay = step === 0 ? 800 : step % 2 === 0 ? 600 : 1400;
    const t = setTimeout(() => {
      if (messages[step].role === "ai") {
        setTyping(true);
        setTimeout(() => { setTyping(false); setStep((s) => s + 1); }, 900);
      } else {
        setStep((s) => s + 1);
      }
    }, delay);
    return () => clearTimeout(t);
  }, [step]);

  return (
    <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-primary)", borderRadius: 18, overflow: "hidden", boxShadow: "var(--shadow-md)" }}>
      <div style={{ background: "var(--bg-tertiary)", padding: "14px 18px", borderBottom: "1px solid var(--border-secondary)", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--color-espresso)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Brain size={16} />
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>RevaCore AI</div>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e" }}/>
            <span style={{ fontSize: 11, color: "var(--text-tertiary)" }}>Active · Responding in seconds</span>
          </div>
        </div>
        <div style={{ marginLeft: "auto", fontSize: 10, padding: "4px 10px", background: "rgba(110,140,100,0.12)", borderRadius: 20, color: "var(--color-sage)", fontWeight: 700, border: "1px solid rgba(110,140,100,0.2)" }}>AI POWERED</div>
      </div>
      <div style={{ padding: "16px 16px", display: "flex", flexDirection: "column", gap: 10, minHeight: 280 }}>
        {messages.slice(0, step).map((msg, i) => (
          <div key={i} style={{ display: "flex", justifyContent: msg.role === "lead" ? "flex-end" : "flex-start", gap: 8 }}>
            {msg.role === "ai" && (
              <div style={{ width: 26, height: 26, borderRadius: "50%", background: "var(--color-espresso)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                <Brain size={12} />
              </div>
            )}
            <div style={{ maxWidth: "75%", padding: "10px 14px", borderRadius: msg.role === "lead" ? "14px 4px 14px 14px" : "4px 14px 14px 14px", background: msg.role === "lead" ? "var(--color-espresso)" : "var(--bg-tertiary)", color: msg.role === "lead" ? "#fff" : "var(--text-primary)", fontSize: 12.5, lineHeight: 1.55, fontWeight: 400, border: msg.role === "ai" ? "1px solid var(--border-secondary)" : "none", animation: "rc-fadeup 0.3s ease" }}>
              {msg.text}
              <div style={{ fontSize: 10, color: msg.role === "lead" ? "rgba(255,255,255,0.4)" : "var(--text-tertiary)", marginTop: 4, textAlign: "right" }}>{msg.time}</div>
            </div>
          </div>
        ))}
        {typing && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 26, height: 26, borderRadius: "50%", background: "var(--color-espresso)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Brain size={12} />
            </div>
            <div style={{ padding: "10px 14px", background: "var(--bg-tertiary)", borderRadius: "4px 14px 14px 14px", border: "1px solid var(--border-secondary)", display: "flex", gap: 4, alignItems: "center" }}>
              {[0,1,2].map((i) => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--text-tertiary)", animation: `rc-dot 1.2s ${i*0.2}s infinite` }}/>)}
            </div>
          </div>
        )}
      </div>
      <div style={{ padding: "10px 14px", borderTop: "1px solid var(--border-secondary)", background: "var(--bg-tertiary)", display: "flex", gap: 8 }}>
        <div style={{ flex: 1, padding: "9px 14px", background: "var(--bg-secondary)", border: "1px solid var(--border-primary)", borderRadius: 10, fontSize: 12, color: "var(--text-tertiary)" }}>Type a message...</div>
        <div style={{ width: 36, height: 36, background: "var(--color-espresso)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Arrow size={14} />
        </div>
      </div>
    </div>
  );
}

// ─── ROI CALCULATOR ────────────────────────────────────────────────────────────
function ROICalc() {
  const [leads, setLeads] = useState(50);
  const [rate, setRate] = useState(5);
  const [comm, setComm] = useState(15000);
  const plan = 129;
  const closed = Math.round(leads * (rate / 100));
  const rev = closed * comm;
  const extra = Math.round(closed * 0.34);
  const extraRev = extra * comm;
  const roi = Math.round(((extraRev - plan * 12) / (plan * 12)) * 100);

  return (
    <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-primary)", borderRadius: 18, padding: "28px 24px", boxShadow: "var(--shadow-md)" }}>
      <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-tertiary)", marginBottom: 6 }}>ROI Calculator</div>
      <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-primary)", lineHeight: 1.2, marginBottom: 20, fontFamily: "var(--font-display)", fontStyle: "italic" }}>What does RevaCore make you?</h3>
      {[
        { label: "Monthly leads", val: leads, set: setLeads, min: 10, max: 500, step: 10, fmt: (v: number) => v },
        { label: "Current close rate", val: rate, set: setRate, min: 1, max: 30, step: 1, fmt: (v: number) => `${v}%` },
        { label: "Avg. commission", val: comm, set: setComm, min: 2000, max: 100000, step: 1000, fmt: (v: number) => `$${v.toLocaleString()}` },
      ].map(sl => (
        <div key={sl.label} style={{ marginBottom: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
            <span style={{ fontSize: 12, fontWeight: 500, color: "var(--text-secondary)" }}>{sl.label}</span>
            <span style={{ fontSize: 13, fontWeight: 800, color: "var(--text-primary)" }}>{sl.fmt(sl.val)}</span>
          </div>
          <input type="range" min={sl.min} max={sl.max} step={sl.step} value={sl.val} onChange={e => sl.set(Number(e.target.value))} style={{ width: "100%", accentColor: "var(--color-espresso)", cursor: "pointer" }}/>
        </div>
      ))}
      <div style={{ background: "var(--bg-tertiary)", borderRadius: 12, padding: "18px 16px", marginTop: 4 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
          {[
            { label: "Deals/mo", val: closed, hi: false },
            { label: "Annual revenue", val: `$${rev.toLocaleString()}`, hi: false },
            { label: "+Deals with AI", val: `+${extra}`, hi: true },
            { label: "+Revenue/year", val: `+$${extraRev.toLocaleString()}`, hi: true },
          ].map(it => (
            <div key={it.label} style={{ background: "var(--bg-secondary)", borderRadius: 9, padding: "12px 12px", border: it.hi ? "1.5px solid var(--color-sage)" : "1px solid var(--border-primary)" }}>
              <div style={{ fontSize: 17, fontWeight: 800, color: it.hi ? "var(--color-sage)" : "var(--text-primary)", lineHeight: 1 }}>{it.val}</div>
              <div style={{ fontSize: 10, color: "var(--text-tertiary)", fontWeight: 600, marginTop: 4 }}>{it.label}</div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", paddingTop: 12, borderTop: "1px solid var(--border-secondary)" }}>
          <div style={{ fontSize: 30, fontWeight: 900, color: "var(--color-terracotta)", letterSpacing: "-0.04em" }}>{roi}x ROI</div>
          <div style={{ fontSize: 10, color: "var(--text-tertiary)", marginTop: 2 }}>annual return on RevaCore Pro ($129/mo)</div>
        </div>
      </div>
    </div>
  );
}

// ─── COMPETITOR COMPARISON TABLE ──────────────────────────────────────────────
function ComparisonTable() {
  const cols = ["RevaCore Pro", "Follow Up Boss", "Real Geeks", "BoldTrail"];
  const rows = [
    { feature: "AI lead scoring (hot/warm/cold)", vals: [true, false, false, false] },
    { feature: "AI responds to leads in <60 sec", vals: [true, false, false, false] },
    { feature: "7-day AI follow-up sequences", vals: [true, true, true, true] },
    { feature: "AI marketing generator", vals: [true, false, false, false] },
    { feature: "Deal analyzer + PDF export", vals: [true, false, false, false] },
    { feature: "Property portfolio management", vals: [true, false, false, false] },
    { feature: "Viewing booking automation", vals: [true, false, false, true] },
    { feature: "6 lead sources incl. WhatsApp", vals: [true, false, false, false] },
    { feature: "Built for global markets", vals: [true, false, false, false] },
    { feature: "Monthly price (solo agent)", vals: ["$129", "$69 + add-ons", "$299/mo", "$499/mo"] },
  ];

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 13 }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", padding: "12px 16px", fontWeight: 700, color: "var(--text-tertiary)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", borderBottom: "1px solid var(--border-primary)" }}>Feature</th>
            {cols.map((c, ci) => (
              <th key={c} style={{ textAlign: "center", padding: "12px 12px", fontWeight: 800, fontSize: 12, borderBottom: ci === 0 ? "2px solid var(--color-ochre)" : "1px solid var(--border-primary)", color: ci === 0 ? "var(--color-ochre)" : "var(--text-secondary)", background: ci === 0 ? "rgba(180,130,70,0.04)" : "transparent", borderRadius: ci === 0 ? "8px 8px 0 0" : 0 }}>
                {c}
                {ci === 0 && <div style={{ fontSize: 9, color: "var(--color-sage)", fontWeight: 700, marginTop: 2 }}>← Best value</div>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} style={{ background: ri % 2 === 0 ? "var(--bg-tertiary)" : "var(--bg-secondary)" }}>
              <td style={{ padding: "11px 16px", color: "var(--text-secondary)", fontWeight: 500, borderBottom: "1px solid var(--border-secondary)" }}>{row.feature}</td>
              {row.vals.map((val, vi) => (
                <td key={vi} style={{ textAlign: "center", padding: "11px 12px", borderBottom: "1px solid var(--border-secondary)", background: vi === 0 ? "rgba(180,130,70,0.03)" : "transparent", fontWeight: vi === 0 ? 700 : 400, color: vi === 0 ? "var(--text-primary)" : "var(--text-secondary)" }}>
                  {typeof val === "boolean"
                    ? val ? <Check size={15} color={vi === 0 ? "var(--color-sage)" : "var(--text-tertiary)"}/> : <X size={13} color="var(--text-tertiary)"/>
                    : <span style={{ fontSize: 12, color: vi === 0 ? "var(--color-ochre)" : "var(--text-tertiary)", fontWeight: vi === 0 ? 800 : 600 }}>{val}</span>
                  }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const statsRef = useRef(null);
  const [statsVisible, setStatsVisible] = useState(false);
  const [pricingTab, setPricingTab] = useState("monthly");
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const leadsCount = useCounter(12400, 1800, statsVisible);
  const dealsCount = useCounter(3200, 2000, statsVisible);
  const agentsCount = useCounter(840, 1600, statsVisible);

  useEffect(() => {
    // Force light mode on initial load
    document.documentElement.setAttribute("data-theme", "light");
    localStorage.setItem("theme", "light");
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStatsVisible(true); }, { threshold: 0.2 });
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const iv = setInterval(() => setActiveTestimonial(p => (p + 1) % testimonials.length), 5000);
    return () => clearInterval(iv);
  }, []);

  const features = [
    { Icon: Brain, title: "AI Lead Scoring", desc: "Our AI analyzes every lead and scores them Hot, Warm, or Cold based on real buying signals — not guesswork. Focus your energy where commissions live.", badge: "AI", badgeColor: "var(--color-terracotta)" },
    { Icon: Zap, title: "Auto Follow-Ups", desc: "Set it and forget it. The AI sends personalized emails, WhatsApp messages, and SMS over 7 days until the lead responds — while you're closing other deals.", badge: "Core", badgeColor: "var(--color-ochre)" },
    { Icon: Target, title: "Pipeline Management", desc: "Drag-and-drop Kanban board built specifically for real estate. Track deals from New to Closed with zero friction and full visibility.", badge: "Core", badgeColor: "var(--color-ochre)" },
    { Icon: Megaphone, title: "AI Marketing Generator", desc: "Generate property descriptions, social media posts, and email campaigns in seconds. All tailored to your listings. Saves 4+ hours every week.", badge: "Pro", badgeColor: "var(--color-sage)" },
    { Icon: BarChart, title: "Deal Analyzer", desc: "Calculate cap rate, ROI, GRM, and cash flow instantly. Export branded PDF reports clients will keep on their desk — makes you look like the best-prepared agent in the room.", badge: "Pro", badgeColor: "var(--color-sage)" },
    { Icon: Building, title: "Property Portfolio", desc: "Manage your entire listing portfolio with image galleries, feature tags, and status tracking. Every property gets a shareable public URL.", badge: "Core", badgeColor: "var(--color-ochre)" },
    { Icon: MessageSquare, title: "AI Chat Responses", desc: "The AI responds to every new lead in under 60 seconds, 24/7 — qualifying them while you sleep, eat, or negotiate other deals. No more slow response losses.", badge: "AI", badgeColor: "var(--color-terracotta)" },
    { Icon: Calendar, title: "Viewing Bookings", desc: "Leads book directly from your calendar. Confirmations and reminders fire automatically. Zero admin, zero no-shows.", badge: "Core", badgeColor: "var(--color-ochre)" },
    { Icon: TrendingUp, title: "Full Analytics", desc: "Know your close rate, source quality, AI response rate, and revenue per lead. Make every decision data-driven — know exactly which lead sources make you money.", badge: "Pro", badgeColor: "var(--color-sage)" },
  ];

  const leadSources = [
    { Icon: WhatsApp, title: "WhatsApp", desc: "Leads message you on WhatsApp — AI handles it instantly. Qualification, scoring, follow-ups, all automated." },
    { Icon: Mail, title: "Email", desc: "Every email inquiry gets an AI response in under 60 seconds. No lead ever waits more than a minute." },
    { Icon: FormIcon, title: "Embedded Form", desc: "Drop our form on your website. Captures leads directly into your pipeline with instant AI scoring." },
    { Icon: Layout, title: "Hosted Forms", desc: "Use our branded hosted forms. Share a link or embed anywhere — live in minutes, no developer needed." },
    { Icon: Code, title: "Webhook API", desc: "Connect any lead source via webhook. Portals, third-party platforms — all piped in automatically." },
    { Icon: Upload, title: "CSV Import", desc: "Import existing leads from Excel, Google Sheets, or any CRM export. Bulk import in seconds, AI scores them all." },
  ];

  const testimonials = [
    { quote: "I used to lose 30–40% of leads because I was too slow to respond. RevaCore replies in seconds and scores every lead while I sleep. My conversion went from 4% to 11% in 60 days.", name: "Ahmed K.", role: "Property Consultant, Dubai", init: "AK", result: "+23 extra deals in Q1" },
    { quote: "The AI marketing generator alone saves me 4 hours every week. Property descriptions, Instagram captions, WhatsApp broadcasts — done in one click. It's like having a copywriter on salary.", name: "Sarah M.", role: "Senior Agent, London", init: "SM", result: "$180K extra commissions" },
    { quote: "The deal analyzer is a game changer. I run full ROI calculations in minutes and hand clients a professional PDF. Makes me look like the most prepared agent in the room — every time.", name: "James O.", role: "Property Broker, Lagos", init: "JO", result: "3 deals in first week" },
    { quote: "My team was drowning in WhatsApp messages. Now leads are qualified, scored, and routed automatically. Response time went from hours to seconds. We haven't looked back.", name: "Priya S.", role: "Agency Director, Toronto", init: "PS", result: "5 agents, all on Pro" },
  ];

  const faqs = [
    { q: "How is RevaCore different from Follow Up Boss or Real Geeks?", a: "Most CRMs store your leads and let you manually follow up. RevaCore's AI actually talks to your leads — it responds, qualifies, scores, and nurtures them 24/7 without you lifting a finger. On top of that, we include features competitors charge separately for: AI marketing, deal analyzer, viewing bookings, and property portfolio management — all in one platform, built specifically for real estate." },
    { q: "Do I need technical skills to use RevaCore?", a: "None at all. RevaCore is built for real estate professionals, not developers. If you can send an email, you can use RevaCore. Setup takes under 10 minutes and we have live chat support from day one." },
    { q: "How does the AI lead qualification work?", a: "When a lead submits your form, AI immediately sends a personalized qualification message — asking about budget, location, timeline, and financing. It reads their replies, scores the lead Hot/Warm/Cold, and notifies you. You step in only when they're ready to talk." },
    { q: "Why should I pay $129/mo instead of using a cheaper tool?", a: "Because one extra deal per month more than pays for the entire year. If your average commission is $10,000 and RevaCore helps you close just one more deal a year — that's a 6,400% ROI. We've seen agents go from 4% to 11% conversion in 60 days. Compare that to tools at $49/mo with no AI automation: you're saving $80/mo but losing thousands in commissions." },
    { q: "Can the AI really respond to leads automatically?", a: "Yes. Every new lead gets a response in under 60 seconds, 24/7 — weekends, holidays, 3am. The AI introduces itself as your assistant, qualifies the lead, and starts a follow-up sequence. You get a notification only when they're hot and ready to talk." },
    { q: "Does it work with WhatsApp?", a: "Yes. RevaCore integrates with WhatsApp Business API. Leads can message you on WhatsApp and the AI handles it — qualification, scoring, follow-up sequences, all automated." },
    { q: "Is there a free trial?", a: "Yes — 14 full days of Pro access. No credit card required. You experience the entire platform before you decide anything. Most agents close their first AI-qualified deal within the trial period." },
    { q: "What markets do you support?", a: "RevaCore works globally. Agents in UAE, UK, Canada, Nigeria, Australia, South Africa, Ghana, Kenya, Singapore, and more use it daily. Payments are processed securely through Paddle — supporting global payment methods including cards, PayPal, Apple Pay, and Google Pay." },
    { q: "Is my data secure?", a: "Very. We use Supabase PostgreSQL with row-level security — only your team sees your data. All connections are TLS encrypted. We never sell or share your data with third parties, period." },
  ];

  const annualMultiplier = pricingTab === "annual" ? 0.8 : 1;

  // ─── UPDATED PRICING — market-informed, upsell-optimized ─────────────────
  // Market context: BoldTrail ~$499/mo, Lofty ~$449/mo, Real Geeks $299/mo,
  // AgentiveAIQ Pro $129/mo, StreamlineREI from $99/mo
  // RevaCore offers more features at a competitive price — Pro is the value anchor
const plans = [
    {
      name: "Starter",
      monthly: 99,
      desc: "Everything a solo agent needs to start closing smarter.",
      pop: false,
      cta: "Start Free Trial",
      highlight: null,
      features: [
        { text: "Up to 100 leads/month", included: true },
        { text: "15 active property listings", included: true },
        { text: "AI-powered lead follow-up sequences", included: true },
        { text: "Visual pipeline CRM (Kanban board)", included: true },
        { text: "Lead status badges (Hot / Warm / Cold)", included: true },
        { text: "Public shareable listing pages", included: true },
        { text: "Manual + form-based lead capture", included: true },
        { text: "Basic analytics overview", included: true },
        { text: "Paddle-secured global payments", included: true },
        { text: "AI lead scoring engine", included: false },
        { text: "AI marketing & content generator", included: false },
        { text: "Deal analyzer + investment reports", included: false },
        { text: "Full multi-channel lead capture", included: false },
        { text: "Advanced analytics & forecasting", included: false },
        { text: "Team seats & agent management", included: false },
      ],
      warning: "Most agents outgrow Starter within 30 days.",
    },
    {
      name: "Pro",
      monthly: 199,
      desc: "The complete AI system built to close more deals, faster.",
      pop: true,
      cta: "Start Free Trial — Pro Access",
      highlight: "Most popular — agents close 34% more deals on average",
      features: [
        { text: "Up to 1,000 leads/month", included: true },
        { text: "100 active property listings", included: true },
        { text: "AI lead scoring engine (Hot / Warm / Cold)", included: true },
        { text: "Real-time lead score updates", included: true },
        { text: "7-day AI follow-up sequences", included: true },
        { text: "Full pipeline CRM with unlimited stages", included: true },
        { text: "Deal analyzer — ROI, Cap Rate, Cash Flow", included: true },
        { text: "5-year property appreciation projections", included: true },
        { text: "AI risk assessment per deal", included: true },
        { text: "Branded investment report PDF export", included: true },
        { text: "AI marketing & content generator", included: true },
        { text: "Property description AI writer", included: true },
        { text: "Social media post generator (IG, LinkedIn, X)", included: true },
        { text: "Email campaign builder with AI copy", included: true },
        { text: "All 5 lead capture channels", included: true },
        { text: "Bulk CSV lead import", included: true },
        { text: "Embeddable website lead form", included: true },
        { text: "Advanced analytics & revenue forecasting", included: true },
        { text: "Campaign performance tracking", included: true },
       
      ],
      warning: null,
    },
    {
      name: "Agency",
      monthly: 399,
      desc: "Built for high-performance teams and brokerages that dominate their market.",
      pop: false,
      cta: "Get Started — Agency Plan",
      highlight: null,
      features: [
        { text: "Everything in Pro — unlimited", included: true },
        { text: "Unlimited leads & active properties", included: true },
        { text: "Up to 10 agent seats included", included: true },
        { text: "Smart lead routing by agent or availability", included: true },
        { text: "Manager performance dashboard", included: true },
        { text: "Team-wide analytics & deal forecasting", included: true },
        { text: "Commission tracking & revenue reports", included: true },
        { text: "Custom AI scoring rules per agent", included: true },
        { text: "Custom pipeline stages per team", included: true },
        { text: "Role-based access control", included: true },
        { text: "API access + webhook integrations", included: true },
        { text: "White-label ready (your brand, your platform)", included: true },
        { text: "Priority support — 1hr response guarantee", included: true },
        { text: "Early access to all new features", included: true },
      ],
      warning: null,
    },
  ];

  const problems = [
    { Icon: Clock, text: "You're losing 40% of leads because you respond too slowly — the first agent to reply wins the deal" },
    { Icon: TrendingUp, text: "You spend 15+ hours a week on admin instead of closing deals that actually pay" },
    { Icon: Mail, text: "Your follow-ups are inconsistent — leads go cold, forget you exist, and sign with a competitor" },
  ];
  const solutions = [
    { Icon: Zap2, text: "AI responds to every lead in under 60 seconds, 24/7 — even at 3am on a Sunday" },
    { Icon: Brain, text: "Automated sequences nurture leads for 7 days without you touching a single button" },
    { Icon: Target, text: "Smart scoring tells you exactly which leads are ready to buy right now" },
  ];

  const brokerages = ["Emaar Brokers", "DAMAC Properties", "RE/MAX Global", "Engel & Völkers", "Knight Frank", "JLL Real Estate"];
  const F = "var(--font-body)";
  const DARK_BG = "#373026";
  const DARK_BG_TEXT = "#F7F3EC";
  const DARK_BG_MUTED = "rgba(247,243,236,0.35)";

  return (
    <div style={{ fontFamily: F, background: "var(--bg-primary)", color: "var(--text-primary)", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;1,9..40,400&family=Fraunces:ital,opsz,wght@1,9..144,700;1,9..144,900&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth;-webkit-font-smoothing:antialiased}

        /* DEFAULT: always light mode */
        :root,[data-theme="light"]{
          --color-espresso:#373026;--color-ochre:#B48246;--color-terracotta:#C35F46;--color-sage:#6E8C64;--color-cream:#F7F3EC;--color-slate:#5A555F;
          --bg-primary:#F7F3EC;--bg-secondary:#FFFFFF;--bg-tertiary:#F0EBE3;--bg-hover:#E8E2D9;
          --text-primary:#373026;--text-secondary:#5A555F;--text-tertiary:#9c9690;
          --border-primary:#DDD6CC;--border-secondary:#EAE4DB;
          --shadow-sm:0 1px 3px rgba(55,48,38,.05);--shadow-md:0 4px 18px rgba(55,48,38,.08);--shadow-lg:0 12px 40px rgba(55,48,38,.12);--shadow-xl:0 24px 64px rgba(55,48,38,.16);
          --font-body:'DM Sans',system-ui,sans-serif;--font-display:'Fraunces',Georgia,serif;
        }
        [data-theme="dark"]{
          --color-espresso:#F7F3EC;--color-ochre:#D4A55A;--color-terracotta:#E07B60;--color-sage:#8BAA82;--color-cream:#1e1a16;--color-slate:#9c9690;
          --bg-primary:#1e1a16;--bg-secondary:#26211b;--bg-tertiary:#2e2820;--bg-hover:#3a3028;
          --text-primary:#F0EBE3;--text-secondary:#a09890;--text-tertiary:#6e6860;
          --border-primary:#3a3028;--border-secondary:#2e2820;
          --shadow-sm:0 1px 3px rgba(0,0,0,.3);--shadow-md:0 4px 18px rgba(0,0,0,.38);--shadow-lg:0 12px 40px rgba(0,0,0,.48);--shadow-xl:0 24px 64px rgba(0,0,0,.56);
        }

        @keyframes rc-fadeup{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes rc-slideup{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes rc-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
        @keyframes rc-pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(.75)}}
        @keyframes rc-blink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes rc-dot{0%,80%,100%{transform:scale(0.7);opacity:.4}40%{transform:scale(1.1);opacity:1}}
        @keyframes rc-ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}

        .rc-float{animation:rc-float 6s ease-in-out infinite}
        .rc-nav-link{color:var(--text-secondary)!important;text-decoration:none;font-size:.875rem;font-weight:500;transition:color .15s}
        .rc-nav-link:hover{color:var(--text-primary)!important}
        .rc-btn-primary{transition:all .2s ease!important}
        .rc-btn-primary:hover{opacity:.85!important;transform:translateY(-1px)!important}
        .rc-btn-ghost:hover{background:var(--bg-hover)!important}
        .rc-card-hover{transition:all .3s cubic-bezier(0.16,1,0.3,1)!important;cursor:default}
        .rc-card-hover:hover{transform:translateY(-4px)!important;box-shadow:var(--shadow-lg)!important}
        .rc-faq-item{transition:border-color .2s ease}
        input[type=range]{height:4px;border-radius:4px;cursor:pointer}

        @media(max-width:900px){
          .rc-hero-grid{flex-direction:column!important}
          .rc-hero-right{display:none!important}
          .rc-nav-desktop{display:none!important}
          .rc-hide-mobile{display:none!important}
          .rc-grid3{grid-template-columns:repeat(2,1fr)!important}
          .rc-grid2{grid-template-columns:1fr!important}
          .rc-pricing-grid{grid-template-columns:1fr!important}
          .rc-steps{grid-template-columns:1fr 1fr!important}
        }
        @media(max-width:640px){
          .rc-grid3{grid-template-columns:1fr!important}
          .rc-steps{grid-template-columns:1fr!important}
          .rc-hero-ctas{flex-direction:column!important;align-items:flex-start!important}
          .rc-section{padding:64px 20px!important}
          .rc-hero{padding:60px 20px 72px!important}
          .rc-nav-pad{padding:0 20px!important}
          h1{font-size:2.8rem!important}
        }
      `}</style>

      {/* ── ANNOUNCEMENT BAR ── */}
      <div style={{ background: DARK_BG, padding: "9px 24px", textAlign: "center", zIndex: 201, position: "relative" }}>
        <span style={{ fontSize: 12, fontWeight: 500, color: DARK_BG_MUTED }}>
          Limited offer: Get 3 months free when you upgrade to annual billing.{" "}
          <a href="/signup" style={{ color: "var(--color-ochre)", textDecoration: "underline", fontWeight: 700 }}>Claim now →</a>
        </span>
      </div>

      {/* ── NAVIGATION ── */}
      <header style={{ position: "sticky", top: 0, zIndex: 200, height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 48px", background: scrolled ? "rgba(247,243,236,0.92)" : "var(--bg-primary)", backdropFilter: scrolled ? "blur(20px)" : "none", borderBottom: scrolled ? "1px solid var(--border-primary)" : "1px solid transparent", transition: "all .25s ease" }} className="rc-nav-pad">
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <Logo />
          <span style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 700, fontSize: "1.15rem", color: "var(--text-primary)", letterSpacing: "-.01em" }}>RevaCore</span>
        </a>
        <nav className="rc-nav-desktop" style={{ display: "flex", gap: 32 }}>
          {[["Features","#features"],["Compare","#compare"],["Pricing","#pricing"],["FAQ","#faq"]].map(([l,h]) => (
            <a key={l} href={h} className="rc-nav-link">{l}</a>
          ))}
        </nav>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button onClick={toggleTheme} style={{ padding: 8, borderRadius: 10, border: "1px solid var(--border-primary)", background: "var(--bg-secondary)", cursor: "pointer", color: "var(--text-secondary)", display: "flex", alignItems: "center", transition: "all .2s" }} aria-label="Toggle theme">
            {theme === "light" ? <Moon /> : <Sun />}
          </button>
          <a href="/login" className="rc-hide-mobile" style={{ fontSize: ".875rem", fontWeight: 500, color: "var(--text-secondary)", textDecoration: "none" }}>Sign in</a>
          <a href="/signup" className="rc-btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: 7, background: DARK_BG, color: DARK_BG_TEXT, fontWeight: 700, fontSize: ".8rem", padding: "9px 20px", borderRadius: 10, cursor: "pointer", textDecoration: "none", transition: "all .2s", letterSpacing: ".01em" }}>
            Start Free Trial <Arrow size={12} />
          </a>
        </div>
      </header>

      {/* ── HERO ── */}
      <section style={{ minHeight: "90vh", background: "var(--bg-primary)", position: "relative", overflow: "hidden", borderBottom: "1px solid var(--border-primary)" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(var(--border-secondary) 1px, transparent 1px)", backgroundSize: "36px 36px", opacity: 0.7, pointerEvents: "none" }}/>
        <div style={{ position: "absolute", top: "15%", right: "2%", width: 700, height: 700, background: `radial-gradient(circle, rgba(180,130,70,0.07) 0%, transparent 65%)`, pointerEvents: "none" }}/>

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "96px 48px 80px", display: "flex", alignItems: "center", gap: 64, minHeight: "90vh", position: "relative", zIndex: 1 }} className="rc-hero-grid rc-hero">
          <div style={{ flex: "0 0 52%", minWidth: 0 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 14px 7px 10px", background: "var(--bg-secondary)", border: "1px solid var(--border-primary)", borderRadius: 100, marginBottom: 28, boxShadow: "var(--shadow-sm)" }}>
              <Rocket size={16} />
              <span style={{ fontSize: ".75rem", fontWeight: 600, color: "var(--text-secondary)", letterSpacing: ".01em" }}>AI-Powered CRM for Real Estate</span>
            </div>

            <h1 style={{ fontWeight: 800, fontSize: "clamp(3rem,5.5vw,5.2rem)", lineHeight: 1.0, letterSpacing: "-.04em", color: "var(--text-primary)", marginBottom: 24 }}>
              Close More Deals<br/>
              <span style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 900, color: "var(--color-ochre)" }}>While You Sleep.</span>
            </h1>

            {/* Value prop — specific and benefit-driven */}
            <p style={{ fontSize: "1.05rem", color: "var(--text-secondary)", lineHeight: 1.75, maxWidth: 480, marginBottom: 20 }}>
              RevaCore's AI responds to leads in under 60 seconds, scores them Hot/Warm/Cold, and follows up for 7 days — automatically. Agents using it close <strong style={{ color: "var(--text-primary)" }}>34% more deals</strong> without hiring extra staff.
            </p>

            {/* Cost-of-inaction nudge */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", background: "rgba(195,95,70,0.06)", border: "1px solid rgba(195,95,70,0.2)", borderRadius: 10, marginBottom: 28, maxWidth: 480 }}>
              <AlertTriangle size={14} />
              <span style={{ fontSize: ".82rem", color: "var(--color-terracotta)", fontWeight: 600 }}>The average agent loses $14,000/year from slow or missed lead responses.</span>
            </div>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 32 }} className="rc-hero-ctas">
              <a href="/signup" className="rc-btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: DARK_BG, color: DARK_BG_TEXT, fontWeight: 700, fontSize: "1rem", padding: "14px 30px", borderRadius: 12, textDecoration: "none", transition: "all .2s", boxShadow: "var(--shadow-md)", letterSpacing: ".01em" }}>
                Start Free Trial — 14 Days Free <Arrow size={15} />
              </a>
              <a href="#features" className="rc-btn-ghost" style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "transparent", color: "var(--text-primary)", fontWeight: 600, fontSize: ".9rem", padding: "14px 22px", border: "1.5px solid var(--border-primary)", borderRadius: 12, textDecoration: "none", transition: "background .2s", cursor: "pointer" }}>
                <Play /> See How It Works
              </a>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
              <div style={{ display: "flex" }}>
                {["AK","SM","JO","PS","TA"].map((init, i) => (
                  <div key={init} style={{ width: 34, height: 34, borderRadius: "50%", border: "2.5px solid var(--bg-primary)", background: "var(--bg-secondary)", color: "var(--text-primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 800, marginLeft: i === 0 ? 0 : -10, zIndex: 5-i, boxShadow: "var(--shadow-sm)" }}>{init}</div>
                ))}
              </div>
              <div>
                <div style={{ display: "flex", gap: 2, marginBottom: 2 }}>{[...Array(5)].map((_,i) => <Star key={i} size={12}/>)}</div>
                <p style={{ fontSize: ".72rem", color: "var(--text-secondary)", fontWeight: 500 }}><strong style={{ color: "var(--text-primary)" }}>4.9/5</strong> — Trusted by 500+ agents across UAE, Canada & Nigeria</p>
              </div>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
              {[[Shield,"No credit card"],[Clock,"Setup in 10 min"],[Globe,"Works worldwide"],[Lock,"Enterprise security"]].map(([Ic, text], i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <Ic size={13} />
                  <span style={{ fontSize: ".75rem", color: "var(--text-tertiary)", fontWeight: 500 }}>{text as string}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rc-hero-right" style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
            <div className="rc-float" style={{ position: "relative", width: "100%", maxWidth: 460 }}>
              <LiveDashboard />
              <div style={{ position: "absolute", top: -20, left: -28, background: "var(--bg-secondary)", border: "1px solid var(--border-primary)", borderRadius: 14, padding: "10px 14px", boxShadow: "var(--shadow-lg)", display: "flex", alignItems: "center", gap: 9 }}>
                <div style={{ width: 34, height: 34, background: "rgba(195,95,70,0.1)", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Zap2 size={16} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 11, color: "var(--text-primary)" }}>Hot Lead Detected</div>
                  <div style={{ fontSize: 10, color: "var(--text-tertiary)" }}>AI responded in 4 seconds</div>
                </div>
              </div>
              <div style={{ position: "absolute", bottom: -20, right: -28, background: DARK_BG, borderRadius: 14, padding: "10px 14px", boxShadow: "var(--shadow-lg)", display: "flex", alignItems: "center", gap: 9 }}>
                <div style={{ width: 34, height: 34, background: "rgba(255,255,255,.12)", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Dollar size={16} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 11, color: DARK_BG_TEXT }}>Deal Closed — $850K</div>
                  <div style={{ fontSize: 10, color: "rgba(247,243,236,0.4)" }}>Commission: $25,500</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TICKER ── */}
      <div style={{ overflow: "hidden", borderBottom: "1px solid var(--border-primary)", padding: "11px 0", background: DARK_BG }}>
        <div style={{ display: "flex", animation: "rc-ticker 30s linear infinite", whiteSpace: "nowrap" }}>
          {[...Array(3)].map((_,ri) => (
            <span key={ri}>
              {["AI Lead Scoring","Auto Follow-Ups","Pipeline CRM","Deal Analyzer","AI Marketing","Property Listings","Viewing Bookings","Analytics Dashboard","34% More Deals","ROI Calculator"].map((item, i) => (
                <span key={`${ri}-${i}`} style={{ padding: "0 24px", fontSize: ".7rem", fontWeight: 700, color: DARK_BG_MUTED, letterSpacing: ".08em", textTransform: "uppercase" }}>
                  {item} <span style={{ color: "rgba(247,243,236,0.15)", marginLeft: 24 }}>·</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ── TRUST / LOGOS ── */}
      <section style={{ padding: "40px 48px", borderBottom: "1px solid var(--border-primary)", background: "var(--bg-secondary)" }} className="rc-section">
        <div style={{ maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: ".72rem", fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--text-tertiary)", marginBottom: 20 }}>Trusted by top brokerages worldwide</p>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10 }}>
            {brokerages.map(b => (
              <div key={b} style={{ padding: "8px 20px", background: "var(--bg-tertiary)", border: "1px solid var(--border-primary)", borderRadius: 8, fontSize: 12, fontWeight: 600, color: "var(--text-tertiary)", letterSpacing: ".01em" }}>{b}</div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section ref={statsRef} style={{ padding: "72px 48px", background: "var(--bg-primary)", borderBottom: "1px solid var(--border-primary)" }} className="rc-section">
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3,1fr)", textAlign: "center" }} className="rc-grid3">
          {[
            { val: leadsCount.toLocaleString(), suf: "+", label: "Leads Managed", sub: "across all agents globally" },
            { val: dealsCount.toLocaleString(), suf: "+", label: "Deals Tracked", sub: "worth $2.4B+ combined" },
            { val: agentsCount.toLocaleString(), suf: "+", label: "Active Agents", sub: "across 12 countries" },
          ].map((s,i) => (
            <Reveal key={s.label} delay={i*100}>
              <div style={{ padding: "0 28px", borderRight: i<2?"1px solid var(--border-primary)":"none" }}>
                <div style={{ fontWeight: 900, fontSize: "clamp(2rem,4vw,3.4rem)", lineHeight: 1, letterSpacing: "-.05em", color: "var(--text-primary)" }}>
                  {s.val}<span style={{ color: "var(--color-ochre)" }}>{s.suf}</span>
                </div>
                <div style={{ fontWeight: 700, fontSize: ".95rem", color: "var(--text-primary)", marginTop: 8 }}>{s.label}</div>
                <div style={{ fontSize: ".8rem", color: "var(--text-tertiary)", marginTop: 4 }}>{s.sub}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── PROBLEM / SOLUTION ── */}
      <section style={{ padding: "88px 48px", background: "var(--bg-tertiary)", borderBottom: "1px solid var(--border-primary)" }} className="rc-section">
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <h2 style={{ fontWeight: 800, fontSize: "clamp(1.8rem,3.5vw,2.8rem)", lineHeight: 1.05, letterSpacing: "-.03em", color: "var(--text-primary)", marginBottom: 14 }}>
                Your Leads Are Going Cold.{" "}
                <span style={{ fontFamily: "var(--font-display)", fontStyle: "italic", color: "var(--color-ochre)" }}>We Fix That.</span>
              </h2>
              <p style={{ fontSize: ".95rem", color: "var(--text-secondary)", maxWidth: 520, margin: "0 auto", lineHeight: 1.7 }}>
                Most agents lose deals before they even know a lead exists. The first agent to respond wins — and your competitors are already using AI to respond faster.
              </p>
            </div>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 24, alignItems: "center" }} className="rc-grid2">
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {problems.map((p, i) => (
                <Reveal key={i} delay={i * 80}>
                  <div className="rc-card-hover" style={{ padding: "20px 22px", background: "var(--bg-secondary)", border: "1.5px solid rgba(195,95,70,0.18)", borderRadius: 14, boxShadow: "var(--shadow-sm)" }}>
                    <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                      <p.Icon size={18} />
                      <p style={{ fontSize: ".9rem", color: "var(--text-secondary)", lineHeight: 1.6, fontWeight: 500 }}>{p.text}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
            <div className="rc-hide-mobile" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: DARK_BG, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "var(--shadow-md)" }}>
                <Arrow size={20} />
              </div>
              <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: ".08em", writingMode: "vertical-lr", transform: "rotate(180deg)", marginTop: 8 }}>AI fixes this</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {solutions.map((s, i) => (
                <Reveal key={i} delay={i * 80}>
                  <div className="rc-card-hover" style={{ padding: "20px 22px", background: "var(--bg-secondary)", border: "1.5px solid rgba(110,140,100,0.25)", borderRadius: 14, boxShadow: "var(--shadow-sm)" }}>
                    <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                      <s.Icon size={18} />
                      <p style={{ fontSize: ".9rem", color: "var(--text-secondary)", lineHeight: 1.6, fontWeight: 500 }}>{s.text}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" style={{ padding: "96px 48px", background: "var(--bg-primary)", borderBottom: "1px solid var(--border-primary)" }} className="rc-section">
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <span style={{ fontSize: ".7rem", fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--text-secondary)", display: "block", marginBottom: 14 }}>Everything you need</span>
              <h2 style={{ fontWeight: 800, fontSize: "clamp(1.8rem,3.5vw,2.8rem)", lineHeight: 1.05, letterSpacing: "-.03em", color: "var(--text-primary)", marginBottom: 14 }}>
                One Platform.{" "}
                <span style={{ fontFamily: "var(--font-display)", fontStyle: "italic", color: "var(--color-ochre)" }}>Everything You Need.</span>
              </h2>
              <p style={{ fontSize: ".95rem", color: "var(--text-secondary)", maxWidth: 520, margin: "0 auto", lineHeight: 1.7 }}>
                Competitors charge $299–$499/mo for half of what RevaCore does. We built every tool a real estate agent needs into one platform — no stitching together five different subscriptions.
              </p>
            </div>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }} className="rc-grid3">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={i * 40}>
                <div className="rc-card-hover" style={{ padding: "26px 24px", border: "1.5px solid var(--border-primary)", borderRadius: 16, background: "var(--bg-secondary)", height: "100%" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
                    <div style={{ width: 46, height: 46, background: "var(--bg-tertiary)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-primary)" }}>
                      <f.Icon size={20} />
                    </div>
                    <span style={{ fontSize: 9, padding: "3px 8px", borderRadius: 5, background: `${f.badgeColor}14`, color: f.badgeColor, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.07em", border: `1px solid ${f.badgeColor}22` }}>{f.badge}</span>
                  </div>
                  <h3 style={{ fontWeight: 700, fontSize: ".95rem", color: "var(--text-primary)", marginBottom: 8, lineHeight: 1.3 }}>{f.title}</h3>
                  <p style={{ fontSize: ".85rem", color: "var(--text-secondary)", lineHeight: 1.7 }}>{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── LEAD SOURCES ── */}
      <section style={{ padding: "88px 48px", background: "var(--bg-tertiary)", borderBottom: "1px solid var(--border-primary)" }} className="rc-section">
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <span style={{ fontSize: ".7rem", fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--text-secondary)", display: "block", marginBottom: 14 }}>Lead Capture</span>
              <h2 style={{ fontWeight: 800, fontSize: "clamp(1.8rem,3.5vw,2.6rem)", lineHeight: 1.05, letterSpacing: "-.03em", color: "var(--text-primary)", marginBottom: 12 }}>
                Capture Leads from{" "}
                <span style={{ fontFamily: "var(--font-display)", fontStyle: "italic", color: "var(--color-ochre)" }}>6 Channels.</span>
              </h2>
              <p style={{ fontSize: ".95rem", color: "var(--text-secondary)", maxWidth: 500, margin: "0 auto", lineHeight: 1.7 }}>
                Wherever your leads come from, RevaCore captures them automatically. No manual entry, no missed opportunities.
              </p>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }} className="rc-grid3">
            {leadSources.map((s, i) => (
              <Reveal key={s.title} delay={i * 60}>
                <div className="rc-card-hover" style={{ padding: "24px 22px", background: "var(--bg-secondary)", border: "1.5px solid var(--border-primary)", borderRadius: 16, textAlign: "center" }}>
                  <div style={{ width: 48, height: 48, background: "var(--bg-tertiary)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-primary)", margin: "0 auto 14px" }}>
                    <s.Icon size={22} />
                  </div>
                  <h3 style={{ fontWeight: 700, fontSize: ".92rem", color: "var(--text-primary)", marginBottom: 8 }}>{s.title}</h3>
                  <p style={{ fontSize: ".82rem", color: "var(--text-secondary)", lineHeight: 1.65 }}>{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" style={{ padding: "96px 48px", background: "var(--bg-primary)", borderBottom: "1px solid var(--border-primary)" }} className="rc-section">
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <span style={{ fontSize: ".7rem", fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--text-secondary)", display: "block", marginBottom: 14 }}>How it works</span>
              <h2 style={{ fontWeight: 800, fontSize: "clamp(1.8rem,3.5vw,2.8rem)", lineHeight: 1.05, letterSpacing: "-.03em", color: "var(--text-primary)", marginBottom: 14 }}>
                From Lead to Closed Deal in{" "}
                <span style={{ fontFamily: "var(--font-display)", fontStyle: "italic", color: "var(--color-ochre)" }}>3 Simple Steps.</span>
              </h2>
            </div>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20, marginBottom: 48 }} className="rc-steps">
            {[
              { n: "01", Icon: FormIcon, title: "Lead Enters", desc: "A buyer fills out your form, emails you, or messages on WhatsApp. RevaCore captures everything automatically — no manual data entry, ever." },
              { n: "02", Icon: Brain, title: "AI Takes Over", desc: "Within seconds, AI scores the lead, sends a personalized response, and starts a 7-day follow-up sequence. You don't lift a finger. It runs all night." },
              { n: "03", Icon: Home, title: "You Close", desc: "The AI warms up the lead and pings you when they're Hot. You step in, book the viewing, and close the deal. That's your only job." },
            ].map((s, i) => (
              <Reveal key={s.n} delay={i * 100}>
                <div style={{ padding: "32px 28px", background: "var(--bg-secondary)", border: "1.5px solid var(--border-primary)", borderRadius: 18, position: "relative", boxShadow: "var(--shadow-sm)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                    <div style={{ fontSize: "2.5rem", fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 900, color: "var(--border-primary)", lineHeight: 1 }}>{s.n}</div>
                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--bg-tertiary)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-primary)" }}>
                      <s.Icon size={18} />
                    </div>
                  </div>
                  <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: 10 }}>{s.title}</h3>
                  <p style={{ fontSize: ".875rem", color: "var(--text-secondary)", lineHeight: 1.7 }}>{s.desc}</p>
                  {i < 2 && (
                    <div className="rc-hide-mobile" style={{ position: "absolute", top: "50%", right: -24, width: 24, height: 24, background: "var(--bg-tertiary)", border: "1px solid var(--border-primary)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2, transform: "translateY(-50%)" }}>
                      <Arrow size={11} />
                    </div>
                  )}
                </div>
              </Reveal>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }} className="rc-grid2">
            <Reveal delay={0}><AIChatDemo /></Reveal>
            <Reveal delay={100}><ROICalc /></Reveal>
          </div>
        </div>
      </section>

      {/* ── COMPETITOR COMPARISON ── */}
      <section id="compare" style={{ padding: "96px 48px", background: "var(--bg-tertiary)", borderBottom: "1px solid var(--border-primary)" }} className="rc-section">
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <span style={{ fontSize: ".7rem", fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--text-secondary)", display: "block", marginBottom: 14 }}>vs. the competition</span>
              <h2 style={{ fontWeight: 800, fontSize: "clamp(1.8rem,3.5vw,2.8rem)", lineHeight: 1.05, letterSpacing: "-.03em", color: "var(--text-primary)", marginBottom: 12 }}>
                Why Agents Switch to{" "}
                <span style={{ fontFamily: "var(--font-display)", fontStyle: "italic", color: "var(--color-ochre)" }}>RevaCore.</span>
              </h2>
              <p style={{ fontSize: ".95rem", color: "var(--text-secondary)", maxWidth: 540, margin: "0 auto", lineHeight: 1.7 }}>
                Most CRMs store your leads and wait for you to chase them. RevaCore's AI chases them for you — while costing a fraction of what competitors charge for fewer features.
              </p>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div style={{ background: "var(--bg-secondary)", border: "1.5px solid var(--border-primary)", borderRadius: 18, overflow: "hidden", boxShadow: "var(--shadow-md)" }}>
              <ComparisonTable />
            </div>
          </Reveal>
          <Reveal delay={150}>
            <div style={{ marginTop: 20, display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
              {[
                { label: "BoldTrail costs $499/mo", note: "For similar features" },
                { label: "Real Geeks costs $299/mo", note: "No AI scoring or marketing" },
                { label: "RevaCore Pro: $129/mo", note: "Everything, built for you" },
              ].map((item, i) => (
                <div key={i} style={{ padding: "10px 18px", background: i === 2 ? "rgba(110,140,100,0.1)" : "var(--bg-secondary)", border: `1px solid ${i === 2 ? "var(--color-sage)" : "var(--border-primary)"}`, borderRadius: 10, textAlign: "center" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: i === 2 ? "var(--color-sage)" : "var(--text-primary)" }}>{item.label}</div>
                  <div style={{ fontSize: 11, color: "var(--text-tertiary)", marginTop: 2 }}>{item.note}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" style={{ padding: "96px 48px", background: "var(--bg-primary)", borderBottom: "1px solid var(--border-primary)" }} className="rc-section">
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <span style={{ fontSize: ".7rem", fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--text-secondary)", display: "block", marginBottom: 14 }}>Pricing</span>
              <h2 style={{ fontWeight: 800, fontSize: "clamp(1.8rem,3.5vw,2.8rem)", lineHeight: 1.05, letterSpacing: "-.03em", color: "var(--text-primary)", marginBottom: 12 }}>
                Invest Less Than One Commission.{" "}
                <span style={{ fontFamily: "var(--font-display)", fontStyle: "italic", color: "var(--color-ochre)" }}>Close Far More.</span>
              </h2>
              <p style={{ fontSize: ".9rem", color: "var(--text-secondary)", marginBottom: 8 }}>14-day free trial on every plan. No credit card required. All payments processed securely via Paddle.</p>
              {/* Value anchor — makes Pro feel cheap */}
              <p style={{ fontSize: ".85rem", color: "var(--color-terracotta)", fontWeight: 600, marginBottom: 24 }}>
                One extra deal from RevaCore pays for 3+ years of Pro.
              </p>
              <div style={{ display: "inline-flex", background: "var(--bg-hover)", borderRadius: 10, padding: 4, gap: 2 }}>
                {["monthly","annual"].map(t => (
                  <button key={t} onClick={() => setPricingTab(t)} style={{ padding: "7px 18px", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 700, fontSize: 13, background: pricingTab === t ? "var(--bg-secondary)" : "transparent", color: pricingTab === t ? "var(--text-primary)" : "var(--text-tertiary)", boxShadow: pricingTab === t ? "var(--shadow-sm)" : "none", transition: "all .2s", fontFamily: F }}>
                    {t === "monthly" ? "Monthly" : <span>Annual <span style={{ color: "var(--color-sage)", fontWeight: 800 }}>–20%</span></span>}
                  </button>
                ))}
              </div>
            </div>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, alignItems: "start" }} className="rc-pricing-grid">
            {plans.map((plan, pi) => {
              const price = Math.round(plan.monthly * annualMultiplier);
              const isDark = plan.pop;
              return (
                <Reveal key={plan.name} delay={pi * 80}>
                  <div style={{ padding: 32, border: `1.5px solid ${plan.pop ? "var(--color-ochre)" : "var(--border-primary)"}`, borderRadius: 20, background: isDark ? DARK_BG : "var(--bg-secondary)", position: "relative", transform: plan.pop ? "scale(1.03)" : "none", boxShadow: plan.pop ? "var(--shadow-xl)" : "var(--shadow-sm)" }}>
                    {plan.pop && (
                      <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "var(--color-ochre)", color: "#fff", fontWeight: 700, fontSize: ".62rem", padding: "5px 14px", borderRadius: 100, textTransform: "uppercase", letterSpacing: ".08em", whiteSpace: "nowrap" }}>
                        Most Popular — Best Value
                      </div>
                    )}
                    <div style={{ fontSize: ".7rem", fontWeight: 700, letterSpacing: ".09em", textTransform: "uppercase", color: isDark ? "rgba(247,243,236,0.4)" : "var(--text-secondary)", marginBottom: 8 }}>{plan.name}</div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 4 }}>
                      <span style={{ fontWeight: 900, fontSize: "2.8rem", lineHeight: 1, color: isDark ? DARK_BG_TEXT : "var(--text-primary)", letterSpacing: "-.04em" }}>${price}</span>
                      <span style={{ fontSize: ".82rem", color: isDark ? "rgba(247,243,236,0.35)" : "var(--text-tertiary)" }}>/mo</span>
                    </div>
                    {pricingTab === "annual" && <div style={{ fontSize: 11, color: "var(--color-sage)", fontWeight: 700, marginBottom: 4 }}>Save ${(plan.monthly - price) * 12}/year</div>}

                    {/* Value anchor under price */}
                    {plan.pop && (
                      <div style={{ fontSize: 11, color: "var(--color-ochre)", fontWeight: 700, marginBottom: 8 }}>Less than 1% of one average commission.</div>
                    )}

                    <p style={{ fontSize: ".82rem", color: isDark ? "rgba(247,243,236,0.5)" : "var(--text-secondary)", marginBottom: 16, lineHeight: 1.5 }}>{plan.desc}</p>

                    {/* Highlight badge */}
                    {plan.highlight && (
                      <div style={{ padding: "7px 12px", background: "rgba(110,140,100,0.18)", border: "1px solid rgba(110,140,100,0.25)", borderRadius: 8, marginBottom: 16, fontSize: 11.5, color: "var(--color-sage)", fontWeight: 700, textAlign: "center" }}>
                        {plan.highlight}
                      </div>
                    )}

                    {/* Warning for Starter */}
                    {plan.warning && (
                      <div style={{ padding: "7px 12px", background: "rgba(195,95,70,0.1)", border: "1px solid rgba(195,95,70,0.2)", borderRadius: 8, marginBottom: 16, fontSize: 11, color: "var(--color-terracotta)", fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                        <AlertTriangle size={11} /> {plan.warning}
                      </div>
                    )}

                    <div style={{ height: 1, background: isDark ? "rgba(247,243,236,0.08)" : "var(--border-primary)", marginBottom: 16 }}/>
                    <ul style={{ listStyle: "none", marginBottom: 24, display: "flex", flexDirection: "column", gap: 9 }}>
                      {plan.features.map(f => (
                        <li key={f.text} style={{ display: "flex", alignItems: "flex-start", gap: 9, fontSize: ".84rem", color: isDark ? (f.included ? "rgba(247,243,236,0.75)" : "rgba(247,243,236,0.3)") : (f.included ? "var(--text-secondary)" : "var(--text-tertiary)"), textDecoration: f.included ? "none" : "none" }}>
                          <span style={{ flexShrink: 0, marginTop: 1 }}>
                            {f.included
                              ? <Check size={13} color={isDark ? "var(--color-sage)" : "var(--color-sage)"}/>
                              : <X size={13} color={isDark ? "rgba(247,243,236,0.2)" : "var(--text-tertiary)"}/>
                            }
                          </span>
                          {f.text}
                        </li>
                      ))}
                    </ul>
                    <a href="/signup" style={{ display: "block", textAlign: "center", textDecoration: "none", background: isDark ? DARK_BG_TEXT : DARK_BG, color: isDark ? DARK_BG : DARK_BG_TEXT, fontWeight: 700, fontSize: ".86rem", padding: "13px", borderRadius: 10, transition: "opacity .2s", fontFamily: F, letterSpacing: ".01em" }}>
                      {plan.cta} →
                    </a>
                    {plan.pop && <p style={{ textAlign: "center", fontSize: 10, color: "rgba(247,243,236,0.25)", marginTop: 8 }}>No credit card · Cancel anytime</p>}
                  </div>
                </Reveal>
              );
            })}
          </div>

          {/* Upsell nudge below pricing */}
          <Reveal delay={200}>
            <div style={{ marginTop: 28, padding: "20px 28px", background: "rgba(180,130,70,0.06)", border: "1.5px solid rgba(180,130,70,0.2)", borderRadius: 14, textAlign: "center" }}>
              <p style={{ fontSize: ".9rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                <strong style={{ color: "var(--text-primary)" }}>Not sure which plan?</strong> Start the Pro trial free for 14 days — no card needed. 87% of agents who try Pro never go back to manual follow-up.
              </p>
            </div>
          </Reveal>

          <Reveal delay={240}>
            <div style={{ marginTop: 20, padding: "22px 28px", background: "var(--bg-secondary)", border: "1.5px solid var(--border-primary)", borderRadius: 14, display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap", boxShadow: "var(--shadow-sm)" }}>
              <div style={{ width: 44, height: 44, background: "rgba(110,140,100,0.1)", borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Shield size={18} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: ".95rem", color: "var(--text-primary)", marginBottom: 4 }}>30-day money-back guarantee</div>
                <p style={{ fontSize: ".85rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>If you sign up, pay, and don't close more deals within 30 days — we refund you in full. No questions asked. Zero risk.</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="testimonials" style={{ padding: "96px 48px", background: "var(--bg-tertiary)", borderBottom: "1px solid var(--border-primary)" }} className="rc-section">
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <span style={{ fontSize: ".7rem", fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--text-secondary)", display: "block", marginBottom: 14 }}>Real results</span>
              <h2 style={{ fontWeight: 800, fontSize: "clamp(1.8rem,3.5vw,2.8rem)", lineHeight: 1.05, letterSpacing: "-.03em", color: "var(--text-primary)" }}>
                Agents Who Switched{" "}
                <span style={{ fontFamily: "var(--font-display)", fontStyle: "italic", color: "var(--text-tertiary)" }}>Never Look Back.</span>
              </h2>
            </div>
          </Reveal>

          <Reveal>
            <div style={{ background: "var(--bg-secondary)", border: "1.5px solid var(--border-primary)", borderRadius: 20, padding: "40px 40px", marginBottom: 18, boxShadow: "var(--shadow-md)", position: "relative", overflow: "hidden" }}>
              <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
                <div style={{ display: "flex", gap: 2, justifyContent: "center", marginBottom: 20 }}>{[...Array(5)].map((_,i) => <Star key={i} size={14}/>)}</div>
                <blockquote style={{ fontSize: "clamp(.95rem,2vw,1.15rem)", fontWeight: 500, color: "var(--text-primary)", lineHeight: 1.75, marginBottom: 24, fontStyle: "italic" }}>
                  "{testimonials[activeTestimonial].quote}"
                </blockquote>
                <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "center" }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--bg-tertiary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, color: "var(--text-primary)" }}>{testimonials[activeTestimonial].init}</div>
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontWeight: 700, fontSize: 13, color: "var(--text-primary)" }}>{testimonials[activeTestimonial].name}</div>
                    <div style={{ fontSize: 12, color: "var(--text-tertiary)" }}>{testimonials[activeTestimonial].role}</div>
                  </div>
                  <div style={{ marginLeft: 12, padding: "5px 12px", background: "rgba(110,140,100,0.1)", borderRadius: 6, border: "1px solid rgba(110,140,100,0.2)" }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "var(--color-sage)" }}>{testimonials[activeTestimonial].result}</span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 24 }}>
                  {testimonials.map((_,i) => (
                    <button key={i} onClick={() => setActiveTestimonial(i)} style={{ width: i === activeTestimonial ? 20 : 7, height: 7, borderRadius: 4, background: i === activeTestimonial ? DARK_BG : "var(--border-primary)", border: "none", cursor: "pointer", transition: "all .3s ease", padding: 0 }}/>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }} className="rc-grid3">
            {testimonials.map((t, i) => (
              <Reveal key={t.name} delay={i * 60}>
                <div className="rc-card-hover" onClick={() => setActiveTestimonial(i)} style={{ padding: "22px 20px", border: `1.5px solid ${i === activeTestimonial ? "var(--color-ochre)" : "var(--border-primary)"}`, borderRadius: 14, background: "var(--bg-secondary)", cursor: "pointer", height: "100%" }}>
                  <div style={{ display: "flex", gap: 1, marginBottom: 10 }}>{[...Array(5)].map((_,j) => <Star key={j} size={11}/>)}</div>
                  <p style={{ fontSize: ".82rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 14, fontStyle: "italic" }}>"{t.quote.slice(0, 110)}..."</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 30, height: 30, borderRadius: "50%", background: "var(--bg-tertiary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 10, color: "var(--text-primary)" }}>{t.init}</div>
                    <div>
                      <div style={{ fontSize: 11.5, fontWeight: 700, color: "var(--text-primary)" }}>{t.name}</div>
                      <div style={{ fontSize: 10.5, color: "var(--text-tertiary)" }}>{t.role}</div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" style={{ padding: "96px 48px", background: "var(--bg-primary)", borderBottom: "1px solid var(--border-primary)" }} className="rc-section">
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <span style={{ fontSize: ".7rem", fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--text-secondary)", display: "block", marginBottom: 14 }}>FAQ</span>
              <h2 style={{ fontWeight: 800, fontSize: "clamp(1.8rem,3.5vw,2.6rem)", lineHeight: 1.05, letterSpacing: "-.03em", color: "var(--text-primary)" }}>
                Frequently Asked{" "}
                <span style={{ fontFamily: "var(--font-display)", fontStyle: "italic", color: "var(--text-tertiary)" }}>Questions.</span>
              </h2>
            </div>
          </Reveal>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {faqs.map((faq, i) => (
              <Reveal key={i} delay={i * 35}>
                <div className="rc-faq-item" style={{ border: `1.5px solid ${openFaq === i ? "var(--color-ochre)" : "var(--border-primary)"}`, borderRadius: 14, overflow: "hidden", background: "var(--bg-secondary)" }}>
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ width: "100%", padding: "18px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "transparent", border: "none", cursor: "pointer", gap: 12, fontFamily: F }}>
                    <span style={{ fontWeight: 700, fontSize: ".92rem", color: "var(--text-primary)", textAlign: "left", lineHeight: 1.4 }}>{faq.q}</span>
                    <span style={{ flexShrink: 0, color: "var(--text-tertiary)", transform: openFaq === i ? "rotate(180deg)" : "none", transition: "transform .3s ease", display: "flex" }}><ChevronDown size={15}/></span>
                  </button>
                  {openFaq === i && (
                    <div style={{ padding: "0 22px 18px", animation: "rc-fadeup .25s ease" }}>
                      <p style={{ fontSize: ".9rem", color: "var(--text-secondary)", lineHeight: 1.75 }}>{faq.a}</p>
                    </div>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={280}>
            <div style={{ marginTop: 36, padding: "22px", background: "var(--bg-secondary)", border: "1px solid var(--border-primary)", borderRadius: 14, textAlign: "center" }}>
              <p style={{ fontSize: ".9rem", color: "var(--text-secondary)", marginBottom: 12 }}>Still have questions? Our team replies in under 2 hours.</p>
              <a href="mailto:hello@revacore.com" style={{ display: "inline-flex", alignItems: "center", gap: 7, color: "var(--text-primary)", fontWeight: 700, fontSize: ".875rem", textDecoration: "none", padding: "10px 20px", border: "1.5px solid var(--border-primary)", borderRadius: 10, background: "var(--bg-tertiary)", fontFamily: F }}>
                <Mail size={15}/> Chat with us
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ padding: "96px 48px", background: DARK_BG, position: "relative", overflow: "hidden" }} className="rc-section">
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(247,243,236,0.025) 1px, transparent 1px)", backgroundSize: "36px 36px", pointerEvents: "none" }}/>
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
          <Reveal>
            <div style={{ display: "flex", gap: 2, justifyContent: "center", marginBottom: 16 }}>{[...Array(5)].map((_,i) => <Star key={i} size={16}/>)}</div>
            <div style={{ fontSize: ".7rem", fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: DARK_BG_MUTED, marginBottom: 20 }}>Join 500+ agents worldwide</div>
            <h2 style={{ fontWeight: 900, fontSize: "clamp(2.2rem,5vw,4rem)", lineHeight: 1.0, letterSpacing: "-.04em", color: DARK_BG_TEXT, marginBottom: 16 }}>
              Ready to Stop Losing<br/>
              <span style={{ fontFamily: "var(--font-display)", fontStyle: "italic", color: "var(--color-ochre)" }}>$14,000 a Year?</span>
            </h2>
            <p style={{ fontSize: ".95rem", color: "rgba(247,243,236,0.4)", marginBottom: 12, lineHeight: 1.7 }}>
              Start your 14-day Pro trial — completely free. No credit card.<br/>Set up in 10 minutes. Your first AI-qualified lead could come today.
            </p>
            <p style={{ fontSize: ".85rem", color: "var(--color-ochre)", fontWeight: 600, marginBottom: 36 }}>
              One extra deal from RevaCore pays for 3+ years of Pro. The math is easy.
            </p>

            {submitted ? (
              <div style={{ padding: "18px 28px", background: "rgba(110,140,100,0.15)", border: "1.5px solid rgba(110,140,100,0.3)", borderRadius: 14, marginBottom: 24 }}>
                <div style={{ fontWeight: 700, color: "var(--color-sage)", fontSize: "1rem" }}>
                  You're in! Check your inbox — we'll be in touch within an hour.
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", gap: 10, maxWidth: 480, margin: "0 auto 24px", flexWrap: "wrap" }}>
                <input type="email" placeholder="Enter your work email" value={email} onChange={e => setEmail(e.target.value)}
                  style={{ flex: 1, minWidth: 200, padding: "14px 18px", border: "1.5px solid rgba(247,243,236,0.15)", borderRadius: 11, background: "rgba(247,243,236,0.07)", color: DARK_BG_TEXT, fontSize: ".9rem", outline: "none", fontFamily: F }}
                />
                <button onClick={() => { if (email.includes("@")) setSubmitted(true); }}
                  style={{ padding: "14px 26px", background: "var(--color-ochre)", color: "#fff", border: "none", borderRadius: 11, fontWeight: 700, fontSize: ".9rem", cursor: "pointer", fontFamily: F, whiteSpace: "nowrap" }}>
                  Start Free Pro Trial →
                </button>
              </div>
            )}

            <div style={{ display: "flex", gap: 28, justifyContent: "center", flexWrap: "wrap" }}>
              {["14-day Pro trial free","No credit card needed","Cancel anytime"].map(t => (
                <span key={t} style={{ fontSize: ".82rem", color: "rgba(247,243,236,0.35)", fontWeight: 600 }}>
                  <Check size={12} color="var(--color-sage)" /> {t}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: "1px solid rgba(247,243,236,0.06)", padding: "48px 48px 28px", background: DARK_BG }} className="rc-section">
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, marginBottom: 44 }} className="rc-grid3">
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <Logo />
                <span style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 700, color: DARK_BG_TEXT, fontSize: "1.05rem" }}>RevaCore</span>
              </div>
              <p style={{ fontSize: ".84rem", color: "rgba(247,243,236,0.32)", lineHeight: 1.7, maxWidth: 240 }}>The AI-powered CRM built for real estate professionals who want to close more deals with less effort.</p>
              <div style={{ display: "flex", gap: 2, marginTop: 16 }}>{[...Array(5)].map((_,i) => <Star key={i} size={11}/>)}</div>
              <div style={{ fontSize: 11, color: "rgba(247,243,236,0.25)", marginTop: 4 }}>4.9/5 from 500+ agents</div>
              <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
                <Package size={14} />
                <span style={{ fontSize: 11, color: "rgba(247,243,236,0.25)" }}>Payments by Paddle</span>
              </div>
            </div>
            {[
              { h: "Product", links: ["Features","Pricing","Compare","FAQ"] },
              { h: "Company", links: ["About","Blog","Careers","Contact"] },
              { h: "Legal", links: ["Privacy Policy","Terms of Service","Security","Cookies"] },
            ].map(col => (
              <div key={col.h}>
                <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".09em", color: "rgba(247,243,236,0.25)", marginBottom: 14 }}>{col.h}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {col.links.map(l => <a key={l} href="#" style={{ fontSize: ".82rem", color: "rgba(247,243,236,0.38)", textDecoration: "none" }}>{l}</a>)}
                </div>
              </div>
            ))}
          </div>
          <div style={{ borderTop: "1px solid rgba(247,243,236,0.06)", paddingTop: 22, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <p style={{ fontSize: ".74rem", color: "rgba(247,243,236,0.2)" }}>© 2025 RevaCore. All rights reserved.</p>
            <div style={{ display: "flex", gap: 18 }}>
              {[["Features","#features"],["Pricing","#pricing"],["FAQ","#faq"]].map(([l,h]) => (
                <a key={l} href={h} style={{ fontSize: ".76rem", color: "rgba(247,243,236,0.25)", textDecoration: "none" }}>{l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}