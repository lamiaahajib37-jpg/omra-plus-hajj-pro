// ════════════════════════════════════════════════════════════════════════
// ClientPortal.tsx  —  /client/portal
// Espace client: Mon voyage · Présentation · Carte · Réclamation · Souvenirs
// ════════════════════════════════════════════════════════════════════════
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin, Calendar, Users, DollarSign, CheckCircle2, Clock,
  AlertCircle, FileText, Send, Phone, Mail, LogOut,
  ChevronRight, Star, MessageSquare, Image, Navigation,
  Download, Eye, Plane, Hotel, Utensils, Music,
  Camera, Heart, Sparkles, AlertTriangle, Check,
  CreditCard, Gift
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import logoAccess from "@/assets/Access_.png";
// ─── Mock data dossier client ────────────────────────────────────────────────
const DOSSIER = {
  reference: "DOS012",
  titre: "Marrakech Experience — Brightspot Group",
  dates: { depart: "Dimanche 27 Avril 2026", retour: "Vendredi 2 Mai 2026", nbNuits: 5 },
  pax: "43 PAX + 2 Staff",
  statut: "confirme" as const,
  agentNom: "Youssef El Amrani",
  agentTel: "+212 6 22 11 00 99",
  agentEmail: "y.elamrani@accessmorocco.ma",
  hotel: "Four Seasons Marrakech",
  totalContrat: 199903,
  totalPaye: 98245,
};

// Programme jour par jour
const PROGRAMME = [
  {
    jour: "Jour 1", date: "Lun 27 Avril", icone: <Plane size={16} />,
    couleur: "#185FA5", bgCouleur: "#E6F1FB",
    activites: [
      { heure: "Arrivée", desc: "Accueil VIP à l'aéroport Menara par l'équipe Access Morocco", confirme: true },
      { heure: "Après-midi", desc: "Transfert en bus luxe 46 places → Four Seasons Marrakech", confirme: true },
      { heure: "Check-in", desc: "Installation à l'hôtel & Gifting Experience — Gandoura, Pashminas, Chaussures artisanales", confirme: true },
    ]
  },
  {
    jour: "Jour 2", date: "Mar 28 Avril", icone: <MapPin size={16} />,
    couleur: "#0F6E56", bgCouleur: "#E1F5EE",
    activites: [
      { heure: "Matin", desc: "Visite guidée de la Médina — Dar El Bacha, souks, artisanat", confirme: true },
      { heure: "12h00", desc: "Tour en calèche jusqu'à la Médina (4 pax/calèche)", confirme: true },
      { heure: "Soirée", desc: "Brunch Blue Majorelle + Souk Set-Up, DJ, Violoniste, Conteuse", confirme: true },
    ]
  },
  {
    jour: "Jour 3", date: "Mer 29 Avril", icone: <Hotel size={16} />,
    couleur: "#633806", bgCouleur: "#FAEEDA",
    activites: [
      { heure: "Journée", desc: "Journée libre — piscine Four Seasons, shopping, spa", confirme: true },
      { heure: "Soir", desc: "Dîner libre ou recommandations de l'équipe", confirme: false },
    ]
  },
  {
    jour: "Jour 4", date: "Jeu 30 Avril", icone: <Star size={16} />,
    couleur: "#3C3489", bgCouleur: "#EEEDFE",
    activites: [
      { heure: "Après-midi", desc: "Transfer Agafay Desert — Quad bikes & Dromadaires", confirme: true },
      { heure: "Soirée", desc: "GALA DINNER — Désert Agafay «1001 Bougies» · Menu gastronomique · Open bar · Mini Jamaa El Fna · DJ", confirme: true },
    ]
  },
  {
    jour: "Jour 5", date: "Ven 1 Mai", icone: <Utensils size={16} />,
    couleur: "#27500A", bgCouleur: "#EAF3DE",
    activites: [
      { heure: "Matin", desc: "Retour au Four Seasons depuis le camp Agafay", confirme: true },
      { heure: "Journée", desc: "Temps libre — massage, shopping Guéliz, Majorelle", confirme: true },
    ]
  },
  {
    jour: "Jour 6", date: "Sam 2 Mai", icone: <Plane size={16} />,
    couleur: "#712B13", bgCouleur: "#FAECE7",
    activites: [
      { heure: "Matin", desc: "Check-out & petit déjeuner panoramique", confirme: true },
      { heure: "Départ", desc: "Transfer aéroport · Au revoir Marrakech!", confirme: true },
    ]
  },
];

// Présentations
const PRESENTATIONS = [
  { version: 3, date: "07 Avril 2026", statut: "validée", montant: 199903 },
  { version: 2, date: "02 Avril 2026", statut: "modif_demandée", montant: 198200 },
  { version: 1, date: "28 Mars 2026", statut: "envoyée", montant: 205000 },
];

// Paiements
const PAIEMENTS = [
  { tranche: "1er dépôt (30 jours avant)", montant: 32230, statut: "payé", date: "01 Avril 2026" },
  { tranche: "2ème versement", montant: 66015, statut: "payé", date: "20 Avril 2026" },
  { tranche: "Solde restant", montant: 101658, statut: "à_payer", date: "26 Avril 2026" },
];

// Lieux sur la carte
const LIEUX = [
  { nom: "Four Seasons Marrakech", type: "Hôtel", lat: 31.6295, lng: -8.0117, emoji: "🏨", desc: "Votre hôtel — 5 étoiles, jardins luxuriants" },
  { nom: "Médina de Marrakech", type: "Visite", lat: 31.6316, lng: -7.9897, emoji: "🕌", desc: "UNESCO — Dar El Bacha, souks, artisanat" },
  { nom: "Jardins Majorelle", type: "Visite", lat: 31.6414, lng: -8.0034, emoji: "🌿", desc: "Jardin iconique — Fondation YSL" },
  { nom: "Désert Agafay", type: "Événement", lat: 31.5019, lng: -8.1731, emoji: "🏜️", desc: "Gala Dinner «1001 Bougies» — Jour 4" },
  { nom: "Aéroport Menara", type: "Transport", lat: 31.6069, lng: -8.0363, emoji: "✈️", desc: "Arrivée & Départ" },
];

// Souvenirs (photos mock)
const PHOTOS = [
  { id: 1, titre: "Coucher de soleil Agafay", date: "30 Avr", emoji: "🌅", couleur: "#FAEEDA" },
  { id: 2, titre: "Jardins Majorelle", date: "29 Avr", emoji: "🌿", couleur: "#E1F5EE" },
  { id: 3, titre: "Soirée Blue Majorelle", date: "28 Avr", emoji: "✨", couleur: "#EEEDFE" },
  { id: 4, titre: "Tour en calèche Médina", date: "28 Avr", emoji: "🐴", couleur: "#FAECE7" },
  { id: 5, titre: "Artisans du souk", date: "28 Avr", emoji: "🏺", couleur: "#EAF3DE" },
  { id: 6, titre: "Gala Dinner 1001 Bougies", date: "30 Avr", emoji: "🕯️", couleur: "#E6F1FB" },
];

// ─── Tabs config ──────────────────────────────────────────────────────────────
const TABS = [
  { id: "voyage",       label: "Mon Voyage",     icon: <Calendar size={15} /> },
  { id: "presentation", label: "Présentation",   icon: <FileText size={15} /> },
  { id: "paiements",   label: "Paiements",       icon: <CreditCard size={15} /> },
  { id: "carte",        label: "Carte",           icon: <MapPin size={15} /> },
  { id: "reclamation",  label: "Réclamation",     icon: <MessageSquare size={15} /> },
  { id: "souvenirs",    label: "Souvenirs",       icon: <Camera size={15} /> },
] as const;

type TabId = typeof TABS[number]["id"];

// ─── Reclamation Modal ────────────────────────────────────────────────────────
function ReclamationForm() {
  const [form, setForm] = useState({ type: "service", objet: "", message: "", priorite: "normale" });
  const [sent, setSent] = useState(false);
  const f = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
          <Check size={28} className="text-green-600" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">Réclamation envoyée</h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          Notre équipe vous répondra dans les 24 heures. Référence: <strong>REC-{Date.now().toString().slice(-6)}</strong>
        </p>
        <Button variant="outline" size="sm" onClick={() => setSent(false)}>Nouvelle réclamation</Button>
      </div>
    );
  }

  return (
    <div className="max-w-lg space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-1">Nous contacter</h2>
        <p className="text-sm text-muted-foreground">
          Une question, une modification ou un problème ? Notre équipe est là pour vous.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Type</Label>
          <Select value={form.type} onValueChange={v => f("type", v)}>
            <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="service">Modification service</SelectItem>
              <SelectItem value="question">Question générale</SelectItem>
              <SelectItem value="reclamation">Réclamation</SelectItem>
              <SelectItem value="urgence">Urgence voyage</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Priorité</Label>
          <Select value={form.priorite} onValueChange={v => f("priorite", v)}>
            <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="basse">Basse — pas urgent</SelectItem>
              <SelectItem value="normale">Normale</SelectItem>
              <SelectItem value="haute">Haute — urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Objet</Label>
        <Input
          value={form.objet}
          onChange={e => f("objet", e.target.value)}
          placeholder="Ex: Demande de modification du menu Jour 4"
          className="h-9"
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Message</Label>
        <Textarea
          rows={5}
          value={form.message}
          onChange={e => f("message", e.target.value)}
          placeholder="Décrivez votre demande en détail..."
          className="resize-none"
        />
      </div>

      {/* Contact direct */}
      <div className="p-4 rounded-xl bg-secondary/30 border border-border/50 space-y-2">
        <p className="text-xs font-semibold text-foreground">Contact direct — {DOSSIER.agentNom}</p>
        <div className="flex items-center gap-4">
          <a href={`tel:${DOSSIER.agentTel}`} className="flex items-center gap-1.5 text-xs text-primary hover:underline">
            <Phone size={12} /> {DOSSIER.agentTel}
          </a>
          <a href={`mailto:${DOSSIER.agentEmail}`} className="flex items-center gap-1.5 text-xs text-primary hover:underline">
            <Mail size={12} /> {DOSSIER.agentEmail}
          </a>
        </div>
      </div>

      <Button
        className="gap-1.5 w-full"
        disabled={!form.objet || !form.message}
        onClick={() => { setSent(true); toast.success("Réclamation envoyée à votre agent"); }}
      >
        <Send size={14} />
        Envoyer la demande
      </Button>
    </div>
  );
}

// ─── Main Portal ──────────────────────────────────────────────────────────────
export default function ClientPortal() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<TabId>("voyage");

  const totalPaye = PAIEMENTS.filter(p => p.statut === "payé").reduce((a, p) => a + p.montant, 0);
  const pct = Math.round((totalPaye / DOSSIER.totalContrat) * 100);

  return (
    <div className="min-h-screen bg-background">

      {/* ── Header ── */}
      <header className="bg-card border-b border-border/50 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-5 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
<img src={logoAccess} alt="Access Morocco" className="h-8 w-auto" />
            <div className="hidden sm:block border-l border-border/50 pl-3">
              <p className="text-xs text-muted-foreground">Espace Client</p>
              <p className="text-xs font-semibold text-foreground">{DOSSIER.reference} — {DOSSIER.titre.split("—")[0].trim()}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 border border-green-200">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-xs font-semibold text-green-700">Confirmé</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                {user?.initials}
              </div>
              {user?.name && <span className="text-sm font-medium text-foreground hidden sm:block">{user.name}</span>}
            </div>
            <button
              onClick={() => { logout(); navigate("/client"); }}
              className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground"
              title="Déconnexion"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* ── Hero banner ── */}
      <div className="bg-primary text-primary-foreground">
        <div className="max-w-5xl mx-auto px-5 py-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl font-bold mb-1">{DOSSIER.titre}</h1>
              <div className="flex items-center gap-4 text-sm text-primary-foreground/80 flex-wrap">
                <span className="flex items-center gap-1.5"><Calendar size={13} />{DOSSIER.dates.depart} → {DOSSIER.dates.retour}</span>
                <span className="flex items-center gap-1.5"><Users size={13} />{DOSSIER.pax}</span>
                <span className="flex items-center gap-1.5"><Hotel size={13} />{DOSSIER.hotel}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-3">
              <div>
                <p className="text-xs text-primary-foreground/70">J-{Math.max(0, Math.floor((new Date("2026-04-27").getTime() - Date.now()) / 86400000))}</p>
                <p className="text-lg font-bold">Avant le départ</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="bg-card border-b border-border/50 sticky top-16 z-30">
        <div className="max-w-5xl mx-auto px-5">
          <div className="flex overflow-x-auto">
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 px-4 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  tab === t.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <main className="max-w-5xl mx-auto px-5 py-6">

        {/* ════ TAB: MON VOYAGE ════ */}
        {tab === "voyage" && (
          <div className="space-y-5">
            {/* Mini KPIs */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-card border border-border/50 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-foreground">{DOSSIER.dates.nbNuits}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Nuits à Marrakech</p>
              </div>
              <div className="bg-card border border-border/50 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-foreground">{PROGRAMME.reduce((a, j) => a + j.activites.length, 0)}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Activités planifiées</p>
              </div>
              <div className="bg-card border border-border/50 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-foreground">{PROGRAMME.reduce((a, j) => a + j.activites.filter(a => a.confirme).length, 0)}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Services confirmés</p>
              </div>
            </div>

            {/* Programme */}
            <div className="space-y-3">
              {PROGRAMME.map((jour, i) => (
                <div key={i} className="bg-card border border-border/50 rounded-xl overflow-hidden">
                  {/* Day header */}
                  <div className="flex items-center gap-3 px-4 py-3 border-b border-border/40" style={{ background: jour.bgCouleur }}>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: jour.couleur, color: "white" }}>
                      {jour.icone}
                    </div>
                    <div>
                      <p className="text-sm font-bold" style={{ color: jour.couleur }}>{jour.jour}</p>
                      <p className="text-xs font-medium" style={{ color: jour.couleur + "bb" }}>{jour.date}</p>
                    </div>
                  </div>

                  {/* Activités */}
                  <div className="divide-y divide-border/30">
                    {jour.activites.map((act, j) => (
                      <div key={j} className="flex items-start gap-3 px-4 py-3">
                        <div className={`mt-0.5 shrink-0 ${act.confirme ? "text-green-500" : "text-amber-400"}`}>
                          {act.confirme ? <CheckCircle2 size={15} /> : <Clock size={15} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-xs font-semibold text-muted-foreground mr-2">{act.heure}</span>
                          <span className="text-sm text-foreground">{act.desc}</span>
                        </div>
                        {!act.confirme && (
                          <span className="text-xs px-2 py-0.5 rounded-full shrink-0" style={{ background: "#FAEEDA", color: "#633806" }}>En attente</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Agent contact */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">YE</div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{DOSSIER.agentNom}</p>
                  <p className="text-xs text-muted-foreground">Votre agent Access Morocco</p>
                </div>
              </div>
              <div className="flex gap-2">
                <a href={`tel:${DOSSIER.agentTel}`} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium">
                  <Phone size={12} />Appeler
                </a>
                <button onClick={() => setTab("reclamation")} className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-xs font-medium hover:bg-secondary transition-colors">
                  <MessageSquare size={12} />Message
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ════ TAB: PRÉSENTATION ════ */}
        {tab === "presentation" && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-1">Propositions reçues</h2>
              <p className="text-sm text-muted-foreground">Retrouvez ici toutes les versions de votre programme.</p>
            </div>

            {PRESENTATIONS.map((p, i) => {
              const isLast = i === 0;
              const cfgStatut = {
                validée:        { bg: "#EAF3DE", color: "#27500A", label: "Validée ✓" },
                envoyée:        { bg: "#E6F1FB", color: "#185FA5", label: "Envoyée" },
                modif_demandée: { bg: "#FAECE7", color: "#712B13", label: "Modif. demandée" },
              }[p.statut] ?? { bg: "#F1EFE8", color: "#5F5E5A", label: p.statut };

              return (
                <div key={p.version} className={`bg-card border rounded-xl p-5 ${isLast ? "border-primary/30 ring-1 ring-primary/10" : "border-border/50 opacity-75"}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${isLast ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
                        V{p.version}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-foreground">Version {p.version}</span>
                          {isLast && <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">Dernière</span>}
                        </div>
                        <p className="text-xs text-muted-foreground">Reçue le {p.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-foreground">${p.montant.toLocaleString()}</p>
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: cfgStatut.bg, color: cfgStatut.color }}>
                        {cfgStatut.label}
                      </span>
                    </div>
                  </div>

                  {isLast && (
                    <div className="mt-4 pt-4 border-t border-border/40 flex gap-2">
                      <Button size="sm" variant="outline" className="gap-1.5 h-8 text-xs">
                        <Download size={12} />Télécharger PDF
                      </Button>
                      <Button
                        size="sm"
                        className="gap-1.5 h-8 text-xs"
                        onClick={() => {
                          toast.success("Présentation V3 validée — votre agent est notifié");
                        }}
                      >
                        <Check size={12} />Valider cette présentation
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1.5 h-8 text-xs"
                        onClick={() => setTab("reclamation")}
                      >
                        <MessageSquare size={12} />Demander modification
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ════ TAB: PAIEMENTS ════ */}
        {tab === "paiements" && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-1">Suivi des paiements</h2>
              <p className="text-sm text-muted-foreground">Dossier {DOSSIER.reference} · Total ${DOSSIER.totalContrat.toLocaleString()}</p>
            </div>

            {/* Progress */}
            <div className="bg-card border border-border/50 rounded-xl p-5 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-foreground">Progression</span>
                <span className="font-bold text-primary">{pct}%</span>
              </div>
              <div className="h-3 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${pct}%` }} />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span className="text-green-600 font-medium">Payé: ${totalPaye.toLocaleString()}</span>
                <span>Restant: ${(DOSSIER.totalContrat - totalPaye).toLocaleString()}</span>
              </div>
            </div>

            {/* Tranches */}
            <div className="space-y-3">
              {PAIEMENTS.map((p, i) => (
                <div key={i} className={`bg-card border rounded-xl p-4 flex items-center justify-between gap-3 ${p.statut === "à_payer" ? "border-amber-200 bg-amber-50/30" : "border-border/50"}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center ${p.statut === "payé" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                      {p.statut === "payé" ? <CheckCircle2 size={16} /> : <Clock size={16} />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{p.tranche}</p>
                      <p className="text-xs text-muted-foreground">{p.statut === "payé" ? `Reçu le ${p.date}` : `Échéance: ${p.date}`}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-bold text-foreground">${p.montant.toLocaleString()}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.statut === "payé" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                      {p.statut === "payé" ? "✓ Payé" : "En attente"}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-xs text-muted-foreground text-center">
              Pour toute question sur les paiements, contactez votre agent:{" "}
              <a href={`mailto:${DOSSIER.agentEmail}`} className="text-primary hover:underline">{DOSSIER.agentEmail}</a>
            </p>
          </div>
        )}

        {/* ════ TAB: CARTE ════ */}
        {tab === "carte" && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-1">Votre itinéraire</h2>
              <p className="text-sm text-muted-foreground">Tous les lieux de votre voyage à Marrakech.</p>
            </div>

            {/* Map placeholder — styled beautifully */}
            <div className="relative bg-card border border-border/50 rounded-2xl overflow-hidden" style={{ height: 340 }}>
              {/* Background map-like grid */}
              <div className="absolute inset-0" style={{
                background: "linear-gradient(135deg, #E1F5EE 0%, #EAF3DE 30%, #E6F1FB 60%, #FAEEDA 100%)",
              }}>
                {/* Grid lines */}
                <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: 0.3 }}>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <line key={`v${i}`} x1={`${i * 14.28}%`} y1="0" x2={`${i * 14.28}%`} y2="100%" stroke="#888" strokeWidth="0.5" />
                  ))}
                  {Array.from({ length: 6 }).map((_, i) => (
                    <line key={`h${i}`} x1="0" y1={`${i * 20}%`} x2="100%" y2={`${i * 20}%`} stroke="#888" strokeWidth="0.5" />
                  ))}
                </svg>
              </div>

              {/* Pins positionnés visuellement */}
              {[
                { nom: "Four Seasons", top: "35%", left: "48%", emoji: "🏨", color: "#185FA5" },
                { nom: "Médina", top: "28%", left: "62%", emoji: "🕌", color: "#712B13" },
                { nom: "Jardins Majorelle", top: "22%", left: "52%", emoji: "🌿", color: "#0F6E56" },
                { nom: "Agafay", top: "70%", left: "36%", emoji: "🏜️", color: "#633806" },
                { nom: "Aéroport", top: "45%", left: "40%", emoji: "✈️", color: "#3C3489" },
              ].map((pin, i) => (
                <div key={i} className="absolute flex flex-col items-center cursor-pointer group" style={{ top: pin.top, left: pin.left, transform: "translate(-50%, -100%)" }}>
                  <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-sm border border-border/50 rounded-full px-2.5 py-1.5 shadow-sm text-xs font-medium text-foreground group-hover:shadow-md transition-all whitespace-nowrap">
                    <span>{pin.emoji}</span>
                    <span>{pin.nom}</span>
                  </div>
                  <div className="w-2.5 h-2.5 rounded-full mt-0.5 border-2 border-white shadow-sm" style={{ background: pin.color }} />
                </div>
              ))}

              {/* Compass */}
              <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm border border-border/50 flex items-center justify-center">
                <Navigation size={14} className="text-foreground" />
              </div>

              {/* Map label */}
              <div className="absolute bottom-3 left-3 bg-white/80 backdrop-blur-sm rounded-lg px-2.5 py-1.5 text-xs font-medium text-foreground border border-border/50">
                📍 Marrakech, Maroc
              </div>
            </div>

            {/* Lieux list */}
            <div className="grid grid-cols-1 gap-3">
              {LIEUX.map((lieu, i) => (
                <div key={i} className="bg-card border border-border/50 rounded-xl p-4 flex items-center gap-4 hover:border-border transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-xl shrink-0">
                    {lieu.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">{lieu.nom}</p>
                    <p className="text-xs text-muted-foreground">{lieu.desc}</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-secondary text-muted-foreground font-medium shrink-0">
                    {lieu.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ════ TAB: RÉCLAMATION ════ */}
        {tab === "reclamation" && <ReclamationForm />}

        {/* ════ TAB: SOUVENIRS ════ */}
        {tab === "souvenirs" && (
          <div className="space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-1">Vos souvenirs</h2>
                <p className="text-sm text-muted-foreground">
                  Photos & moments capturés lors de votre voyage. Disponibles après le retour (2 Mai 2026).
                </p>
              </div>
            </div>

            {/* Pre-voyage message */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 flex items-start gap-3">
              <Sparkles size={18} className="text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-foreground mb-1">Vos photos arrivent bientôt ✨</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Notre photographe sera présent les 28, 29 et 30 Avril pour capturer chaque moment magique de votre voyage. Toutes les photos seront disponibles ici dans les 48h après votre retour.
                </p>
              </div>
            </div>

            {/* Photo grid — preview cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {PHOTOS.map(photo => (
                <div
                  key={photo.id}
                  className="relative aspect-square rounded-2xl flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border/50 overflow-hidden group cursor-pointer hover:border-primary/30 transition-all"
                  style={{ background: photo.couleur + "44" }}
                >
                  <div className="text-4xl">{photo.emoji}</div>
                  <div className="text-center px-3">
                    <p className="text-xs font-semibold text-foreground">{photo.titre}</p>
                    <p className="text-xs text-muted-foreground">{photo.date}</p>
                  </div>
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-foreground/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-xs font-medium text-foreground bg-background/80 px-3 py-1.5 rounded-full backdrop-blur-sm">
                      Disponible après le voyage
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Memory quote */}
            <div className="text-center py-6">
              <Heart size={24} className="text-primary/40 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground italic max-w-md mx-auto">
                "Voyager, c'est vivre." — Chaque moment de ce voyage sera préservé pour vous.
              </p>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}