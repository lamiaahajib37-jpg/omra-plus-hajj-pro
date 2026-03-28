import { LucideIcon } from "lucide-react";

interface Props {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "up" | "down" | "neutral";
  icon: LucideIcon;
}

export function StatCard({ title, value, change, changeType = "neutral", icon: Icon }: Props) {
  return (
    <div className="bg-card rounded-xl p-5 border shadow-sm slide-up">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold mt-1 text-card-foreground">{value}</p>
          {change && (
            <p className={`text-xs mt-1 font-medium ${
              changeType === "up" ? "text-success" : changeType === "down" ? "text-destructive" : "text-muted-foreground"
            }`}>
              {change}
            </p>
          )}
        </div>
        <div className="p-2.5 rounded-lg bg-secondary">
          <Icon size={20} className="text-primary" />
        </div>
      </div>
    </div>
  );
}
