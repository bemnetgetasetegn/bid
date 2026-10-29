import Link from "next/link";
import { Gavel } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F5F5F3] flex flex-col justify-between">
      {/* Auth Top Header */}
      <header className="border-b border-[#E5E5E5] bg-white py-4 px-6">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-[#111111] text-white p-1.5">
              <Gavel className="h-5 w-5 stroke-[2.5]" />
            </div>
            <span className="font-black text-xl tracking-tighter uppercase text-[#111111]">
              <span className="text-[#FF5A1F]">ONE</span>BID
            </span>
          </Link>
          <span className="text-xs uppercase font-extrabold text-[#686868] tracking-wider">
            Ethiopia
          </span>
        </div>
      </header>

      {/* Main Form Center */}
      <main className="flex-1 flex items-center justify-center p-4 py-12">
        {children}
      </main>

      {/* Auth Bottom Footer */}
      <footer className="border-t border-[#E5E5E5] bg-white py-4 text-center text-xs text-[#686868]">
        <div className="container mx-auto">
          <span>© 2026 ONEBID Ethiopia. Secure Phone Authentication.</span>
        </div>
      </footer>
    </div>
  );
}
