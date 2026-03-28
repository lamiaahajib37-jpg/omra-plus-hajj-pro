import { Bell, Search, Menu, Plus, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Props {
  onToggleSidebar: () => void;
}

export function ERPTopbar({ onToggleSidebar }: Props) {
  return (
    <header className="h-16 bg-card border-b flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-4">
        <button onClick={onToggleSidebar} className="lg:hidden p-2 rounded-md hover:bg-muted">
          <Menu size={20} />
        </button>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <Input
            placeholder="Rechercher employés, clients, dossiers..."
            className="pl-10 w-80 bg-muted border-0"
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button size="sm" variant="outline" className="gap-2">
          <Download size={16} />
          Exporter
        </Button>
        <Button size="sm" className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
          <Plus size={16} />
          Nouveau
        </Button>
        <div className="relative ml-2">
          <button className="p-2 rounded-lg hover:bg-muted transition-colors relative">
            <Bell size={20} className="text-muted-foreground" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-primary text-primary-foreground">
              4
            </Badge>
          </button>
        </div>
      </div>
    </header>
  );
}
