"use client";

import * as React from "react";
import { History, Search, Gavel, Filter, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function AdminBidHistoryPage() {
  const [search, setSearch] = React.useState("");

  const demoBids = [
    {
      id: "bid-88912",
      item_title: "iPhone 16 Pro Max 256GB Desert Titanium",
      user_name: "Abebe Kebede",
      user_phone: "+251911456789",
      bid_amount: 1450,
      bidding_mode: "Lowest Unique Bid",
      is_unique: true,
      status: "ACTIVE",
      created_at: new Date(Date.now() - 1800000).toISOString(),
    },
    {
      id: "bid-88911",
      item_title: "iPhone 16 Pro Max 256GB Desert Titanium",
      user_name: "Sara Hailu",
      user_phone: "+251922334455",
      bid_amount: 1450,
      bidding_mode: "Lowest Unique Bid",
      is_unique: false,
      status: "ACTIVE",
      created_at: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: "bid-88910",
      item_title: "PlayStation 5 Pro Console 2TB Digital Edition",
      user_name: "Dawit Yohannes",
      user_phone: "+251933556677",
      bid_amount: 320,
      bidding_mode: "Lowest Unique Bid",
      is_unique: true,
      status: "ACTIVE",
      created_at: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      id: "bid-88909",
      item_title: 'MacBook Pro 16" M3 Max 36GB / 1TB Space Black',
      user_name: "Abebe Kebede",
      user_phone: "+251911456789",
      bid_amount: 85500,
      bidding_mode: "Highest Bid",
      is_unique: true,
      status: "ACTIVE",
      created_at: new Date(Date.now() - 14400000).toISOString(),
    }
  ];

  const filtered = demoBids.filter(
    (b) =>
      b.id.toLowerCase().includes(search.toLowerCase()) ||
      b.item_title.toLowerCase().includes(search.toLowerCase()) ||
      b.user_phone.includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b-2 border-[#111111] flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-widest text-[#FF5A1F] block mb-1">
            Audit Trails
          </span>
          <h1 className="text-3xl font-black uppercase text-[#111111]">
            Bid Submission History
          </h1>
          <p className="text-xs text-[#686868] mt-1">
            Real-time feed of all incoming bids. In lowest unique bid mode, amounts are immutable.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#686868]" />
          <Input
            placeholder="Search Bid ID, Item, Phone..."
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
                <th className="p-3.5">Bid ID</th>
                <th className="p-3.5">Target Auction</th>
                <th className="p-3.5">Participant</th>
                <th className="p-3.5 text-right">Bid Amount</th>
                <th className="p-3.5 text-center">Uniqueness Flag</th>
                <th className="p-3.5">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5]">
              {filtered.map((b) => (
                <tr key={b.id} className="hover:bg-[#F5F5F3]">
                  <td className="p-3.5 font-mono font-bold text-[#FF5A1F]">
                    {b.id}
                  </td>
                  <td className="p-3.5 font-bold text-[#111111]">
                    {b.item_title}
                  </td>
                  <td className="p-3.5">
                    <span className="font-semibold block">{b.user_name}</span>
                    <span className="font-mono text-[10px] text-[#686868]">{b.user_phone}</span>
                  </td>
                  <td className="p-3.5 font-mono font-black text-right text-sm text-[#111111]">
                    {formatCurrency(b.bid_amount)}
                  </td>
                  <td className="p-3.5 text-center">
                    {b.bidding_mode === "Lowest Unique Bid" ? (
                      b.is_unique ? (
                        <Badge className="bg-[#16803C] text-white text-[9px] font-bold">
                          UNIQUE
                        </Badge>
                      ) : (
                        <Badge className="bg-[#DC2626] text-white text-[9px] font-bold">
                          DUPLICATE
                        </Badge>
                      )
                    ) : (
                      <Badge variant="outline" className="text-[9px] font-bold">
                        OPEN
                      </Badge>
                    )}
                  </td>
                  <td className="p-3.5 text-[#686868] text-[11px] font-mono">
                    {formatDate(b.created_at)}
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
