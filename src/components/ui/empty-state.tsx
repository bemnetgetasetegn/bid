import { cn } from "@/lib/utils";
import { LucideIcon, PackageOpen } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  className?: string;
}

export function EmptyState({
  icon: Icon = PackageOpen,
  title,
  description,
  actionLabel,
  actionHref,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-4 text-center",
        className
      )}
    >
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#F5F5F3] mb-6">
        <Icon className="w-8 h-8 text-[#686868]" strokeWidth={1.5} />
      </div>
      <h3 className="text-lg font-semibold text-[#111111] mb-2">{title}</h3>
      <p className="text-sm text-[#686868] max-w-md mb-6">{description}</p>
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-[#FF5A1F] rounded-lg hover:bg-[#E94B16] transition-colors"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
