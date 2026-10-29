import Link from "next/link";
import {
  Users,
  Gavel,
  Wallet,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  ShieldAlert,
  FolderTree,
  FileCheck2
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAdminStats, getTopUpRequests } from "@/lib/services/admin.service";
import { formatCurrency, formatDate } from "@/lib/utils";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Administrator Console — ONEBID",
  description: "Administrative command dashboard for ONEBID Ethiopia platform.",
};

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();
  const pendingRequests = await getTopUpRequests("PENDING_VERIFICATION");

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-[#111111] text-white p-6 sm:p-8 border-l-4 border-[#FF5A1F] flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1">
          <span className="text-xs uppercase font-extrabold tracking-widest text-[#FF5A1F]">
            Central Command Console
          </span>
          <h1 className="text-3xl font-black uppercase tracking-tight">
            ONEBID Operations Center
          </h1>
          <p className="text-xs text-[#A0A0A0]">
            Platform monitoring, manual top-up verification, event finalization, and user audit trails.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Link href="/admin/bids/new">
            <Button className="bg-[#FF5A1F] hover:bg-[#E94B16] text-white font-extrabold uppercase text-xs tracking-wider px-6 py-5">
              + Create New Auction
            </Button>
          </Link>
          <Link href="/admin/top-ups">
            <Button variant="outline" className="border-white text-white font-bold uppercase text-xs py-5">
              Review Top-Ups ({stats.pending_top_ups})
            </Button>
          </Link>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Registered Users */}
        <Card className="border-2 border-[#111111] bg-white shadow-sm">
          <CardContent className="p-5 space-y-2">
            <div className="flex justify-between items-center text-xs font-bold uppercase text-[#686868]">
              <span>Registered Users</span>
              <Users className="h-4 w-4 text-[#111111]" />
            </div>
            <div className="text-3xl font-black font-mono text-[#111111]">
              {stats.total_users.toLocaleString()}
            </div>
            <span className="text-[10px] text-[#16803C] font-semibold block">
              ● {stats.active_users.toLocaleString()} Active Profiles
            </span>
          </CardContent>
        </Card>

        {/* Pending Top-Up Verification */}
        <Card className="border-2 border-[#FF5A1F] bg-white shadow-sm">
          <CardContent className="p-5 space-y-2">
            <div className="flex justify-between items-center text-xs font-bold uppercase text-[#686868]">
              <span>Pending Top-Ups</span>
              <Wallet className="h-4 w-4 text-[#FF5A1F]" />
            </div>
            <div className="text-3xl font-black font-mono text-[#FF5A1F]">
              {stats.pending_top_ups}
            </div>
            <Link href="/admin/top-ups" className="text-[10px] font-bold text-[#FF5A1F] uppercase hover:underline block">
              Needs verification →
            </Link>
          </CardContent>
        </Card>

        {/* Total Bidding Items */}
        <Card className="border-2 border-[#E5E5E5] bg-white shadow-sm">
          <CardContent className="p-5 space-y-2">
            <div className="flex justify-between items-center text-xs font-bold uppercase text-[#686868]">
              <span>Total Auctions</span>
              <Gavel className="h-4 w-4 text-[#111111]" />
            </div>
            <div className="text-3xl font-black font-mono text-[#111111]">
              {stats.total_items}
            </div>
            <span className="text-[10px] text-[#686868] font-semibold block">
              {stats.active_items} Active • {stats.upcoming_items} Upcoming
            </span>
          </CardContent>
        </Card>

        {/* Approved Top-Up Total */}
        <Card className="border-2 border-[#E5E5E5] bg-white shadow-sm">
          <CardContent className="p-5 space-y-2">
            <div className="flex justify-between items-center text-xs font-bold uppercase text-[#686868]">
              <span>Approved Volume</span>
              <CheckCircle2 className="h-4 w-4 text-[#16803C]" />
            </div>
            <div className="text-2xl font-black font-mono text-[#16803C]">
              {formatCurrency(stats.approved_top_ups_total)}
            </div>
            <span className="text-[10px] text-[#686868] font-semibold block">
              Simulated demonstration volume
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Pending Top-Up Verification Table */}
      <div className="bg-white border-2 border-[#111111] p-6 shadow-md space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-[#E5E5E5]">
          <div className="flex items-center space-x-2">
            <Wallet className="h-4 w-4 text-[#FF5A1F]" />
            <h3 className="font-black text-sm uppercase text-[#111111]">
              Pending Top-Up Verification Queue ({pendingRequests.length})
            </h3>
          </div>
          <Link href="/admin/top-ups" className="text-xs font-bold uppercase text-[#FF5A1F] hover:underline">
            Manage All Requests →
          </Link>
        </div>

        {pendingRequests.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#F5F5F3] text-[#111111] uppercase font-bold text-[10px]">
                <tr>
                  <th className="p-3">User Details</th>
                  <th className="p-3">Method</th>
                  <th className="p-3">Transaction ID</th>
                  <th className="p-3 text-right">Amount</th>
                  <th className="p-3">Submitted</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E5E5]">
                {pendingRequests.slice(0, 5).map((req) => (
                  <tr key={req.id} className="hover:bg-[#F5F5F3]">
                    <td className="p-3">
                      <span className="font-bold text-[#111111] block">
                        {req.user?.full_name || "Participant"}
                      </span>
                      <span className="text-[10px] text-[#686868] font-mono">
                        {req.user?.phone}
                      </span>
                    </td>
                    <td className="p-3 font-semibold uppercase text-[#111111]">
                      {req.payment_method}
                    </td>
                    <td className="p-3 font-mono font-bold text-[#FF5A1F]">
                      {req.transaction_id}
                    </td>
                    <td className="p-3 font-mono font-black text-right text-sm">
                      {formatCurrency(req.amount)}
                    </td>
                    <td className="p-3 text-[#686868] text-[11px]">
                      {formatDate(req.created_at)}
                    </td>
                    <td className="p-3 text-center">
                      <Link href="/admin/top-ups">
                        <Button size="sm" className="bg-[#111111] hover:bg-[#FF5A1F] text-white text-[10px] font-bold uppercase">
                          Review
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-[#686868]">
            ✓ No pending top-up requests at this time. All submissions verified.
          </div>
        )}
      </div>
    </div>
  );
}
