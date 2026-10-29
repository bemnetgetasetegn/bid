import Link from "next/link";
import { CheckCircle2, Trophy, ArrowRight } from "lucide-react";
import { getBiddingItems } from "@/lib/services/bidding.service";
import { BiddingCard } from "@/components/public/bidding-card";
import { Button } from "@/components/ui/button";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Completed Events — ONEBID",
  description: "Review finalized auctions, winning bids, and historical bidding results.",
};

export default async function CompletedPage() {
  const items = await getBiddingItems({ status: "COMPLETED" });

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-10 pb-6 border-b-2 border-[#111111] flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-[#686868] text-xs font-bold uppercase tracking-widest mb-1">
            <CheckCircle2 className="h-4 w-4 text-[#16803C]" />
            <span>Audited & Finalized</span>
          </div>
          <h1 className="text-4xl font-black uppercase text-[#111111] tracking-tight">
            Completed Auctions
          </h1>
          <p className="text-sm text-[#686868] mt-1">
            Archived events with verified outcomes and finalized settlement records.
          </p>
        </div>
        <Link href="/winners">
          <Button variant="outline" className="border-2 border-[#111111] font-bold uppercase text-xs">
            <Trophy className="h-3.5 w-3.5 mr-1.5 text-[#FF5A1F]" /> View Verified Winners
          </Button>
        </Link>
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item) => (
            <BiddingCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="bg-white border-2 border-[#E5E5E5] p-16 text-center space-y-4">
          <CheckCircle2 className="h-12 w-12 text-[#686868] mx-auto opacity-50" />
          <h3 className="text-xl font-black uppercase text-[#111111]">
            No Past Events Recorded
          </h3>
          <p className="text-sm text-[#686868] max-w-md mx-auto">
            All active auctions are currently running. As events conclude, results and winner verification logs will appear here.
          </p>
        </div>
      )}
    </div>
  );
}
