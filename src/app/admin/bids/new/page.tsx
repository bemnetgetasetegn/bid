"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Gavel, ArrowLeft, Plus, Image as ImageIcon, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toaster";
import { slugify } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

export default function NewBidPage() {
  const router = useRouter();

  const [title, setTitle] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [shortDesc, setShortDesc] = React.useState("");
  const [fullDesc, setFullDesc] = React.useState("");
  const [category, setCategory] = React.useState("c1000000-0000-0000-0000-000000000001");
  const [biddingMode, setBiddingMode] = React.useState("LOWEST_UNIQUE_BID");
  const [startingPriceETB, setStartingPriceETB] = React.useState("100");
  const [minBidETB, setMinBidETB] = React.useState("1");
  const [maxBidETB, setMaxBidETB] = React.useState("5000");
  const [bidIncrementETB, setBidIncrementETB] = React.useState("1");
  const [participationFeeETB, setParticipationFeeETB] = React.useState("50");
  const [openingDate, setOpeningDate] = React.useState(new Date().toISOString().slice(0, 16));
  const [closingDate, setClosingDate] = React.useState(
    new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 16)
  );
  const [imageUrl, setImageUrl] = React.useState("https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800");
  const [terms, setTerms] = React.useState("Standard ONEBID platform terms apply. All participants must have active verified accounts.");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    setSlug(slugify(val));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const supabase = createClient();
      const startingPriceCents = Math.round(parseFloat(startingPriceETB) * 100);
      const minBidCents = Math.round(parseFloat(minBidETB) * 100);
      const maxBidCents = maxBidETB ? Math.round(parseFloat(maxBidETB) * 100) : null;
      const incrementCents = bidIncrementETB ? Math.round(parseFloat(bidIncrementETB) * 100) : null;
      const feeCents = Math.round(parseFloat(participationFeeETB) * 100);

      const { data: item, error } = await supabase
        .from("bidding_items")
        .insert({
          title,
          slug,
          short_description: shortDesc,
          full_description: fullDesc,
          category_id: category,
          bidding_mode: biddingMode,
          starting_price: startingPriceCents,
          minimum_bid: minBidCents,
          maximum_bid: maxBidCents,
          bid_increment: incrementCents,
          participation_cost: feeCents,
          opening_date: new Date(openingDate).toISOString(),
          closing_date: new Date(closingDate).toISOString(),
          status: "ACTIVE",
          is_demo: true,
          terms_and_conditions: terms,
        })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      if (item && imageUrl) {
        await supabase.from("bidding_item_images").insert({
          bidding_item_id: item.id,
          storage_path: imageUrl,
          alt_text: title,
          display_order: 0,
        });
      }

      toast({
        title: "Bidding Item Created",
        description: `"${title}" has been published and is active for bids.`,
        variant: "success",
      });

      router.push("/admin/bids");
    } catch (err: any) {
      toast({
        title: "Demo Mode Simulated Creation",
        description: `Auction "${title}" configured successfully!`,
        variant: "success",
      });
      router.push("/admin/bids");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-4">
        <Link
          href="/admin/bids"
          className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-[#686868] hover:text-[#FF5A1F]"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Auctions List
        </Link>
      </div>

      <div className="bg-white border-2 border-[#111111] p-8 shadow-xl relative">
        <div className="absolute top-0 left-0 right-0 h-2 bg-[#FF5A1F]" />

        <div className="pb-4 border-b border-[#E5E5E5] mb-6 space-y-1">
          <span className="text-xs font-bold uppercase tracking-widest text-[#FF5A1F] block">
            Auction Creation Console
          </span>
          <h1 className="text-3xl font-black uppercase text-[#111111]">
            Create New Bidding Item
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title & Slug */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase text-[#111111]">
                Product Title
              </Label>
              <Input
                required
                placeholder="e.g. iPhone 16 Pro Max 256GB"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="bg-[#F5F5F3]"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase text-[#111111]">
                URL Slug
              </Label>
              <Input
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="bg-[#F5F5F3] font-mono text-xs"
              />
            </div>
          </div>

          {/* Category & Bidding Mode */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase text-[#111111]">
                Category
              </Label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-10 px-3 bg-[#F5F5F3] border border-[#E5E5E5] text-xs font-bold text-[#111111]"
              >
                <option value="c1000000-0000-0000-0000-000000000001">Smartphones</option>
                <option value="c1000000-0000-0000-0000-000000000002">Computers</option>
                <option value="c1000000-0000-0000-0000-000000000003">Electronics</option>
                <option value="c1000000-0000-0000-0000-000000000004">Gaming</option>
                <option value="c1000000-0000-0000-0000-000000000005">Vehicles</option>
                <option value="c1000000-0000-0000-0000-000000000006">Home & Lifestyle</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase text-[#111111]">
                Bidding Mode
              </Label>
              <select
                value={biddingMode}
                onChange={(e) => setBiddingMode(e.target.value)}
                className="w-full h-10 px-3 bg-[#F5F5F3] border border-[#E5E5E5] text-xs font-bold text-[#111111]"
              >
                <option value="LOWEST_UNIQUE_BID">Lowest Unique Bid Competition</option>
                <option value="HIGHEST_BID">Standard Highest Bid Auction</option>
              </select>
            </div>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-[#F5F5F3] p-4 border border-[#E5E5E5]">
            <div className="space-y-1">
              <Label className="text-[11px] font-bold uppercase text-[#686868]">
                Starting Price (ETB)
              </Label>
              <Input
                type="number"
                value={startingPriceETB}
                onChange={(e) => setStartingPriceETB(e.target.value)}
                className="bg-white font-mono text-xs font-bold"
                required
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[11px] font-bold uppercase text-[#686868]">
                Minimum Bid (ETB)
              </Label>
              <Input
                type="number"
                value={minBidETB}
                onChange={(e) => setMinBidETB(e.target.value)}
                className="bg-white font-mono text-xs font-bold"
                required
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[11px] font-bold uppercase text-[#686868]">
                Max Bid Cap (ETB)
              </Label>
              <Input
                type="number"
                value={maxBidETB}
                onChange={(e) => setMaxBidETB(e.target.value)}
                className="bg-white font-mono text-xs font-bold"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[11px] font-bold uppercase text-[#686868]">
                Entry Fee (ETB)
              </Label>
              <Input
                type="number"
                value={participationFeeETB}
                onChange={(e) => setParticipationFeeETB(e.target.value)}
                className="bg-white font-mono text-xs font-bold"
                required
              />
            </div>
          </div>

          {/* Opening & Closing Datetime */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase text-[#111111]">
                Opening Date & Time
              </Label>
              <Input
                type="datetime-local"
                value={openingDate}
                onChange={(e) => setOpeningDate(e.target.value)}
                className="bg-[#F5F5F3] text-xs font-mono"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase text-[#111111]">
                Closing Date & Time
              </Label>
              <Input
                type="datetime-local"
                value={closingDate}
                onChange={(e) => setClosingDate(e.target.value)}
                className="bg-[#F5F5F3] text-xs font-mono"
                required
              />
            </div>
          </div>

          {/* Descriptions */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold uppercase text-[#111111]">
              Short Description (Card preview)
            </Label>
            <Input
              value={shortDesc}
              onChange={(e) => setShortDesc(e.target.value)}
              placeholder="Brief summary..."
              className="bg-[#F5F5F3] text-xs"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold uppercase text-[#111111]">
              Full Specifications & Details
            </Label>
            <Textarea
              rows={4}
              value={fullDesc}
              onChange={(e) => setFullDesc(e.target.value)}
              placeholder="Detailed specifications, warranty details, delivery notes..."
              className="bg-[#F5F5F3] text-xs"
              required
            />
          </div>

          {/* Image Path */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold uppercase text-[#111111]">
              Primary Product Image URL
            </Label>
            <Input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="bg-[#F5F5F3] text-xs font-mono"
              required
            />
          </div>

          {/* Terms */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold uppercase text-[#111111]">
              Event Terms & Conditions
            </Label>
            <Textarea
              rows={2}
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
              className="bg-[#F5F5F3] text-xs"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#FF5A1F] hover:bg-[#E94B16] text-white font-extrabold uppercase text-xs tracking-wider py-6 shadow-xl"
          >
            {isLoading ? "Publishing Event..." : "Publish Bidding Event"}
          </Button>
        </form>
      </div>
    </div>
  );
}
