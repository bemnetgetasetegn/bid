"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ShieldAlert,
  Gavel,
  LayoutDashboard,
  Users,
  Wallet,
  FolderTree,
  FileCheck2,
  Sliders,
  HelpCircle,
  Shield,
  LogOut,
  ArrowLeft,
  FileText,
  History
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {}
    router.push("/");
  };

  const navItems = [
    { label: "Dashboard Overview", href: "/admin", icon: LayoutDashboard },
    { label: "Bidding Items", href: "/admin/bids", icon: Gavel },
    { label: "Top-Up Requests", href: "/admin/top-ups", icon: Wallet, highlight: true },
    { label: "Event Finalization", href: "/admin/results", icon: FileCheck2 },
    { label: "Bid History & Logs", href: "/admin/bid-history", icon: History },
    { label: "User Management", href: "/admin/users", icon: Users },
    { label: "Categories", href: "/admin/categories", icon: FolderTree },
    { label: "Content & Copy", href: "/admin/content", icon: FileText },
    { label: "FAQs Management", href: "/admin/faqs", icon: HelpCircle },
    { label: "Audit Logs", href: "/admin/audit-logs", icon: ShieldAlert },
    { label: "System Settings", href: "/admin/settings", icon: Sliders },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F3] flex flex-col">
      {/* Top Admin Header */}
      <header className="bg-[#111111] text-white border-b-4 border-[#FF5A1F] h-16 flex items-center px-6 justify-between sticky top-0 z-50">
        <div className="flex items-center space-x-4">
          <Link href="/admin" className="flex items-center space-x-2">
            <div className="bg-[#FF5A1F] text-white p-1.5">
              <Shield className="h-5 w-5 stroke-[2.5]" />
            </div>
            <span className="font-black text-xl uppercase tracking-tighter">
              <span className="text-[#FF5A1F]">ONE</span>BID ADMIN
            </span>
          </Link>
          <Badge className="bg-[#1B1B1B] text-[#FF5A1F] border border-[#333333] text-[10px] font-black uppercase tracking-widest px-2.5">
            Single Administrator Node
          </Badge>
        </div>

        <div className="flex items-center space-x-4">
          <Link href="/">
            <Button size="sm" variant="outline" className="border-white text-white text-xs font-bold uppercase hover:bg-white hover:text-[#111111]">
              <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Public Portal
            </Button>
          </Link>
          <Button
            size="sm"
            onClick={handleLogout}
            className="bg-[#DC2626] hover:bg-red-700 text-white font-bold uppercase text-xs"
          >
            <LogOut className="h-3.5 w-3.5 mr-1" /> Exit Console
          </Button>
        </div>
      </header>

      {/* Admin Layout with Sidebar */}
      <div className="flex-1 flex container mx-auto px-4 py-8 gap-8">
        <aside className="w-64 shrink-0 hidden lg:block space-y-4">
          <nav className="bg-white border-2 border-[#111111] p-2 space-y-1 shadow-md">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors",
                    isActive
                      ? "bg-[#111111] text-white"
                      : item.highlight
                      ? "text-[#FF5A1F] hover:bg-[#FF5A1F]/10"
                      : "text-[#111111] hover:bg-[#F5F5F3]"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="bg-[#111111] text-white p-4 border-l-4 border-[#FF5A1F] text-xs space-y-2">
            <span className="font-bold text-[#FF5A1F] uppercase text-[10px] block">
              Security Compliance
            </span>
            <p className="text-[#A0A0A0] text-[11px] leading-tight">
              All administrative operations are cryptographically linked to audit logs.
            </p>
          </div>
        </aside>

        <main className="flex-1 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
