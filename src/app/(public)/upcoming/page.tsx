import Link from "next/link";
import { Clock, Calendar, ArrowRight, Bell } from "lucide-react";
import { getBiddingItems } from "@/lib/services/bidding.service";
import { BiddingCard } from "@/components/public/bidding-card";
import { Button } from "@/components/ui/button";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Upcoming Auctions — ONEBID",
  description: "Preview upcoming bidding events and auctions coming to ONEBID Ethiopia.",
};

export default async function UpcomingPage() {
  const items = await getBiddingItems({ status: "UPCOMING" });

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-10 pb-6 border-b-2 border-[#111111] flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-[#FF5A1F] text-xs font-bold uppercase tracking-widest mb-1">
            <Calendar className="h-4 w-4" />
            <span>Scheduled Releases</span>
          </div>
          <h1 className="text-4xl font-black uppercase text-[#111111] tracking-tight">
            Upcoming Auctions
          </h1>
          <p className="text-sm text-[#686868] mt-1">
            Browse items scheduled to open for bidding soon. Prepare your wallet and plan your strategy.
          </p>
        </div>
        <Link href="/register">
          <Button className="bg-[#FF5A1F] hover:bg-[#E94B16] text-white font-extrabold uppercase text-xs">
            Register to Get Notified
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
          <Clock className="h-12 w-12 text-[#686868] mx-auto opacity-50" />
          <h3 className="text-xl font-black uppercase text-[#111111]">
            New Schedule Being Finalized
          </h3>
          <p className="text-sm text-[#686868] max-w-md mx-auto">
            Our curators are currently preparing the next batch of premium smartphones and vehicle auctions. Check our live events in the meantime.
          </p>
          <div className="pt-2">
            <Link href="/bids">
              <Button className="bg-[#111111] hover:bg-[#FF5A1F] text-white font-bold uppercase text-xs">
                Explore Live Bids
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
