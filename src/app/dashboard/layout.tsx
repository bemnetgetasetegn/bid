"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Gavel,
  LayoutDashboard,
  Wallet,
  Clock,
  History,
  Bell,
  User,
  LogOut,
  PlusCircle,
  Menu,
  X,
  ChevronRight,
  Shield,
  ArrowUpRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn, formatCurrency } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { getUserWallet, fallbackWallet } from "@/lib/services/wallet.service";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [wallet, setWallet] = React.useState(fallbackWallet);
  const [user, setUser] = React.useState<any>(null);
  const [isAdmin, setIsAdmin] = React.useState(false);

  React.useEffect(() => {
    const loadData = async () => {
      try {
        const supabase = createClient();
        const { data: { user: authUser } } = await supabase.auth.getUser();
        setUser(authUser);
        if (authUser) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("is_admin")
            .eq("id", authUser.id)
            .single();
          setIsAdmin(!!profile?.is_admin);
        }
        const w = await getUserWallet();
        setWallet(w);
      } catch {
        // fallback
      }
    };
    loadData();
  }, []);

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
    router.push("/");
  };

  const menuItems = [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "My Bids", href: "/dashboard/bids", icon: Gavel },
    { label: "My Wallet", href: "/dashboard/wallet", icon: Wallet },
    { label: "Top-Up Wallet", href: "/dashboard/wallet/top-up", icon: PlusCircle, highlight: true },
    { label: "Transactions", href: "/dashboard/transactions", icon: History },
    { label: "Notifications", href: "/dashboard/notifications", icon: Bell },
    { label: "Profile Settings", href: "/dashboard/profile", icon: User },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F3] flex flex-col">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 bg-[#111111] text-white border-b-2 border-[#FF5A1F] h-16 flex items-center px-4 sm:px-6 justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden text-white p-1"
          >
            {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-[#FF5A1F] text-white p-1.5">
              <Gavel className="h-4 w-4 stroke-[2.5]" />
            </div>
            <span className="font-black text-xl tracking-tighter uppercase">
              <span className="text-[#FF5A1F]">ONE</span>BID
            </span>
          </Link>
        </div>

        {/* Right Header: Wallet Balance & Profile */}
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/wallet/top-up">
            <div className="bg-[#1B1B1B] hover:bg-[#252525] border border-[#333333] px-3.5 py-1.5 flex items-center space-x-2 transition-colors">
              <span className="text-[10px] uppercase font-bold text-[#A0A0A0]">Balance:</span>
              <span className="font-mono text-xs font-black text-[#FF5A1F]">
                {formatCurrency(wallet.available_balance)}
              </span>
              <PlusCircle className="h-3.5 w-3.5 text-[#FF5A1F]" />
            </div>
          </Link>

          {isAdmin && (
            <Link href="/admin">
              <Button size="sm" variant="outline" className="border-white text-white text-xs font-bold uppercase hidden sm:flex">
                <Shield className="h-3.5 w-3.5 mr-1 text-[#FF5A1F]" /> Admin
              </Button>
            </Link>
          )}

          <Button
            size="sm"
            variant="ghost"
            onClick={handleLogout}
            className="text-[#A0A0A0] hover:text-white hover:bg-[#1B1B1B] text-xs font-bold uppercase"
          >
            <LogOut className="h-4 w-4 mr-1 text-red-500" />
            <span className="hidden sm:inline">Sign Out</span>
          </Button>
        </div>
      </header>

      {/* Main Body with Sidebar */}
      <div className="flex-1 flex container mx-auto px-4 py-8 gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0 space-y-6">
          {/* User Profile Mini Card */}
          <div className="bg-white border-2 border-[#111111] p-5 shadow-sm space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#111111] text-white font-black text-sm flex items-center justify-center uppercase">
                {user?.user_metadata?.full_name?.slice(0, 2) || "OB"}
              </div>
              <div className="overflow-hidden">
                <span className="font-extrabold text-sm uppercase text-[#111111] block truncate">
                  {user?.user_metadata?.full_name || "Abebe Kebede"}
                </span>
                <span className="text-[11px] font-mono text-[#686868] block">
                  {user?.phone || "+251911234567"}
                </span>
              </div>
            </div>
            <div className="pt-2 border-t border-[#E5E5E5] flex justify-between items-center text-[11px]">
              <span className="text-[#686868]">Status:</span>
              <Badge className="bg-[#16803C] text-white text-[9px] uppercase font-bold py-0">
                ACTIVE
              </Badge>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="bg-white border-2 border-[#111111] p-2 space-y-1 shadow-sm">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors",
                    isActive
                      ? "bg-[#111111] text-white"
                      : item.highlight
                      ? "text-[#FF5A1F] hover:bg-[#FF5A1F]/10"
                      : "text-[#111111] hover:bg-[#F5F5F3]"
                  )}
                >
                  <Icon className={cn("h-4 w-4", item.highlight && !isActive ? "text-[#FF5A1F]" : "")} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Quick action to live bids */}
          <div className="bg-[#111111] text-white p-5 border-l-4 border-[#FF5A1F] space-y-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#FF5A1F] block">
              Marketplace
            </span>
            <h4 className="text-sm font-black uppercase">Active Auctions</h4>
            <p className="text-xs text-[#A0A0A0]">
              Discover open events and place bids.
            </p>
            <Link href="/bids" className="block pt-1">
              <Button size="sm" className="w-full bg-[#FF5A1F] hover:bg-[#E94B16] text-white font-extrabold text-[11px] uppercase">
                Explore Bids <ArrowUpRight className="h-3 w-3 ml-1" />
              </Button>
            </Link>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex">
            <div className="w-72 bg-white h-full p-6 space-y-6 shadow-2xl flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center pb-4 border-b border-[#E5E5E5] mb-4">
                  <span className="font-black text-lg uppercase text-[#111111]">
                    User Menu
                  </span>
                  <button onClick={() => setSidebarOpen(false)}>
                    <X className="h-6 w-6 text-[#111111]" />
                  </button>
                </div>
                <nav className="space-y-1">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={cn(
                          "flex items-center space-x-3 px-3 py-2 text-xs font-bold uppercase",
                          isActive ? "bg-[#111111] text-white" : "text-[#111111]"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <Button
                variant="outline"
                onClick={handleLogout}
                className="w-full border-red-500 text-red-600 font-bold uppercase text-xs"
              >
                Sign Out
              </Button>
            </div>
          </div>
        )}

        {/* Content Area */}
        <main className="flex-1 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
