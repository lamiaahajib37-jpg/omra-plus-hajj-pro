// ════════════════════════════════════════════════════════════════════════
// Pipeline.tsx  —  /pipeline
// Entonnoir commercial — vue Admin
// ════════════════════════════════════════════════════════════════════════
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TrendingUp, Users, FolderOpen, DollarSign,
  ArrowRight, ChevronDown, ChevronUp, Eye
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// ─── Mock data ────────────────────────────────────────────────────────────────
const FUNNEL = [
  { id: "leads",       label: "Leads captés",        count: 47, total: null,    color: "#185FA5", bg: "#E6F1FB",  pct: 100 },
  { id: "contactes",   label: "Contactés",            count: 38, total: null,    color: "#0F6E56", bg: "#E1F5EE",  pct: 81 },
  { id: "interesse",   label: "Intéressés",           count: 22, total: null,    color: "#633806", bg: "#FAEEDA",  pct: 47 },
  { id: "promis",      label: "Promis / Accord",      count: 11, total: null,    color: "#3C3489", bg: "#EEEDFE",  pct: 23 },
  { id: "convertis",   label: "Convertis (clients)",  count: 7,  total: null,    color: "#27500A", bg: "#EAF3DE",  pct: 15 },
  { id: "dossiers",    label: "Dossiers ouverts",     count: 14, total: null,    color: "#712B13", bg: "#FAECE7",  pct: 30 },
  { id: "ca",          label: "CA généré",            count: null, total: 487000, color: "#791F1F", bg: "#FCEBEB", pct: null },
];

interface DeptStat {
  dept: string;
  leads: number;
  dossiers: number;
  ca: number;
  tauxConv: number;
}

const DEPT_STATS: DeptStat[] = [
  { dept: "MICE",       leads: 12, dossiers: 5,  ca: 185000, tauxConv: 42 },
  { dept: "Leisure",    leads: 15, dossiers: 4,  ca: 68000,  tauxConv: 27 },
  { dept: "Hajj & Omra",leads: 14, dossiers: 3,  ca: 42000,  tauxConv: 21 },
  { dept: "Outbound",   leads: 6,  dossiers: 2,  ca: 192000, tauxConv: 33 },
];

const AGENT_PERF = [
  { nom: "Feras",  leads: 24, convertis: 4, ca: 248000, tauxConv: 17 },
  { nom: "Adam",   leads: 23, convertis: 3, ca: 239000, tauxConv: 13 },
];

const MONTHLY = [
  { mois: "Jan", leads: 6, dossiers: 2, ca: 38000 },
  { mois: "Fév", leads: 8, dossiers: 3, ca: 54000 },
  { mois: "Mar", leads: 11, dossiers: 4, ca: 87000 },
  { mois: "Avr", leads: 14, dossiers: 5, ca: 102000 },
  { mois: "Mai", leads: 8, dossiers: 0, ca: 0 },
];

const maxCA = Math.max(...MONTHLY.map(m => m.ca));

// ─── Funnel Bar ───────────────────────────────────────────────────────────────
function FunnelBar({ stage, isLast }: { stage: typeof FUNNEL[0]; isLast: boolean }) {
  const width = stage.pct ? `${Math.max(stage.pct, 15)}%` : "100%";

  return (
    <div className="flex items-center gap-4">
      {/* Bar */}
      <div className="flex-1 relative">
        <div
          className="rounded-lg h-12 flex items-center px-4 transition-all"
          style={{ width, background: stage.bg, border: `1px solid ${stage.color}22` }}
        >
          <span className="text-sm font-medium truncate" style={{ color: stage.color }}>
            {stage.label}
          </span>
        </div>
      </div>
      {/* Value */}
      <div className="w-32 text-right">
        {stage.count !== null ? (
          <span className="text-xl font-bold text-foreground">{stage.count}</span>
        ) : (
          <span className="text-xl font-bold text-foreground">${(stage.total! / 1000).toFixed(0)}K</span>
        )}
        {stage.pct && (
          <span className="text-xs text-muted-foreground ml-2">{stage.pct}%</span>
        )}
      </div>
      {/* Arrow to next */}
      {!isLast && (
        <div className="absolute left-0 right-0 flex justify-start pl-4">
          <span className="text-muted-foreground text-xs"></span>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Pipeline() {
  const navigate = useNavigate();
  const [periode, setPeriode] = useState("2026");

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Pipeline Commercial</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Entonnoir de conversion — Access Morocco</p>
        </div>
        <Select value={periode} onValueChange={setPeriode}>
          <SelectTrigger className="w-32 h-9"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="2026">2026</SelectItem>
            <SelectItem value="q1">Q1 2026</SelectItem>
            <SelectItem value="q2">Q2 2026</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total leads",      value: "47",     sub: "+12 ce mois",   icon: <Users size={15} />,      color: "text-primary" },
          { label: "Taux conversion",  value: "14.9%",  sub: "leads → clients",icon: <TrendingUp size={15}/>,  color: "text-green-600" },
          { label: "Dossiers actifs",  value: "14",     sub: "en cours",       icon: <FolderOpen size={15} />, color: "text-amber-600" },
          { label: "CA total",         value: "$487K",  sub: "YTD 2026",       icon: <DollarSign size={15} />, color: "text-foreground" },
        ].map(k => (
          <div key={k.label} className="bg-background border border-border/50 rounded-xl p-4">
            <div className={`flex items-center gap-1.5 mb-2 ${k.color}`}>{k.icon}<span className="text-xs text-muted-foreground">{k.label}</span></div>
            <p className="text-2xl font-bold text-foreground">{k.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{k.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-5">
        {/* Entonnoir */}
        <div className="col-span-3 bg-background border border-border/50 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">Entonnoir de conversion</h2>
          <div className="space-y-2">
            {FUNNEL.map((stage, i) => (
              <FunnelBar key={stage.id} stage={stage} isLast={i === FUNNEL.length - 1} />
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Taux de conversion global: <strong>14.9%</strong> (leads → clients confirmés)
          </p>
        </div>

        {/* Droite: dept + agents */}
        <div className="col-span-2 space-y-4">
          {/* Par département */}
          <div className="bg-background border border-border/50 rounded-xl p-4">
            <h2 className="text-sm font-semibold text-foreground mb-3">Par département</h2>
            <div className="space-y-2">
              {DEPT_STATS.map(d => (
                <div key={d.dept} className="flex items-center justify-between py-1.5 border-b border-border/20 last:border-0">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{d.dept}</p>
                    <p className="text-xs text-muted-foreground">{d.leads} leads · {d.dossiers} dossiers</p>
                  </div>
                  <div className="text-right ml-3">
                    <p className="text-sm font-semibold text-foreground">${(d.ca / 1000).toFixed(0)}K</p>
                    <p className="text-xs text-muted-foreground">{d.tauxConv}% conv.</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Performance agents */}
          <div className="bg-background border border-border/50 rounded-xl p-4">
            <h2 className="text-sm font-semibold text-foreground mb-3">Performance agents</h2>
            {AGENT_PERF.map(a => (
              <div key={a.nom} className="mb-3 last:mb-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                      {a.nom[0]}
                    </div>
                    <span className="text-sm font-medium text-foreground">{a.nom}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{a.tauxConv}% conv.</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1.5">
                  <span>{a.leads} leads</span>
                  <ArrowRight size={10} />
                  <span>{a.convertis} clients</span>
                  <span className="ml-auto font-medium text-foreground">${(a.ca / 1000).toFixed(0)}K</span>
                </div>
                <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${a.tauxConv * 3}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly chart */}
      <div className="bg-background border border-border/50 rounded-xl p-5">
        <h2 className="text-sm font-semibold text-foreground mb-4">Évolution mensuelle</h2>
        <div className="flex items-end gap-6 h-40">
          {MONTHLY.map(m => (
            <div key={m.mois} className="flex-1 flex flex-col items-center gap-2">
              {/* CA bar */}
              <div className="w-full flex flex-col items-center justify-end" style={{ height: "100px" }}>
                <div
                  className="w-full rounded-t-md transition-all"
                  style={{
                    height: m.ca > 0 ? `${Math.max(Math.round((m.ca / maxCA) * 90), 4)}px` : "4px",
                    background: m.ca > 0 ? "#185FA5" : "#E6F1FB",
                  }}
                />
              </div>
              <span className="text-xs text-muted-foreground">{m.mois}</span>
              <span className="text-xs font-medium text-foreground">
                {m.ca > 0 ? `$${(m.ca / 1000).toFixed(0)}K` : "—"}
              </span>
            </div>
          ))}
        </div>
        <div className="flex gap-6 mt-3 text-xs text-muted-foreground border-t border-border/30 pt-3">
          {MONTHLY.map(m => (
            <div key={m.mois} className="flex-1 text-center">
              <p>{m.leads} leads</p>
              <p>{m.dossiers > 0 ? `${m.dossiers} doss.` : "—"}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="flex gap-3">
        <button
          onClick={() => navigate("/leads")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border/50 text-sm hover:bg-secondary transition-colors"
        >
          <Users size={14} className="text-primary" />
          Voir tous les leads
        </button>
        <button
          onClick={() => navigate("/clients")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border/50 text-sm hover:bg-secondary transition-colors"
        >
          <FolderOpen size={14} className="text-primary" />
          Voir tous les clients
        </button>
        <button
          onClick={() => navigate("/rapports")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border/50 text-sm hover:bg-secondary transition-colors"
        >
          <TrendingUp size={14} className="text-primary" />
          Rapports détaillés
        </button>
      </div>
    </div>
  );
}