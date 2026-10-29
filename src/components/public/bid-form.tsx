"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Gavel, AlertCircle, CheckCircle2, ShieldCheck, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toaster";
import { formatCurrency } from "@/lib/utils";
import { BiddingItem } from "@/types";
import { submitBidAction } from "@/lib/services/bidding.service";
import { createClient } from "@/lib/supabase/client";

interface BidFormProps {
  item: BiddingItem;
}

export function BidForm({ item }: BidFormProps) {
  const router = useRouter();
  const [bidAmountETB, setBidAmountETB] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [user, setUser] = React.useState<any>(null);

  React.useEffect(() => {
    const checkUser = async () => {
      try {
        const supabase = createClient();
        const { data: { user: authUser } } = await supabase.auth.getUser();
        setUser(authUser);
      } catch {
        // demo fallback
      }
    };
    checkUser();
  }, []);

  const minBidETB = item.minimum_bid / 100;
  const maxBidETB = item.maximum_bid ? item.maximum_bid / 100 : undefined;
  const feeETB = item.bid_cost / 100;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in or create an account to submit bids.",
        variant: "destructive",
      });
      router.push(`/login?redirectTo=/bids/${item.slug}`);
      return;
    }

    const numericAmount = parseFloat(bidAmountETB);
    if (isNaN(numericAmount) || numericAmount < minBidETB) {
      toast({
        title: "Invalid Bid Amount",
        description: `Your bid must be at least ${minBidETB.toFixed(2)} ETB.`,
        variant: "destructive",
      });
      return;
    }

    if (maxBidETB && numericAmount > maxBidETB) {
      toast({
        title: "Bid Limit Exceeded",
        description: `The maximum allowed bid is ${maxBidETB.toFixed(2)} ETB.`,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Amount in minor units
      const minorAmount = Math.round(numericAmount * 100);
      const res = await submitBidAction(item.id, minorAmount);

      if (res.success) {
        toast({
          title: "Bid Recorded Successfully!",
          description: `Your bid of ${numericAmount.toFixed(2)} ETB has been confirmed.`,
          variant: "success",
        });
        setBidAmountETB("");
      } else {
        toast({
          title: "Bid Submission Notice",
          description: res.message || "Failed to record bid.",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      toast({
        title: "Submission Error",
        description: err.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white border-2 border-[#111111] p-6 shadow-xl relative">
      {/* Editorial orange header marker */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#FF5A1F]" />

      <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E5E5E5]">
        <div className="flex items-center space-x-2">
          <Gavel className="h-5 w-5 text-[#FF5A1F]" />
          <h3 className="text-base font-black uppercase tracking-wider text-[#111111]">
            {item.bidding_mode === "LOWEST_UNIQUE_BID" ? "Submit Unique Bid" : "Place Highest Bid"}
          </h3>
        </div>
        <span className="text-[11px] font-bold text-[#686868] uppercase bg-[#F5F5F3] px-2 py-0.5 border border-[#E5E5E5]">
          Currency: ETB
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <div className="flex justify-between text-xs font-bold mb-1">
            <Label htmlFor="bid-amount" className="uppercase text-[#111111]">
              Your Bid Amount (ETB)
            </Label>
            <span className="text-[#686868]">
              Min: {minBidETB.toFixed(2)} ETB {maxBidETB ? `• Max: ${maxBidETB.toFixed(2)} ETB` : ""}
            </span>
          </div>

          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 font-extrabold text-[#686868] text-sm">
              ETB
            </span>
            <Input
              id="bid-amount"
              type="number"
              step="0.01"
              min={minBidETB}
              max={maxBidETB}
              placeholder={`${minBidETB.toFixed(2)}`}
              value={bidAmountETB}
              onChange={(e) => setBidAmountETB(e.target.value)}
              className="pl-14 text-base font-bold bg-[#F5F5F3] border-[#E5E5E5] focus-visible:ring-[#FF5A1F] h-12"
              required
            />
          </div>
        </div>

        {/* Participation Fee & Wallet Notice */}
        <div className="bg-[#F5F5F3] p-3 text-xs space-y-1.5 border border-[#E5E5E5]">
          <div className="flex justify-between font-bold">
            <span className="text-[#686868]">Participation Entry Cost:</span>
            <span className="text-[#111111]">{formatCurrency(item.bid_cost)}</span>
          </div>
          <p className="text-[11px] text-[#686868] leading-tight">
            The participation fee is deducted from your wallet upon bid confirmation to secure your spot in this event.
          </p>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading || item.status !== "ACTIVE"}
          className="w-full bg-[#FF5A1F] hover:bg-[#E94B16] text-white font-extrabold text-sm uppercase tracking-wider py-6 shadow-md transition-all"
        >
          {isLoading ? (
            "Validating and Recording..."
          ) : !user ? (
            <span className="flex items-center justify-center space-x-1.5">
              <Lock className="h-4 w-4" />
              <span>Sign In to Place Bid</span>
            </span>
          ) : (
            <span className="flex items-center justify-center space-x-1.5">
              <Gavel className="h-4 w-4" />
              <span>Confirm & Submit Bid</span>
            </span>
          )}
        </Button>

        <div className="text-[11px] text-[#686868] flex items-center justify-center space-x-1 text-center pt-1">
          <ShieldCheck className="h-3.5 w-3.5 text-[#16803C]" />
          <span>Server-side cryptographic bid validation & verification</span>
        </div>
      </form>
    </div>
  );
}
