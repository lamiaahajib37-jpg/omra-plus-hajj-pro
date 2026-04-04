import { mockLeads, mockCRMDossiers, mockAgents } from "@/data/crmMockData";
import { LEAD_STATUS_CONFIG, DOSSIER_STATUS_CONFIG } from "@/types/crm";
import { StatCard } from "@/components/StatCard";
import { Badge } from "@/components/ui/badge";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from "recharts";
import { Users, TrendingUp, DollarSign, Target, UserCheck, FolderOpen } from "lucide-react";

const COLORS = ["hsl(354, 85%, 42%)", "hsl(354, 85%, 55%)", "hsl(354, 85%, 68%)", "hsl(220, 20%, 60%)", "hsl(142, 71%, 45%)", "hsl(38, 92%, 50%)", "hsl(0, 84%, 60%)", "hsl(220, 14%, 80%)"];

export default function CRMDashboard() {
  const totalLeads = mockLeads.length;
  const convertedLeads = mockLeads.filter(l => l.status === "converted").length;
  const conversionRate = totalLeads ? Math.round(convertedLeads / totalLeads * 100) : 0;
  const totalDossiers = mockCRMDossiers.length;
  const confirmedDossiers = mockCRMDossiers.filter(d => d.status === "confirmed");
  const totalRevenue = confirmedDossiers.reduce((s, d) => {
    const last = d.presentations[d.presentations.length - 1];
    return s + (last?.totalSelling || 0);
  }, 0);
  const totalMargin = confirmedDossiers.reduce((s, d) => {
    const last = d.presentations[d.presentations.length - 1];
    return s + (last?.margin || 0);
  }, 0);

  // Lead status distribution
  const statusData = Object.entries(LEAD_STATUS_CONFIG).map(([key, cfg]) => ({
    name: cfg.label,
    value: mockLeads.filter(l => l.status === key).length,
  })).filter(d => d.value > 0);

  // Source distribution
  const sourceData = ["Foire", "Website", "Ads", "Referral", "Cold Call", "Social Media"].map(s => ({
    name: s,
    value: mockLeads.filter(l => l.source === s).length,
  })).filter(d => d.value > 0);

  // Agent performance
  const agentData = mockAgents.filter(a => a.role === "agent").map(a => ({
    name: a.name.split(" ")[0],
    leads: mockLeads.filter(l => l.assignedTo === a.id).length,
    converted: mockLeads.filter(l => l.assignedTo === a.id && l.status === "converted").length,
  }));

  // Monthly trend (mock)
  const trendData = [
    { month: "Jan", leads: 15, converted: 3 },
    { month: "Fév", leads: 22, converted: 5 },
    { month: "Mar", leads: 28, converted: 8 },
    { month: "Avr", leads: 18, converted: 4 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">CRM Dashboard</h1>
        <p className="text-muted-foreground">Vue d'ensemble des performances commerciales</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard title="Total Leads" value={totalLeads} icon={Users} change="+12 ce mois" changeType="up" />
        <StatCard title="Taux Conversion" value={`${conversionRate}%`} icon={Target} change="+3% vs mois" changeType="up" />
        <StatCard title="Dossiers Actifs" value={totalDossiers} icon={FolderOpen} />
        <StatCard title="Confirmés" value={confirmedDossiers.length} icon={UserCheck} />
        <StatCard title="CA Confirmé" value={`${(totalRevenue / 1000).toFixed(0)}K`} icon={DollarSign} change="MAD" changeType="neutral" />
        <StatCard title="Marge Totale" value={`${(totalMargin / 1000).toFixed(0)}K`} icon={TrendingUp} change="MAD" changeType="up" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lead Status Pie */}
        <div className="bg-card border rounded-xl p-5">
          <h3 className="font-semibold text-card-foreground mb-4">Répartition des Leads</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" innerRadius={50} outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Source Bar */}
        <div className="bg-card border rounded-xl p-5">
          <h3 className="font-semibold text-card-foreground mb-4">Leads par Source</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={sourceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,14%,90%)" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="value" fill="hsl(354, 85%, 42%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Agent Performance */}
        <div className="bg-card border rounded-xl p-5">
          <h3 className="font-semibold text-card-foreground mb-4">Performance Agents</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={agentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,14%,90%)" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="leads" name="Leads" fill="hsl(354, 85%, 42%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="converted" name="Convertis" fill="hsl(142, 71%, 45%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Trend */}
        <div className="bg-card border rounded-xl p-5">
          <h3 className="font-semibold text-card-foreground mb-4">Tendance Mensuelle</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,14%,90%)" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="leads" name="Leads" stroke="hsl(354, 85%, 42%)" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="converted" name="Convertis" stroke="hsl(142, 71%, 45%)" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-card border rounded-xl p-5">
        <h3 className="font-semibold text-card-foreground mb-4">Derniers Leads</h3>
        <div className="space-y-3">
          {mockLeads.slice(0, 5).map(lead => (
            <div key={lead.id} className="flex items-center justify-between py-2 border-b last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                  {lead.fullName.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <p className="text-sm font-medium text-card-foreground">{lead.fullName}</p>
                  <p className="text-xs text-muted-foreground">{lead.source} • {lead.interest}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{lead.assignedToName}</span>
                <Badge className={`${LEAD_STATUS_CONFIG[lead.status].color} border-0 text-xs`}>
                  {LEAD_STATUS_CONFIG[lead.status].label}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
