import { History, ArrowDownLeft, ArrowUpRight, ShieldCheck } from "lucide-react";
import { getWalletTransactions } from "@/lib/services/wallet.service";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Transaction Ledger — ONEBID",
  description: "Complete financial ledger history and audit records for your account.",
};

export default async function TransactionsPage() {
  const transactions = await getWalletTransactions();

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b-2 border-[#111111]">
        <span className="text-xs uppercase font-extrabold tracking-widest text-[#FF5A1F] block mb-1">
          Audited History
        </span>
        <h1 className="text-3xl font-black uppercase text-[#111111]">
          Wallet Transactions
        </h1>
        <p className="text-xs text-[#686868] mt-1">
          Immutable double-entry ledger entries for top-ups, participation fees, and refunds.
        </p>
      </div>

      <div className="bg-white border-2 border-[#111111] shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#111111] text-white uppercase text-[11px] tracking-wider">
              <tr>
                <th className="p-4 font-bold">Date & Time</th>
                <th className="p-4 font-bold">Type</th>
                <th className="p-4 font-bold">Description</th>
                <th className="p-4 font-bold text-right">Amount (ETB)</th>
                <th className="p-4 font-bold text-right">Balance After</th>
                <th className="p-4 font-bold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5] text-[#111111]">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-[#F5F5F3] transition-colors">
                  <td className="p-4 font-mono text-[11px] text-[#686868]">
                    {formatDate(tx.created_at)}
                  </td>
                  <td className="p-4">
                    <Badge variant="outline" className="border-[#111111] text-[10px] font-bold uppercase">
                      {tx.entry_type.replace(/_/g, " ")}
                    </Badge>
                  </td>
                  <td className="p-4 font-medium max-w-xs truncate">
                    {tx.description}
                  </td>
                  <td
                    className={`p-4 font-mono font-black text-right text-sm ${
                      tx.amount > 0 ? "text-[#16803C]" : "text-[#111111]"
                    }`}
                  >
                    {tx.amount > 0 ? `+${formatCurrency(tx.amount)}` : formatCurrency(tx.amount)}
                  </td>
                  <td className="p-4 font-mono text-right text-[#686868]">
                    {formatCurrency(tx.balance_after || 0)}
                  </td>
                  <td className="p-4 text-center">
                    <Badge className="bg-[#16803C] text-white text-[9px] uppercase font-bold py-0.5">
                      SETTLED
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
