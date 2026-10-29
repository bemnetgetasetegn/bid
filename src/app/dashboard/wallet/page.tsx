import Link from "next/link";
import { Wallet, PlusCircle, ArrowUpRight, History, ShieldAlert, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { getUserWallet, getWalletTransactions } from "@/lib/services/wallet.service";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "My Wallet — ONEBID",
  description: "Manage your ONEBID Ethiopian Birr wallet, check balances and request top-ups.",
};

export default async function WalletPage() {
  const wallet = await getUserWallet();
  const transactions = await getWalletTransactions();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-4 border-b-2 border-[#111111] flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-widest text-[#FF5A1F] block mb-1">
            Financial Center
          </span>
          <h1 className="text-3xl font-black uppercase text-[#111111]">
            My Wallet
          </h1>
        </div>
        <Link href="/dashboard/wallet/top-up">
          <Button className="bg-[#FF5A1F] hover:bg-[#E94B16] text-white font-extrabold uppercase text-xs tracking-wider px-6 py-5 shadow-lg">
            <PlusCircle className="h-4 w-4 mr-1.5" /> Request Wallet Top-Up
          </Button>
        </Link>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-[#111111] text-white p-6 border-b-4 border-[#FF5A1F] shadow-lg space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#A0A0A0]">
            Available Funds (ETB)
          </span>
          <div className="text-3xl font-black font-mono text-white">
            {formatCurrency(wallet.available_balance)}
          </div>
          <p className="text-[11px] text-[#A0A0A0]">
            Usable immediately for bid submissions and entry fees.
          </p>
        </div>

        <div className="bg-white border-2 border-[#E5E5E5] p-6 shadow-sm space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#686868]">
            Reserved Funds (ETB)
          </span>
          <div className="text-3xl font-black font-mono text-[#111111]">
            {formatCurrency(wallet.reserved_balance)}
          </div>
          <p className="text-[11px] text-[#686868]">
            Held in escrow while your live bids are evaluated.
          </p>
        </div>

        <div className="bg-white border-2 border-[#E5E5E5] p-6 shadow-sm space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#686868]">
            Lifetime Deposited
          </span>
          <div className="text-3xl font-black font-mono text-[#16803C]">
            {formatCurrency(wallet.total_deposited || 0)}
          </div>
          <p className="text-[11px] text-[#686868]">
            Total verified credits approved by administrator.
          </p>
        </div>
      </div>

      {/* Payment Provider Guidance */}
      <div className="bg-white border-2 border-[#111111] p-6 shadow-sm space-y-4">
        <h3 className="font-black text-sm uppercase text-[#111111]">
          Supported Deposit Accounts in Ethiopia
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-[#F5F5F3] p-4 border border-[#E5E5E5] space-y-1.5">
            <span className="font-extrabold text-sm uppercase text-[#111111] block">
              telebirr
            </span>
            <div className="text-[#686868]">
              Merchant ID: <strong className="text-[#111111]">882011</strong>
            </div>
            <div className="text-[#686868]">
              Phone: <strong className="text-[#111111]">0911234567</strong>
            </div>
            <span className="text-[10px] text-[#16803C] font-bold block">
              Instant verification
            </span>
          </div>

          <div className="bg-[#F5F5F3] p-4 border border-[#E5E5E5] space-y-1.5">
            <span className="font-extrabold text-sm uppercase text-[#111111] block">
              CBE Birr / Commercial Bank
            </span>
            <div className="text-[#686868]">
              Account: <strong className="text-[#111111]">100023456789</strong>
            </div>
            <div className="text-[#686868]">
              Name: <strong className="text-[#111111]">ONEBID Ethiopia PLC</strong>
            </div>
            <span className="text-[10px] text-[#16803C] font-bold block">
              Direct transfer
            </span>
          </div>

          <div className="bg-[#F5F5F3] p-4 border border-[#E5E5E5] space-y-1.5">
            <span className="font-extrabold text-sm uppercase text-[#111111] block">
              Awash Bank
            </span>
            <div className="text-[#686868]">
              Account: <strong className="text-[#111111]">01320492834700</strong>
            </div>
            <div className="text-[#686868]">
              Branch: <strong className="text-[#111111]">Bole Medhanealem</strong>
            </div>
            <span className="text-[10px] text-[#16803C] font-bold block">
              Slip or mobile transfer
            </span>
          </div>
        </div>
      </div>

      {/* Ledger History */}
      <div className="bg-white border-2 border-[#111111] p-6 shadow-md space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-[#E5E5E5]">
          <div className="flex items-center space-x-2">
            <History className="h-4 w-4 text-[#FF5A1F]" />
            <h3 className="font-black text-sm uppercase text-[#111111]">
              Audited Ledger History
            </h3>
          </div>
        </div>

        <div className="divide-y divide-[#E5E5E5]">
          {transactions.map((tx) => (
            <div key={tx.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="space-y-0.5">
                <span className="font-extrabold text-[#111111] text-sm block">
                  {tx.description}
                </span>
                <span className="text-[11px] text-[#686868]">
                  {formatDate(tx.created_at)} • Type: {tx.entry_type}
                </span>
              </div>
              <div className="text-right flex sm:flex-col items-center sm:items-end justify-between sm:justify-center">
                <span
                  className={`font-mono font-black text-base block ${
                    tx.amount > 0 ? "text-[#16803C]" : "text-[#111111]"
                  }`}
                >
                  {tx.amount > 0 ? `+${formatCurrency(tx.amount)}` : formatCurrency(tx.amount)}
                </span>
                <span className="text-[10px] text-[#686868] font-mono">
                  Balance: {formatCurrency(tx.balance_after || 0)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
