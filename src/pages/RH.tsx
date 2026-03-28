import { useState } from "react";
import { Users, Clock, CalendarOff, CheckCircle } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const employees = [
  { id: 1, name: "Youssef El Amrani", dept: "Commercial", poste: "Responsable Commercial", salaire: "18 000 MAD", status: "Actif", tel: "+212 6 12 34 56 78" },
  { id: 2, name: "Fatima Zahra Bennani", dept: "Hajj & Omra", poste: "Coordinatrice Pèlerinage", salaire: "15 000 MAD", status: "Actif", tel: "+212 6 23 45 67 89" },
  { id: 3, name: "Karim Tazi", dept: "Tourisme", poste: "Chef de produit", salaire: "16 500 MAD", status: "Actif", tel: "+212 6 34 56 78 90" },
  { id: 4, name: "Amina Chraibi", dept: "Marketing", poste: "Community Manager", salaire: "12 000 MAD", status: "Actif", tel: "+212 6 45 67 89 01" },
  { id: 5, name: "Hassan Ouazzani", dept: "Finance", poste: "Comptable", salaire: "14 000 MAD", status: "Congé", tel: "+212 6 56 78 90 12" },
  { id: 6, name: "Nadia Berrada", dept: "Hajj & Omra", poste: "Agent réservation", salaire: "11 000 MAD", status: "Actif", tel: "+212 6 67 89 01 23" },
];

const attendanceData = [
  { day: "Lun", present: 44, absent: 4 },
  { day: "Mar", present: 46, absent: 2 },
  { day: "Mer", present: 42, absent: 6 },
  { day: "Jeu", present: 45, absent: 3 },
  { day: "Ven", present: 40, absent: 8 },
];

const leaveRequests = [
  { employee: "Hassan Ouazzani", type: "Congé annuel", from: "25/03/2026", to: "02/04/2026", status: "En attente" },
  { employee: "Amina Chraibi", type: "Congé maladie", from: "20/03/2026", to: "22/03/2026", status: "Approuvé" },
  { employee: "Karim Tazi", type: "Congé personnel", from: "15/04/2026", to: "16/04/2026", status: "En attente" },
];

export default function RH() {
  return (
    <div className="space-y-6 fade-in">
      <h1 className="text-2xl font-bold">Ressources Humaines</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Employés" value={48} icon={Users} change="+3 ce mois" changeType="up" />
        <StatCard title="Présents aujourd'hui" value={45} icon={CheckCircle} change="94%" changeType="up" />
        <StatCard title="En retard" value={2} icon={Clock} change="vs 5 hier" changeType="down" />
        <StatCard title="En congé" value={3} icon={CalendarOff} />
      </div>

      <Tabs defaultValue="employees">
        <TabsList>
          <TabsTrigger value="employees">Employés</TabsTrigger>
          <TabsTrigger value="attendance">Présences</TabsTrigger>
          <TabsTrigger value="leaves">Congés</TabsTrigger>
        </TabsList>

        <TabsContent value="employees">
          <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-3 font-medium text-muted-foreground">Nom</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Département</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Poste</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Salaire</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Téléphone</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Statut</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((e) => (
                  <tr key={e.id} className="border-t hover:bg-muted/50 transition-colors">
                    <td className="p-3 font-medium">{e.name}</td>
                    <td className="p-3">{e.dept}</td>
                    <td className="p-3">{e.poste}</td>
                    <td className="p-3">{e.salaire}</td>
                    <td className="p-3">{e.tel}</td>
                    <td className="p-3">
                      <Badge variant={e.status === "Actif" ? "default" : "secondary"} className={e.status === "Actif" ? "bg-success text-success-foreground" : ""}>
                        {e.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="attendance">
          <div className="bg-card rounded-xl border shadow-sm p-5">
            <h3 className="font-semibold mb-4">Présences cette semaine</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,14%,90%)" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="present" fill="hsl(354, 85%, 42%)" name="Présents" radius={[4,4,0,0]} />
                <Bar dataKey="absent" fill="hsl(220,14%,90%)" name="Absents" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>

        <TabsContent value="leaves">
          <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-3 font-medium text-muted-foreground">Employé</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Type</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Du</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Au</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Statut</th>
                </tr>
              </thead>
              <tbody>
                {leaveRequests.map((l, i) => (
                  <tr key={i} className="border-t hover:bg-muted/50">
                    <td className="p-3 font-medium">{l.employee}</td>
                    <td className="p-3">{l.type}</td>
                    <td className="p-3">{l.from}</td>
                    <td className="p-3">{l.to}</td>
                    <td className="p-3">
                      <Badge className={l.status === "Approuvé" ? "bg-success text-success-foreground" : "bg-warning text-warning-foreground"}>
                        {l.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
