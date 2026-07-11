"use client";

/**
 * Interactive architecture diagram.
 *
 * Renders declarative DiagramData (nodes on a logical grid + edges + optional
 * swim lanes) into a single SVG. Click or focus a node to open the detail
 * panel (what it is, why it was chosen, protocol). Hovering a node highlights
 * its connected edges. "data" edges get a slow animated dash shimmer.
 *
 * Custom-built instead of a graph library on purpose: the diagrams are
 * curated and read-only, and this keeps the bundle lean and the look native
 * to the site's glass/iris design system.
 */

import { useMemo, useRef, useState } from "react";
import {
  AppWindow,
  Banknote,
  BellRing,
  Bot,
  BookOpen,
  Boxes,
  Braces,
  Building2,
  CalendarClock,
  Camera,
  Cloud,
  Coins,
  Compass,
  Cpu,
  CreditCard,
  Database,
  Droplets,
  FileCode,
  FileText,
  Fingerprint,
  Flashlight,
  Gauge,
  GitBranch,
  Github,
  Globe,
  GraduationCap,
  HardDrive,
  KeyRound,
  Landmark,
  Languages,
  Layers,
  ListChecks,
  Lock,
  Mail,
  MapPin,
  MessageSquare,
  Mic,
  Navigation,
  Package,
  QrCode,
  Radio,
  Receipt,
  RefreshCw,
  Rocket,
  Route,
  Scale,
  ScanLine,
  Search,
  Server,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Sparkles,
  SplitSquareHorizontal,
  Table,
  TerminalSquare,
  TestTube,
  Timer,
  Upload,
  User,
  Users,
  Video,
  Wifi,
  WifiOff,
  Workflow,
  Wrench,
  Youtube,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { DiagramData, DiagramNode } from "@/lib/reports/types";
import { NODE_ACCENT_HEX } from "@/lib/accents";
import { DiagramNodePanel } from "@/components/work/diagram-node-panel";

/* Icon names allowed in diagram data. Kept as a registry because component
   references cannot cross the server/client boundary. */
const ICONS: Record<string, LucideIcon> = {
  AppWindow, Banknote, BellRing, Bot, BookOpen, Boxes, Braces, Building2,
  CalendarClock, Camera, Cloud, Coins, Compass, Cpu, CreditCard, Database,
  Droplets, FileCode, FileText, Fingerprint, Flashlight, Gauge, GitBranch,
  Github, Globe, GraduationCap, HardDrive, KeyRound, Landmark, Languages,
  Layers, ListChecks, Lock, Mail, MapPin, MessageSquare, Mic, Navigation,
  Package, QrCode, Radio, Receipt, RefreshCw, Rocket, Route, Scale, ScanLine,
  Search, Server, Shield, ShieldAlert, ShieldCheck, Smartphone, Sparkles,
  SplitSquareHorizontal, Table, TerminalSquare, TestTube, Timer, Upload,
  User, Users, Video, Wifi, WifiOff, Workflow, Wrench, Youtube, Zap,
};

/* Logical grid geometry (SVG units). */
const COL_W = 216;
const ROW_H = 132;
const NODE_W = 184;
const NODE_H = 88;
const PAD = 36;

type Rect = { x: number; y: number; w: number; h: number; cx: number; cy: number };

function nodeRect(n: DiagramNode): Rect {
  const w = NODE_W + (n.span ? (n.span - 1) * COL_W : 0);
  const x = PAD + n.col * COL_W;
  const y = PAD + n.row * ROW_H;
  return { x, y, w, h: NODE_H, cx: x + w / 2, cy: y + NODE_H / 2 };
}

/** Pick edge anchor points and a cubic bezier between two rects. */
function edgePath(a: Rect, b: Rect): { d: string; mx: number; my: number } {
  const dx = b.cx - a.cx;
  const dy = b.cy - a.cy;
  let x1: number, y1: number, x2: number, y2: number;

  if (Math.abs(dx) >= Math.abs(dy) && Math.abs(dx) > NODE_W / 2) {
    // horizontal-ish: leave from left/right edges
    if (dx > 0) {
      x1 = a.x + a.w; y1 = a.cy; x2 = b.x; y2 = b.cy;
    } else {
      x1 = a.x; y1 = a.cy; x2 = b.x + b.w; y2 = b.cy;
    }
    const bend = Math.max(28, Math.abs(x2 - x1) * 0.45);
    const c1 = x1 + (dx > 0 ? bend : -bend);
    const c2 = x2 - (dx > 0 ? bend : -bend);
    return { d: `M ${x1} ${y1} C ${c1} ${y1}, ${c2} ${y2}, ${x2} ${y2}`, mx: (x1 + x2) / 2, my: (y1 + y2) / 2 };
  }
  // vertical-ish: leave from top/bottom edges
  if (dy > 0) {
    x1 = a.cx; y1 = a.y + a.h; x2 = b.cx; y2 = b.y;
  } else {
    x1 = a.cx; y1 = a.y; x2 = b.cx; y2 = b.y + b.h;
  }
  const bend = Math.max(24, Math.abs(y2 - y1) * 0.45);
  const c1 = y1 + (dy > 0 ? bend : -bend);
  const c2 = y2 - (dy > 0 ? bend : -bend);
  return { d: `M ${x1} ${y1} C ${x1} ${c1}, ${x2} ${c2}, ${x2} ${y2}`, mx: (x1 + x2) / 2, my: (y1 + y2) / 2 };
}

const EDGE_BASE = "#3c4463";

export function ArchitectureDiagram({ data }: { data: DiagramData }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const rects = useMemo(() => {
    const m = new Map<string, Rect>();
    for (const n of data.nodes) m.set(n.id, nodeRect(n));
    return m;
  }, [data.nodes]);

  const { width, height } = useMemo(() => {
    let maxX = 0;
    let maxY = 0;
    for (const r of rects.values()) {
      maxX = Math.max(maxX, r.x + r.w);
      maxY = Math.max(maxY, r.y + r.h);
    }
    return { width: maxX + PAD, height: maxY + PAD };
  }, [rects]);

  const selected = data.nodes.find((n) => n.id === selectedId) ?? null;
  const activeId = hoverId ?? selectedId;

  return (
    <div className="relative">
      <style>{`@keyframes diagram-dash { to { stroke-dashoffset: -20; } }`}</style>

      <div
        ref={scrollRef}
        className="overflow-x-auto rounded-2xl border border-white/[0.06] bg-slate-900/40 bg-dot-grid shadow-panel"
      >
        <svg
          viewBox={`0 0 ${width} ${height}`}
          width={width}
          height={height}
          role="group"
          aria-label={data.caption ?? "Architecture diagram"}
          className="block min-w-full"
          style={{ minWidth: width }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedId(null);
          }}
        >
          <defs>
            {(Object.keys(NODE_ACCENT_HEX) as Array<keyof typeof NODE_ACCENT_HEX>).map((k) => (
              <marker
                key={k}
                id={`arrow-${k}`}
                viewBox="0 0 10 10"
                refX="9"
                refY="5"
                markerWidth="7"
                markerHeight="7"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 9 5 L 0 9" fill="none" stroke={NODE_ACCENT_HEX[k].stroke} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </marker>
            ))}
            <marker id="arrow-base" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M 0 1 L 9 5 L 0 9" fill="none" stroke={EDGE_BASE} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </marker>
          </defs>

          {/* Group swim lanes */}
          {data.groups?.map((g) => {
            const members = g.nodeIds
              .map((id) => rects.get(id))
              .filter((r): r is Rect => Boolean(r));
            if (members.length === 0) return null;
            const minX = Math.min(...members.map((r) => r.x)) - 14;
            const minY = Math.min(...members.map((r) => r.y)) - 26;
            const maxX = Math.max(...members.map((r) => r.x + r.w)) + 14;
            const maxY = Math.max(...members.map((r) => r.y + r.h)) + 14;
            return (
              <g key={g.id} aria-hidden>
                <rect
                  x={minX}
                  y={minY}
                  width={maxX - minX}
                  height={maxY - minY}
                  rx={14}
                  fill="rgba(255,255,255,0.012)"
                  stroke="rgba(255,255,255,0.08)"
                  strokeDasharray="3 5"
                />
                <text
                  x={minX + 12}
                  y={minY + 15}
                  fill="#6b7494"
                  fontSize="9"
                  letterSpacing="0.14em"
                  className="font-mono uppercase"
                >
                  {g.label.toUpperCase()}
                </text>
              </g>
            );
          })}

          {/* Edges */}
          {data.edges.map((e, i) => {
            const a = rects.get(e.from);
            const b = rects.get(e.to);
            if (!a || !b) return null;
            const { d, mx, my } = edgePath(a, b);
            const isActive = activeId === e.from || activeId === e.to;
            const accent =
              data.nodes.find((n) => n.id === (activeId === e.from ? e.from : e.to))?.accent ?? "neutral";
            const stroke = isActive ? NODE_ACCENT_HEX[accent].stroke : EDGE_BASE;
            const dash = e.kind === "async" ? "6 5" : e.kind === "data" ? "4 6" : undefined;
            return (
              <g key={`${e.from}-${e.to}-${i}`} aria-hidden>
                <path
                  d={d}
                  fill="none"
                  stroke={stroke}
                  strokeWidth={isActive ? 1.8 : 1.3}
                  strokeDasharray={dash}
                  markerEnd={`url(#arrow-${isActive ? accent : "base"})`}
                  opacity={activeId && !isActive ? 0.35 : 0.9}
                  style={
                    e.kind === "data"
                      ? { animation: "diagram-dash 1.6s linear infinite" }
                      : undefined
                  }
                />
                {e.label && (
                  <g opacity={activeId && !isActive ? 0.4 : 1}>
                    <rect
                      x={mx - e.label.length * 2.9 - 6}
                      y={my - 8}
                      width={e.label.length * 5.8 + 12}
                      height={16}
                      rx={8}
                      fill="#0a0d18"
                      stroke="rgba(255,255,255,0.08)"
                    />
                    <text
                      x={mx}
                      y={my + 3.5}
                      textAnchor="middle"
                      fill={isActive ? NODE_ACCENT_HEX[accent].text : "#8a92b3"}
                      fontSize="9"
                      className="font-mono"
                    >
                      {e.label}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Nodes */}
          {data.nodes.map((n) => {
            const r = rects.get(n.id)!;
            const hex = NODE_ACCENT_HEX[n.accent];
            const isSelected = selectedId === n.id;
            const isHover = hoverId === n.id;
            const lit = isSelected || isHover;
            const Icon = n.icon ? ICONS[n.icon] : undefined;
            return (
              <g
                key={n.id}
                role="button"
                tabIndex={0}
                aria-label={`${n.label}. ${n.detail.what}`}
                aria-pressed={isSelected}
                className="cursor-pointer outline-none"
                onClick={() => setSelectedId(isSelected ? null : n.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelectedId(isSelected ? null : n.id);
                  }
                  if (e.key === "Escape") setSelectedId(null);
                }}
                onMouseEnter={() => setHoverId(n.id)}
                onMouseLeave={() => setHoverId(null)}
                onFocus={() => setHoverId(n.id)}
                onBlur={() => setHoverId(null)}
              >
                {/* glow behind lit nodes */}
                {lit && (
                  <rect x={r.x - 3} y={r.y - 3} width={r.w + 6} height={r.h + 6} rx={17} fill="none" stroke={hex.glow} strokeWidth={6} opacity={0.5} />
                )}
                <rect
                  x={r.x}
                  y={r.y}
                  width={r.w}
                  height={r.h}
                  rx={14}
                  fill="#0d1120"
                  stroke={lit ? hex.stroke : "rgba(255,255,255,0.10)"}
                  strokeWidth={lit ? 1.6 : 1}
                />
                <rect x={r.x} y={r.y} width={r.w} height={r.h} rx={14} fill={hex.fill} />
                {/* accent tick, top-left */}
                <rect x={r.x + 14} y={r.y + 14} width={18} height={3} rx={1.5} fill={hex.stroke} opacity={0.9} />
                {Icon && (
                  <Icon
                    x={r.x + r.w - 34}
                    y={r.y + 12}
                    width={18}
                    height={18}
                    color={hex.text}
                    strokeWidth={1.6}
                    aria-hidden
                  />
                )}
                <text x={r.x + 14} y={r.y + 44} fill="#f0f2fa" fontSize="13.5" fontWeight={600} className="font-display">
                  {n.label}
                </text>
                {n.tech && (
                  <text x={r.x + 14} y={r.y + 64} fill={hex.text} fontSize="9.5" className="font-mono" opacity={0.9}>
                    {n.tech}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* mobile scroll hint */}
      <div className="mt-2 flex items-center justify-between gap-4">
        <span className="label-mono sm:hidden">drag to explore</span>
        <span className="label-mono hidden sm:inline">click a component for details</span>
        {data.caption && <span className="text-xs text-zinc-500">{data.caption}</span>}
      </div>

      <DiagramNodePanel node={selected} onClose={() => setSelectedId(null)} />
    </div>
  );
}
