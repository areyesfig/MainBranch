import type { ReactNode } from "react";

interface StatCardProps {
  value: string | number;
  label: string;
  icon: ReactNode;
  accentColor: string;
}

export default function StatCard({ value, label, icon, accentColor }: StatCardProps) {
  return (
    <div className="animate-scale-in flex items-center gap-4 rounded-lg border border-gray-200/50 bg-white/10 px-5 py-4 backdrop-blur-sm dark:border-gray-700/50">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${accentColor}`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="text-sm text-gray-300">{label}</p>
      </div>
    </div>
  );
}
