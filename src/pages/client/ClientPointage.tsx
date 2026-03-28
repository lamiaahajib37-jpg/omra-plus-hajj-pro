import { Clock, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const pointageData = [
  { date: "28 Mars 2026", checkIn: "08:55", checkOut: "17:05", status: "present", hours: "8h10" },
  { date: "27 Mars 2026", checkIn: "09:15", checkOut: "17:00", status: "late", hours: "7h45" },
  { date: "26 Mars 2026", checkIn: "08:50", checkOut: "17:30", status: "present", hours: "8h40" },
  { date: "25 Mars 2026", checkIn: null, checkOut: null, status: "absent", hours: "0h" },
  { date: "24 Mars 2026", checkIn: "08:45", checkOut: "17:00", status: "present", hours: "8h15" },
  { date: "21 Mars 2026", checkIn: "08:58", checkOut: "17:10", status: "present", hours: "8h12" },
  { date: "20 Mars 2026", checkIn: "09:30", checkOut: "17:00", status: "late", hours: "7h30" },
  { date: "19 Mars 2026", checkIn: "08:40", checkOut: "17:15", status: "present", hours: "8h35" },
  { date: "18 Mars 2026", checkIn: "08:50", checkOut: "17:00", status: "present", hours: "8h10" },
  { date: "17 Mars 2026", checkIn: null, checkOut: null, status: "absent", hours: "0h" },
];

const statusConfig = {
  present: { label: "Présent", icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
  late: { label: "En retard", icon: AlertTriangle, color: "text-yellow-600", bg: "bg-yellow-50" },
  absent: { label: "Absent", icon: XCircle, color: "text-red-600", bg: "bg-red-50" },
};

export default function ClientPointage() {
  const presents = pointageData.filter((p) => p.status === "present").length;
  const lates = pointageData.filter((p) => p.status === "late").length;
  const absents = pointageData.filter((p) => p.status === "absent").length;

  return (
    <div className="space-y-6 fade-in">
      <h1 className="text-2xl font-bold">Mon Pointage</h1>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
          <CheckCircle className="mx-auto text-green-600" size={24} />
          <p className="text-2xl font-bold text-green-700 mt-1">{presents}</p>
          <p className="text-xs text-green-600">Présences</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
          <AlertTriangle className="mx-auto text-yellow-600" size={24} />
          <p className="text-2xl font-bold text-yellow-700 mt-1">{lates}</p>
          <p className="text-xs text-yellow-600">Retards</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
          <XCircle className="mx-auto text-red-600" size={24} />
          <p className="text-2xl font-bold text-red-700 mt-1">{absents}</p>
          <p className="text-xs text-red-600">Absences</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left p-3 font-medium">Date</th>
              <th className="text-left p-3 font-medium">Arrivée</th>
              <th className="text-left p-3 font-medium">Départ</th>
              <th className="text-left p-3 font-medium">Heures</th>
              <th className="text-left p-3 font-medium">Statut</th>
            </tr>
          </thead>
          <tbody>
            {pointageData.map((p, i) => {
              const sc = statusConfig[p.status as keyof typeof statusConfig];
              const Icon = sc.icon;
              return (
                <tr key={i} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="p-3 font-medium">{p.date}</td>
                  <td className="p-3">{p.checkIn || "—"}</td>
                  <td className="p-3">{p.checkOut || "—"}</td>
                  <td className="p-3">{p.hours}</td>
                  <td className="p-3">
                    <Badge variant="outline" className={`gap-1 ${sc.color}`}>
                      <Icon size={12} /> {sc.label}
                    </Badge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
