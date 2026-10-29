import Link from "next/link";
import {
  Wallet,
  Gavel,
  Trophy,
  Clock,
  PlusCircle,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  History,
  Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { getUserWallet, getWalletTransactions } from "@/lib/services/wallet.service";
import { getUserNotifications } from "@/lib/services/notifications.service";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Dashboard Overview — ONEBID",
  description: "User dashboard and wallet status on ONEBID Ethiopia.",
};

export default async function DashboardPage() {
  const wallet = await getUserWallet();
  const transactions = (await getWalletTransactions()).slice(0, 5);
  const notifications = (await getUserNotifications()).slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-[#111111] text-white p-6 sm:p-8 border-l-4 border-[#FF5A1F] flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1">
          <span className="text-xs uppercase font-extrabold tracking-widest text-[#FF5A1F]">
            Welcome to your Dashboard
          </span>
          <h1 className="text-3xl font-black uppercase tracking-tight">
            Hello, Bidding Participant
          </h1>
          <p className="text-xs text-[#A0A0A0]">
            Track your bids, manage your Ethiopian Birr wallet, and monitor live competitions.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Link href="/dashboard/wallet/top-up">
            <Button className="bg-[#FF5A1F] hover:bg-[#E94B16] text-white font-extrabold uppercase text-xs tracking-wider px-6 py-5 shadow-lg">
              <PlusCircle className="h-4 w-4 mr-1.5" /> Top Up Wallet
            </Button>
          </Link>
          <Link href="/bids">
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-[#111111] font-bold uppercase text-xs py-5">
              Live Bids
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Available Balance */}
        <Card className="border-2 border-[#111111] bg-white shadow-sm">
          <CardContent className="p-5 space-y-2">
            <div className="flex justify-between items-center text-xs font-bold uppercase text-[#686868]">
              <span>Available Balance</span>
              <Wallet className="h-4 w-4 text-[#FF5A1F]" />
            </div>
            <div className="text-2xl font-black text-[#111111] font-mono">
              {formatCurrency(wallet.available_balance)}
            </div>
            <span className="text-[10px] text-[#16803C] font-semibold block">
              ● Ready for bid placement
            </span>
          </CardContent>
        </Card>

        {/* Reserved Balance */}
        <Card className="border-2 border-[#E5E5E5] bg-white shadow-sm">
          <CardContent className="p-5 space-y-2">
            <div className="flex justify-between items-center text-xs font-bold uppercase text-[#686868]">
              <span>Reserved Balance</span>
              <Clock className="h-4 w-4 text-[#686868]" />
            </div>
            <div className="text-2xl font-black text-[#111111] font-mono">
              {formatCurrency(wallet.reserved_balance)}
            </div>
            <span className="text-[10px] text-[#686868] font-semibold block">
              Active in live events
            </span>
          </CardContent>
        </Card>

        {/* Active Bids */}
        <Card className="border-2 border-[#E5E5E5] bg-white shadow-sm">
          <CardContent className="p-5 space-y-2">
            <div className="flex justify-between items-center text-xs font-bold uppercase text-[#686868]">
              <span>Active Bids</span>
              <Gavel className="h-4 w-4 text-[#111111]" />
            </div>
            <div className="text-2xl font-black text-[#111111] font-mono">
              3
            </div>
            <Link href="/dashboard/bids" className="text-[10px] font-bold text-[#FF5A1F] uppercase hover:underline">
              View active entries →
            </Link>
          </CardContent>
        </Card>

        {/* Winning Bids */}
        <Card className="border-2 border-[#E5E5E5] bg-white shadow-sm">
          <CardContent className="p-5 space-y-2">
            <div className="flex justify-between items-center text-xs font-bold uppercase text-[#686868]">
              <span>Winning Bids</span>
              <Trophy className="h-4 w-4 text-[#16803C]" />
            </div>
            <div className="text-2xl font-black text-[#16803C] font-mono">
              1
            </div>
            <span className="text-[10px] font-semibold text-[#16803C] block">
              Claim ready in Addis Ababa
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: Recent Transactions & Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Recent Ledger Transactions */}
        <div className="lg:col-span-8 bg-white border-2 border-[#111111] p-6 shadow-md space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-[#E5E5E5]">
            <div className="flex items-center space-x-2">
              <History className="h-4 w-4 text-[#FF5A1F]" />
              <h3 className="font-black text-sm uppercase text-[#111111]">
                Recent Wallet Transactions
              </h3>
            </div>
            <Link href="/dashboard/transactions" className="text-xs font-bold uppercase text-[#FF5A1F] hover:underline">
              View All
            </Link>
          </div>

          <div className="divide-y divide-[#E5E5E5]">
            {transactions.map((tx) => (
              <div key={tx.id} className="py-3 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <span className="font-extrabold text-[#111111] block">
                    {tx.description}
                  </span>
                  <span className="text-[10px] text-[#686868]">
                    {formatDate(tx.created_at)} • Ref: {tx.reference_type}
                  </span>
                </div>
                <div className="text-right">
                  <span
                    className={`font-mono font-black text-sm block ${
                      tx.amount > 0 ? "text-[#16803C]" : "text-[#111111]"
                    }`}
                  >
                    {tx.amount > 0 ? `+${formatCurrency(tx.amount)}` : formatCurrency(tx.amount)}
                  </span>
                  <Badge variant="outline" className="text-[9px] uppercase font-bold py-0">
                    SETTLED
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Alerts & Notices */}
        <div className="lg:col-span-4 space-y-6">
          {/* Notifications Card */}
          <div className="bg-white border-2 border-[#111111] p-6 shadow-md space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-[#E5E5E5]">
              <div className="flex items-center space-x-2">
                <Bell className="h-4 w-4 text-[#FF5A1F]" />
                <h3 className="font-black text-sm uppercase text-[#111111]">
                  Alerts & Notices
                </h3>
              </div>
              <Link href="/dashboard/notifications" className="text-xs font-bold uppercase text-[#FF5A1F] hover:underline">
                All
              </Link>
            </div>

            <div className="space-y-3">
              {notifications.map((notif) => (
                <div key={notif.id} className="p-3 bg-[#F5F5F3] border-l-2 border-[#FF5A1F] text-xs space-y-1">
                  <span className="font-extrabold text-[#111111] block">
                    {notif.title}
                  </span>
                  <p className="text-[11px] text-[#686868] leading-tight">
                    {notif.message}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Payment Instructions Card */}
          <div className="bg-[#111111] text-white p-5 space-y-3 border-t-4 border-[#FF5A1F]">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#FF5A1F] block">
              Payment Guide
            </span>
            <h4 className="text-xs font-black uppercase">Instant telebirr & CBE Birr</h4>
            <p className="text-[11px] text-[#A0A0A0] leading-relaxed">
              When depositing, remember to include your phone number in the transaction remark and submit your transaction ID for rapid review.
            </p>
            <Link href="/dashboard/wallet/top-up" className="block pt-1">
              <Button size="sm" className="w-full bg-[#FF5A1F] hover:bg-[#E94B16] text-white font-bold text-[10px] uppercase">
                Submit Deposit Request
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
