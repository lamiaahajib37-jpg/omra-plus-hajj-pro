import { FileText, Upload, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const documents = [
  { name: "Passeport", file: "passeport_alaoui.pdf", status: "verified", expiry: "15 Juin 2030", uploadDate: "10 Jan 2025" },
  { name: "Visa Omra", file: "visa_omra_2026.pdf", status: "pending", expiry: "30 Avril 2026", uploadDate: "05 Mars 2026" },
  { name: "Assurance Voyage", file: "assurance_axa_2026.pdf", status: "verified", expiry: "31 Déc 2026", uploadDate: "12 Fév 2026" },
  { name: "Certificat Médical", file: null, status: "missing", expiry: null, uploadDate: null },
  { name: "Photo d'identité", file: "photo_id.jpg", status: "verified", expiry: null, uploadDate: "10 Jan 2025" },
  { name: "Acte de naissance", file: null, status: "missing", expiry: null, uploadDate: null },
  { name: "Carnet de vaccination", file: "vaccin_carnet.pdf", status: "pending", expiry: null, uploadDate: "01 Mars 2026" },
];

const statusConfig = {
  verified: { label: "Vérifié", icon: CheckCircle, color: "text-green-600", bg: "bg-green-50 border-green-200" },
  pending: { label: "En vérification", icon: Clock, color: "text-yellow-600", bg: "bg-yellow-50 border-yellow-200" },
  missing: { label: "Manquant", icon: AlertCircle, color: "text-red-600", bg: "bg-red-50 border-red-200" },
};

export default function ClientDocuments() {
  const verified = documents.filter((d) => d.status === "verified").length;
  const pending = documents.filter((d) => d.status === "pending").length;
  const missing = documents.filter((d) => d.status === "missing").length;

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Mes Documents</h1>
          <p className="text-muted-foreground">Portefeuille de documents — voyage</p>
        </div>
        <Button className="gap-2">
          <Upload size={16} /> Uploader un document
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
          <CheckCircle className="mx-auto text-green-600" size={24} />
          <p className="text-2xl font-bold text-green-700 mt-1">{verified}</p>
          <p className="text-xs text-green-600">Vérifiés</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
          <Clock className="mx-auto text-yellow-600" size={24} />
          <p className="text-2xl font-bold text-yellow-700 mt-1">{pending}</p>
          <p className="text-xs text-yellow-600">En vérification</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
          <AlertCircle className="mx-auto text-red-600" size={24} />
          <p className="text-2xl font-bold text-red-700 mt-1">{missing}</p>
          <p className="text-xs text-red-600">Manquants</p>
        </div>
      </div>

      {/* Documents list */}
      <div className="bg-card rounded-xl border divide-y">
        {documents.map((doc) => {
          const sc = statusConfig[doc.status as keyof typeof statusConfig];
          const Icon = sc.icon;
          return (
            <div key={doc.name} className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${sc.bg}`}>
                <FileText size={20} className={sc.color} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{doc.name}</p>
                {doc.file ? (
                  <p className="text-xs text-muted-foreground">{doc.file} • Uploadé le {doc.uploadDate}</p>
                ) : (
                  <p className="text-xs text-red-500">Document non fourni</p>
                )}
              </div>
              {doc.expiry && (
                <span className="text-xs text-muted-foreground hidden sm:inline">Expire: {doc.expiry}</span>
              )}
              <Badge variant="outline" className={`gap-1 ${sc.color}`}>
                <Icon size={12} /> {sc.label}
              </Badge>
              {doc.status === "missing" && (
                <Button size="sm" variant="outline" className="gap-1 text-xs">
                  <Upload size={12} /> Uploader
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
