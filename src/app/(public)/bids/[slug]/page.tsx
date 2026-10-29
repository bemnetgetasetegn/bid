import Link from "next/link";
import { notFound } from "next/navigation";
import { Gavel, Clock, ShieldCheck, Tag, Info, ArrowLeft, CheckCircle2, AlertTriangle } from "lucide-react";
import { getBiddingItemBySlug, getBiddingItems } from "@/lib/services/bidding.service";
import { CountdownTimer } from "@/components/public/countdown-timer";
import { BidForm } from "@/components/public/bid-form";
import { BiddingCard } from "@/components/public/bidding-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await getBiddingItemBySlug(slug);
  if (!item) return { title: "Item Not Found — ONEBID" };

  return {
    title: `${item.title} — ONEBID Ethiopia`,
    description: item.short_description || item.description,
  };
}

export default async function BidDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await getBiddingItemBySlug(slug);

  if (!item) {
    notFound();
  }

  const relatedItems = (await getBiddingItems({ status: "ACTIVE" }))
    .filter((i) => i.id !== item.id)
    .slice(0, 3);

  const isLive = item.status === "ACTIVE";
  const isLowestUnique = item.bidding_mode === "LOWEST_UNIQUE_BID";
  const imageUrl =
    item.images?.[0]?.storage_path ||
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800";

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back breadcrumb */}
      <div className="mb-6">
        <Link
          href="/bids"
          className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-[#686868] hover:text-[#FF5A1F] transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Live Bids
        </Link>
      </div>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Image Gallery & Description */}
        <div className="lg:col-span-7 space-y-8">
          {/* Main Showcase Image */}
          <div className="relative bg-white border-2 border-[#111111] overflow-hidden shadow-lg">
            <div className="absolute top-4 left-4 z-10 flex gap-2">
              <Badge className="bg-[#FF5A1F] text-white border-0 font-extrabold uppercase text-xs tracking-widest px-3 py-1 shadow">
                {item.status}
              </Badge>
              <Badge className="bg-[#111111] text-white border-0 font-bold uppercase text-xs tracking-widest px-3 py-1">
                {isLowestUnique ? "Lowest Unique Bid" : "Highest Bid Auction"}
              </Badge>
            </div>

            <div className="w-full h-96 sm:h-[460px] bg-[#F5F5F3] flex items-center justify-center overflow-hidden">
              <img
                src={imageUrl}
                alt={item.title}
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>

          {/* Description & Technical Specs */}
          <div className="bg-white border-2 border-[#E5E5E5] p-6 space-y-6">
            <div className="border-b border-[#E5E5E5] pb-4">
              <h2 className="text-xl font-black uppercase text-[#111111] tracking-tight">
                Item Description & Specifications
              </h2>
            </div>

            <div className="prose text-sm text-[#444444] leading-relaxed space-y-4">
              <p>{item.description}</p>
            </div>

            {/* Rules explanation box */}
            <div className="bg-[#F5F5F3] border-l-4 border-[#FF5A1F] p-4 space-y-2">
              <div className="flex items-center space-x-2 text-[#111111] font-bold text-xs uppercase tracking-wider">
                <Info className="h-4 w-4 text-[#FF5A1F]" />
                <span>How This Event Works: {item.bidding_mode.replace(/_/g, " ")}</span>
              </div>
              <p className="text-xs text-[#686868] leading-relaxed">
                {isLowestUnique
                  ? "In this competition, participants submit bids within the allowed range. The winner is the participant who places the LOWEST bid that is completely UNIQUE (no one else has submitted the same exact figure). Choose your numbers strategically!"
                  : "Standard auction format. Place bids meeting or exceeding the current price. The highest eligible bidder when time expires wins the item."}
              </p>
            </div>

            {/* Terms and conditions */}
            {item.terms_and_conditions && (
              <div className="pt-4 border-t border-[#E5E5E5] text-xs text-[#686868] space-y-1">
                <span className="font-bold uppercase tracking-wider text-[#111111] block">
                  Event Terms & Conditions:
                </span>
                <p>{item.terms_and_conditions}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Pricing, Countdown, Bid Submission Box */}
        <div className="lg:col-span-5 space-y-6">
          {/* Header Info Box */}
          <div className="bg-white border-2 border-[#111111] p-6 space-y-4 shadow-lg">
            <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-[#686868]">
              <span>ID: {item.id.slice(0, 8)}</span>
              <span className="text-[#FF5A1F]">Currency: ETB</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black uppercase text-[#111111] leading-tight">
              {item.title}
            </h1>

            {/* Countdown Banner */}
            <div className="bg-[#111111] text-white p-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#A0A0A0]">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-[#FF5A1F]" />
                  <span>{isLive ? "Auction Closes In" : "Event Status"}</span>
                </span>
                <span>Ends: {formatDate(item.closing_date)}</span>
              </div>

              {isLive ? (
                <div className="pt-1">
                  <CountdownTimer endDate={item.closing_date} />
                </div>
              ) : (
                <div className="py-2 text-center text-sm font-bold uppercase text-[#FF5A1F]">
                  This event is closed
                </div>
              )}
            </div>

            {/* Price Matrix */}
            <div className="grid grid-cols-2 gap-4 py-2 border-y border-[#E5E5E5] text-xs">
              <div>
                <span className="text-[#686868] font-bold uppercase block mb-0.5">
                  Starting Price
                </span>
                <span className="text-base font-black text-[#111111]">
                  {formatCurrency(item.starting_price)}
                </span>
              </div>
              <div>
                <span className="text-[#686868] font-bold uppercase block mb-0.5">
                  Entry Participation Fee
                </span>
                <span className="text-base font-black text-[#FF5A1F]">
                  {formatCurrency(item.bid_cost)}
                </span>
              </div>
              <div>
                <span className="text-[#686868] font-bold uppercase block mb-0.5">
                  Minimum Bid
                </span>
                <span className="font-bold text-[#111111]">
                  {formatCurrency(item.minimum_bid)}
                </span>
              </div>
              <div>
                <span className="text-[#686868] font-bold uppercase block mb-0.5">
                  Maximum Bid Cap
                </span>
                <span className="font-bold text-[#111111]">
                  {item.maximum_bid ? formatCurrency(item.maximum_bid) : "No Cap"}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-xs text-[#16803C] font-bold uppercase tracking-wider">
              <ShieldCheck className="h-4 w-4" />
              <span>Certified Server-Side Settlement Active</span>
            </div>
          </div>

          {/* Bid Submission Box */}
          <BidForm item={item} />
        </div>
      </div>

      {/* Related Bids Section */}
      {relatedItems.length > 0 && (
        <div className="mt-20 pt-10 border-t-2 border-[#111111]">
          <div className="flex justify-between items-end mb-8">
            <h3 className="text-2xl font-black uppercase text-[#111111]">
              Other Active Auctions
            </h3>
            <Link href="/bids">
              <Button variant="outline" className="border-2 border-[#111111] font-bold text-xs uppercase">
                Explore All
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedItems.map((rel) => (
              <BiddingCard key={rel.id} item={rel} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
