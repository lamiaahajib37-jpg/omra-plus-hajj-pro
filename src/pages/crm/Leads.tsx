import { useState } from "react";
import { mockLeads, mockAgents } from "@/data/crmMockData";
import { Lead, LeadStatus, LEAD_STATUS_CONFIG, LeadSource, InterestType } from "@/types/crm";
import { StatCard } from "@/components/StatCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  UserPlus, Search, Phone, Mail, MessageSquare, Calendar, Filter,
  Users, TrendingUp, UserCheck, UserX, ChevronRight, Clock, Building2
} from "lucide-react";

const SOURCES: LeadSource[] = ["Foire", "Website", "Ads", "Referral", "Cold Call", "Email", "Social Media"];
const INTERESTS: InterestType[] = ["Leisure", "MICE"];

export default function CRMLeads() {
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [interestFilter, setInterestFilter] = useState<string>("all");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showNewLead, setShowNewLead] = useState(false);
  const [newNote, setNewNote] = useState("");

  const filtered = leads.filter(l => {
    const matchSearch = l.fullName.toLowerCase().includes(search.toLowerCase()) ||
      l.email.toLowerCase().includes(search.toLowerCase()) ||
      l.company?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || l.status === statusFilter;
    const matchInterest = interestFilter === "all" || l.interest === interestFilter;
    return matchSearch && matchStatus && matchInterest;
  });

  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === "new").length,
    potential: leads.filter(l => l.status === "potential" || l.status === "in_progress").length,
    converted: leads.filter(l => l.status === "converted").length,
    lost: leads.filter(l => l.status === "lost").length,
  };

  const handleStatusChange = (leadId: string, newStatus: LeadStatus) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus, updatedAt: new Date().toISOString().split("T")[0] } : l));
    if (selectedLead?.id === leadId) {
      setSelectedLead(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const handleAddActivity = (leadId: string, type: "call" | "email" | "note", description: string) => {
    const activity = { id: `act-${Date.now()}`, type, description, date: new Date().toISOString().split("T")[0], by: "Vous" };
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, activities: [...l.activities, activity] } : l));
    if (selectedLead?.id === leadId) {
      setSelectedLead(prev => prev ? { ...prev, activities: [...prev.activities, activity] } : null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gestion des Leads</h1>
          <p className="text-muted-foreground">Pipeline de prospection et acquisition</p>
        </div>
        <Dialog open={showNewLead} onOpenChange={setShowNewLead}>
          <DialogTrigger asChild>
            <Button><UserPlus size={16} className="mr-2" /> Nouveau Lead</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Nouveau Lead</DialogTitle></DialogHeader>
            <NewLeadForm agents={mockAgents.filter(a => a.role === "agent")} onSave={(lead) => { setLeads(prev => [lead, ...prev]); setShowNewLead(false); }} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard title="Total Leads" value={stats.total} icon={Users} change="+12 ce mois" changeType="up" />
        <StatCard title="Nouveaux" value={stats.new} icon={UserPlus} change="À traiter" changeType="neutral" />
        <StatCard title="En cours" value={stats.potential} icon={TrendingUp} change="Pipeline actif" changeType="up" />
        <StatCard title="Convertis" value={stats.converted} icon={UserCheck} change={`${Math.round(stats.converted / stats.total * 100)}% taux`} changeType="up" />
        <StatCard title="Perdus" value={stats.lost} icon={UserX} change={`${Math.round(stats.lost / stats.total * 100)}% taux`} changeType="down" />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Rechercher un lead..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]"><Filter size={14} className="mr-2" /><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            {Object.entries(LEAD_STATUS_CONFIG).map(([key, cfg]) => (
              <SelectItem key={key} value={key}>{cfg.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={interestFilter} onValueChange={setInterestFilter}>
          <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous types</SelectItem>
            <SelectItem value="Leisure">Leisure</SelectItem>
            <SelectItem value="MICE">MICE</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lead List */}
        <div className="lg:col-span-2 space-y-3">
          {filtered.map(lead => (
            <div
              key={lead.id}
              onClick={() => setSelectedLead(lead)}
              className={`bg-card border rounded-xl p-4 cursor-pointer transition-all hover:shadow-md ${selectedLead?.id === lead.id ? "ring-2 ring-primary" : ""}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-card-foreground">{lead.fullName}</h3>
                    <Badge variant="outline" className="text-xs">{lead.interest}</Badge>
                  </div>
                  {lead.company && <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5"><Building2 size={12} />{lead.company}</p>}
                </div>
                <Badge className={`${LEAD_STATUS_CONFIG[lead.status].color} border-0 text-xs`}>
                  {LEAD_STATUS_CONFIG[lead.status].label}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Mail size={12} />{lead.email}</span>
                <span className="flex items-center gap-1"><Phone size={12} />{lead.phone}</span>
              </div>
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-muted-foreground">Agent: <span className="font-medium text-foreground">{lead.assignedToName}</span></span>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-muted-foreground">{lead.activities.length} activités</span>
                  {lead.nextFollowUp && (
                    <span className="flex items-center gap-1 text-primary font-medium">
                      <Clock size={12} />Relance: {lead.nextFollowUp}
                    </span>
                  )}
                  <ChevronRight size={14} className="text-muted-foreground" />
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">Aucun lead trouvé</div>
          )}
        </div>

        {/* Lead Detail Panel */}
        <div className="lg:col-span-1">
          {selectedLead ? (
            <div className="bg-card border rounded-xl p-5 sticky top-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg text-card-foreground">{selectedLead.fullName}</h3>
                <Badge className={`${LEAD_STATUS_CONFIG[selectedLead.status].color} border-0`}>
                  {LEAD_STATUS_CONFIG[selectedLead.status].label}
                </Badge>
              </div>

              <div className="space-y-2 text-sm">
                <p className="flex items-center gap-2"><Mail size={14} className="text-primary" />{selectedLead.email}</p>
                <p className="flex items-center gap-2"><Phone size={14} className="text-primary" />{selectedLead.phone}</p>
                {selectedLead.company && <p className="flex items-center gap-2"><Building2 size={14} className="text-primary" />{selectedLead.company}</p>}
                <p className="flex items-center gap-2"><Calendar size={14} className="text-primary" />Créé le {selectedLead.createdAt}</p>
              </div>

              {/* Status Change */}
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">Changer le statut</Label>
                <Select value={selectedLead.status} onValueChange={(v) => handleStatusChange(selectedLead.id, v as LeadStatus)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(LEAD_STATUS_CONFIG).map(([key, cfg]) => (
                      <SelectItem key={key} value={key}>{cfg.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleAddActivity(selectedLead.id, "call", "Appel effectué")}>
                  <Phone size={14} className="mr-1" /> Appel
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleAddActivity(selectedLead.id, "email", "Email envoyé")}>
                  <Mail size={14} className="mr-1" /> Email
                </Button>
              </div>

              {/* Add Note */}
              <div className="space-y-2">
                <Textarea placeholder="Ajouter une note..." value={newNote} onChange={e => setNewNote(e.target.value)} className="text-sm" rows={2} />
                <Button size="sm" className="w-full" disabled={!newNote.trim()} onClick={() => { handleAddActivity(selectedLead.id, "note", newNote); setNewNote(""); }}>
                  <MessageSquare size={14} className="mr-1" /> Ajouter note
                </Button>
              </div>

              {/* Activity Timeline */}
              <Tabs defaultValue="activity">
                <TabsList className="w-full">
                  <TabsTrigger value="activity" className="flex-1 text-xs">Historique</TabsTrigger>
                  <TabsTrigger value="notes" className="flex-1 text-xs">Notes</TabsTrigger>
                </TabsList>
                <TabsContent value="activity" className="mt-3 space-y-2 max-h-[300px] overflow-y-auto">
                  {[...selectedLead.activities].reverse().map(act => (
                    <div key={act.id} className="flex gap-2 text-xs border-l-2 border-primary/30 pl-3 py-1">
                      <div>
                        <span className="font-medium text-foreground">
                          {act.type === "call" ? "📞" : act.type === "email" ? "✉️" : act.type === "meeting" ? "🤝" : act.type === "whatsapp" ? "💬" : act.type === "status_change" ? "🔄" : "📝"}{" "}
                          {act.description}
                        </span>
                        <p className="text-muted-foreground">{act.date} — {act.by}</p>
                      </div>
                    </div>
                  ))}
                </TabsContent>
                <TabsContent value="notes" className="mt-3">
                  <p className="text-sm text-muted-foreground">{selectedLead.notes || "Aucune note"}</p>
                </TabsContent>
              </Tabs>

              {/* Convert to Dossier */}
              {selectedLead.status !== "converted" && selectedLead.status !== "lost" && (
                <Button className="w-full" onClick={() => handleStatusChange(selectedLead.id, "converted")}>
                  Convertir en Dossier
                </Button>
              )}
            </div>
          ) : (
            <div className="bg-card border rounded-xl p-8 text-center text-muted-foreground">
              <Users size={40} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">Sélectionnez un lead pour voir les détails</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function NewLeadForm({ agents, onSave }: { agents: typeof mockAgents; onSave: (lead: Lead) => void }) {
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", company: "", source: "Website" as LeadSource, interest: "Leisure" as InterestType, assignedTo: agents[0]?.id || "", notes: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const agent = agents.find(a => a.id === form.assignedTo);
    const lead: Lead = {
      id: `L${Date.now()}`,
      ...form,
      status: "new",
      assignedToName: agent?.name || "",
      activities: [{ id: `act-${Date.now()}`, type: "note", description: "Lead créé", date: new Date().toISOString().split("T")[0], by: "Vous" }],
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    };
    onSave(lead);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div><Label>Nom complet *</Label><Input required value={form.fullName} onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))} /></div>
        <div><Label>Téléphone *</Label><Input required value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} /></div>
      </div>
      <div><Label>Email *</Label><Input type="email" required value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} /></div>
      <div><Label>Entreprise</Label><Input value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))} /></div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Source</Label>
          <Select value={form.source} onValueChange={v => setForm(p => ({ ...p, source: v as LeadSource }))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{SOURCES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div>
          <Label>Intérêt</Label>
          <Select value={form.interest} onValueChange={v => setForm(p => ({ ...p, interest: v as InterestType }))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{INTERESTS.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label>Assigner à</Label>
        <Select value={form.assignedTo} onValueChange={v => setForm(p => ({ ...p, assignedTo: v }))}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>{agents.map(a => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div><Label>Notes</Label><Textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} rows={2} /></div>
      <Button type="submit" className="w-full">Créer le Lead</Button>
    </form>
  );
}
