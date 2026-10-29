"use client";

import * as React from "react";
import Link from "next/link";
import { Gavel, Trophy, Clock, ArrowUpRight, CheckCircle2, AlertCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function MyBidsPage() {
  const activeBids = [
    {
      id: "bid-101",
      item_title: "iPhone 16 Pro Max 256GB Desert Titanium",
      slug: "iphone-16-pro-max-desert-titanium",
      bidding_mode: "Lowest Unique Bid",
      bid_amount: 1450, // 14.50 ETB
      status: "ACTIVE",
      placed_at: new Date(Date.now() - 3600000).toISOString(),
      closes_at: new Date(Date.now() + 259200000).toISOString(),
    },
    {
      id: "bid-102",
      item_title: "PlayStation 5 Pro Console 2TB Digital Edition",
      slug: "playstation-5-pro-2tb",
      bidding_mode: "Lowest Unique Bid",
      bid_amount: 320, // 3.20 ETB
      status: "ACTIVE",
      placed_at: new Date(Date.now() - 14400000).toISOString(),
      closes_at: new Date(Date.now() + 18000000).toISOString(),
    },
    {
      id: "bid-103",
      item_title: 'MacBook Pro 16" M3 Max 36GB / 1TB Space Black',
      slug: "macbook-pro-16-m3-max",
      bidding_mode: "Highest Bid Auction",
      bid_amount: 85500, // 855.00 ETB
      status: "ACTIVE",
      placed_at: new Date(Date.now() - 43200000).toISOString(),
      closes_at: new Date(Date.now() + 115200000).toISOString(),
    }
  ];

  const wonBids = [
    {
      id: "bid-088",
      item_title: "DJI Mini 4 Pro Fly More Combo Plus",
      slug: "dji-mini-4-pro-fly-more-combo",
      bidding_mode: "Lowest Unique Bid",
      bid_amount: 31250, // 312.50 ETB
      status: "WON",
      placed_at: new Date(Date.now() - 604800000).toISOString(),
      settled_at: new Date(Date.now() - 172800000).toISOString(),
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b-2 border-[#111111] flex justify-between items-end">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-widest text-[#FF5A1F] block mb-1">
            Participation Log
          </span>
          <h1 className="text-3xl font-black uppercase text-[#111111]">
            My Bidding Activity
          </h1>
        </div>
        <Link href="/bids">
          <Button className="bg-[#111111] hover:bg-[#FF5A1F] text-white font-bold uppercase text-xs">
            Browse Live Auctions
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-sm">
          <TabsTrigger value="active">Active Bids ({activeBids.length})</TabsTrigger>
          <TabsTrigger value="won">Won Events ({wonBids.length})</TabsTrigger>
        </TabsList>

        {/* Active Bids Content */}
        <TabsContent value="active" className="space-y-4 pt-4">
          <div className="bg-white border-2 border-[#111111] divide-y divide-[#E5E5E5] shadow-sm">
            {activeBids.map((bid) => (
              <div key={bid.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-[#FF5A1F] text-white text-[10px] font-bold uppercase">
                      {bid.bidding_mode}
                    </Badge>
                    <span className="text-[11px] text-[#686868]">
                      Placed: {formatDate(bid.placed_at)}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-base text-[#111111]">
                    {bid.item_title}
                  </h3>
                  <div className="text-xs text-[#686868]">
                    Closes: {formatDate(bid.closes_at)}
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-[#686868] block">
                      Submitted Bid
                    </span>
                    <span className="font-mono font-black text-lg text-[#111111]">
                      {formatCurrency(bid.bid_amount)}
                    </span>
                  </div>
                  <Link href={`/bids/${bid.slug}`}>
                    <Button variant="outline" size="sm" className="border-[#111111] font-bold uppercase text-xs">
                      View Auction <ArrowUpRight className="h-3 w-3 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Won Bids Content */}
        <TabsContent value="won" className="space-y-4 pt-4">
          <div className="bg-white border-2 border-[#16803C] divide-y divide-[#E5E5E5] shadow-sm">
            {wonBids.map((bid) => (
              <div key={bid.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-[#16803C] text-white text-[10px] font-bold uppercase flex items-center gap-1">
                      <Trophy className="h-3 w-3" /> VERIFIED WINNER
                    </Badge>
                    <span className="text-[11px] text-[#686868]">
                      Settled: {formatDate(bid.settled_at)}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-base text-[#111111]">
                    {bid.item_title}
                  </h3>
                  <p className="text-xs text-[#16803C] font-semibold">
                    ✓ Verified by backend engine. Ready for Addis Ababa pickup.
                  </p>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-[#686868] block">
                      Winning Amount
                    </span>
                    <span className="font-mono font-black text-lg text-[#16803C]">
                      {formatCurrency(bid.bid_amount)}
                    </span>
                  </div>
                  <Link href={`/bids/${bid.slug}`}>
                    <Button size="sm" className="bg-[#16803C] text-white font-bold uppercase text-xs">
                      Claim Details
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
