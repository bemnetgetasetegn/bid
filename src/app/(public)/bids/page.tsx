import Link from "next/link";
import { Gavel, Filter, SlidersHorizontal } from "lucide-react";
import { getBiddingItems } from "@/lib/services/bidding.service";
import { BiddingCard } from "@/components/public/bidding-card";
import { Button } from "@/components/ui/button";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Live Bidding Events — ONEBID",
  description: "Browse and place bids on active live auctions and lowest-unique-bid competitions.",
};

export default async function BidsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; mode?: string }>;
}) {
  const { category, mode } = await searchParams;
  const items = await getBiddingItems({
    status: "ACTIVE",
    category,
    bidding_mode: mode,
  });

  const categories = [
    { label: "All Categories", value: "" },
    { label: "Smartphones", value: "c1000000-0000-0000-0000-000000000001" },
    { label: "Computers", value: "c1000000-0000-0000-0000-000000000002" },
    { label: "Electronics", value: "c1000000-0000-0000-0000-000000000003" },
    { label: "Gaming", value: "c1000000-0000-0000-0000-000000000004" },
    { label: "Vehicles", value: "c1000000-0000-0000-0000-000000000005" },
    { label: "Home & Lifestyle", value: "c1000000-0000-0000-0000-000000000006" },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Page Header */}
      <div className="mb-10 pb-6 border-b-2 border-[#111111] flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-[#FF5A1F] text-xs font-bold uppercase tracking-widest mb-1">
            <span className="w-2 h-2 rounded-full bg-[#FF5A1F] animate-ping" />
            <span>Active Marketplace</span>
          </div>
          <h1 className="text-4xl font-black uppercase text-[#111111] tracking-tight">
            Live Bidding Events
          </h1>
          <p className="text-sm text-[#686868] mt-1">
            Real-time auctions currently accepting bids. Lowest unique and highest-bid formats.
          </p>
        </div>

        {/* Filter Navigation */}
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => {
            const isSelected = (!category && c.value === "") || category === c.value;
            return (
              <Link
                key={c.value}
                href={c.value ? `/bids?category=${c.value}` : "/bids"}
              >
                <Button
                  size="sm"
                  variant={isSelected ? "default" : "outline"}
                  className={
                    isSelected
                      ? "bg-[#111111] text-white font-bold text-xs uppercase"
                      : "border-[#E5E5E5] text-[#111111] hover:border-[#111111] font-medium text-xs uppercase"
                  }
                >
                  {c.label}
                </Button>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Grid of items */}
      {items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item) => (
            <BiddingCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="bg-white border-2 border-[#E5E5E5] p-16 text-center space-y-4">
          <Gavel className="h-12 w-12 text-[#686868] mx-auto opacity-50" />
          <h3 className="text-xl font-black uppercase text-[#111111]">
            No Active Events In This Category
          </h3>
          <p className="text-sm text-[#686868] max-w-md mx-auto">
            There are currently no active bidding events matching your selection. Try selecting another category or check upcoming auctions.
          </p>
          <div className="pt-2">
            <Link href="/bids">
              <Button className="bg-[#FF5A1F] hover:bg-[#E94B16] text-white font-bold uppercase text-xs">
                View All Categories
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
