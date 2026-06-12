import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center text-center p-8 bg-white border border-gray-200 rounded-xl max-w-md mx-auto my-12 shadow-sm", className)}>
      <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-gray-50 border border-gray-100 ring-8 ring-gray-50/50">
        <Icon className="w-6 h-6 text-gray-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 mb-6">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}
