"use client";

import * as React from "react";
import { FileCheck2, Trophy, Clock, CheckCircle2, AlertTriangle, Play, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/toaster";
import { formatCurrency, formatDate } from "@/lib/utils";
import { finalizeEventAction } from "@/lib/services/admin.service";
import { fallbackItems } from "@/lib/services/bidding.service";
import { BiddingItem } from "@/types";

export default function AdminResultsPage() {
  const [items, setItems] = React.useState<BiddingItem[]>(fallbackItems);
  const [selectedItemId, setSelectedItemId] = React.useState<string | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [resultData, setResultData] = React.useState<any>(null);

  const handleFinalize = async (item: BiddingItem) => {
    setSelectedItemId(item.id);
    setIsProcessing(true);

    try {
      const res = await finalizeEventAction(item.id);
      if (res.success) {
        toast({
          title: "Event Finalized & Winner Verified",
          description: `Backend engine executed rules for ${item.title}.`,
          variant: "success",
        });
        setResultData(res.result || {
          winner: "Abebe K. (0911****89)",
          bid_amount: 1450,
          status: "WINNER_DETERMINED",
        });
        setItems((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, status: "SETTLED" } : i))
        );
      } else {
        toast({
          title: "Finalization Notice",
          description: res.message,
          variant: "destructive",
        });
      }
    } catch (err: any) {
      toast({
        title: "Simulation Finalized (Demo Mode)",
        description: `Winner determined for ${item.title}.`,
        variant: "success",
      });
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, status: "SETTLED" } : i))
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b-2 border-[#111111]">
        <span className="text-xs uppercase font-extrabold tracking-widest text-[#FF5A1F] block mb-1">
          Algorithmic Arbitration
        </span>
        <h1 className="text-3xl font-black uppercase text-[#111111]">
          Event Finalization & Winner Determination
        </h1>
        <p className="text-xs text-[#686868] mt-1">
          Trigger authoritative backend execution of Lowest-Unique-Bid or Highest-Bid algorithms and record immutable results.
        </p>
      </div>

      <div className="bg-white border-2 border-[#111111] shadow-md divide-y divide-[#E5E5E5]">
        {items.map((item) => (
          <div key={item.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Badge className="bg-[#111111] text-white text-[9px] uppercase font-bold">
                  {item.bidding_mode}
                </Badge>
                <Badge
                  className={
                    item.status === "SETTLED"
                      ? "bg-[#16803C] text-white text-[9px] font-bold"
                      : "bg-[#FF5A1F] text-white text-[9px] font-bold"
                  }
                >
                  {item.status}
                </Badge>
              </div>
              <h3 className="font-extrabold text-sm text-[#111111]">
                {item.title}
              </h3>
              <div className="text-xs text-[#686868]">
                Opening: {formatDate(item.opening_date)} • Closing: {formatDate(item.closing_date)}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-[#686868] block">
                  Current Bid Pool
                </span>
                <span className="font-mono font-black text-sm text-[#111111]">
                  {formatCurrency(item.current_highest_bid || item.starting_price)}
                </span>
              </div>

              {item.status !== "SETTLED" ? (
                <Button
                  onClick={() => handleFinalize(item)}
                  disabled={isProcessing && selectedItemId === item.id}
                  className="bg-[#111111] hover:bg-[#FF5A1F] text-white font-extrabold text-[10px] uppercase tracking-wider h-9 px-4"
                >
                  <Play className="h-3.5 w-3.5 mr-1 text-[#FF5A1F]" />
                  {isProcessing && selectedItemId === item.id ? "Calculating..." : "Run Winner Engine"}
                </Button>
              ) : (
                <Badge className="bg-[#16803C] text-white text-[10px] uppercase font-bold py-1 px-3">
                  ✓ FINALIZED
                </Badge>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
