import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse bg-[#E5E5E5] rounded-none", className)}
      {...props}
    />
  );
}

export { Skeleton };
