import Link from "next/link";
import { Gavel, Plus, Eye, Edit, Trash2, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getBiddingItems } from "@/lib/services/bidding.service";
import { formatCurrency, formatDate } from "@/lib/utils";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Manage Auctions — ONEBID Admin",
  description: "Create, schedule, configure, and monitor bidding items.",
};

export default async function AdminBidsPage() {
  const items = await getBiddingItems();

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b-2 border-[#111111] flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-widest text-[#FF5A1F] block mb-1">
            Inventory & Events
          </span>
          <h1 className="text-3xl font-black uppercase text-[#111111]">
            Manage Bidding Items
          </h1>
          <p className="text-xs text-[#686868] mt-1">
            Configure bidding modes, entry fees, start/end dates, and manage auction lifecycles.
          </p>
        </div>
        <Link href="/admin/bids/new">
          <Button className="bg-[#FF5A1F] hover:bg-[#E94B16] text-white font-extrabold uppercase text-xs tracking-wider px-5 py-5 shadow-lg">
            <Plus className="h-4 w-4 mr-1.5" /> Create Auction Item
          </Button>
        </Link>
      </div>

      <div className="bg-white border-2 border-[#111111] shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#111111] text-white uppercase text-[11px] tracking-wider">
              <tr>
                <th className="p-3.5">Item & Format</th>
                <th className="p-3.5">Starting Price</th>
                <th className="p-3.5">Min Bid / Fee</th>
                <th className="p-3.5">Closing Date</th>
                <th className="p-3.5 text-center">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5]">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-[#F5F5F3] transition-colors">
                  <td className="p-3.5">
                    <div className="flex items-center space-x-3">
                      <img
                        src={item.images?.[0]?.storage_path || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800"}
                        alt={item.title}
                        className="w-12 h-12 object-cover border border-[#E5E5E5] shrink-0"
                      />
                      <div>
                        <span className="font-extrabold text-[#111111] text-xs block line-clamp-1">
                          {item.title}
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <Badge variant="outline" className="border-[#111111] text-[9px] font-bold uppercase py-0">
                            {item.bidding_mode === "LOWEST_UNIQUE_BID" ? "Lowest Unique" : "Highest Bid"}
                          </Badge>
                          <span className="text-[10px] text-[#686868]">
                            Slug: {item.slug}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3.5 font-mono font-bold text-[#111111]">
                    {formatCurrency(item.starting_price)}
                  </td>
                  <td className="p-3.5 text-[11px]">
                    <div className="font-mono text-[#111111]">
                      Min: {formatCurrency(item.minimum_bid)}
                    </div>
                    <div className="text-[10px] text-[#FF5A1F] font-bold">
                      Fee: {formatCurrency(item.bid_cost)}
                    </div>
                  </td>
                  <td className="p-3.5 text-[11px] text-[#686868] font-mono">
                    {formatDate(item.closing_date)}
                  </td>
                  <td className="p-3.5 text-center">
                    {item.status === "ACTIVE" && (
                      <Badge className="bg-[#FF5A1F] text-white text-[9px] font-bold uppercase">
                        ACTIVE
                      </Badge>
                    )}
                    {item.status === "SCHEDULED" && (
                      <Badge className="bg-[#111111] text-white text-[9px] font-bold uppercase">
                        SCHEDULED
                      </Badge>
                    )}
                    {item.status === "SETTLED" && (
                      <Badge className="bg-[#16803C] text-white text-[9px] font-bold uppercase">
                        SETTLED
                      </Badge>
                    )}
                  </td>
                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Link href={`/bids/${item.slug}`} target="_blank">
                        <Button size="sm" variant="outline" className="h-7 px-2 border-[#111111] text-[10px] uppercase font-bold">
                          <Eye className="h-3 w-3 mr-1" /> View
                        </Button>
                      </Link>
                      <Link href={`/admin/results`}>
                        <Button size="sm" className="h-7 px-2 bg-[#111111] text-white text-[10px] uppercase font-bold">
                          Finalize
                        </Button>
                      </Link>
                    </div>
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
