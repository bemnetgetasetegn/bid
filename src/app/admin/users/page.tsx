"use client";

import * as React from "react";
import { Users, Search, Shield, Ban, CheckCircle2, Wallet, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/toaster";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function AdminUsersPage() {
  const [search, setSearch] = React.useState("");
  const [users, setUsers] = React.useState([
    {
      id: "u-101",
      full_name: "Abebe Kebede",
      phone: "+251911456789",
      wallet_balance: 150000,
      bid_count: 14,
      account_status: "ACTIVE",
      created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
    },
    {
      id: "u-102",
      full_name: "Sara Hailu",
      phone: "+251922334455",
      wallet_balance: 320000,
      bid_count: 28,
      account_status: "ACTIVE",
      created_at: new Date(Date.now() - 25 * 86400000).toISOString(),
    },
    {
      id: "u-103",
      full_name: "Dawit Yohannes",
      phone: "+251933556677",
      wallet_balance: 5000,
      bid_count: 6,
      account_status: "ACTIVE",
      created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
    },
    {
      id: "u-104",
      full_name: "Tigist Alemu",
      phone: "+251944667788",
      wallet_balance: 0,
      bid_count: 0,
      account_status: "SUSPENDED",
      created_at: new Date(Date.now() - 8 * 86400000).toISOString(),
    }
  ]);

  const toggleStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const newStatus = u.account_status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
          toast({
            title: `Account ${newStatus === "ACTIVE" ? "Reactivated" : "Suspended"}`,
            description: `User ${u.full_name} status updated.`,
            variant: newStatus === "ACTIVE" ? "success" : "destructive",
          });
          return { ...u, account_status: newStatus };
        }
        return u;
      })
    );
  };

  const filtered = users.filter((u) =>
    u.full_name.toLowerCase().includes(search.toLowerCase()) ||
    u.phone.includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b-2 border-[#111111] flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-widest text-[#FF5A1F] block mb-1">
            Access Control
          </span>
          <h1 className="text-3xl font-black uppercase text-[#111111]">
            Registered Users ({users.length})
          </h1>
          <p className="text-xs text-[#686868] mt-1">
            Monitor participant profiles, inspect balances, and enforce suspension where violations occur.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#686868]" />
          <Input
            placeholder="Search Name or Phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-white border-[#E5E5E5] text-xs font-semibold h-10"
          />
        </div>
      </div>

      <div className="bg-white border-2 border-[#111111] shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#111111] text-white uppercase text-[11px] tracking-wider">
              <tr>
                <th className="p-3.5">Full Name</th>
                <th className="p-3.5">Phone (Auth)</th>
                <th className="p-3.5 text-right">Wallet Balance</th>
                <th className="p-3.5 text-center">Bids Placed</th>
                <th className="p-3.5">Registration</th>
                <th className="p-3.5 text-center">Status</th>
                <th className="p-3.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5]">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-[#F5F5F3] transition-colors">
                  <td className="p-3.5 font-bold text-[#111111]">
                    {u.full_name}
                  </td>
                  <td className="p-3.5 font-mono text-[#686868]">
                    {u.phone}
                  </td>
                  <td className="p-3.5 font-mono font-black text-right text-sm text-[#111111]">
                    {formatCurrency(u.wallet_balance)}
                  </td>
                  <td className="p-3.5 text-center font-bold">
                    {u.bid_count}
                  </td>
                  <td className="p-3.5 text-[#686868] text-[11px]">
                    {formatDate(u.created_at)}
                  </td>
                  <td className="p-3.5 text-center">
                    <Badge
                      className={
                        u.account_status === "ACTIVE"
                          ? "bg-[#16803C] text-white text-[9px] font-bold"
                          : "bg-[#DC2626] text-white text-[9px] font-bold"
                      }
                    >
                      {u.account_status}
                    </Badge>
                  </td>
                  <td className="p-3.5 text-center">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleStatus(u.id)}
                      className={
                        u.account_status === "ACTIVE"
                          ? "border-red-600 text-red-600 text-[10px] font-bold uppercase h-7 px-2"
                          : "border-green-600 text-green-600 text-[10px] font-bold uppercase h-7 px-2"
                      }
                    >
                      {u.account_status === "ACTIVE" ? "Suspend" : "Activate"}
                    </Button>
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
