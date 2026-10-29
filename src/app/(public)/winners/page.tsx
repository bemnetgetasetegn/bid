import Link from "next/link";
import { Trophy, ShieldCheck, Sparkles, CheckCircle, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

export const metadata = {
  title: "Verified Winners — ONEBID",
  description: "Meet the winners of recent ONEBID auctions and lowest-unique-bid competitions.",
};

export default function WinnersPage() {
  const demoWinners = [
    {
      id: "win-1",
      product_title: "iPhone 15 Pro Max 256GB Natural Titanium",
      product_image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=800",
      retail_value: 14500000, // 145,000 ETB
      winning_bid: 1850,       // 18.50 ETB
      winner_name: "Yonas B.",
      winner_phone: "+251 91 **** 42",
      city: "Addis Ababa",
      bidding_mode: "Lowest Unique Bid",
      finalized_at: "Oct 22, 2026",
    },
    {
      id: "win-2",
      product_title: 'MacBook Air 15" M2 Midnight',
      product_image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800",
      retail_value: 12000000,
      winning_bid: 7600000, // 76,000 ETB (highest bid)
      winner_name: "Bethlehem T.",
      winner_phone: "+251 92 **** 89",
      city: "Hawassa",
      bidding_mode: "Highest Bid Auction",
      finalized_at: "Oct 18, 2026",
    },
    {
      id: "win-3",
      product_title: "Sony PlayStation 5 Disc Edition + 2 Controllers",
      product_image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=800",
      retail_value: 8500000,
      winning_bid: 1240, // 12.40 ETB
      winner_name: "Kidus M.",
      winner_phone: "+251 94 **** 11",
      city: "Addis Ababa",
      bidding_mode: "Lowest Unique Bid",
      finalized_at: "Oct 14, 2026",
    },
    {
      id: "win-4",
      product_title: "Samsung Galaxy S24 Ultra 512GB Titanium Gray",
      product_image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=800",
      retail_value: 13500000,
      winning_bid: 2150, // 21.50 ETB
      winner_name: "Selamawit A.",
      winner_phone: "+251 93 **** 76",
      city: "Dire Dawa",
      bidding_mode: "Lowest Unique Bid",
      finalized_at: "Oct 10, 2026",
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-10 pb-6 border-b-2 border-[#111111] flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-[#FF5A1F] text-xs font-bold uppercase tracking-widest mb-1">
            <Trophy className="h-4 w-4" />
            <span>Hall of Winners</span>
          </div>
          <h1 className="text-4xl font-black uppercase text-[#111111] tracking-tight">
            Verified Winners
          </h1>
          <p className="text-sm text-[#686868] mt-1">
            Celebrating participants who secured high-value technology and vehicles on ONEBID.
          </p>
        </div>

        {/* Demo Mode Notice Badge */}
        <div className="bg-[#111111] text-white p-3 border-l-4 border-[#FF5A1F] text-xs">
          <span className="font-bold uppercase text-[#FF5A1F] block">Demonstration Notice:</span>
          <span>Sample records illustrate system output during pilot phase.</span>
        </div>
      </div>

      {/* Grid of Winners */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {demoWinners.map((winner) => (
          <Card key={winner.id} className="border-2 border-[#111111] bg-white overflow-hidden shadow-lg flex flex-col justify-between">
            <div className="relative h-48 bg-[#F5F5F3] overflow-hidden border-b border-[#E5E5E5]">
              <img
                src={winner.product_image}
                alt={winner.product_title}
                className="w-full h-full object-cover"
              />
              <Badge className="absolute top-3 left-3 bg-[#16803C] text-white border-0 font-extrabold uppercase text-[10px] tracking-wider">
                Claimed & Delivered
              </Badge>
            </div>

            <CardContent className="p-5 space-y-4 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#FF5A1F] uppercase tracking-wider block mb-1">
                  {winner.bidding_mode}
                </span>
                <h3 className="font-black text-base uppercase text-[#111111] line-clamp-2 leading-snug">
                  {winner.product_title}
                </h3>
              </div>

              {/* Price comparison box */}
              <div className="bg-[#F5F5F3] p-3 border-l-2 border-[#111111] space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-[#686868]">Retail Value:</span>
                  <span className="line-through text-[#686868] font-bold">
                    {formatCurrency(winner.retail_value)}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-[#111111]">Winning Bid:</span>
                  <span className="font-black text-[#FF5A1F] text-sm">
                    {formatCurrency(winner.winning_bid)}
                  </span>
                </div>
              </div>

              {/* Winner Profile Mini Box */}
              <div className="pt-2 border-t border-[#E5E5E5] flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-[#111111] block">{winner.winner_name}</span>
                  <span className="text-[11px] text-[#686868]">{winner.city}</span>
                </div>
                <div className="text-right text-[11px] text-[#686868]">
                  <span>{winner.finalized_at}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Call to action */}
      <div className="mt-16 bg-[#111111] text-white p-10 border-2 border-[#FF5A1F] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <h3 className="text-2xl font-black uppercase tracking-tight">
            Will You Be Our Next Winner?
          </h3>
          <p className="text-sm text-[#A0A0A0]">
            Explore our open live events today. Register your phone number and submit your lowest unique bid.
          </p>
        </div>
        <Link href="/bids">
          <Button className="bg-[#FF5A1F] hover:bg-[#E94B16] text-white font-black uppercase text-xs tracking-wider px-8 py-6 shadow-xl">
            Explore Active Bids
          </Button>
        </Link>
      </div>
    </div>
  );
}
