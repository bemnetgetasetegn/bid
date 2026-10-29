"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Gavel, Menu, X, User, Wallet, Shield, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [user, setUser] = React.useState<any>(null);
  const [isAdmin, setIsAdmin] = React.useState(false);

  React.useEffect(() => {
    const checkUser = async () => {
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
      } catch {
        // Fallback / client offline mode
      }
    };
    checkUser();
  }, []);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Live Bids", href: "/bids" },
    { label: "Upcoming", href: "/upcoming" },
    { label: "Completed", href: "/completed" },
    { label: "Winners", href: "/winners" },
    { label: "How It Works", href: "/how-it-works" },
    { label: "FAQ", href: "/faq" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#E5E5E5] bg-white/95 backdrop-blur-md">
      {/* Top Announcement Bar */}
      <div className="bg-[#111111] text-white px-4 py-1.5 text-xs font-semibold flex items-center justify-between">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#FF5A1F] animate-pulse" />
            <span className="tracking-wide uppercase text-[11px]">
              Demonstration Mode Active — Simulated Currency (ETB)
            </span>
          </div>
          <div className="hidden sm:flex items-center space-x-4 text-[11px] text-[#A0A0A0]">
            <span>Addis Ababa, Ethiopia</span>
            <span>•</span>
            <span>Support: +251 91 123 4567</span>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="bg-[#111111] text-white p-2 border-2 border-[#111111] group-hover:bg-[#FF5A1F] transition-colors">
            <Gavel className="h-6 w-6 stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-2xl tracking-tighter text-[#111111] uppercase leading-none">
              <span className="text-[#FF5A1F]">ONE</span>BID
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#686868] -mt-0.5">
              Ethiopia
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden lg:flex items-center space-x-6 text-sm font-bold uppercase tracking-wider">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative py-1 transition-colors hover:text-[#FF5A1F]",
                  isActive ? "text-[#FF5A1F]" : "text-[#111111]"
                )}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#FF5A1F]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="hidden md:flex items-center space-x-3">
          {user ? (
            <div className="flex items-center space-x-3">
              {isAdmin && (
                <Link href="/admin">
                  <Button variant="outline" size="sm" className="border-[#111111] text-[#111111] font-bold text-xs uppercase">
                    <Shield className="h-3.5 w-3.5 mr-1 text-[#FF5A1F]" /> Admin Panel
                  </Button>
                </Link>
              )}
              <Link href="/dashboard">
                <Button className="bg-[#111111] hover:bg-[#FF5A1F] text-white font-bold text-xs uppercase transition-colors">
                  <User className="h-4 w-4 mr-1.5" /> Dashboard
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <Link href="/login">
                <Button variant="outline" className="border-2 border-[#111111] text-[#111111] font-extrabold uppercase text-xs hover:bg-[#111111] hover:text-white transition-colors">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-[#FF5A1F] hover:bg-[#E94B16] text-white font-extrabold uppercase text-xs shadow-md">
                  Register
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-[#111111] focus:outline-none"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[110px] bg-white border-b-2 border-[#111111] shadow-2xl p-6 z-50 animate-in slide-in-from-top duration-200">
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "text-lg font-bold uppercase tracking-wider py-2 border-b border-[#E5E5E5] flex items-center justify-between",
                  pathname === link.href ? "text-[#FF5A1F]" : "text-[#111111]"
                )}
              >
                <span>{link.label}</span>
                <ChevronRight className="h-4 w-4 text-[#FF5A1F]" />
              </Link>
            ))}

            <div className="pt-4 flex flex-col space-y-3">
              {user ? (
                <>
                  <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full bg-[#111111] text-white font-bold uppercase">
                      My Dashboard
                    </Button>
                  </Link>
                  {isAdmin && (
                    <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full border-2 border-[#111111] font-bold uppercase">
                        Admin Portal
                      </Button>
                    </Link>
                  )}
                </>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full border-2 border-[#111111] font-bold uppercase text-xs">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full bg-[#FF5A1F] text-white font-bold uppercase text-xs">
                      Register
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
