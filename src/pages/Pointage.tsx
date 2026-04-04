import { useState, useMemo, useEffect, useRef } from "react";
import {
  Clock, MapPin, LogIn, LogOut, FileText, CheckCircle2,
  XCircle, AlertCircle, Search, SlidersHorizontal, Download,
  ChevronDown, Eye, ThumbsUp, ThumbsDown, User, Building2,
  Calendar, Timer, Wifi, WifiOff, BarChart3, TrendingUp,
  Shield, RefreshCw, Info,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import {
  INITIAL_RECORDS, EMPLOYEES_POINTAGE, STATUS_CONFIG, JUSTIF_LABELS,
  PointageRecord, PointageStatus, JustifType,
} from "./pointage.data";

// ─── Live Clock ───────────────────────────────────────────────────────────────
function LiveClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="text-center">
      <div className="text-5xl font-bold tabular-nums text-foreground tracking-tight">
        {time.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
      </div>
      <div className="text-sm text-muted-foreground mt-1 capitalize">
        {time.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
      </div>
    </div>
  );
}

// ─── GPS Hook ─────────────────────────────────────────────────────────────────
function useGPS() {
  const [gps, setGps] = useState<{ lat: number; lng: number; accuracy: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = () => {
    if (!navigator.geolocation) { setError("GPS non supporté"); return; }
    setLoading(true); setError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGps({ lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy });
        setLoading(false);
      },
      () => {
        // Demo fallback — simulate Casablanca coords
        setGps({ lat: 33.5731 + Math.random() * 0.001, lng: -7.5898 + Math.random() * 0.001, accuracy: 12 });
        setLoading(false);
      },
      { timeout: 5000, enableHighAccuracy: true }
    );
  };

  return { gps, loading, error, fetch };
}

// ─── Justification Modal ──────────────────────────────────────────────────────
function JustifModal({ onClose, onSubmit, mode = "add" }: {
  onClose: () => void;
  onSubmit: (type: JustifType, text: string) => void;
  mode?: "add" | "view";
}) {
  const [type, setType] = useState<JustifType>("transport");
  const [text, setText] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border rounded-2xl shadow-2xl w-full max-w-sm animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <div className="flex items-center gap-2">
            <FileText size={16} className="text-primary" />
            <h2 className="font-semibold text-sm">Ajouter une justification</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-accent text-muted-foreground">
            <XCircle size={16} />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Type de justification</label>
            <Select value={type} onValueChange={v => setType(v as JustifType)}>
              <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                {(Object.entries(JUSTIF_LABELS) as [JustifType, string][]).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Explication</label>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Décrivez la raison de votre retard ou absence..."
              className="w-full min-h-[90px] text-sm border rounded-lg px-3 py-2 bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
        <div className="flex gap-2 px-5 pb-5">
          <button onClick={onClose}
            className="flex-1 py-2 text-sm rounded-lg border hover:bg-accent text-muted-foreground transition-colors">
            Annuler
          </button>
          <button onClick={() => { if (text.trim()) { onSubmit(type, text); onClose(); } }}
            className="flex-1 py-2 text-sm rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 font-medium transition-colors">
            Envoyer
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Employee Pointage View ───────────────────────────────────────────────────
function EmployeePointageView({ records, onCheckIn, onCheckOut, onJustif }: {
  records: PointageRecord[];
  onCheckIn: (gps: { lat: number; lng: number }) => void;
  onCheckOut: () => void;
  onJustif: (type: JustifType, text: string) => void;
}) {
  const { user } = useAuth();
  const { gps, loading: gpsLoading, fetch: fetchGPS } = useGPS();
  const [showJustif, setShowJustif] = useState(false);
  const [checkingIn, setCheckingIn] = useState(false);

  const todayStr = new Date().toISOString().split("T")[0];
  const todayRecord = records.find(r => r.date === todayStr);
  const recentRecords = records.slice(0, 7);

  const hasCheckedIn = !!todayRecord?.checkIn;
  const hasCheckedOut = !!todayRecord?.checkOut;
  const canJustify = todayRecord && (todayRecord.status === "retard" || todayRecord.status === "absent") && !todayRecord.justification;

  useEffect(() => { fetchGPS(); }, []);

  const handleCheckIn = async () => {
    setCheckingIn(true);
    await new Promise(r => setTimeout(r, 800));
    onCheckIn(gps ?? { lat: 33.5731, lng: -7.5898 });
    setCheckingIn(false);
  };

  return (
    <div className="max-w-lg mx-auto space-y-5">
      {/* Clock card */}
      <div className="bg-card border rounded-2xl p-6 shadow-sm text-center space-y-4">
        <LiveClock />

        {/* GPS indicator */}
        <div className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border ${
          gps ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-amber-50 border-amber-200 text-amber-700"
        }`}>
          {gps ? <Wifi size={12} /> : <WifiOff size={12} />}
          {gpsLoading ? "Localisation en cours..." : gps
            ? `GPS actif · ${gps.lat.toFixed(4)}, ${gps.lng.toFixed(4)}`
            : "GPS non disponible"}
          {gps && <span className="text-xs opacity-60">±{Math.round(gps.accuracy ?? 10)}m</span>}
        </div>

        {/* Today status */}
        {todayRecord && (
          <div className={`flex items-center justify-center gap-2 text-sm font-medium px-4 py-2 rounded-full border ${STATUS_CONFIG[todayRecord.status].bg} ${STATUS_CONFIG[todayRecord.status].color}`}>
            <span className={`w-2 h-2 rounded-full ${STATUS_CONFIG[todayRecord.status].dot}`} />
            {STATUS_CONFIG[todayRecord.status].label}
            {todayRecord.checkIn && <span className="opacity-70">· Arrivée {todayRecord.checkIn}</span>}
            {todayRecord.checkOut && <span className="opacity-70">· Départ {todayRecord.checkOut}</span>}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3 pt-1">
          <button
            onClick={handleCheckIn}
            disabled={hasCheckedIn || checkingIn}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold transition-all ${
              hasCheckedIn
                ? "bg-muted text-muted-foreground cursor-not-allowed opacity-60"
                : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-md hover:shadow-lg active:scale-95"
            }`}
          >
            {checkingIn ? <RefreshCw size={16} className="animate-spin" /> : <LogIn size={16} />}
            {checkingIn ? "Pointage..." : hasCheckedIn ? `Pointé ${todayRecord?.checkIn}` : "Pointer l'arrivée"}
          </button>
          <button
            onClick={onCheckOut}
            disabled={!hasCheckedIn || hasCheckedOut}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold transition-all ${
              !hasCheckedIn || hasCheckedOut
                ? "bg-muted text-muted-foreground cursor-not-allowed opacity-60"
                : "bg-slate-800 hover:bg-slate-900 text-white shadow-md hover:shadow-lg active:scale-95"
            }`}
          >
            <LogOut size={16} />
            {hasCheckedOut ? `Parti ${todayRecord?.checkOut}` : "Pointer le départ"}
          </button>
        </div>

        {/* Justify button */}
        {canJustify && (
          <button
            onClick={() => setShowJustif(true)}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed border-amber-300 bg-amber-50 text-amber-700 text-sm font-medium hover:bg-amber-100 transition-colors"
          >
            <FileText size={15} />
            Ajouter une justification · {todayRecord.status === "retard" ? "Retard" : "Absence"}
          </button>
        )}
        {todayRecord?.justification && (
          <div className="text-xs bg-muted rounded-lg px-3 py-2 text-left text-muted-foreground">
            <span className="font-medium">Justification envoyée ·</span> {todayRecord.justification}
            {todayRecord.justifApproved === true && <span className="ml-2 text-emerald-600 font-medium">✓ Approuvé</span>}
            {todayRecord.justifApproved === null && <span className="ml-2 text-amber-600">En attente</span>}
          </div>
        )}
      </div>

      {/* Recent history */}
      <div className="bg-card border rounded-2xl overflow-hidden shadow-sm">
        <div className="px-5 py-3.5 border-b flex items-center gap-2">
          <Calendar size={15} className="text-primary" />
          <h3 className="text-sm font-semibold">Mon historique récent</h3>
        </div>
        <div className="divide-y">
          {recentRecords.length === 0 && (
            <p className="text-center py-8 text-sm text-muted-foreground">Aucun pointage enregistré</p>
          )}
          {recentRecords.map(r => {
            const st = STATUS_CONFIG[r.status];
            return (
              <div key={r.id} className="flex items-center gap-3 px-5 py-3 hover:bg-muted/30 transition-colors">
                <div className={`w-2 h-2 rounded-full shrink-0 ${st.dot}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground capitalize">
                      {new Date(r.date).toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" })}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${st.bg} ${st.color}`}>
                      {st.label}
                    </span>
                  </div>
                  {(r.checkIn || r.checkOut) && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {r.checkIn && `Arrivée ${r.checkIn}`}
                      {r.checkIn && r.checkOut && " · "}
                      {r.checkOut && `Départ ${r.checkOut}`}
                      {r.workHours && ` · ${r.workHours}h`}
                    </p>
                  )}
                  {r.justification && <p className="text-xs text-muted-foreground truncate mt-0.5 italic">{r.justification}</p>}
                </div>
                {r.justifApproved === true && <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />}
                {r.justifApproved === false && <XCircle size={14} className="text-red-500 shrink-0" />}
                {r.justifApproved === null && r.justification && <AlertCircle size={14} className="text-amber-500 shrink-0" />}
              </div>
            );
          })}
        </div>
      </div>

      {showJustif && (
        <JustifModal
          onClose={() => setShowJustif(false)}
          onSubmit={onJustif}
        />
      )}
    </div>
  );
}

// ─── Admin Pointage View ──────────────────────────────────────────────────────
function AdminPointageView({ records, onApprove, onReject }: {
  records: PointageRecord[];
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
}) {
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("today");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deptFilter, setDeptFilter] = useState("all");
  const [detailRecord, setDetailRecord] = useState<PointageRecord | null>(null);

  const todayStr = new Date().toISOString().split("T")[0];

  const getDateRange = () => {
    const today = new Date();
    if (dateFilter === "today") return [todayStr, todayStr];
    if (dateFilter === "week") {
      const start = new Date(today); start.setDate(today.getDate() - 6);
      return [start.toISOString().split("T")[0], todayStr];
    }
    if (dateFilter === "month") {
      const start = new Date(today.getFullYear(), today.getMonth(), 1);
      return [start.toISOString().split("T")[0], todayStr];
    }
    return ["", ""];
  };

  const filtered = useMemo(() => {
    const [from, to] = getDateRange();
    return records.filter(r => {
      const matchSearch = r.employeeName.toLowerCase().includes(search.toLowerCase()) || r.department.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || r.status === statusFilter;
      const matchDept = deptFilter === "all" || r.department === deptFilter;
      const matchDate = (!from || r.date >= from) && (!to || r.date <= to);
      return matchSearch && matchStatus && matchDept && matchDate;
    }).sort((a, b) => b.date.localeCompare(a.date) || (a.employeeName.localeCompare(b.employeeName)));
  }, [records, search, statusFilter, deptFilter, dateFilter]);

  const todayRecords = records.filter(r => r.date === todayStr);
  const stats = {
    present: todayRecords.filter(r => r.status === "present" || r.status === "telework").length,
    retard: todayRecords.filter(r => r.status === "retard").length,
    absent: todayRecords.filter(r => r.status === "absent").length,
    conge: todayRecords.filter(r => r.status === "conge").length,
    pending: records.filter(r => r.justifApproved === null && r.justification).length,
  };

  const departments = [...new Set(records.map(r => r.department))];

  return (
    <div className="space-y-5">
      {/* Stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: "Présents", value: stats.present, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200", dot: "bg-emerald-500" },
          { label: "Retards", value: stats.retard, color: "text-amber-600", bg: "bg-amber-50 border-amber-200", dot: "bg-amber-500" },
          { label: "Absents", value: stats.absent, color: "text-red-600", bg: "bg-red-50 border-red-200", dot: "bg-red-500" },
          { label: "Congés", value: stats.conge, color: "text-blue-600", bg: "bg-blue-50 border-blue-200", dot: "bg-blue-500" },
          { label: "Justif. en attente", value: stats.pending, color: "text-violet-600", bg: "bg-violet-50 border-violet-200", dot: "bg-violet-500" },
        ].map(s => (
          <div key={s.label} className={`border rounded-xl p-3.5 flex items-center gap-3 ${s.bg}`}>
            <div className={`w-8 h-8 rounded-lg bg-white/70 flex items-center justify-center`}>
              <span className={`text-lg font-bold ${s.color}`}>{s.value}</span>
            </div>
            <div>
              <div className={`w-1.5 h-1.5 rounded-full ${s.dot} mb-0.5`} />
              <p className={`text-xs font-medium ${s.color}`}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-9 text-sm" />
        </div>
        <Select value={dateFilter} onValueChange={setDateFilter}>
          <SelectTrigger className="h-9 w-[140px] text-sm">
            <Calendar size={13} className="mr-1 text-muted-foreground" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Aujourd'hui</SelectItem>
            <SelectItem value="week">7 derniers jours</SelectItem>
            <SelectItem value="month">Ce mois</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-9 w-[145px] text-sm">
            <SlidersHorizontal size={13} className="mr-1 text-muted-foreground" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous statuts</SelectItem>
            <SelectItem value="present">Présent</SelectItem>
            <SelectItem value="retard">Retard</SelectItem>
            <SelectItem value="absent">Absent</SelectItem>
            <SelectItem value="conge">Congé</SelectItem>
            <SelectItem value="telework">Télétravail</SelectItem>
          </SelectContent>
        </Select>
        <Select value={deptFilter} onValueChange={setDeptFilter}>
          <SelectTrigger className="h-9 w-[160px] text-sm">
            <Building2 size={13} className="mr-1 text-muted-foreground" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous dépts</SelectItem>
            {departments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
          </SelectContent>
        </Select>
        <div className="ml-auto text-xs text-muted-foreground">{filtered.length} enregistrement{filtered.length > 1 ? "s" : ""}</div>
      </div>

      {/* Table */}
      <div className="bg-card border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40">
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Employé</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Date</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Arrivée</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Départ</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Heures</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Statut</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">GPS</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Justif.</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-muted-foreground text-sm">
                    Aucun enregistrement trouvé
                  </td>
                </tr>
              )}
              {filtered.map(r => {
                const st = STATUS_CONFIG[r.status];
                return (
                  <tr key={r.id} className="hover:bg-muted/20 transition-colors">
                    {/* Employee */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold shrink-0">
                          {r.employeeInitials}
                        </div>
                        <div>
                          <p className="font-medium text-foreground text-xs">{r.employeeName}</p>
                          <p className="text-xs text-muted-foreground">{r.department}</p>
                        </div>
                      </div>
                    </td>
                    {/* Date */}
                    <td className="px-4 py-3 text-xs text-muted-foreground capitalize">
                      {new Date(r.date).toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" })}
                    </td>
                    {/* Check in */}
                    <td className="px-4 py-3">
                      {r.checkIn
                        ? <span className={`font-mono text-xs font-semibold ${r.status === "retard" ? "text-amber-600" : "text-emerald-600"}`}>{r.checkIn}</span>
                        : <span className="text-xs text-muted-foreground">—</span>}
                    </td>
                    {/* Check out */}
                    <td className="px-4 py-3">
                      {r.checkOut
                        ? <span className="font-mono text-xs font-semibold text-foreground">{r.checkOut}</span>
                        : <span className="text-xs text-muted-foreground">—</span>}
                    </td>
                    {/* Hours */}
                    <td className="px-4 py-3 text-xs font-medium text-foreground">
                      {r.workHours ? `${r.workHours}h` : "—"}
                    </td>
                    {/* Status */}
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${st.bg} ${st.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                        {st.label}
                      </span>
                    </td>
                    {/* GPS */}
                    <td className="px-4 py-3">
                      {r.gpsLat
                        ? <span className="inline-flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                            <MapPin size={10} /> OK
                          </span>
                        : <span className="text-xs text-muted-foreground">—</span>}
                    </td>
                    {/* Justif */}
                    <td className="px-4 py-3">
                      {r.justification ? (
                        <button
                          onClick={() => setDetailRecord(r)}
                          className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-medium transition-colors ${
                            r.justifApproved === true ? "bg-emerald-50 border-emerald-200 text-emerald-700" :
                            r.justifApproved === false ? "bg-red-50 border-red-200 text-red-700" :
                            "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100"
                          }`}
                        >
                          <Eye size={10} />
                          {r.justifApproved === true ? "Approuvé" : r.justifApproved === false ? "Refusé" : "En attente"}
                        </button>
                      ) : (
                        (r.status === "retard" || r.status === "absent")
                          ? <span className="text-xs text-red-500 font-medium">Manquante</span>
                          : <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                    {/* Actions */}
                    <td className="px-4 py-3">
                      {r.justification && r.justifApproved === null && (
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => onApprove(r.id)}
                            className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors border border-emerald-200"
                            title="Approuver">
                            <ThumbsUp size={12} />
                          </button>
                          <button onClick={() => onReject(r.id)}
                            className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors border border-red-200"
                            title="Refuser">
                            <ThumbsDown size={12} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail modal */}
      {detailRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDetailRecord(null)} />
          <div className="relative bg-card border rounded-2xl shadow-2xl w-full max-w-sm animate-in fade-in zoom-in-95 duration-200 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">Détail justification</h3>
              <button onClick={() => setDetailRecord(null)} className="p-1 rounded hover:bg-accent text-muted-foreground">
                <XCircle size={15} />
              </button>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                {detailRecord.employeeInitials}
              </div>
              <div>
                <p className="font-semibold text-sm">{detailRecord.employeeName}</p>
                <p className="text-xs text-muted-foreground">{detailRecord.department}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-muted rounded-lg p-2.5">
                <p className="text-muted-foreground mb-0.5">Date</p>
                <p className="font-medium capitalize">{new Date(detailRecord.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}</p>
              </div>
              <div className="bg-muted rounded-lg p-2.5">
                <p className="text-muted-foreground mb-0.5">Type</p>
                <p className="font-medium">{JUSTIF_LABELS[detailRecord.justifType!] ?? "—"}</p>
              </div>
            </div>
            <div className="bg-muted rounded-lg p-3 text-sm text-foreground">
              {detailRecord.justification}
            </div>
            {detailRecord.justifApproved === null && (
              <div className="flex gap-2">
                <button onClick={() => { onApprove(detailRecord.id); setDetailRecord(null); }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition-colors">
                  <ThumbsUp size={13} /> Approuver
                </button>
                <button onClick={() => { onReject(detailRecord.id); setDetailRecord(null); }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors">
                  <ThumbsDown size={13} /> Refuser
                </button>
              </div>
            )}
            {detailRecord.justifApproved === true && (
              <div className="flex items-center justify-center gap-2 py-2 rounded-lg bg-emerald-50 text-emerald-700 text-sm font-medium border border-emerald-200">
                <CheckCircle2 size={14} /> Justification approuvée
              </div>
            )}
            {detailRecord.justifApproved === false && (
              <div className="flex items-center justify-center gap-2 py-2 rounded-lg bg-red-50 text-red-700 text-sm font-medium border border-red-200">
                <XCircle size={14} /> Justification refusée
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Pointage() {
  const { isAdmin, user } = useAuth();
  const [records, setRecords] = useState<PointageRecord[]>(INITIAL_RECORDS);

  // For demo: get logged-in user's records
  // In real app, employeeId would match user.id
  const myRecords = useMemo(() =>
    records.filter(r => r.employeeId === 5) // Youssef = id 5 = employee demo
      .sort((a, b) => b.date.localeCompare(a.date)),
    [records]
  );

  const todayStr = new Date().toISOString().split("T")[0];
  const nowTime = () => new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

  const handleCheckIn = (gps: { lat: number; lng: number }) => {
    const existing = records.find(r => r.employeeId === 5 && r.date === todayStr);
    const checkIn = nowTime();
    const hour = parseInt(checkIn.split(":")[0]);
    const min = parseInt(checkIn.split(":")[1]);
    const isLate = hour > 8 || (hour === 8 && min > 15);
    if (existing) {
      setRecords(prev => prev.map(r =>
        r.id === existing.id ? { ...r, checkIn, status: isLate ? "retard" : "present", gpsLat: gps.lat, gpsLng: gps.lng } : r
      ));
    } else {
      setRecords(prev => [...prev, {
        id: Date.now(), employeeId: 5, employeeName: "Youssef El Amrani", employeeInitials: "YE",
        department: "IT", date: todayStr, checkIn, status: isLate ? "retard" : "present",
        gpsLat: gps.lat, gpsLng: gps.lng,
      }]);
    }
  };

  const handleCheckOut = () => {
    const checkOut = nowTime();
    setRecords(prev => prev.map(r => {
      if (r.employeeId === 5 && r.date === todayStr && r.checkIn && !r.checkOut) {
        const [inH, inM] = r.checkIn.split(":").map(Number);
        const [outH, outM] = checkOut.split(":").map(Number);
        const workHours = Math.round(((outH * 60 + outM) - (inH * 60 + inM)) / 60 * 10) / 10;
        return { ...r, checkOut, workHours };
      }
      return r;
    }));
  };

  const handleJustif = (type: JustifType, text: string) => {
    setRecords(prev => prev.map(r =>
      r.employeeId === 5 && r.date === todayStr
        ? { ...r, justification: text, justifType: type, justifApproved: null }
        : r
    ));
  };

  const handleApprove = (id: number) =>
    setRecords(prev => prev.map(r => r.id === id ? { ...r, justifApproved: true } : r));
  const handleReject = (id: number) =>
    setRecords(prev => prev.map(r => r.id === id ? { ...r, justifApproved: false } : r));

  return (
    <div className="space-y-5 fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {isAdmin ? "Pointage & Présences" : "Mon Pointage"}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {isAdmin
              ? "Suivi des présences, retards et justifications"
              : "Pointez votre arrivée et votre départ"}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs bg-muted border rounded-lg px-3 py-2 text-muted-foreground">
          <Shield size={13} className="text-primary" />
          Heure officielle · Casablanca (GMT+1)
        </div>
      </div>

      {isAdmin
        ? <AdminPointageView records={records} onApprove={handleApprove} onReject={handleReject} />
        : <EmployeePointageView records={myRecords} onCheckIn={handleCheckIn} onCheckOut={handleCheckOut} onJustif={handleJustif} />
      }
    </div>
  );
}