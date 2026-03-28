import { DollarSign, TrendingUp, FileText, CreditCard } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { Badge } from "@/components/ui/badge";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar,
} from "recharts";

const revenueData = [
  { month: "Jan", ca: 420000, depenses: 280000 },
  { month: "Fév", ca: 480000, depenses: 310000 },
  { month: "Mar", ca: 520000, depenses: 295000 },
  { month: "Avr", ca: 560000, depenses: 320000 },
  { month: "Mai", ca: 610000, depenses: 340000 },
  { month: "Juin", ca: 580000, depenses: 300000 },
];

const monthlyBreakdown = [
  { month: "Jan", hajj: 180000, tourisme: 150000, omra: 90000 },
  { month: "Fév", hajj: 200000, tourisme: 170000, omra: 110000 },
  { month: "Mar", hajj: 220000, tourisme: 180000, omra: 120000 },
  { month: "Avr", hajj: 250000, tourisme: 190000, omra: 120000 },
  { month: "Mai", hajj: 280000, tourisme: 200000, omra: 130000 },
  { month: "Juin", hajj: 260000, tourisme: 190000, omra: 130000 },
];

const invoices = [
  { id: "FAC-2026-087", client: "Mohammed Alaoui", amount: "45 000 MAD", date: "25/03/2026", status: "Payée", type: "Omra" },
  { id: "FAC-2026-086", client: "Khadija Bennis", amount: "62 000 MAD", date: "24/03/2026", status: "En attente", type: "Hajj" },
  { id: "FAC-2026-085", client: "Ahmed Fassi", amount: "18 500 MAD", date: "23/03/2026", status: "Payée", type: "Tourisme" },
  { id: "FAC-2026-084", client: "Sara Kettani", amount: "55 000 MAD", date: "22/03/2026", status: "En retard", type: "Omra" },
  { id: "FAC-2026-083", client: "Omar Benjelloun", amount: "72 000 MAD", date: "20/03/2026", status: "Payée", type: "Hajj" },
];

export default function Finance() {
  return (
    <div className="space-y-6 fade-in">
      <h1 className="text-2xl font-bold">Finance & Facturation</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="CA Mensuel" value="520K MAD" change="+18%" changeType="up" icon={DollarSign} />
        <StatCard title="Bénéfice net" value="225K MAD" change="+12%" changeType="up" icon={TrendingUp} />
        <StatCard title="Factures émises" value={87} change="ce mois" changeType="neutral" icon={FileText} />
        <StatCard title="Impayés" value="128K MAD" change="3 factures" changeType="down" icon={CreditCard} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border shadow-sm p-5">
          <h3 className="font-semibold mb-4">Évolution CA & Dépenses</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,14%,90%)" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v: number) => `${(v/1000).toFixed(0)}K MAD`} />
              <Legend />
              <Line type="monotone" dataKey="ca" stroke="hsl(354, 85%, 42%)" strokeWidth={2} name="Chiffre d'affaires" />
              <Line type="monotone" dataKey="depenses" stroke="hsl(220,10%,46%)" strokeWidth={2} name="Dépenses" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-xl border shadow-sm p-5">
          <h3 className="font-semibold mb-4">CA par Activité</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlyBreakdown}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,14%,90%)" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v: number) => `${(v/1000).toFixed(0)}K MAD`} />
              <Legend />
              <Bar dataKey="hajj" fill="hsl(354, 85%, 42%)" name="Hajj" radius={[2,2,0,0]} />
              <Bar dataKey="tourisme" fill="hsl(354, 85%, 55%)" name="Tourisme" radius={[2,2,0,0]} />
              <Bar dataKey="omra" fill="hsl(354, 85%, 68%)" name="Omra" radius={[2,2,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
        <div className="p-5 border-b"><h3 className="font-semibold">Dernières Factures</h3></div>
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-3 font-medium text-muted-foreground">N° Facture</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Client</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Montant</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Date</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Type</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Statut</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id} className="border-t hover:bg-muted/50">
                <td className="p-3 font-medium text-primary">{inv.id}</td>
                <td className="p-3">{inv.client}</td>
                <td className="p-3 font-medium">{inv.amount}</td>
                <td className="p-3">{inv.date}</td>
                <td className="p-3"><Badge variant="secondary">{inv.type}</Badge></td>
                <td className="p-3">
                  <Badge className={
                    inv.status === "Payée" ? "bg-success text-success-foreground" :
                    inv.status === "En retard" ? "bg-destructive text-destructive-foreground" : "bg-warning text-warning-foreground"
                  }>{inv.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
