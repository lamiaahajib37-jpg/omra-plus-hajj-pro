import { useParams, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import {
  ArrowLeft, Plus, Trash2, CheckCircle2, Save, Download, Send,
  ChevronDown, ChevronUp, Paperclip, X, FileSpreadsheet, Presentation, File,
} from "lucide-react";
import { ALL_DOSSIERS } from "@/data/allDossiers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

// ─── Types ───────────────────────────────────────────────────────────────────
const CATEGORIES = ["Transport", "Guide", "Staff", "Hébergement", "F&B", "Activité", "Entertainment", "AV", "Événement", "Divers"];

type FileType = "excel" | "powerpoint" | "autre";

interface AttachedFile {
  id: string;
  nom: string;
  type: FileType;
  taille: string;
  date: string;
  // In a real app: File object or URL
}

interface ServiceRow {
  id: string;
  jour: string;
  description: string;
  unite: number;
  tarifUnitaire: number;
  nb: number;
  total: number;
  categorie: string;
  optionnel: boolean;
  inclus: boolean;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function getFileType(filename: string): FileType {
  const ext = filename.split(".").pop()?.toLowerCase();
  if (["xlsx", "xls", "csv"].includes(ext ?? "")) return "excel";
  if (["pptx", "ppt"].includes(ext ?? "")) return "powerpoint";
  return "autre";
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const FILE_ICONS = {
  excel: <FileSpreadsheet size={16} className="text-emerald-600" />,
  powerpoint: <Presentation size={16} className="text-orange-500" />,
  autre: <File size={16} className="text-muted-foreground" />,
};

const FILE_BADGE_COLORS = {
  excel: "bg-emerald-50 border-emerald-200 text-emerald-700",
  powerpoint: "bg-orange-50 border-orange-200 text-orange-700",
  autre: "bg-muted border-border text-muted-foreground",
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function DossierPresentation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dossier = ALL_DOSSIERS.find((d) => d.id === id);

  const lastV = dossier?.presentations[dossier.presentations.length - 1];
  const version = (lastV?.version || 0) + 1;

  const [services, setServices] = useState<ServiceRow[]>(
    lastV?.services?.map((s: any) => ({ ...s })) || []
  );
  const [notes, setNotes] = useState("");
  const [collapsedDays, setCollapsedDays] = useState<Set<string>>(new Set());

  // ── Attached files state ────────────────────────────────────────────────
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>(
    // Pre-populate from last version's documents if they exist
    (lastV?.documents ?? []).map((doc: any) => ({
      id: `existing-${doc.nom}`,
      nom: doc.nom,
      type: getFileType(doc.nom),
      taille: "—",
      date: doc.date,
    }))
  );
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!dossier) return <div className="p-8 text-center text-muted-foreground">Dossier introuvable.</div>;

  const totalHT = services.filter((s) => s.inclus).reduce((acc, s) => acc + s.total, 0);
  const totalParPax = dossier.nombrePax > 0 ? totalHT / dossier.nombrePax : 0;
  const jours = Array.from(new Set(services.map((s) => s.jour)));

  // ── File handling ────────────────────────────────────────────────────────
  const handleFileAdd = (files: FileList | null) => {
    if (!files) return;
    const newFiles: AttachedFile[] = Array.from(files)
      .filter((f) => {
        const ext = f.name.split(".").pop()?.toLowerCase();
        return ["xlsx", "xls", "csv", "pptx", "ppt", "pdf"].includes(ext ?? "");
      })
      .map((f) => ({
        id: `file-${Date.now()}-${f.name}`,
        nom: f.name,
        type: getFileType(f.name),
        taille: formatFileSize(f.size),
        date: new Date().toISOString().split("T")[0],
      }));
    setAttachedFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (fileId: string) => {
    setAttachedFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileAdd(e.dataTransfer.files);
  };

  // ── Services ─────────────────────────────────────────────────────────────
  const addService = (jour?: string) => {
    const newService: ServiceRow = {
      id: `s${Date.now()}`,
      jour: jour || (jours[0] || "Jour 1"),
      description: "",
      unite: 1,
      tarifUnitaire: 0,
      nb: 1,
      total: 0,
      categorie: "Divers",
      optionnel: false,
      inclus: true,
    };
    setServices([...services, newService]);
  };

  const updateService = (sid: string, field: keyof ServiceRow, value: any) => {
    setServices(
      services.map((s) => {
        if (s.id !== sid) return s;
        const updated = { ...s, [field]: value };
        if (["unite", "tarifUnitaire", "nb"].includes(field)) {
          updated.total = updated.unite * updated.tarifUnitaire * updated.nb;
        }
        return updated;
      })
    );
  };

  const removeService = (sid: string) => setServices(services.filter((s) => s.id !== sid));

  const toggleDay = (jour: string) => {
    const next = new Set(collapsedDays);
    next.has(jour) ? next.delete(jour) : next.add(jour);
    setCollapsedDays(next);
  };

  const dayTotal = (jour: string) =>
    services.filter((s) => s.jour === jour && s.inclus).reduce((a, s) => a + s.total, 0);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(`/dossiers/${id}`)}>
          <ArrowLeft size={18} />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">Présentation V{version}</h1>
          <p className="text-muted-foreground">{dossier.reference} — {dossier.clientNom}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2"><Download size={15} /> Exporter</Button>
          <Button variant="outline" className="gap-2"><Send size={15} /> Envoyer client</Button>
          <Button className="gap-2"><Save size={15} /> Sauvegarder V{version}</Button>
        </div>
      </div>

      {/* Totals banner */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="border-border/50 col-span-2">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Total HT (services inclus)</p>
            <p className="text-3xl font-bold text-emerald-600">{totalHT.toLocaleString()} $</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Par pax ({dossier.nombrePax} pax)</p>
            <p className="text-2xl font-bold">{totalParPax.toFixed(0)} $</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Lignes de service</p>
            <p className="text-2xl font-bold">{services.filter((s) => s.inclus).length} / {services.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* ── Documents joints (Excel / PowerPoint) ── */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Paperclip size={15} />
              Documents joints à cette version
              {attachedFiles.length > 0 && (
                <Badge variant="secondary" className="text-xs">{attachedFiles.length}</Badge>
              )}
            </CardTitle>
            <Button
              size="sm"
              variant="outline"
              className="gap-2 text-xs"
              onClick={() => fileInputRef.current?.click()}
            >
              <Plus size={13} /> Ajouter fichier
            </Button>
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".xlsx,.xls,.csv,.pptx,.ppt,.pdf"
              className="hidden"
              onChange={(e) => handleFileAdd(e.target.files)}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Drag & Drop zone */}
          <div
            className={`border-2 border-dashed rounded-xl p-5 text-center transition-colors cursor-pointer ${
              isDragOver
                ? "border-primary bg-primary/5"
                : "border-border/60 hover:border-primary/50 hover:bg-muted/30"
            }`}
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="flex items-center justify-center gap-3 text-muted-foreground">
              <div className="flex gap-1">
                <FileSpreadsheet size={20} className="text-emerald-500" />
                <Presentation size={20} className="text-orange-500" />
              </div>
              <div>
                <p className="text-sm font-medium">
                  {isDragOver ? "Déposez ici..." : "Glissez vos fichiers Excel ou PowerPoint"}
                </p>
                <p className="text-xs text-muted-foreground/70 mt-0.5">
                  .xlsx, .xls, .csv, .pptx, .ppt, .pdf — ou cliquez pour parcourir
                </p>
              </div>
            </div>
          </div>

          {/* Attached files list */}
          {attachedFiles.length > 0 && (
            <div className="space-y-2">
              {attachedFiles.map((file) => (
                <div
                  key={file.id}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg border ${FILE_BADGE_COLORS[file.type]}`}
                >
                  <div className="flex items-center gap-3">
                    {FILE_ICONS[file.type]}
                    <div>
                      <p className="text-sm font-medium">{file.nom}</p>
                      <p className="text-xs opacity-70">
                        {file.type === "excel" ? "Feuille Excel" : file.type === "powerpoint" ? "Présentation PowerPoint" : "Document"}
                        {file.taille !== "—" && ` · ${file.taille}`}
                        {" · "}{new Date(file.date).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="ghost" className="h-7 text-xs gap-1 opacity-70 hover:opacity-100">
                      <Download size={12} /> Télécharger
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                      onClick={() => removeFile(file.id)}
                    >
                      <X size={13} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {attachedFiles.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-1">
              Aucun document joint pour l'instant. Ajoutez votre costing Excel ou présentation PowerPoint.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Services table */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Services du programme</CardTitle>
            <Button size="sm" className="gap-2" onClick={() => addService()}>
              <Plus size={14} /> Ajouter ligne
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {/* Column headers */}
          <div className="grid grid-cols-12 gap-2 px-4 py-2 bg-muted/50 text-xs font-semibold text-muted-foreground border-b border-border">
            <div className="col-span-1">Inclus</div>
            <div className="col-span-3">Description</div>
            <div className="col-span-2">Catégorie</div>
            <div className="col-span-1 text-center">Unité</div>
            <div className="col-span-1 text-center">Tarif $</div>
            <div className="col-span-1 text-center">Nº</div>
            <div className="col-span-2 text-right">Total $</div>
            <div className="col-span-1"></div>
          </div>

          {jours.length === 0 && (
            <div className="text-center py-12 text-muted-foreground text-sm">
              Aucun service. Cliquez sur "Ajouter ligne" pour commencer.
            </div>
          )}

          {jours.map((jour) => (
            <div key={jour}>
              <div
                className="flex items-center justify-between px-4 py-2 bg-primary/5 border-b border-border cursor-pointer hover:bg-primary/10 transition-colors"
                onClick={() => toggleDay(jour)}
              >
                <div className="flex items-center gap-2">
                  {collapsedDays.has(jour) ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                  <span className="text-sm font-semibold text-primary">{jour}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-emerald-600">{dayTotal(jour).toLocaleString()} $</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 text-xs gap-1"
                    onClick={(e) => { e.stopPropagation(); addService(jour); }}
                  >
                    <Plus size={11} /> Ajouter
                  </Button>
                </div>
              </div>

              {!collapsedDays.has(jour) &&
                services.filter((s) => s.jour === jour).map((s) => (
                  <div
                    key={s.id}
                    className={`grid grid-cols-12 gap-2 px-4 py-2 border-b border-border/50 items-center text-sm ${!s.inclus ? "opacity-40" : ""}`}
                  >
                    <div className="col-span-1 flex items-center">
                      <Checkbox
                        checked={s.inclus}
                        onCheckedChange={(v) => updateService(s.id, "inclus", !!v)}
                      />
                    </div>
                    <div className="col-span-3">
                      <Input
                        className="h-7 text-xs border-0 bg-transparent hover:bg-muted/40 focus:bg-background"
                        value={s.description}
                        onChange={(e) => updateService(s.id, "description", e.target.value)}
                        placeholder="Description du service..."
                      />
                    </div>
                    <div className="col-span-2">
                      <select
                        className="w-full h-7 text-xs rounded bg-transparent border-0 hover:bg-muted/40 text-muted-foreground"
                        value={s.categorie}
                        onChange={(e) => updateService(s.id, "categorie", e.target.value)}
                      >
                        {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="col-span-1">
                      <Input
                        className="h-7 text-xs text-center border-0 bg-transparent hover:bg-muted/40"
                        type="number"
                        value={s.unite}
                        onChange={(e) => updateService(s.id, "unite", parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="col-span-1">
                      <Input
                        className="h-7 text-xs text-center border-0 bg-transparent hover:bg-muted/40"
                        type="number"
                        value={s.tarifUnitaire}
                        onChange={(e) => updateService(s.id, "tarifUnitaire", parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="col-span-1">
                      <Input
                        className="h-7 text-xs text-center border-0 bg-transparent hover:bg-muted/40"
                        type="number"
                        value={s.nb}
                        onChange={(e) => updateService(s.id, "nb", parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="col-span-2 text-right">
                      <span className="font-semibold text-emerald-600">{s.total.toLocaleString()} $</span>
                    </div>
                    <div className="col-span-1 flex justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:text-destructive"
                        onClick={() => removeService(s.id)}
                      >
                        <Trash2 size={12} />
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          ))}

          {services.length > 0 && (
            <div className="grid grid-cols-12 gap-2 px-4 py-3 bg-muted/30 items-center">
              <div className="col-span-10 text-right text-sm font-bold">TOTAL HT</div>
              <div className="col-span-2 text-right text-lg font-bold text-emerald-600">
                {totalHT.toLocaleString()} $
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notes */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Notes internes (V{version})</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Notes sur cette version de la présentation..."
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Previous versions */}
      {dossier.presentations.length > 0 && (
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Versions précédentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {[...dossier.presentations].reverse().map((p: any) => (
              <div key={p.version} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                <div className="flex items-center gap-3">
                  <Badge variant="outline">V{p.version}</Badge>
                  <span className="text-sm text-muted-foreground">{new Date(p.dateCreation).toLocaleDateString("fr-FR")}</span>
                  {p.valideParClient && (
                    <span className="text-xs text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 size={11} /> Validée
                    </span>
                  )}
                  {/* Documents attachés aux versions précédentes */}
                  {p.documents?.length > 0 && (
                    <div className="flex gap-1">
                      {p.documents.map((doc: any) => (
                        <Badge key={doc.nom} variant="outline" className={`text-xs gap-1 ${FILE_BADGE_COLORS[getFileType(doc.nom)]}`}>
                          {FILE_ICONS[getFileType(doc.nom)]}
                          {doc.nom.split(".").pop()?.toUpperCase()}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <span className="font-semibold text-emerald-600">{p.totalHT.toLocaleString()} $</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}