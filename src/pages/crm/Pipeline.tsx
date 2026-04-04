import { useState } from "react";
import { mockCRMDossiers, mockAgents, mockServices } from "@/data/crmMockData";
import { CRMDossier, DossierStatus, DOSSIER_STATUS_CONFIG, DossierType } from "@/types/crm";
import { StatCard } from "@/components/StatCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  FolderOpen, Search, Plus, Filter, DollarSign, TrendingUp, Clock,
  CheckCircle, XCircle, Send, FileText, ChevronRight, Calendar, User
} from "lucide-react";

export default function CRMPipeline() {
  const [dossiers, setDossiers] = useState<CRMDossier[]>(mockCRMDossiers);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedDossier, setSelectedDossier] = useState<CRMDossier | null>(null);
  const [viewMode, setViewMode] = useState<"cards" | "kanban">("cards");

  const filtered = dossiers.filter(d => {
    const matchSearch = d.clientName.toLowerCase().includes(search.toLowerCase()) || d.reference.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || d.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalBudget = dossiers.reduce((s, d) => s + d.budget, 0);
  const confirmed = dossiers.filter(d => d.status === "confirmed");
  const confirmedRevenue = confirmed.reduce((s, d) => {
    const lastPres = d.presentations[d.presentations.length - 1];
    return s + (lastPres?.totalSelling || 0);
  }, 0);

  const handleStatusChange = (id: string, status: DossierStatus) => {
    setDossiers(prev => prev.map(d => d.id === id ? { ...d, status } : d));
    if (selectedDossier?.id === id) setSelectedDossier(prev => prev ? { ...prev, status } : null);
  };

  const statuses: DossierStatus[] = ["new", "assigned", "in_progress", "waiting_client", "confirmed", "lost"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Pipeline Commercial</h1>
          <p className="text-muted-foreground">Suivi des dossiers et propositions commerciales</p>
        </div>
        <div className="flex gap-2">
          <Button variant={viewMode === "cards" ? "default" : "outline"} size="sm" onClick={() => setViewMode("cards")}>Cartes</Button>
          <Button variant={viewMode === "kanban" ? "default" : "outline"} size="sm" onClick={() => setViewMode("kanban")}>Kanban</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Dossiers" value={dossiers.length} icon={FolderOpen} />
        <StatCard title="Budget Total" value={`${(totalBudget / 1000).toFixed(0)}K MAD`} icon={DollarSign} change="+15% vs mois dernier" changeType="up" />
        <StatCard title="Confirmés" value={confirmed.length} icon={CheckCircle} change={`${confirmedRevenue.toLocaleString()} MAD CA`} changeType="up" />
        <StatCard title="Taux conversion" value={`${dossiers.length ? Math.round(confirmed.length / dossiers.length * 100) : 0}%`} icon={TrendingUp} />
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Rechercher dossier..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]"><Filter size={14} className="mr-2" /><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            {Object.entries(DOSSIER_STATUS_CONFIG).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {viewMode === "kanban" ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {statuses.map(status => (
            <div key={status} className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge className={`${DOSSIER_STATUS_CONFIG[status].color} border-0 text-xs`}>{DOSSIER_STATUS_CONFIG[status].label}</Badge>
                <span className="text-xs text-muted-foreground">{dossiers.filter(d => d.status === status).length}</span>
              </div>
              {dossiers.filter(d => d.status === status).map(d => (
                <div key={d.id} onClick={() => setSelectedDossier(d)} className="bg-card border rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow">
                  <p className="font-medium text-xs text-card-foreground truncate">{d.clientName}</p>
                  <p className="text-xs text-muted-foreground">{d.reference}</p>
                  <p className="text-xs text-primary font-medium mt-1">{d.budget.toLocaleString()} MAD</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            {filtered.map(d => (
              <div key={d.id} onClick={() => setSelectedDossier(d)}
                className={`bg-card border rounded-xl p-4 cursor-pointer transition-all hover:shadow-md ${selectedDossier?.id === d.id ? "ring-2 ring-primary" : ""}`}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-card-foreground">{d.reference}</h3>
                      <Badge variant="outline" className="text-xs">{d.department}</Badge>
                      <Badge variant="outline" className="text-xs">{d.type}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">{d.clientName} {d.clientCompany ? `— ${d.clientCompany}` : ""}</p>
                  </div>
                  <Badge className={`${DOSSIER_STATUS_CONFIG[d.status].color} border-0 text-xs`}>{DOSSIER_STATUS_CONFIG[d.status].label}</Badge>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                  <span className="flex items-center gap-1"><DollarSign size={12} />{d.budget.toLocaleString()} MAD</span>
                  <span className="flex items-center gap-1"><Calendar size={12} />{d.dateStart} → {d.dateEnd}</span>
                  <span className="flex items-center gap-1"><User size={12} />{d.assignedToName || "Non assigné"}</span>
                  <span className="flex items-center gap-1"><FileText size={12} />{d.presentations.length} présentation(s)</span>
                </div>
              </div>
            ))}
          </div>

          {/* Detail Panel */}
          <div className="lg:col-span-1">
            {selectedDossier ? (
              <div className="bg-card border rounded-xl p-5 sticky top-6 space-y-4">
                <div>
                  <h3 className="font-bold text-lg text-card-foreground">{selectedDossier.reference}</h3>
                  <p className="text-sm text-muted-foreground">{selectedDossier.clientName}</p>
                </div>
                <Badge className={`${DOSSIER_STATUS_CONFIG[selectedDossier.status].color} border-0`}>
                  {DOSSIER_STATUS_CONFIG[selectedDossier.status].label}
                </Badge>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Budget</span><span className="font-medium">{selectedDossier.budget.toLocaleString()} MAD</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Département</span><span className="font-medium">{selectedDossier.department}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Type</span><span className="font-medium">{selectedDossier.type}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Dates</span><span className="font-medium">{selectedDossier.dateStart} → {selectedDossier.dateEnd}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Assigné à</span><span className="font-medium">{selectedDossier.assignedToName || "—"}</span></div>
                </div>

                <div>
                  <Label className="text-xs text-muted-foreground mb-1 block">Statut</Label>
                  <Select value={selectedDossier.status} onValueChange={v => handleStatusChange(selectedDossier.id, v as DossierStatus)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{Object.entries(DOSSIER_STATUS_CONFIG).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}</SelectContent>
                  </Select>
                </div>

                {/* Presentations */}
                <div>
                  <h4 className="font-semibold text-sm mb-2">Présentations</h4>
                  {selectedDossier.presentations.length > 0 ? (
                    <div className="space-y-2">
                      {selectedDossier.presentations.map(p => (
                        <div key={p.id} className="bg-secondary/50 rounded-lg p-3 text-xs">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium">Version {p.version}</span>
                            <Badge variant="outline" className="text-xs">
                              {p.status === "sent" ? "Envoyée" : p.status === "accepted" ? "Acceptée" : p.status === "rejected" ? "Rejetée" : "Brouillon"}
                            </Badge>
                          </div>
                          <div className="flex justify-between text-muted-foreground">
                            <span>Coût: {p.totalCost.toLocaleString()}</span>
                            <span>Vente: {p.totalSelling.toLocaleString()}</span>
                            <span className="text-primary font-medium">Marge: {p.margin.toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : <p className="text-xs text-muted-foreground">Aucune présentation</p>}
                </div>

                {/* Timeline */}
                <div>
                  <h4 className="font-semibold text-sm mb-2">Activité</h4>
                  <div className="space-y-2 max-h-[200px] overflow-y-auto">
                    {[...selectedDossier.activities].reverse().map(act => (
                      <div key={act.id} className="flex gap-2 text-xs border-l-2 border-primary/30 pl-3 py-1">
                        <div>
                          <p className="font-medium text-foreground">
                            {act.type === "call" ? "📞" : act.type === "email" ? "✉️" : act.type === "status_change" ? "🔄" : "📝"} {act.description}
                          </p>
                          <p className="text-muted-foreground">{act.date} — {act.by}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-card border rounded-xl p-8 text-center text-muted-foreground">
                <FolderOpen size={40} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">Sélectionnez un dossier</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
