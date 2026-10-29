"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Gavel, Clock, Tag, ArrowUpRight, Flame, ShieldAlert } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CountdownTimer } from "./countdown-timer";
import { formatCurrency } from "@/lib/utils";
import { BiddingItem } from "@/types";

interface BiddingCardProps {
  item: BiddingItem;
}

export function BiddingCard({ item }: BiddingCardProps) {
  const imageUrl =
    item.images?.[0]?.storage_path ||
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800";

  const isLive = item.status === "ACTIVE";
  const [isUpcoming, setIsUpcoming] = React.useState(item.status === "SCHEDULED");

  React.useEffect(() => {
    if (item.status === "SCHEDULED" || new Date(item.opening_date) > new Date()) {
      setIsUpcoming(true);
    }
  }, [item.status, item.opening_date]);

  const isLowestUnique = item.bidding_mode === "LOWEST_UNIQUE_BID";

  return (
    <Card className="group relative border-2 border-[#E5E5E5] hover:border-[#111111] bg-white transition-all duration-300 hover:shadow-xl flex flex-col justify-between overflow-hidden">
      {/* Top Banner Tag */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
        {isLive && (
          <Badge className="bg-[#FF5A1F] text-white border-0 font-extrabold uppercase text-[10px] tracking-widest px-2.5 py-1 flex items-center space-x-1 shadow-md">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
            <span>LIVE NOW</span>
          </Badge>
        )}
        {isUpcoming && (
          <Badge className="bg-[#111111] text-white border-0 font-bold uppercase text-[10px] tracking-widest px-2.5 py-1">
            UPCOMING
          </Badge>
        )}
        {!isLive && !isUpcoming && (
          <Badge className="bg-[#686868] text-white border-0 font-bold uppercase text-[10px] tracking-widest px-2.5 py-1">
            COMPLETED
          </Badge>
        )}
      </div>

      <div className="absolute top-3 right-3 z-10">
        <Badge
          variant="outline"
          className="bg-white/90 backdrop-blur-sm border-[#111111] text-[#111111] font-bold text-[10px] uppercase tracking-wider"
        >
          {isLowestUnique ? "Lowest Unique Bid" : "Highest Bid"}
        </Badge>
      </div>

      {/* Image Container with geometric hover effect */}
      <div className="relative w-full h-56 bg-[#F5F5F3] overflow-hidden border-b border-[#E5E5E5]">
        <img
          src={imageUrl}
          alt={item.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
      </div>

      {/* Body Content */}
      <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between text-xs text-[#686868] mb-1 font-semibold uppercase tracking-wider">
            <span>Starting Price: {formatCurrency(item.starting_price)}</span>
            {item.bid_cost > 0 && (
              <span className="text-[#FF5A1F]">Entry Fee: {formatCurrency(item.bid_cost)}</span>
            )}
          </div>

          <Link href={`/bids/${item.slug}`}>
            <h3 className="font-extrabold text-lg text-[#111111] group-hover:text-[#FF5A1F] transition-colors line-clamp-1 leading-snug">
              {item.title}
            </h3>
          </Link>
          <p className="text-xs text-[#686868] line-clamp-2 mt-1 leading-relaxed">
            {item.short_description || item.description}
          </p>
        </div>

        {/* Pricing / Bid Status Box */}
        <div className="bg-[#F5F5F3] p-3 border-l-4 border-[#FF5A1F] flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#686868] tracking-wider block">
              {isLowestUnique ? "Current Pool" : "Highest Bid"}
            </span>
            <span className="text-base font-extrabold text-[#111111]">
              {(item.current_highest_bid ?? 0) > 0
                ? formatCurrency(item.current_highest_bid!)
                : formatCurrency(item.starting_price)}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-[#686868] tracking-wider block">
              Min Bid
            </span>
            <span className="text-xs font-bold text-[#111111]">
              {formatCurrency(item.minimum_bid)}
            </span>
          </div>
        </div>

        {/* Countdown Area */}
        <div className="pt-1">
          {isLive ? (
            <div>
              <span className="text-[10px] uppercase font-bold text-[#686868] tracking-widest block mb-1.5 flex items-center gap-1">
                <Clock className="h-3 w-3 text-[#FF5A1F]" /> Closes In:
              </span>
              <CountdownTimer endDate={item.closing_date} />
            </div>
          ) : isUpcoming ? (
            <div className="text-xs font-semibold text-[#111111] bg-[#E5E5E5] p-2 text-center">
              Opens: {new Date(item.opening_date).toLocaleDateString()}
            </div>
          ) : (
            <div className="text-xs font-bold text-[#686868] uppercase text-center bg-[#E5E5E5] p-2">
              Auction Ended
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <Link href={`/bids/${item.slug}`} className="w-full block">
            <Button
              className="w-full bg-[#111111] hover:bg-[#FF5A1F] text-white font-extrabold text-xs uppercase tracking-wider py-5 transition-colors group-hover:shadow-md flex items-center justify-center space-x-1.5"
            >
              <span>{isLive ? "Place Your Bid" : "View Details"}</span>
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
